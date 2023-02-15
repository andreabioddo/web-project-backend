let cfg = require('./config.json')
const jwt = require('jsonwebtoken');

function checkAuth (req, res) {
    try {
        const token = req.headers.authorization;//take the token from the header
        const verified = jwt.verify(token, cfg.auth.jwt_key);
        if(verified){
            req.userData = token;
            return verified;
        } else {
            return false;  
        }
    } catch(err){
        return false;
    }
};

module.exports.checkAdmin = (req, res, next) => {
    let verified = checkAuth(req, res);
    if(verified && verified.isAdmin){
        next();
    } else {
        return res.status(401).json({message: "Admin area only"});
    }
};

module.exports.checkUser = (req, res, next) => {
    console.log(checkAuth(req, res));
    if(checkAuth(req, res)){
        next();
    } else {
        res.status(401).json({message: "Authentication failed"});
    }
}


module.exports.returnJWTData = function(authorization){
    if(authorization != null){
        const token = authorization;//take the token from the header
        return jwt.verify(token, cfg.auth.jwt_key);
    } else {
        return false;
    }
}