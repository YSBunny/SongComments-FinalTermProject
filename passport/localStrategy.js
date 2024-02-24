const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        // 로그인 폼에 입력된 값
        usernameField: 'identity',
        passwordField: 'password',
    }, async (identity, password, done) => {
        try {
            // DB에 이미 존재하는 아이디인지 찾기
            const exUser = await User.findOne({ where: { identity } });
            if (exUser) {
                // 비밀번호 비교
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    // 일치하면 로그인
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
