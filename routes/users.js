import express from "express";
import { signin, signup, updateuser } from "../controllers/user.js";

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/:id/updateuser', updateuser);

export default router