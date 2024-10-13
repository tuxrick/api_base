const Joi = require('@hapi/joi');
const {badResponse, okResponse, acceptedResponse} = require('../../utils/response');
const functions = require('./functions');

exports.registerUser = async function(req, res){
    const data = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }

    const schema = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().min(2).required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(data);

    if(error){
        return badResponse(req, res, error.details, "error");
    }

    const user = await functions.registerUser(data);
    if(!user.status){
        return badResponse(req, res, user.data, user.message);
    }
    //TODO send email verification
    //TODO send welcome email
    //TODO send auth token
    //TODO send refresh token
    //return okResponse(req, res, user.data, user.message);
    return okResponse(req, res, [], user.message);
}