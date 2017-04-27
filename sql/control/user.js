const mongoose = require('mongoose')
const UserSchema = require('../schema/user')
const User = mongoose.model('User', UserSchema)
const crypto = require('crypto')
// 密钥
const key = 'pretty'

// 登录
exports.signin = async(ctx) => {
	let user = ctx.request.body
	let username = user.username
	let password = user.password
	await new Promise(function(resolve, reject) {
		User.find({username: username}, function(err, data) {
			if(err) {
				reject(err)
			} else {
				if(data.length == 0) {
					reject('该用户不存在')
				} else {
					let hmac = crypto.createHmac('sha256', key)
					hmac.update(password)
					let passwordHex = hmac.digest('hex')
					if(data[0].password == passwordHex) {
						resolve(data)
					} else {
						resolve('')
					}	
				}
			}
		})
	}).then(function(data) {
		if(data) {
			if(user.checked) {
				ctx.cookies.set('username', user.username, {
					domain: '127.0.0.1',
					path: '/',
					maxAge: 24 * 36000000,
					httpOnly: true,
					overwrite: false
				})
				ctx.cookies.set('userId', data[0]._id, {
					domain: '127.0.0.1',
					path: '/',
					maxAge: 24 * 36000000,
					httpOnly: true,
					overwrite: false
				})
				ctx.cookies.set('role', data[0].role, {
					domain: '127.0.0.1',
					path: '/',
					maxAge: 24 * 36000000,
					httpOnly: true,
					overwrite: false
				})
			}
			ctx.session.username = user.username
			ctx.session.userId = data[0]._id
			ctx.session.role = data[0].role
			ctx.body = '登录成功'
		} else {
			ctx.body = '密码错误'
		}
	}, function(data) {
		if(data) {
			ctx.body = data
		} else {
			ctx.body = '登录异常'				
		}
	})
}

// 注册
exports.signup = async(ctx) => {
	let user = ctx.request.body
	let username = user.username
	let password = user.password
	await new Promise(function(resolve, reject) {
		User.find({username: username}, function(err, data) {
			if(err) {
				reject(err)
			} else {
				if(data.length == 0) {
					// 储存用户信息
					let hmac = crypto.createHmac('sha256', key)
					hmac.update(password)
					let passwordHex = hmac.digest('hex')
					let _user = new User({
						username: username,
						password: passwordHex
					})
					_user.save(function(err, data) {
						if(err) {
							reject(err)
						} else {
							resolve(data)
						}
					})
				} else {
					resolve('')
				}
			}
		})
	}).then(function(data) {
		if(data) {
			ctx.body = '注册成功'
		} else {
			ctx.body = '该用户已经存在'
		}
	}, function(data) {
		ctx.body = data
	})
}

// 退出
exports.logout = async(ctx) => {
	ctx.session = null
	ctx.cookies.set('username', null, {
		maxAge: 0,
	})
	ctx.cookies.set('userId', null, {
		maxAge: 0,
	})
	ctx.cookies.set('role', null, {
		maxAge: 0,
	})
	global.username = null
	global.userId = null
	global.role = null
	ctx.redirect('/')
}

// 登录状态
exports.keepLog = async(ctx, next) => {
	if(!global.username) {
		if(ctx.cookies.get('username')) {
			global.username = ctx.cookies.get('username')
			global.userId = ctx.cookies.get('userId')
			global.role = ctx.cookies.get('role')
			ctx.session.username = global.username
			ctx.session.userId = global.userId
			ctx.session.role = global.role
		} else if(ctx.session.username) {
			global.username = ctx.session.username
			global.userId = ctx.session.userId
			global.role = ctx.session.role
		}
	}

	await next()
	return
}

// 登录权限
exports.req = async(ctx, next) => {
	if(!global.role) {
		global.role = ctx.session.role || ctx.cookies.get('role')
	}

	if(!global.role || global.role < 40) {
		await ctx.redirect('/')
	}
	
	await next()
	return
}

// 用户列表
exports.list = async(ctx) => {
	await new Promise(function(resolve, reject) {
		User.find({role: {$lt: 10}}, {username: 1, role: 1}).sort({_id: -1}).exec(function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	}).then(async(data) => {
		await ctx.render('userList', {
			data
		})
	}, function(err) {
		console.log(err)
	})
}

// 用户删除
exports.del = async(ctx) => {
	let id = ctx.request.body.id
	let str = ''
	await new Promise(function(resolve, reject) {
		User.remove({_id: id}, function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve()
			}
		})
	}).then(async() => {
		str = '删除成功'
	}, () => {
		str = '删除错误'
	})

	ctx.body = str
}

// 管理员
exports.admin = async(ctx) => {
	await ctx.render('admin')
}