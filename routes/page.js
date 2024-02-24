const express = require('express');
const { isNotLoggedIn } = require('./middlewares');
const { User, Comment } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// 회원가입 페이지 요청
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - SB Song' });
});

// 메인 페이지 요청
router.get('/', async (req, res, next) => {
    try {
        // 댓글과 작성자 가져옴
        const comments = await Comment.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        res.render('main', {
            title: 'SB Song',
            cmts: comments,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
