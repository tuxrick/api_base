//Bad request status
exports.badResponse = function(req, res, data, message){
    res.status(400).json({ 
        data: data,
        message:message,
        status: "error"
    });
}

//Unauthorized status
exports.unauthorizedResponse = function(req, res, data, message){
    res.status(401).json({ 
        data: data,
        message:message,
        status: "error"
    });
}

//Forbidden status
exports.forbiddenResponse = function(req, res, data, message){
    res.status(403).json({ 
        data: data,
        message:message,
        status: "error"
    });
}

//Not found status
exports.notFoundResponse = function(req, res, data, message){
    res.status(404).json({ 
        data: data,
        message:message,
        status: "error"
    });
}

//OK status
exports.okResponse = function(req, res, data, message){
    res.status(200).json({ 
        data: data,
        message:message,
        status: "success"
    });
}

//Created status
exports.createdResponse = function(req, res, data, message){
    res.status(201).json({ 
        data: data,
        message:message,
        status: "success"
    });
}

//Accepted status
exports.acceptedResponse= function(req, res, data, message){
    res.status(202).json({ 
        data: data,
        message:message,
        status: "success"
    });
}

//Custom status
exports.customResponse = function(req, res, data, message, status, code){
    res.status(code).json({ 
        data: data,
        message:message,
        status: status
    });
}