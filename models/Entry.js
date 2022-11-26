import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
    user: {
        type: 'ObjectId',
        ref: 'User'
    },
    temperature: {
        type: String,
        required: true
    },
    windspeed: {
        type: String,
        required: true
    },
    rainfall: {
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