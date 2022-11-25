import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
    user: {
        type: 'ObjectId',
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Entry = mongoose.model('entry', EntrySchema);

export default Entry;