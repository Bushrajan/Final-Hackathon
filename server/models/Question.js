import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true

    },
    description: {
        type: String,
        required: true

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model('Question', questionSchema);