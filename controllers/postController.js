const mongoose = require('mongoose');
const Post = require('../Models/post').Post;
const Comment = require('../Models/post').Comment;
const Reply = require('../Models/post').Reply;
const Share = require('../Models/post').Share;
const User = require('../Models/user');
const upload = require("../middlewares/uploadFile");
const path = require("path");
const cloudinary = require("../services/cloudinary");

const addPost = async (req, res, next) => {
    try {
        const author = await User.findById(req.userId);

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
        const newPost = new Post({
            author: author,
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


//update post
const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== userId) {
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
    try{
        //find the id of the post to be deleted
        const post = await Post.findById(req.params.id);
        await post.deleteOne();
        res.status(200).json({message:'The post has been successfully deleted.'})
    }
    catch(err){
      console.error('Error deleting post.', err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  
    }
};

//get all posts
const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find();
      console.log(posts);
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

//react post
const reactPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'This post does not exist' });
        }
        const author = await User.findById(req.userId);
      //Check if the user has already reacted to the post
      let userReacted = post.reacts.users.includes(author);
      if (! userReacted) {
        // User has not reacted, allow reacting to the post
        post.reacts.count += 1;
        post.reacts.users.push(req.body.author);
        userReacted = true;
        res.status(200).json({message:'You liked the post.'})
      } else {
        // User has already reacted, allow disliking the post
        post.reacts.count -= 1;
        post.reacts.users.pull(author);
        userReacted = false;
        res.status(200).json({message:'You disliked the post.'})
      }

      await post.save();
      
      res.status(200).json({ message: 'Your post was reacted.' });

    } catch (err) {
      console.error("Error reacting post.", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
};

//add comment
const addComment  = async (req,res,next)=>{
    try{    
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'This post does not exist' });
        }
        const author = await User.findById(req.userId);
        const  {content} = req.body;
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
        const newComment = new  Comment ({
            author: author,
            content:content,
            attachments: attachments,
        });
        post.comments.push(newComment);
        await post.save(); 
        await newComment.save();
        res.status(200).json({ message: 'Your comment was shared.' });

    } catch (err) {
      console.error("Error comment in the  post.", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
};

//update comment
const updateComment = async (req, res, next) => {
    try{
        // Find the post to which the comment belongs
        const comment = await Comment.findById(req.params.id);
        await comment.updateOne({$set:req.body});
        res.status(200).json({message:'The comment has been successfully updated'})
    }
    catch(err){
        console.error('Error updating post.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  
    }
};

const deleteComment = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        
        post.comments.pull(comment);
        await comment.deleteOne();
        await post.save();
        res.status(200).json({message:'Your comment has been successfully deleted.'})
    }
    catch(err){
      console.error('Error deleting post.', err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  
    }
};

const reactComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: 'This comment does not exist' });
        }
      const author = await User.findById(req.userId);
      let userReacted = comment.reacts.users.includes(author);
      if (! userReacted) {
        comment.reacts.count += 1;
        comment.reacts.users.push(author);
        userReacted = true;
        res.status(200).json({message:'You liked the comment.'});
      } else {
        comment.reacts.count -= 1;
        comment.reacts.users = comment.reacts.users.pull(author);
        userReacted = false;
        res.status(200).json({message:'You disliked the comment.'});
      }

      await comment.save();

      res.status(200).json({ message: 'Your comment was reacted.' });

    } catch (err) {
        console.error("Error reacting comment.", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//reply for a comment
const replyComment  = async (req,res,next)=>{
    try{   
        // Find the post to which the comment belongs
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ error: 'This comment does not exist' });
        }
        
        const {author, content} = req.body;
        const  files = req.files;
        let attachments = [];
        if(files.length == 0){
            return res.status(404).json({ error: 'files not found' }); 
        }
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
        const  reply = new Reply ({
            author: author,
            content: content,
            attachments: attachments,
        });
        comment.replies = comment.replies || []; // Initialize replies if it doesn't exist

        comment.replies.push(reply);
        comment.count += 1;
        
        await reply.save(); 
        await comment.save();  
        await post.save();
        res.status(200).json({ message: 'Your reply was shared.' });

    } catch (err) {
      console.error("Error reply in the  post.", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
};

//react for a reply
const reactReply = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ error: 'This comment does not exist' });
        }

        const reply = await Reply.findById(req.params.replyId);
        if (!reply) {
            return res.status(404).json({ error: 'This reply does not exist' });
        }
        const author = await User.findById(req.userId);
      //Check if the user has already reacted to the comment
      let userReacted = reply.reacts.users.includes(author);
      if (! userReacted) {
        // User has not reacted, allow reacting to the comment
        reply.reacts.count += 1;
        reply.reacts.users.push(author);
        userReacted = true;
        res.status(200).json({message:'You liked the comment.'});
      } else {
        // User has already reacted, allow disliking the comment
        reply.reacts.count -= 1;
        reply.reacts.users = reply.reacts.users.pull(author);
        userReacted = false;
        res.status(200).json({message:'You disliked the comment.'});
      }

      await reply.save();
      await comment.save();
      res.status(200).json({ message: 'Your comment was reacted.' });

    } catch (err) {
        console.error("Error reacting comment.", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//delete reply
const deleteRely = async (req, res, next) => {
    try{
        
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const reply = await Reply.findById(req.params.replyId);
        if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
        }
        
        comment.replies.pull(reply);
        await reply.deleteOne();
        await comment.save();
        res.status(200).json({message:'Your comment has been successfully deleted.'})
    }
    catch(err){
      console.error('Error deleting post.', err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  
    }
};

//save post
const savePosts = async(req, res, next) =>{
    try{
        const author = await User.findById(req.userId);
        const user = await User.findById(author);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        //Check if the user has already saved the post
        const isSaved = User.savePosts.includes(req.params.id);
        if (!isSaved) {
            user.savePosts.push(req.params.id);
            await user.save();
            res.status(200).json({ message: 'You saved the post.' });
        } else{
            // Remove the post ID from savedPosts to unsave it
            user.savePosts = user.savePosts.filter((postId) => postId !== req.params.id);
            await user.save();
            res.status(200).json({ message: 'You unsaved the post.' });
        }
        
    } catch(err){
        console.error("Error saving the  post.", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}; 

//share post
const  sharePost = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.id);
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
    deleteRely,
    savePosts,
    sharePost,
  };