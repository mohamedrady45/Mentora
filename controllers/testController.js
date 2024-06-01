const Test = require('../Models/test');



const addTest = async (req, res, next) => {
    try {
        
        const { trainingId, questions,passScore } = req.body;
        const test = new Test({ trainingId, questions ,passScore});
        await test.save();
        res.status(200).json({ message: 'Successfully added test.' })
    } catch (err) {
        console.error('Error adding test.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getTest = async (req, res, next) => {
    try {
        
        const { trainingId } = req.params;
        const test = await Test.findOne({ trainingId });

        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }

        res.status(200).json({ message: 'Successfully got test.',data:test })
    } catch (err) {
        console.error('Error getting test.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
const submitTest = async (req, res, next) => {
    try {
        const { trainingId, answers } = req.body;
        const userId = req.userId;
        const test = await Test.findOne({ trainingId });
        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }
        let score = 0;
        test.questions.forEach((question, index) => {
            if(question.answer === answers[index]){
                score++;
            }
        });
        if(score < test.passScore){
            return res.status(400).json({ error: 'You failed the test.' ,score});
        }
        test.passed.push(userId);
        await test.save();
        res.status(200).json({ message: 'You passed the test.', score })
    } catch (err) {
        console.error('Error submitting test.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


module.exports = {
    addTest,
    // editTest,
    getTest,
    submitTest,
}