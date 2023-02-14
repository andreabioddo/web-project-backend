let cfg = require('./config.json')
const jwt = require('jsonwebtoken');

function checkAuth (req, res) {
    try {
        const token = req.headers.authorization;//take the token from the header
        const verified = jwt.verify(token, cfg.auth.jwt_key);
        console.log(verified);
        if(verified){
            req.userData = token;
            return verified;
        } else {
            return res.status(401).json({message: "Authentication failed"});  
        }
    } catch(err){
        return res.status(401).json({message: "Authentication failed"});
    }
};

module.exports.checkAdmin = (req, res, next) => {
    let verified = checkAuth(req, res);
    if(!verified.isAdmin || !verified){
        return res.status(401).json({message: "Admin area only"});
    } else {
        next();
    }
};

module.exports.checkUser = (req, res, next) => {
    if(checkAuth(req, res))
        next();
}


module.exports.returnJWTData = function(authorization){
    if(authorization != null){
        const token = authorization;//take the token from the header
        return jwt.verify(token, cfg.auth.jwt_key);
    } else {
        return false;
    }
}