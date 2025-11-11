import { celebrate, Joi } from 'celebrate';

export const emailSigninValidation = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        remember: Joi.bool().truthy('true', '1').falsy('false', '0').valid(true, false).default(false)
    }),
});

export const signupValidation = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
});

export const updateUserProfileValidation = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        email: Joi.string().required().email(),
    }),
});