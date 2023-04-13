import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPost = async (req,res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post with that id');
    try{
        const post = await PostMessage.findById(id);
        //console.log(post);
        res.status(200).json(post);
    } catch (error){
        res.status(404).json({ message: error });
    }
}

export const getPosts = async (req,res) => {
    try{
        const postMessages = await PostMessage.find();
        //console.log(postMessages);
        res.status(200).json(postMessages);
    } catch (error){
        res.status(404).json({ message: error });
    }
}

export const createPost = async (req,res) => {
    const post = req.body;
    if (!post.title || !post.message) return res.status(400).json({ message: 'Fill the required fields.'});

    const dateRn = new Date().toISOString();
    console.log(dateRn);
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: dateRn});

    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
export const updatePost = async (req,res) => {
    const { id: _id } = req.params;
    const post = req.body;
    if (!post.title || !post.message) return res.status(400).json({ message: 'Fill the required fields.'});

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post with that id');

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post with that id');
    await PostMessage.findByIdAndRemove(id);
    res.json({ message: 'Post deleted sucessfully' });
}

export const likePost = async(req, res) => {
    const { id } = req.params;
    if(!req.userId) return res.json({ message: 'Unauthenticated' });    

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post with that id');
    const post = await PostMessage.findById(id);
    
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if(index === -1){
        //he wants to like the post
        post.likes.push(req.userId);
    } else {
        //he wants to remove his like of the post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
}