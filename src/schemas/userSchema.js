import joi from 'joi';

const userSchema = joi.object({
    url: joi.string().required()
});

export default userSchema;