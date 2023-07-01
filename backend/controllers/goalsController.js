const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

// get all goals
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({user: req.user.id});
    res.status(200).json({ error: false, message: 'Goals fetched successfully', data: goals })
})

//create all goals
const createGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        // res.status(400).json({message: 'Please add a text field' })
        res.status(400)
        throw new Error('Please add a text field');
    }
    const params = { text: req.body.text, user: req.user.id }
    const goal = await Goal.create(params);
    res.status(200).json({ error: false, message: 'Goal created successfully', data: goal });
})

//update goal
const updateGoal = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    if (!id) {
        res.status(400);
        throw new Error('Please provide an id');
    } else if(!req.body.text){
        res.status(400);
        throw new Error('Please provide a text field');
    } else {
        const goal = await Goal.findById(id);
        if (!goal) {
            res.status(404);
            throw new Error('Goal not found');
        } else {
            // check for user
            const user = await User.findById(req.user.id);
            if(!user){
                res.status(401);
                throw new Error('User does not exist')
            }

            if(goal.user.toString() !== user.id){
                res.status(401);
                throw new Error('User not authorized')
            }
            
            const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json({ message: 'Goal with id ' + id + ' is updated', data: updatedGoal })
        }
    }

})

//delete goal
const deleteGoals = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error('Please provide an id');
    } else {
        const goal = await Goal.findById(id);
        if (!goal) {
            res.status(404);
            throw new Error('Goal not found');
        } else {
            // check for user
            const user = await User.findById(req.user.id);
            if(!user){
                res.status(401);
                throw new Error('User does not exist')
            }

            if(goal.user.toString() !== user.id){
                res.status(401);
                throw new Error('User not authorized')
            }

            //await goal.remove(); remove function deprecated in new version.
            await goal.deleteOne();
            res.status(200).json({ message: 'Goal with id ' + id + ' is deleted.'})
        }
    }

})

module.exports = {
    getGoals, createGoal, updateGoal, deleteGoals
}