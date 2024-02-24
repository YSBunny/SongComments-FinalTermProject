const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
    // req.session에 user.id 저장
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // req.user에 사용자 정보 저장
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
};
