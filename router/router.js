const Router = require('koa-router')
const router = new Router()
const convert = require('koa-convert')
const Betterbody = require('koa-better-body')

const User = require('../sql/control/user')
const Article = require('../sql/control/article')
const Comment = require('../sql/control/comment')

router.get('/', User.keepLog, Article.index)

router.post('/signin', User.signin)

router.post('/signup', User.signup)

router.get('/user/logout', User.logout)

router.get('/user/list', User.keepLog, User.req, User.list)

router.post('/user/del', User.del)

router.get('/article', User.keepLog, Article.get)

router.get('/article/add', User.keepLog, User.req, Article.add)

router.post('/article/addDeal', Article.addDeal)

router.get('/article/list', User.keepLog, User.req, Article.list)

router.get('/article/update/:id', Article.update)

router.post('/article/updateDeal', Article.updateDeal)

router.post('/article/del', Article.del)

router.post('/upload/img', convert(Betterbody()), Article.uploadImg)

router.post('/comment/save', Comment.save)

router.get('/admin', User.keepLog, User.req, User.admin)

module.exports = router