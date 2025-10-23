import express from 'express';
import passport from 'passport';
import { loginUser, registerUser } from '../controllers/auth.js';
import { signupValidation, emailSigninValidation, /*socialSigninValidation*/ } from '../middlewares/validation.js';
import { passportAuth } from '../middlewares/passport.js';

const router = express.Router();

router.post('/signup', signupValidation, registerUser);

router.post('/signin', emailSigninValidation, passportAuth('local'), loginUser);

router.get('/signin/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/signin/google/callback', /*socialSigninValidation,*/ passport.authenticate('google', { session: false, failureRedirect: '/signin?error=google'}), loginUser);

router.get('/signin/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/signin/facebook/callback', /*socialSigninValidation,*/ passport.authenticate('facebook', { session: false, failureRedirect: '/auth/fail' }), loginUser);

export default router;