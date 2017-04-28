const arcAdd = new Vue({
	el: '#add',
	data:() => {
		return {
			options: [
				{
					label: '选项1',
					value: 'javascript'
				},
				{
					label: '选项2',
					value: 'css'
				},
				{
					label: '选项3',
					value: 'node'
				}
			],
			select: '',
			title: '',
			tips: '',
			textarea: '',
			loading: false,
		}
	},
	methods: {
		// icon 点击功能
		clickIcon: function(event) {
			let target = event.target
			let className = target.className
			let icon = className.slice(-1)
			let text = document.querySelector('.el-textarea textarea')
			let start = text.selectionStart
			let end = text.selectionEnd
			let startText = text.value.slice(0, start)
			let endText = text.value.slice(end)
			switch(icon) {
				case 'B':
					text.value = startText + '****' + endText
					text.focus()
					text.setSelectionRange(start+2, end+2)
					break
				case 'I':
					text.value = startText + '**' + endText
					text.focus()
					text.setSelectionRange(start+1, end+1)
					break
				case 'L':
					this.$prompt('请输入链接', '提示', {
						cancelButtonText: '取消',
						confirmButtonText: '确定',
						inputPlaceholder: '谷歌||https://google.com'
					}).then((data) => {
						let url = data.value
						let arr = url.split('||')
						text.value = startText + '['+arr[0]+']' + '('+arr[1]+')' + endText
					})
					break
				case 'Q':
					this.textInsert('>')
					break
				case 'O':
					this.textInsert('1.')
					break
				case 'U':
					this.textInsert('*')
					break
				case 'V':
					this.$message({
						message: '预览功能暂无',
						type: 'warning',
					})
					break
				default:
					break
			}
		},
		// 文章发布功能
		submit: function() {
			let $this = this
			this.loading = true
			if(!document.querySelector('.isData')) {
				if(this.select && this.title && this.tips && this.textarea) {
					axios.post('/article/addDeal', {
						type: this.select,
						title: this.title,
						tips: this.tips,
						content: this.textarea,
					}).then(function(res) {
						$this.loading = false
						if(res.data == '该标题已经存在') {
							$this.$message({
								showClose: true,
								message: res.data,
								duration: 2000,
								type: 'warning',
							})	
						} else {
							$this.$message({
								showClose: true,
								message: res.data,
								duration: 2000,
							})
						}
						}).catch(function(err) {
						$this.loading = false
						$this.$message({
						showClose: true,
						message: '未知错误',
						duration: 2000,
						type: 'error'
						})
					})
				} else {	
					$this.$message({
						showClose: true,
						message: '不能有空的地方',
						duration: 2000,
						type: 'warning',
					})
				}
			} else {
				let id = document.getElementById('dataId').value
				if(this.select && this.title && this.tips && this.textarea && id) {
					axios.post('/article/updateDeal', {
						id: id,
						type: this.select,
						title: this.title,
						tips: this.tips,
						content: this.textarea,
					}).then((res) => {
						if(res.data == '修改成功') {
							$this.$message('修改成功')
							location.reload()
						} else {
							$this.$message.error('修改错误')
						}
					}).catch((err) => {
						$this.$message.error('修改错误')
					})
				} else {	
					$this.$message({
						showClose: true,
						message: '不能有空的地方',
						duration: 2000,
						type: 'warning',
					})
				}
			}
			
		},
		// 上传图片限制
		beforeUpload: function(file) {
			const isImg = /image/.test(file.type)
			const isLt2M = file.size / 1024 / 1024 < 2
			if (!isImg) {
				this.$message.error('上传的必须是图片！');
			}
			if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isImg && isLt2M
		},
		// 图片上传成功回调
		uploadSeccuss: function(res) {
			if(res) {
				this.$message('上传成功')
				this.textarea += '![图片](/upload/' + res + ')'
			}
		},
		// textarea处理
		textInsert: function(str) {
			let text = document.querySelector('.el-textarea textarea')
			let start = text.selectionStart
			let end = text.selectionEnd
			let startText = text.value.slice(0, start)
			let endText = text.value.slice(end)
			
			let textarea = this.textarea
			let length = textarea.length
			let i = 0
			let arr = []
			while(i < length) {
				let n = textarea.indexOf('\n', i+1)
				if(n == -1) {
					break
				}
				i = n
				arr.push(n)
			}
			let arrLength = arr.length
			if(arrLength == 0) {
				this.textarea = str + this.textarea
			} else {
					for(let j = 0; j < arrLength; j++) {
						if(arr[j] >= end) {
							startText = text.value.slice(0, arr[j-1]+2)
							endText = text.value.slice(arr[j-1]+2)
							text.value = startText + str + endText
							text.focus()
							text.setSelectionRange(arr[j-1]+2, arr[j-1]+2)
							return
						}
					}
					startText = text.value.slice(0, arr[arrLength-1]+2)
					endText = text.value.slice(arr[arrLength-1]+2)
					text.value = startText + str + endText
					text.focus()
					text.setSelectionRange(arr[arrLength-1]+2, arr[arrLength-1]+2)
				}
		}
	},
	created: function() {
		if(document.querySelector('.isData')) {
			this.select = document.getElementById('dataType').value
			this.title = document.getElementById('dataTitle').value
			this.tips = document.getElementById('dataTips').value
			this.textarea = document.getElementById('dataContent').value
		}
	}
})

// var ue = UE.getEditor('container');