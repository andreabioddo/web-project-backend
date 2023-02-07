const { hashText } = require("./tools");
const escape = require("escape-html");

// Check the request parameters for any malicious SQL keywords, excluding the password field
module.exports.checkInjection = function (req, res, next) {
    const sqlInjectionRegex = /(SELECT|INSERT|DELETE|DROP|UPDATE|TRUNCATE)/i;
    const reqWithoutPassword = { ...req.body };
    if (reqWithoutPassword.password){
        delete reqWithoutPassword.password;
    }
    const hasSQLInjection = Object.values(reqWithoutPassword).some(value => {
        return sqlInjectionRegex.test(value);
    });

    reqWithoutPassword = { ...req.query };
    hasSQLInjection = hasSQLInjection || Object.values(reqWithoutPassword).some(value => {
      return sqlInjectionRegex.test(value);
    });
  
    reqWithoutPassword = { ...req.params };
    hasSQLInjection = hasSQLInjection || Object.values(reqWithoutPassword).some(value => {
      return sqlInjectionRegex.test(value);
    });

    if (hasSQLInjection) {
        return res.status(400).send(
            { error: "SQL injection detected" }
        );
    }
    next();
}


//Function to protect the server from XSS attacks
module.exports.checkXSS = function (req, res, next) {
    for (const key in req.body) {
        req.body[key] = escape(req.body[key]);
    }
    for (const key in req.query) {
        req.query[key] = escape(req.query[key]);
    }
    for (const key in req.params) {
        req.params[key] = escape(req.params[key]);
    }
    next();
}

module.exports.hashPassword = function(req, res, next){
    if(!req.body.password){
        res.status(400).json({"error":"passowrd filed is missing"});
    }
    hashText(req.body.password).then((result) => {
        req.body.password = result;
        next();
    }).catch((err) => {res.status(400).json({"error":err})})
}