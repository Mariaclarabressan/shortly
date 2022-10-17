import joi from 'joi';

const loginSchema = joi.object({
    email: joi.string().email().required(),
    passaword: joi.string().required()
});

const creatSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.ref("password")
});

export {loginSchema, creatSchema};
