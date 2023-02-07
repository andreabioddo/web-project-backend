const { hashText } = require("./tools");

module.exports.checkInjection = function (req, res, next) {
    // Check the request parameters for any malicious SQL keywords, excluding the password field
    const sqlInjectionRegex = /(SELECT|INSERT|DELETE|DROP|UPDATE|TRUNCATE)/i;
    const reqWithoutPassword = { ...req.body };
    if (reqWithoutPassword.password){
        delete reqWithoutPassword.password;
    }
    const hasSQLInjection = Object.values(reqWithoutPassword).some(value => {
        return sqlInjectionRegex.test(value);
    });
    if (hasSQLInjection) {
        return res.status(400).send(
            { error: "SQL injection detected" }
        );
    }
    next();
}

module.exports.hashPassword = function(req, res, next){
    req.password = hashText(req.password);
    next();
}