const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Comment } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// uploads 폴더 생성
try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    // 오디오를 서버 디스크에 저장
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 30 * 1024 * 1024 },
});

router.post('/audio', isLoggedIn, upload.single('media'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/audio/${req.file.filename}` });
});

const upload2 = multer();
// 댓글 등록
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        console.log(req.user);
        const comment = await Comment.create({
            content: req.body.content,
            audio: req.body.url,
            UserId: req.user.id,
        });
        console.log("Comment:", comment.content, comment.audio, comment.UserId);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 댓글 수정, 삭제
router.route('/:id', isLoggedIn)
    .put(async (req, res, next) => {
        try {
            await Comment.update({
                content: req.body.content,
            }, {
                where: { id: req.params.id },
            });
            res.redirect('/');
        } catch (error) {
            console.error(error);
            next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            await Comment.destroy({
                where: { id: req.params.id }
            });;
            res.redirect('/');
        } catch (error) {
            console.error(error);
            next(error);
        }
    });

module.exports = router;
