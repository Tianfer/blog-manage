const mongoose = require('mongoose')
const ArticleSchema = require('../schema/article')
const Article = mongoose.model('Article', ArticleSchema)
const CommentSchema = require('../schema/comment')
const Comment = mongoose.model('Comment', CommentSchema)

const marked = require('marked')
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

// 主页
exports.index = async(ctx) => {
	let head = {}
	let articles = []
	await new Promise(function(resolve, reject) {
		Article.findOne({}).sort({_id: -1}).exec(function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	}).then( async(data) => {
		head = data
	}, function(err) {
		console.log('程序错误')
	})
	await new Promise(function(resolve, reject) {
		Article.find({}, {title: 1, UpdataTime: 1}).skip(1).limit(5).sort({_id: -1}).exec(function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	}).then( async(data) => {
		articles = data
	}, function(err) {
		console.log('程序错误')
	})
	await ctx.render('index', {
		head,
		articles
	})
}

// 详情页
exports.get = async(ctx) => {
	let id = ctx.request.query.id
	let article = {}
	await new Promise(function(resolve, reject) {
		Article.findOne({_id: id}, function(err, data) {
			if(err) {
				reject(err)
			} else {
				data.content = marked(data.content)
				article = data

				Comment.find({article: id})
					.populate('from', 'username')
					.populate('reply.from reply.to', 'username')
					.exec(function(err, comments) {
						if(err) {
							reject(err)
						} else {
							resolve(comments)
						}
					})
			}
		})
	}).then( async(comments) => {
		await ctx.render('detail', {
			article,
			comments
		})
	}, function(data) {
		console.log(data)
	})
}

// 文章添加
exports.add = async(ctx) => {
	await ctx.render('atcAdd')
}

// 添加处理
exports.addDeal = async(ctx) => {
	let article = ctx.request.body
	let type = article.type
	let title = article.title
	await new Promise(function(resolve, reject) {
		Article.find({type: type, title: title}, function(err, data) {
			if(err) {
				reject(err)
			}
			if(data.length == 0) {
				let _article = new Article(article)
				_article.save(function(err, data) {
					if(err) {
						reject(err)
					} else {
						resolve(data)
					}
				})
			} else {
				resolve('')
			}
		})	
	}).then(function(data) {
		if(data) {
			ctx.body = '发布成功'
		} else {
			ctx.body = '该标题已存在'
		}
	}, function(data) {
		ctx.body = '发布异常'
	})
}

// 文章列表
exports.list = async(ctx) => {
	await new Promise(function(resolve, reject) {
		Article.find({}, {type: 1, title: 1, UpdataTime: 1}).sort({_id: -1}).exec(function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	}).then(async(data) => {
		await ctx.render('atcList', {
			data
		})
	}, function(err) {
		console.log(err)
	})
}

// 文章删除
exports.del = async(ctx) => {
	let id = ctx.request.body.id
	let str = ''
	await new Promise(function(resolve, reject) {
		Article.remove({_id: id}, function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve()
			}
		})
	}).then(() => {
		str = '删除成功'
	}, () => {
		str = '删除错误'
	})

	ctx.body = str
}

// 文章更新
exports.update = async(ctx) => {
	let id = ctx.params.id
	await new Promise(function(resolve, reject) {
		Article.findOne({_id: id}, function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	}).then(async(data) => {
		await ctx.render('atcAdd', {
			data
		})
	}, (err) => {
		console.log(err)
	})
}

// 更新处理
exports.updateDeal = async(ctx) => {
	let article = ctx.request.body
	let id = article.id
	let str = ''
	await new Promise(function(resolve, reject) {
		Article.update({_id: id}, {$set: {type: article.type, title: article.title, tips: article.tips, content: article.content}}, function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve()
			}
		})	
	}).then(function() {
		str = '修改成功'
	}, function(data) {
		str = '修改异常'
	})
	ctx.body = str
}

// 上传图片
exports.uploadImg = async(ctx) => {
	let img = ctx.request.fields.file[0].path
	await new Promise(function(resolve, reject) {
		// 读取文件
		fs.readFile(img, function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	}).then(async(data) => {
		let fileName = new Date().getTime() + '' + Math.floor(Math.random() * 1000) + '.png'
		// 写入文件
		await new Promise(function(resolve, reject) {
			fs.writeFile('../../public/upload/' + fileName, data, 'utf8', function(err) {
				if(err) {
					reject()
				} else {
					resolve()
				}
			})
		}).then(function() {
			ctx.body = fileName
		}, function(err) {
			ctx.body = ''
		})
	}, function(err) {
		ctx.body = ''
	})
}