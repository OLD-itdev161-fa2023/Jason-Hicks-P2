import express from 'express';
import connectDatabase from './config/db';
import {check, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from './models/User';
import Entry from './models/Entry';
import auth from './middleware/auth';
import { Route } from 'react-router-dom';

const app = express();

connectDatabase();

app.use(express.json({extended: false }));

app.use(express.json({extended: false}));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

/**
 * @route GET /
 * @desc Test endpoint
 */
app.get('/',(req,res) =>
    res.send('http get request sent to root api endpoint')
);

/**
 * @route POST api/users
 * @desc Register user
 */
app.post(
    '/api/users',
    [
        check('name', 'Please enter your name')
            .not()
            .isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check(
            'password', 
            'please enter a password with 6 or more characters'
        ).isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { name, email, password } = req.body;
            try {
                let user = await User.findOne({ email: email });
                if(user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'User already exists' }] });
                }

                user = new User({
                    name: name,
                    email: email,
                    password: password
                });

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                await user.save();

                returnToken(user, res);
            } catch (error) {
                res.status(500).send(`Server error`);
            }
        }
    }
);

const returnToken = (user, res) => {
    const payload = {
        user: {
            id: user.id
        }
    };

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '10hr'},
        (err, token) => {
            if(err) throw err;
            res.json({ token: token });
        }
    );
};

/**
 * @route GET api/auth
 * @desc Authenticate user
 */
app.get('/api/auth', auth, async (req, res) => {   
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch(error) {
        res.status(500).send('Unknown server error');
    }
});

/**
 * @route POST api/login
 * @desc Login user
 */
app.post(
    '/api/login',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { email, password } = req.body;
            try {
                let user = await User.findOne({ email: email });
                if(!user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'Invalid email or password' }] });
                }

                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'Invalid email or password' }] })
                }

                returnToken(user, res);
            }catch (error) {
                res.status(500).send(`Server error`);
            }
        }
    }
);

/**
 * @route POST api/entrys
 * @desc Create entry
 */
app.post(
    '/api/entrys',
    [
        auth,
        [
            check('title', 'Title text is required')
                .not()
                .isEmpty(),
            check('body', 'Body text is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            const {title, body } = req.body;
            try{
                
                const user = await User.findById(req.user.id);

                const entry = new Entry({
                    user: user.id,
                    title: title,
                    body: body
                });

                await entry.save();

                res.json(entry);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server error');
            }
        }
    }
);

/**
 * @route GET api/entrys
 * @desc Get entrys
 */
app.get('/api/entrys', auth, async (req, res) => {
    try{
        const entrys = await Entry.find().sort({date: -1 });

        res.json(entrys);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

/**
 * @route GET api/entrys/:id
 * @desc Get entry
 */
app.get('/api/entrys/:id', auth, async (req, res) => {
    try{
        const entry = await Entry.findById(req.params.id);

        if (!entry){
            return res.status(404).json({ msg: 'Entry not found' });
        }

        res.json(entry);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

/**
 * @route DELETE api/entrys/:id
 * @desc Delete entry
 */
app.delete('/api/entrys/:id', auth, async (req, res) => {
    try{
        const entry = await Entry.findById(req.params.id);

        if (!entry){
            return res.status(404).json({ msg: 'Entry not found' });
        }

        if (entry.user.toString() !== req.user.id) {
            return res .status(401).json({ msg: 'User not authorized' });
        }

        await entry.remove();

        res.json({ msg: 'Entry removed'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

/**
 * @route PUT api/entrys/:id
 * @desc Update a entry
 */
app.put('/api/entrys/:id', auth, async (req, res) =>{
    try{
        const { title, body } = req.body;
        const entry = await Entry.findById(req.params.id);

        if(!entry){
            return res.status(404).json({ msg: 'Entry not found' });
        }

        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        entry.title = title || entry.title;
        entry.body = body || entry.body;

        await entry.save();

        res.json(entry);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

const port = 5000
app.listen(port, () => console.log(`Express server runing on port ${port}`));