const express = require('express');
const mongoose = require('mongoose');
const { Community } =  require('../Models/Community');
const { Question } =  require('../Models/questions');
const {  Answer } =  require('../Models/Answer');
const createCommunity = async (req, res) =>{
    const { name, description } = req.body;
  
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: 'Community name is required (minimum of 3 characters)' });
    }
  
    try {
      const community = new Community({
        name,
        description,
        creator: req.user._id, 
      });
  
      await community.save();
  
      
      req.user.communities.push(community._id);
      await req.user.save();
  
     
      res.status(201).json({ message: 'Community created successfully!', community });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating community' });
    }
  }

  const joinCommunity = async  (req, res)=> {
    const communityId = req.params.communityId;
  
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: 'Invalid community ID' });
    }
  
    try {
      const community = await Community.findById(communityId);
  
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
  
      if (community.members.includes(req.user._id)) {
        return res.status(400).json({ message: 'You are already a member of this community' });
      }
  
      community.members.push(req.user._id);
      req.user.communities.push(communityId); 
  
      await community.save();
      await req.user.save();
  
      res.status(200).json({ message: 'Joined community successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error joining community' });
    }
  }

  const leaveCommunity = async (req, res, next) => {
    const communityId = req.params.communityId;
  
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: 'Invalid community ID' });
    }
  
    try {
      const community = await Community.findById(communityId);
  
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
  
      community.members.pull(req.user._id);
  
      await community.save();
  
      req.user.communities.pull(communityId);
  
      await req.user.save();
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error leaving the community' });
    }
  };
 const addQuestion = async (req, res)=> {
    const communityId = req.params.communityId;
    const { content } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: 'Invalid community ID' });
    }

  
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ message: 'Question content is required (minimum 10 characters)' });
    }
  
    try {
      const community = await Community.findById(communityId);
  
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
  
      const question = new Question({
        body,
        author: req.user._id, 
        community: communityId,
      });
  
      community.questions.push(question._id); 
      await question.save();
      await community.save();
  
      res.status(201).json({ message: 'Question created successfully!', question });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating question' });
    }
  }
  
  const answerQuestion = async  (req, res)=> {
    const questionId = req.params.questionId;
    const { content } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
  
    if (!content) {
      return res.status(400).json({ message: 'Answer body is required' });
    }
  
    try {
      const question = await Question.findById(questionId).populate('community'); 
  
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      const answer = new Answer({
        content,
        author: req.user._id, 
        question: questionId,
      });
  
      question.answers.push(answer._id); 
      await answer.save();
      await question.save();
  
      res.status(201).json({ message: 'Answer submitted successfully!', answer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error submitting answer' });
    }}  
  
    module.exports = {
        createCommunity , 
        joinCommunity ,
        leaveCommunity, 
        addQuestion , 
        answerQuestion
    };