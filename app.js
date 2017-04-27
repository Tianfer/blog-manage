const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const static = require('koa-static')
const convert = require('koa-convert')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const session = require('koa-session')

global.moment = require('moment')
app.keys = ['secret key']

let CONFIG = {
	key: 'blog',
	maxAge: 1000000,
	overwrite: true,
	httpOnly: true,
	signed: true,
}
app.use(convert(session(CONFIG, app)))

app.use(convert(static(path.join(__dirname, 'public'))))
app.use(convert(static(path.join(__dirname, 'node_modules'))))
app.use(bodyParser())
app.use(views(path.join(__dirname, 'views/pages'), {
	extension: 'pug'
}))

const router = require('./router/router')

app.use(router.routes()).use(router.allowedMethods())
app.listen(80)