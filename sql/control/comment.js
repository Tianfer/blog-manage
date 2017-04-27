const mongoose = require('mongoose')
const CommentSchema = require('../schema/comment.js')
const Comment = mongoose.model('Comment', CommentSchema)

exports.save = async(ctx) => {
	let comment = ctx.request.body
	// let fromId = ctx.cookies.get('userId')
	let fromId = ctx.session.userId
	let str = ''
	if(!comment.replyTo) {
		_comment = new Comment({
			article: comment.articleId,
			content: comment.content,
			from: fromId,
		})
		_comment.save(function(err, data) {
			if(err) {
				console.log(err)
				str = '评论出错'
			} else {
				console.log(data)
				str = '评论成功'
			}
		})
	} else {
		Comment.findOne({_id: comment.commentId}, function(err, data) {
			if(err) {
				console.log(err)
			} else {
				let reply = {
					from: fromId,
					to: comment.replyTo,
					content: comment.content
				}

				data.reply.push(reply)
				data.save(function(err) {
					if(err) {
						console.log(err)
					}
				})
			}
		})
	}

	ctx.body = str
}