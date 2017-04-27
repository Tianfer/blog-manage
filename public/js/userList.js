let userList = new Vue({
	el: '#userList',
	data: () => {
		return {

		}
	},
	methods: {
		userDel: function(event) {
			let $this = this
			let div = event.target.parentNode.parentNode
			let id = div.firstChild.value
			this.$confirm('确定删除该用户？', '提示', {
				confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
			}).then(() => {
				axios.post('/user/del', {
					id: id
				}).then((res) => {
					if(res.data == '删除成功') {
						div.style.display = 'none'
						$this.$message('删除成功')
					} else {
						$this.$message('删除错误')
					}	
				}).catch((res) => {
					console.log(res)
				})
			}).catch(() => {
				this.$message('删除取消')
			})
		}
	}
})