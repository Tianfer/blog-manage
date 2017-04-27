let signin = new Vue({
	el: '#container',
	data: {
		seen: false,
		form: {
			name: '',
			pass: '',
			checked: '',
		}
	},
	methods: {
		showWindow: function() {
			this.seen = !this.seen
		},
		signin: function() {
			let $this = this
			if(!this.form.name || !this.form.pass) {
				$this.$message({
					message: '账号或者密码不能为空',
					type: 'warning',
					showClose: true,
					duration: 2000
				})
			} else {
				axios.post('/signin', {
					username: this.form.name,
					password: this.form.pass,
					checked: this.form.checked,
				}).then(function(res) {
					if(res.data == '登录成功') {
						location.reload()
					} else {
						$this.$message({
							message: res.data,
							type: 'warning',
							showClose: true,
							duration: 2000
						})
					}
				}).catch(function(err) {
					console.log(err)
				})
			}	
		},
		signup: function() {
			let $this = this
			if(!this.form.name || !this.form.pass) {
				this.$message({
					message: '账号或者密码不能为空',
					type: 'warning',
					showClose: true,
					duration: 2000
				})
			} else {
				axios.post('/signup', {
					username: this.form.name,
					password: this.form.pass
				}).then(function(res) {
					if(res.data == '注册成功') {
						$this.$message('注册成功,请点击登陆')
					} else {
						$this.$message.error('该用户名已存在')
					}		
				}).catch(function(err) {
					console.log(err)
				})
			}
		}
	},
	created: function() {
		document.querySelector('.window').style.display = 'block'
	}
})