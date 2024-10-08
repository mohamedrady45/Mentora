const express = require('express');
const mongoose = require('mongoose');
const Community = require('../Models/Community');
const User = require('../Models/user');
const Question = require('../Models/questions');
const Answer = require('../Models/Answer');
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json({ communities });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ message: 'Error fetching communities' });
  }
};
const createCommunity = async (req, res) => {
  const { name, description, track } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ message: 'Community name is required (minimum of 3 characters)' });
  }

  try {
    const community = new Community({
      name,
      description,
      track,
      creator: req.userId,
    });


    const user = await User.findById(req.userId);
    community.members.push(user._id);
    await community.save();
    user.communities.push(community._id);
    await user.save();
    res.status(201).json({ message: 'Community created successfully!', community });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating community' });
  }
}

const joinCommunity = async (req, res, next) => {
  const communityId = req.params.communityId;

  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    return res.status(400).json({ message: 'Invalid community ID' });
  }

  try {
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    const user = await User.findById(req.userId);
    if (community.members.includes(req.userId)) {
      return res.status(400).json({ message: 'You are already a member of this community' });
    }

    community.members.push(req.userId);
    user.communities.push(communityId);

    await community.save();
    await user.save();

    res.status(200).json({ message: 'Joined community successfully!' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error joining community' });
  }
}
const getUserCommunities = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'communities',
      populate: {
        path: 'creator',
        select: 'firstName lastName profilePicture'
      },
      populate: {
        path: 'members',
        select: 'firstName lastName profilePicture',
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ communities: user.communities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user communities' });
    next(error);
  }
};
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
    const user = await User.findById(req.userId);
    community.members.pull(req.userId);

    await community.save();

    user.communities.pull(communityId);
    await user.save();
    res.status(200).json({ message: 'You leave this community' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error leaving the community' });
  }
};

const getCommunity = async (req, res) => {
  const communityId = req.params.communityId;

  try {
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.status(200).json({ message: 'Community found', community });
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ message: 'Error fetching community' });
  }
};
const addQuestion = async (req, res) => {
  const communityId = req.params.communityId;
  const content = req.body.content;

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
      content,
      author: req.userId,
      community: communityId,
    });

    community.questions.push(question._id);
    await question.save();
    await community.save();
    // io.to(`community_${communityId}`).emit('newQuestion', { message: 'New question added!', question });
    res.status(201).json({ message: 'Question created successfully!', question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating question' });
  }
}
//TODO:
const getCommunityQuestions = async (req, res) => {
  const communityId = req.params.communityId;
  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    return res.status(400).json({ message: 'Invalid community ID' });
  }

  try {
    const community = await Community.findById(communityId).populate({
      path: 'questions',
      populate: {
        path: 'author',
        select: 'firstName lastName profilePicture'
      }
    });

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const questions = community.questions.map(question => ({
      _id: question._id,
      content: question.content,
      author: {
        firstName: question.author.firstName,
        lastName: question.author.lastName,
        profilePicture: question.author.profilePicture.url
      },
      date: question.date
    }));

    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching community questions' });
  }
};
//TODO:
const getQuestionAnswers = async (req, res) => {
  const communityId = req.params.communityId;
  const questionId = req.params.questionId;

  if (!mongoose.Types.ObjectId.isValid(communityId) || !mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ message: 'Invalid community ID or question ID' });
  }

  try {
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const question = await Question.findById(questionId).populate('author').populate({
      path: 'answers',
      populate: {
        path: 'author',
        select: 'firstName lastName profilePicture'
      }
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.community.toString() !== communityId) {
      return res.status(403).json({ message: 'Question does not belong to this community' });
    }

    const answers = question.answers.map(answer => ({
      _id: answer._id,
      content: answer.content,
      author: {
        firstName: answer.author.firstName,
        lastName: answer.author.lastName,
        profilePicture: answer.author.profilePicture.url
      },
      date: answer.date
    }));

    res.status(200).json({ answers });
  } catch (error) {
    console.error('Error fetching question answers:', error);
    res.status(500).json({ message: 'Error fetching question answers' });
  }
};
const searchCommunity = async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const regex = new RegExp(searchQuery.split(' ').join('|'), 'i');
    const communities = await Community.find({
      $or: [
        { name: { $regex: regex } },
        { track: { $regex: regex } },
      ]
    });

    if (communities.length === 0) {
      return res.status(404).json({ message: 'No matching communities found' });
    }

    res.status(200).json({ communities });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ message: 'Error fetching communities' });
  }
};
//TODO:
const getOneCommunityQuestion = async (req, res) => {
  const communityId = req.params.communityId;
  const questionId = req.params.questionId;

  if (!mongoose.Types.ObjectId.isValid(communityId) || !mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ message: 'Invalid community ID or question ID' });
  }

  try {
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const question = await Question.findById(questionId).populate('author', 'firstName lastName profilePicture');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.community.toString() !== communityId) {
      return res.status(403).json({ message: 'Question does not belong to this community' });
    }

    const questionData = {
      _id: question._id,
      content: question.content,
      author: {
        firstName: question.author.firstName,
        lastName: question.author.lastName,
        profilePicture: question.author.profilePicture.url
      },
      date: question.date
    };

    res.status(200).json({ question: questionData });
  } catch (error) {
    console.error('Error fetching community question:', error);
    res.status(500).json({ message: 'Error fetching community question' });
  }
};

const answerQuestion = async (req, res) => {
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
      author: req.userId,
      question: questionId,
    });
    question.answers.push(answer._id);
    await answer.save();
    await question.save();
    ////  io.to(`question_${questionId}`).emit('newAnswer', { message: 'New answer submitted!', answer });
    res.status(201).json({ message: 'Answer submitted successfully!', answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting answer' });
  }
}

module.exports = {
  createCommunity,
  joinCommunity,
  leaveCommunity,
  addQuestion,
  answerQuestion,
  getUserCommunities,
  getCommunityQuestions,
  getOneCommunityQuestion,
  getCommunity,
  searchCommunity,
  getAllCommunities,
  getQuestionAnswers
};