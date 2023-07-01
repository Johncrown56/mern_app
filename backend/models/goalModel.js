const mongoose = require('mongoose');
const goalSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'please add a text field']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'please add a user field'],
        ref: 'User'
    }
}, { 
    timestamps: true 
})

module.exports = mongoose.model('Goal', goalSchema);