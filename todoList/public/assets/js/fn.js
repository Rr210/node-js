// 启动时加载
function fn() {
	$.ajax({
		url: '/todo',
		type: 'get',
		success: (res) => {
			let html = template('list', { listData: res })
			$('.todo-list').html(html)
			$('#nums').text(res.length)
		}
	})
}
fn()
// 增加数据
$('.new-todo').on('keyup', (res) => {
	if (res.keyCode == 13) {
		let value = $('.new-todo').val().trim()
		data = { task: value }
		if (value.length !== 0) {
			$.ajax({
				url: '/add',
				type: 'post',
				data: data,
				success: (res) => {
					if (res.code == 1) {
						$('.new-todo').val('')
						fn()
					}
				}
			})
		}
	}
})
// 删除数据(jquery页面监听 加载完成后可继续监听)
$(document).on('click', '.destroy', function () {
	let task = $(this).prev('label').text()
	$.ajax({
		url: '/del',
		type: 'post',
		data: {
			task: task
		}, success: (res) => {
			// console.log(res);
			if (res.code == 1) {
				fn()
			}
		}
	})
})

// 更新数据
$(document).on('dblclick', '.dbl', function () {
	let value = $(this).text()
	let _id = $(this).data('id')
	$(this).parent(".view").next().css({ "display": "block" }).val(value)
	$(this).parent(".view").css({ "display": "none" })
	$(document).on('change', '.edit', function (res) {
		let values = $(this).val()
		$(this).prev('.view').css({ "display": "block" }).children('.dbl').text(values)
		$(this).css({ "display": "none" })
		if (values.trim().length != 0) {
			$.ajax({
				url: '/update',
				type: 'post',
				data: {
					task: values,
					id: _id
				},
				success: (res) => {
					if (res.code == 1) {
						fn()
					}
				}
			})
		}
	})
})
// 使用checkbox 使用change事件来监听 checkbox 复选框
$(document).on('change', '.toggle', function () {
	// // 判断是否checkbox呗选中
	let status = $(this).prop('checked')
	// 从他兄弟的属性中获取_id至d
	let id = $(this).next('.dbl').data('id')
	// 根据获取的id然后对数据进行更新， 将数据库中的completed的值改为true
	if (id) {
		$.ajax({
			url: "/update",
			type: 'post',
			data: {
				id,
				completed: status
			}, success: (res) => {
				if (res.code == 1) {
					fn()
				}
			}
		})
	}

})
// 选择未完成的任务
$(document).on('click', '.filters li', function () {
	let index = $(this).index()
	console.log(index);
	$(this).children('a').addClass('selected');
	$(this).siblings('li').children('a').removeClass('selected');
	function fn2() {
		$.ajax({
			url: '/todo',
			type: 'get',
			data: data,
			success: (res) => {
				let html = template('list', { listData: res })
				$('.todo-list').html(html)
				$('#nums').text(res.length)
			}
		})
	}
	if (index == 0) {
		data = ''
		fn2()
	} else if (index == 2) {
		data = {
			completed: true
		}
		fn2()
	} else if (index == 1) {
		data = {
			completed: false
		}
		fn2()
	}

})

// 移除所有已完成

$(document).on('click', '.clear-completed', function () {
	$.ajax({
		url: '/delall',
		type: 'post',
		success: (res) => {
			if (res.code == 1) {
				fn()
			}
		}
	})
})

$(document).on('ajaxStart', function () {
	NProgress.start();

})

$(document).on('ajaxComplete', function () {
	NProgress.done();
})
