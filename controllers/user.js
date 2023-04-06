import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();

export const signin = async (req, res) => {
    
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser) return res.status(404).json({ message: 'user does not exists.'});
        
        const isPassowrdCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPassowrdCorrect) return res.status(400).json({ message: 'invalid credentials.'})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.secretToken, { expiresIn: "7d"});
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong in server'});
    }
}

export const signup = async (req, res) => {

    const { email, password, confirmPassword, firstname, lastname } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(404).json({ message: 'user already exists.'});

        if(password !== confirmPassword ) return res.status(404).json({ message: 'passowrds dont match '});

        const hashPassowrd = await bcrypt.hash(password, 12);

        const result= await User.create({ email, password: hashPassowrd, name: `${firstname} ${lastname}`});

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.secretToken, { expiresIn: "7d"});
        res.status(200).json({ result: result, token });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong in server'});
    }
}