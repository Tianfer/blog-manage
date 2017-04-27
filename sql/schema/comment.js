const Schema = require('../config/config')
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
	article: {
		type: ObjectId,
		ref: 'Article'
	},
	from: {
		type: ObjectId,
		ref: 'User'
	},
	reply: [{
		from: {type: ObjectId,ref: 'User'},
		to: {type: ObjectId,ref: 'User'},
		content: String
	}],
	content: String,
	CreateTime: {
		type: Date,
		default: Date.now()
	},
	UpdataTime: {
		type: Date,
		default: Date.now()
	}
})
CommentSchema.pre('save', function(next) {
	if(this.isNew) {
		this.CreateTime = this.UpdataTime = Date.now()
	} else {
		this.UpdataTime = Date.now()
	}
	next()
})

module.exports = CommentSchema