const mongoose = require('mongoose');
const Post = require('../Models/post').Post;
const Comment = require('../Models/post').Comment;
const Reply = require('../Models/post').Reply;
const Share = require('../Models/post').Share;
const User = require('../Models/user');
const upload = require("../middlewares/uploadFile");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../services/cloudinary");
const addPost = async (req, res, next) => {
    try {
        const files = req.files;
        const { content } = req.body;
        const author = await User.findById(req.userId);

        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        let attachments = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "Post",
                });
            });
            const uploadResults = await Promise.all(uploadPromises);
            attachments = uploadResults.map(result => ({
                type: result.resource_type === 'image' ? 'image' : result.resource_type === 'video' ? 'video' : 'file',
                url: result.secure_url,
                public_id: result.public_id
            }));
        }

        const newPost = new Post({
            author: author._id,
            content: content,
            attachments: attachments,
            date: new Date()  
        });

        await newPost.save();
        res.status(200).json({ message: 'Your post was shared.' });
    } catch (err) {
        console.error('Error creating post:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


const getPostById = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId)
            .populate({
                path: 'author',
                select: 'firstName lastName profilePicture',
            })
            .populate('comments'); 

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const response = {
            authorName: `${post.author.firstName} ${post.author.lastName}`,
            authorProfilePicture: post.author.profilePicture,
            date: post.date,
            content: post.content,
            reactsCount: post.reacts.count,
            commentsCount: post.comments.length,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Error fetching post' });
        next(error);
    }
};


//update post
const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to edit this post' });
        }

        post.content = req.body.content; 
        await post.save();

        res.status(200).json({ message: 'The post has been successfully updated', data: post });
    } catch (err) {
        console.error('Error updating post:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


//delete post
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId; 

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ message: 'The post has been successfully deleted.' });
    } catch (err) {
        console.error('Error deleting post:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};



//get all posts
const getAllPosts = async (req, res) => {
    try {
        const userId = req.userId; 

        const posts = await Post.find()
            .populate('author', 'firstName lastName profilePicture')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'firstName lastName profilePicture'
                }
            });

        const postsWithAuthorInfo = posts.map(post => {
            const userReacted = post.reacts.users.includes(userId);
            return {
                _id: post._id,
                author: post.author ? {
                    firstName: post.author.firstName,
                    lastName: post.author.lastName,
                    profilePicture: post.author.profilePicture
                } : null,
                content: post.content,
                date: post.date,
                attachments: post.attachments,
                reacts: post.reacts.count,
                commentsCount: post.comments.length,
                reactsCount: post.reacts.count,
                sharesCount: post.shares.count,
                userReacted: userReacted 
            };
        });

        console.log(postsWithAuthorInfo);
        res.status(200).json(postsWithAuthorInfo);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




//react post
const reactPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId; 

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'This post does not exist' });
        }


        const userReacted = post.reacts.users.includes(userId);

        if (!userReacted) {
            post.reacts.count += 1;
            post.reacts.users.push(userId);
            await post.save();
            res.status(200).json({ message: 'You liked the post.' });
        } else {
            post.reacts.count -= 1;
            post.reacts.users.pull(userId);
            await post.save();
            res.status(200).json({ message: 'You disliked the post.' });
        }
    } catch (err) {
        console.error('Error reacting post:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

const getPostComments = async (req, res, next) => {
    try {
        const userId = req.userId; 
        const postId = req.params.postId;

        const post = await Post.findById(postId)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'firstName lastName profilePicture',
                }
            });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comments = post.comments.map(comment => {
            const userReacted = comment.reacts.users.includes(userId);
            return {
                _id: comment._id, 
                authorId: comment.author._id, 
                authorName: `${comment.author.firstName} ${comment.author.lastName}`,
                authorProfilePicture: comment.author.profilePicture,
                date: comment.date,
                content: comment.content,
                reactsCount: comment.reacts.count,
                repliesCount: comment.replies.length,
                userReacted: userReacted,
                replies: comment.replies.map(reply => ({
                    _id: reply._id,
                    authorId: reply.author._id, 
                    authorName: `${reply.author.firstName} ${reply.author.lastName}`,
                    authorProfilePicture: reply.author.profilePicture,
                    date: reply.date,
                    content: reply.content,
                    reactsCount: reply.reacts.count,
                    userReacted: reply.reacts.users.includes(userId),
                })),
            };
        });

        res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
        next(error);
    }
};





//add comment
const addComment = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId; 

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'This post does not exist' });
        }

        const author = await User.findById(userId);
        const { content } = req.body;
        const files = req.files;
        let attachments = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "Post",
                });
            });
            const uploadResults = await Promise.all(uploadPromises);
            attachments = uploadResults.map(result => ({
                type: result.resource_type === 'image' ? 'image' : result.resource_type === 'video' ? 'video' : 'file',
                url: result.secure_url,
                public_id: result.public_id
            }));
        }

        const newComment = new Comment({
            author: author,
            content: content,
            date: Date.now(),
            attachments: attachments
        });


        post.comments.push(newComment);
        await post.save();
        await newComment.save();
        res.status(200).json({ message: 'Your comment was shared.' });

    } catch (err) {
        console.error('Error commenting on the post:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


//update comment
const updateComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    try {
        const userId = req.userId; 

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'You are not authorized to update this comment' });
        }

        comment.content = content;
        await post.save();

        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (err) {
        console.error('Error updating comment:', err);
        res.status(500).json({ error: 'Failed to update comment' });
    }
};


const getCommentReplies = async (req, res, next) => {
    try {

        const userId = req.userId; 
        const { postId, commentId } = req.params;

        const post = await Post.findOne({ _id: postId, 'comments._id': commentId })
            .populate({
                path: 'comments',
                match: { _id: commentId },
                populate: {
                    path: 'replies.author',
                    select: 'firstName lastName profilePicture',
                }
            });

        if (!post) {
            return res.status(404).json({ message: 'Post or comment not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const replies = comment.replies.map(reply => {
            const userReacted = reply.reacts.users.includes(userId);
            return {
                _id: reply._id, 
                authorId: reply.author._id, 
                authorName: `${reply.author.firstName} ${reply.author.lastName}`,
                authorProfilePicture: reply.author.profilePicture,
                date: reply.date,
                content: reply.content,
                reactsCount: reply.reacts.count,
                userReacted: userReacted,
            };
        });

        res.status(200).json({ replies });
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).json({ message: 'Error fetching replies' });
        next(error);
    }
};




const deleteComment = async (req, res, next) => {
    try {
        const userId = req.userId; 
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        comment.remove();
        await post.save();

        res.status(200).json({ message: 'Your comment has been successfully deleted.' });
    } catch (err) {
        console.error('Error deleting comment.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


const reactComment = async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const authorId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found in the post' });
        }

        const author = await User.findById(authorId);
        if (!author) {
            return res.status(404).json({ error: 'User not found' });
        }

        let userReacted = comment.reacts.users.includes(authorId);
        if (!userReacted) {
            comment.reacts.count += 1;
            comment.reacts.users.push(authorId);
            res.status(200).json({ message: 'You liked the comment.' });
        } else {
            comment.reacts.count -= 1;
            comment.reacts.users = comment.reacts.users.filter(userId => userId.toString() !== authorId);
            res.status(200).json({ message: 'You disliked the comment.' });
        }

        await post.save();
    } catch (err) {
        console.error("Error reacting comment:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


//reply for a comment
const replyComment = async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.userId; 
        const author = await User.findById(userId);

        if (!author) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const files = req.files;
        let attachments = [];

        if (files && files.length > 0) {
            const uploadPromises = files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "Post",
                });
            });
            const uploadResults = await Promise.all(uploadPromises);
            attachments = uploadResults.map(result => ({
                type: result.resource_type === 'image' ? 'image' : result.resource_type === 'video' ? 'video' : 'file',
                url: result.secure_url,
                public_id: result.public_id
            }));
        }

        const newReply = {
            author: author._id,
            content: content,
            attachments: attachments,
        };

        comment.replies.push(newReply);
        comment.count += 1;

        await post.save();

        res.status(200).json({ message: 'Your reply was shared.' });
    } catch (err) {
        console.error("Error replying to the comment:", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


//react for a reply
const reactReply = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const replyId = req.params.replyId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'This post does not exist' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'This comment does not exist' });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({ error: 'This reply does not exist' });
        }

        const author = await User.findById(req.userId);
        let userReacted = reply.reacts.users.includes(author);

        if (!userReacted) {
            reply.reacts.count += 1;
            reply.reacts.users.push(author);
            userReacted = true;
            res.status(200).json({ message: 'You liked the reply.' });
        } else {
            reply.reacts.count -= 1;
            reply.reacts.users = reply.reacts.users.pull(author);
            userReacted = false;
            res.status(200).json({ message: 'You disliked the reply.' });
        }

        await post.save();
        res.status(200).json({ message: 'Your reaction on the reply was updated.' });

    } catch (err) {
        console.error('Error reacting to reply:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


//delete reply
const deleteReply = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const replyId = req.params.replyId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
        }

        comment.replies.pull(reply);
        await post.save();

        await reply.deleteOne();

        res.status(200).json({ message: 'Your reply has been successfully deleted.' });
    } catch (err) {
        console.error('Error deleting reply.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


//save post
const savePosts = async (req, res, next) => {
    try {
        const userId = req.userId; 
        const postId = req.params.postId; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const isSaved = user.savedPosts.includes(postId);
        if (!isSaved) {
            user.savedPosts.push(postId);
            await user.save();
            res.status(200).json({ message: 'You saved the post.' });
        } else {
            user.savedPosts = user.savedPosts.filter((savedPostId) => savedPostId.toString() !== postId.toString());
            await user.save();
            res.status(200).json({ message: 'You unsaved the post.' });
        }
    } catch (err) {
        console.error("Error saving the post:", err);
        res.status(500).json({ error: 'Internal server error' });
        next(err);
    }
};


//share post
const  sharePost = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const author = await User.findById(req.userId);
        const sharedPost = new Post({
            author: author, 
            content: post.content,   
          });
      
          // Initialize shares if it doesn't exist
          post.shares = post.shares || {}; 
          post.shares.count = post.shares.count || 0;

          post.shares.users = post.shares.users || []; // Initialize users array if it doesn't exist
          post.shares.count += 1;
          post.shares.users.push(author);
         
          await sharedPost.save();
          await post.save();

        res.status(200).json({ message: 'You shared the post.' });

    }catch(err){
        console.error("Error sharing the  post.", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


module.exports = {
    addPost,
    updatePost,
    deletePost,
    getAllPosts,
    reactPost,
    addComment,
    updateComment,
    deleteComment,
    reactComment,
    replyComment,
    reactReply,
    deleteReply,
    savePosts,
    sharePost,
    getPostComments,
    getCommentReplies,
    getPostById
  };