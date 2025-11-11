import express from 'express';
import passport from 'passport';
import { loginUser, registerUser, resetPasswordUser, changePasswordUser } from '../controllers/auth.js';
import { signupValidation, emailSigninValidation } from '../middlewares/validation.js';
import { passportAuth } from '../middlewares/passport.js';

const router = express.Router();

router.post('/signup', signupValidation, registerUser);

router.post('/signin', emailSigninValidation, passportAuth('local'), loginUser);

router.post('/resetpassword', resetPasswordUser),

router.post('/changepassword', changePasswordUser),

router.get('/signin/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/signin/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/signin?error=google'}), loginUser);

router.get('/signin/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/signin/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/auth/fail' }), loginUser);


export default router;