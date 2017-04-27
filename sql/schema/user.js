const Schema = require('../config/config')

const UserSchema = new Schema({
	username: String,
	password: String,
	role: {
		type: Number,
		default: 0
	},
	CreateTime: {
		type: Date,
		default: Date.now()
	},
	UpdataTime: {
		type: Date,
		default: Date.now()
	}
})

UserSchema.pre('save', function(next) {
	if(this.isNew) {
		this.CreateTime = this.UpdataTime = Date.now()
	} else {
		this.UpdataTime = Date.now()
	}
	next()
})

module.exports = UserSchema