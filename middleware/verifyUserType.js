const verifyUserType = (roles) => {
    return verifyUserType[roles] || (verifyUserType[roles] = function (req, res, next) {

        if (!req.user || !req.user.user_type || !roles.some(role => req.user.user_type.includes(role))) {
            res.render('forbidden',{user: req.user});
        } else {
            next();
        }
    });
}

module.exports = verifyUserType;
