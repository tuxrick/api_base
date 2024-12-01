'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User} = require('../../models');
const mail = require('../../utils/mail/mail');

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

    findUserById: async (id) =>{
        try{
            let result = await User.findOne({
                where: {
                  id: id
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
        try {
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

            const user = await User.create(user_info).then(async user => {
                if (!user) {
                    return {
                        status: false,
                        data: [],
                        message: "Error creating user on database"
                    };
                }

                let refresh_token = await userFunctions.generateRefreshToken({
                    id: user.dataValues.id,
                    id_role: user.dataValues.id_role,
                    email: user.dataValues.email,
                    username: user.dataValues.username
                });
                const save_token = await userFunctions.saveRefreshToken({
                    id: user.dataValues.id,
                    refresh_token: refresh_token.data
                });

                refresh_token = refresh_token.data;

                const access_token = await userFunctions.generateAccessToken({
                    id: user_data.data.id,
                    id_role: user_data.data.id_role,
                    email: user_data.data.email,
                    username: user_data.data.username
                });

                await mail.sendWelcomeEmail({email:user.dataValues.email});

                return {
                    status: true,
                    data: {
                        email: user.dataValues.email,
                        username: user.dataValues.username,
                        access_token: access_token.data,
                        refresh_token: refresh_token
                    },
                    message: "Success creating user"
                };
            });

            return {
                status: true,
                data: user.data,
                message: "Success creating user"
            };;

        }catch(err){
            return {
                status: false,
                data: err,
                message: "Error creating user"
            };
        }
    },

    generateRefreshToken: async (data) => {
        try{
            const token = await jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '6M' });
            return {
                status: true,
                data: token,
                message: "Success generating refresh token"
            };
        }catch(err){
            return {
                status: false,
                data: err,
                message: "Error generating refresh token"
            };
        }
    },

    generateAccessToken: async (data) => {
        try{
            const token = await jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            return {
                status: true,
                data: token,
                message: "Success generating access token"
            };
        }catch(err){
            return {
                status: false,
                data: err,
                message: "Error generating access token"
            };
        }
    },

    saveRefreshToken: async (data) => {
        try {
            let user = await User.findOne({ where: { id: data.id } });
    
            if (!user) {
                return {
                    status: false,
                    data: [],
                    message: "User not found"
                };
            }
    
            // Actualiza el refresh_token y guarda
            user.refresh_token = data.refresh_token;
            await user.save();
    
            return {
                status: true,
                data: user,
                message: "Success saving refresh token"
            };
        } catch (err) {
            return {
                status: false,
                data: err,
                message: "Error saving refresh token"
            };
        }
    },

    logIn: async (data) => {
        try{
            let user_data = await userFunctions.findUserByEmail(data.email);
            //Si no encuentra al usuario en la base de datos
            if (!user_data.status) {
                return {
                    status: false,
                    data: [],
                    message: "User not found"
                };
            }
            //Si encuentra al usuario en la base de datos
            //Validamos la contraseña
            let validate_pass = await bcrypt.compareSync(data.password, user_data.data.password);
            if (!validate_pass) {
                return {
                    status: false,
                    data: [],
                    message: "Wrong password"
                };
            }
            //Obtenemos el refresh token de la base 
            let refresh_token = user_data.data.refresh_token;
            //Validamos el refresh token
            let valid_token = false;
            try{
                valid_token = await jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
            }catch(error){
                /*
                if (error.name === 'TokenExpiredError') {
                    console.log('El token ha expirado');
                } else if (error.name === 'JsonWebTokenError') {
                    console.log('El token es inválido');
                } else {
                    console.log('Error desconocido de JWT:', error);
                }
                */
                valid_token = false;
            }
            //Si el refresh token no es valido
            if (!valid_token) {
                //Generamos un nuevo refresh token
                refresh_token = await userFunctions.generateRefreshToken({
                    id: user_data.data.id,
                    id_role: user_data.data.id_role,
                    email: user_data.data.email,
                    username: user_data.data.username
                });
                //Lo guardamos en la base de datos 
                const save_token = await userFunctions.saveRefreshToken({
                    id: user_data.data.id,
                    refresh_token: refresh_token.data
                });
                refresh_token = refresh_token.data;
            }
            //Generamos Access Token
            const access_token = await userFunctions.generateAccessToken({
                id: user_data.data.id,
                id_role: user_data.data.id_role,
                email: user_data.data.email,
                username: user_data.data.username
            });
            //Entregamos token y refresh token
            return {
                status: true,
                data: {
                    email: user_data.data.email,
                    username: user_data.data.username,
                    access_token: access_token.data,
                    refresh_token: refresh_token
                },
                message: "Success logging in"
            };
        }catch(err){
            return {
                status: false,
                data: err,
                message: "Error logging in"
            };
        }
    },
};