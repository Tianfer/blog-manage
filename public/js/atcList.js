let atcList = new Vue({
	el: '#atcList',
	data: () => {
		return {

		}
	},
	methods: {
		atcUpdate: function(event) {
			let div = event.target.parentNode.parentNode
			let id = div.firstChild.value
			this.$confirm('确定修改该文章？', '提示', {
				confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
			}).then(() => {
				window.location.href = '/article/update/' + id
			}).catch(() => {
				this.$message('修改取消')
			})
		},
		atcDel: function(event) {
			let $this = this
			let div = event.target.parentNode.parentNode
			let id = div.firstChild.value
			this.$confirm('确定删除该文章？', '提示', {
				confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
			}).then(() => {
				axios.post('/article/del', {
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