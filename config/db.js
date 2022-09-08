import mongoose from 'mongoose';
import config from 'config';
import { check } from 'express-validator';

const db = config.get('mongoURI');

const connectDatabase = async () => {
    try{
        await mongoose.connect(db, {
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    }catch(error) {
        console.error(error.message);
    }
};

export default connectDatabase;