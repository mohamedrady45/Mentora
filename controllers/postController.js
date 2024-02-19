const mongoose = require('mongoose');
const Post = require('../Models/post');
const User = require('../Models/user');

//create post
const addPost = async (req, res, next) => {
    try{
        const  newPost  = new Post(req.body);

        const savedPost = await newPost.save();
        res.status(200).json({ message: 'Your post was shared.' });
    }
    catch(err){ 
        console.error('Error creating post.', err);
        next(err);
    }
}

//update post
const updatePost = async (req, res, next) => {
    try{
        //find the id of the post to be updated
        const post = await Post.findById(req.params.id);
        if(post.author == req.body.author)
        {
            await post.updateOne({$set:req.body});
            res.status(200).json({message:'The post has been successfully updated'})
        } else{
            res.status(403).json({message:"You can only update your post."})
        }
        res.status(200).json(err);
    }
    catch(err){
        console.error('Error updating post.', err);
        next(err);  
    }
}

//delete post
const deletePost = async (req, res, next) => {
    try{
        //find the id of the post to be deleted
        const post = await Post.findById(req.params.id);
        if(post.author == req.body.author)
        {
            await post.deleteOne();
            res.status(200).json({message:'The post has been successfully deleted.'})
        } else{
            res.status(403).json({message:"You can only delete your post."})
        }
        res.status(200).json(err);
    }
    catch(err){
      console.error('Error deleting post.', err);
      next(err);  
    }
}

//react post
const reactPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            throw new Error('This post does not exist');
        }

      //Check if the user has already reacted to the post
      let userReacted = post.reacts.users.includes(req.body.author);
      if (! userReacted) {
        // User has not reacted, allow reacting to the post
        post.reacts.count += 1;
        post.reacts.users.push(req.body.author);
        userReacted = true;
        res.status(200).json({message:'You liked the post.'})
      } else {
        // User has already reacted, allow disliking the post
        post.reacts.count -= 1;
        post.reacts.users.pull(req.body.author);
        userReacted = false;
        res.status(200).json({message:'You disliked the post.'})
      }

      const savedPost = await post.save();

      res.status(200).json({ message: 'Your post was reacted.' });

    } catch (err) {
      console.error("Error reacting post.", err);
      next(err);
    }
};

const Comment = require('../Models/post')
//add comment
const addComment  = async (req,res,next)=>{
    try{    
        const post = await Post.findById(req.params.id);
        if (!post) {
            throw new Error('This post does not exist');
        }

        const  comment = new Comment({
            author : req.body.author,
            content : req.body.content,
        });

        post.comments.push(comment);
        await post.save();
        res.status(200).json({ message: 'Your comment was shared.' });

    } catch (err) {
      console.error("Error comment in the  post.", err);
      next(err);
    }
};




//add reaction for a comment
//reply for a comment
//share post(with captions)
//save post


module.exports = {
    addPost,
    updatePost,
    deletePost,
    addComment,
    reactPost,
  };
