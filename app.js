'use strict'

const express = require('express'); 
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

let cors = require('cors');
const cors_option = {
	origin: true,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	exposedHeaders: ["x-auth-token"]
};

let app = express();
let router = express.Router();

app.use(cors(cors_option));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

let api_route = "/api";
let v1 = require('./v1/index.js');
v1(app, router , api_route+"/v1");


app.get('/',(req,res)=>res.send("<h2>It Works!</h2>"));    

//media 
app.use(express.static('./media'));

const port = process.env.PORT || 3008;

app.listen(port, () => {
	console.log("server running in port " + port);
});