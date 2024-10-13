'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');

const userFunctions = module.exports = {

    findUserByEmail: async (email) =>{
        try{
            let result = await User.findOne({
                where: {
                  email: email
                }
            }).then(user => {
                if (!user) {
                    return {
                        status: false,
                        data: [],
                        message: "Error getting user"
                    };
                }else{
                    return {
                        status: true,
                        data: user,
                        message: "Success getting user"
                    };
                }
            });

            return result;
            
        }catch(err){
            return {
                status: false,
                data: err,
                message: "Success getting user from database"
            };
        }
    },

    registerUser: async (data) => {
        //try {
            let user_info = {
                email: data.email,
                username: data.username,
                password: data.password
            }
            const user_data = await userFunctions.findUserByEmail(user_info.email);
            //user already exists
            if(user_data.status){
                return {
                    status: false,
                    data: [],
                    message: "Email already exists"
                };
            }
            //hash password
            user_info.password = await bcrypt.hash(user_info.password, 10);

            const user = await User.create(user_info).then(user => {
                if (!user) {
                    return {
                        status: false,
                        data: [],
                        message: "Error creating user on database"
                    };
                }
                return {
                    status: true,
                    data: user,
                    message: "Success creating user"
                };
            });

            return {
                status: true,
                data: user,
                message: "Success creating user"
            };;

        /*}catch(err){
            return {
                status: false,
                data: err,
                message: "Error creating user"
            };
        }*/
    }
};