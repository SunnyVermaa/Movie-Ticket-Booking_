import express from 'express';
import { addShow, getNowPlayingMovie } from '../controllers/showController.js';
import { protectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();
showRouter.get('/now-playing', protectAdmin ,getNowPlayingMovie)
showRouter.post('/add', protectAdmin, addShow)

export default showRouter;