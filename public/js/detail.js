let articleId = document.getElementById('articleId').value

let detail = new Vue({
	el: '#detail',
	data: () => {
		return {
			content: '',
			articleId: articleId,
			replyTo: '',
			username: '',
			commentId: '',
		}
	},
	methods: {
		commentPost: function() {
			let $this = this
			// 判断点击回复之后，把@删除了
			if(this.username) {
				let reg = new RegExp(this.username)
				if(!reg.test(this.content)) {
					this.replyTo = ''
				}
			}
			axios.post('/comment/save', {
				articleId: this.articleId,
				content: this.content,
				replyTo: this.replyTo,
				commentId: this.commentId,
			}).then((res) => {
				$this.$message({
					message: '评论成功',
					type: 'success',
				})
				location.reload()
			}, (err) => {
			})
		},
		replyComment: function(event) {
			let detail = event.target.parentNode.parentNode
			this.commentId = detail.children[1].value
			this.username = '@' + detail.children[2].innerText + ' '
			this.replyTo = detail.firstChild.value
			this.content += this.username;
		}
	}
})