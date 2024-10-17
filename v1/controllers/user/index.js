const Joi = require('@hapi/joi');
const {badResponse, okResponse, acceptedResponse} = require('../../utils/response');
const functions = require('./functions');

module.exports = {
    registerUser: async (req, res) => {
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
            return badResponse(req, res, error.details, "error wrong data");
        }

        const user = await functions.registerUser(data);
        if(!user.status){
            return badResponse(req, res, user.data, user.message);
        }
        //TODO send email verification
        //TODO send welcome email
        //TODO 2fa verification

        return okResponse(req, res, [], user.message);
    },

    logInUser: async (req, res) => {
        console.log(req.body);
        const data = {
            email: req.body.email,
            password: req.body.password
        }

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        });

        const { error } = schema.validate(data);

        if(error){
            return badResponse(req, res, error.details, "error wrong data");
        }

        const response = await functions.logIn(data);
        if(!response.status){
            return badResponse(req, res, response.data, response.message);
        }

        return okResponse(req, res, response.data, response.message);
    }
}
