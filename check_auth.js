let cfg = require('./config.json')
const jwt = require('jsonwebtoken');

// EX4 TODO:
// - verify token using jwt_key of "secret"
// - set req.userData to the user information stored in the token's payload
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;//take the token from the header
        const verified = jwt.verify(token, cfg.auth.jwt_key);
        if(verified){
            req.userData = token;
            next();//proced
        } else {
            return res.status(401).json({message: "Authentication failed"});  
        }
    } catch(err){
        return res.status(401).json({message: "Authentication failed"});
    }
};
