const Schema = require('../config/config')

const ArticleSchema = new Schema({
	type: String,
	title: String,
	tips: String,
	author: {
		type: String,
		default: 'Tianfer'
	},
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
ArticleSchema.pre('save', function(next) {
	if(this.isNew) {
		this.CreateTime = this.UpdataTime = Date.now()
	} else {
		this.UpdataTime = Date.now()
	}
	next()
})

module.exports = ArticleSchema