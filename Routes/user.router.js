import express from 'express';
import {getProfile, login, logout, otherUsers, register} from '../Controller/user.controller.js'
import { isAuthenticated } from '../Middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
//before the getProfile isAuthenticated middleware runs where whole user using tokenData
router.get('/get-profile', isAuthenticated, getProfile);
router.get('/get-other-users', isAuthenticated, otherUsers);
router.post('/logout', isAuthenticated, logout);

export default router;