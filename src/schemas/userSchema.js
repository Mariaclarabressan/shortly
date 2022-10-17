import joi from 'joi';

export const userSchema = joi.object({
    url: joi.string().required()
});