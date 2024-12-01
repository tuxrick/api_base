'use strict'

const nodemailer = require("nodemailer");
const welcome_template = require('./templates/welcome_email.js');

let transporter = nodemailer.createTransport({
    host: "mail.trebolbit.mx",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "soporte@freeticket.trebolbit.com", // generated ethereal user
        pass: "soportefreetrebol" // generated ethereal password
    }
});

let mail = {
    sendMail:async  function (template, email, subject){
        let info =  await transporter.sendMail({
            from: '"API BASE" <no-reply@mail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: template, // plain text body
            html: template
        });
        console.log("Message sent: %s", info.messageId);
        return info.messageId;
    },
    sendWelcomeEmail: async function(data){
        try{
            let template = welcome_template.message(data);
            let sent_email = await this.sendMail(template, data.email, "Bienvenido ! ");
            return sent_email;
        }catch(err){
            console.log(err + "Error sending welcome email");
            return false;
        }
    },
}
module.exports = mail;