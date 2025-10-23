import { celebrate, Joi } from 'celebrate';

export const emailSigninValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    remember: Joi.bool().truthy('true', '1').falsy('false', '0').valid(true, false).default(false)
  }),
});

/*export const socialSigninValidation = celebrate({
  body: Joi.object().keys({
    provider: Joi.string().required(),
    socialId: Joi.string().required(),
    email: Joi.string().required().email(),
    name: Joi.string()
  }),
});*/

export const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});