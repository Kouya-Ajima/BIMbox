
//tooltip
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
})


// Accordion
$(function() {

	var Accordion = function(event, multiple) {
		this.event = event || {};
		this.multiple = multiple || false;

		// Variables privadas
		var links = this.event.find('.link');
		// Evento
		links.on('click', {event: this.event, multiple: this.multiple}, this.dropdown)
	}

	Accordion.prototype.dropdown = function(e) {
		var $el = e.data.event;
			$this = $(this),
			$next = $el.siblings('.submenu');

		$next.slideToggle();
		$this.parent().toggleClass('open');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
		};
	}	

	var accordion = new Accordion($('#accordion'), false);
});



//send options
$(function() {

	$(document).ajaxSend(function(e, xhr, options) {
		let token = $("meta[name='_csrf']").attr("content");
		let header = $("meta[name='_csrf_header']").attr("content");
		xhr.setRequestHeader(header, token);
	});

	$(document).on('click', '#ajaxForm button', function() {

		let ajaxForm = $(this).parents("#ajaxForm");
		let paramTopicNo = ajaxForm.find('#topicNo').val();
		let paramSubject = ajaxForm.find('#subject').val();
		let paramPostText = ajaxForm.find('#postText').val();
		let paramPostImg = ajaxForm.find('#paramPostImg');

		$.ajax({
			type: ajaxForm.attr('method'),
			url: ajaxForm.attr('action'),
			dataType: 'html',
			data: {
				topicNo: paramTopicNo,
				subject: paramSubject,
				primaryPost: paramPostText,
				primaryPostImg: paramPostImg.attr('src')
			}
		}).done((data) => {
			let targetId = '#' + paramTopicNo;
			$(targetId).html(data);
		});
	});

	$(document).on('click', 'button.ajax-link', function() {
		let parent = $(this).parents('#ratingForm');
		let paramTopicNo = parent.find('input[name="topicNo"]').val();
		let paramPostNo = parent.find('input[name="postNo"]').val();
		let paramRating = $(this).data('ts-param');
		$.ajax({
			type: parent.attr('method'),
			url: parent.attr('action'),
			dataType: 'html',
			data: {
				topicNo: paramTopicNo,
				postNo: paramPostNo,
				rating: paramRating
			}
		}).done((data) => {
			let targetId = '#' + paramTopicNo;
			$(targetId).html(data);
		});
	});

	$(document).on('click', '#postEdit', function() {
		let target = $(this).data('ts-target');
		let postText = $(this).parents('#ratingForm').find('textarea[name="postText"]');
		$(target).toggleClass('d-none');
		postText.toggleClass('readonly').toggleClass('p-0');
		if (postText.attr('readonly')) {
			postText.removeAttr('readonly');
		} else {
			postText.attr('readonly', 'readonly');
		}
	});

// Imageを追加する。
	$(document).on('click', '#textEdit', function() {
		let parent = $(this).parents('#ratingForm');
		let paramPostText = parent.find('#postText').val();
		let paramTopicNo = parent.find('input[name="topicNo"]').val();
		let paramPostNo = parent.find('input[name="postNo"]').val();
		$.ajax({
			type: parent.attr('method'),
			url: '/comms/EditPost.do',
			dataType: 'html',
			data: {
				postText: paramPostText,
				topicNo: paramTopicNo,
				postNo: paramPostNo
			}
		}).done((data) => {
			let targetId = '#' + paramTopicNo;
			$(targetId).html(data);
		});
	});

	$(document).on('click', '#textDelete', function() {
		if (!confirm('本当にこの投稿を削除しますか？')) {
			return false;
		} else {
			let parent = $(this).parents('#ratingForm');
			let paramPostText = parent.find('#postText').val();
			let paramTopicNo = parent.find('input[name="topicNo"]').val();
			let paramPostNo = parent.find('input[name="postNo"]').val();
			$.ajax({
				type: parent.attr('method'),
				url: '/comms/DeletePost.do',
				dataType: 'html',
				data: {
					topicNo: paramTopicNo,
					postNo: paramPostNo
				}
			}).done((data) => {
				let targetId = '#' + paramTopicNo;
				$(targetId).html(data);
			});
		}
	});

	$(document).on('click', '#deleteForm button', function() {
		if (!confirm('本当にこのトピックを削除しますか？')) {
			return false;
		} else {
			let parent = $(this).parents('#deleteForm');
			let paramTopicNo = parent.find('input[name="topicNo"]').val();
			$.ajax({
				type: parent.attr('method'),
				url: parent.attr('action'),
				dataType: 'html',
				data: {
					topicNo: paramTopicNo,
				}
			}).done((data) => {
				let targetId = '#' + paramTopicNo;
				$(targetId).html(data);
			});
		}
	});

});


// 画像のアップロード
$(document).ready(function() {
	var view_box = $('.view_box');

	$(".file").on('change', function() {
		var fileprop = $(this).prop('files')[0],
			find_img = $(this).next('img'),
			fileRdr = new FileReader();

		if (find_img.length) {
			find_img.nextAll().remove();
			find_img.remove();
		}

		var img = '<img width="200" alt="" id="paramPostImg"><a href="#" class="img_del">画像を削除する</a>';

		view_box.append(img);

		fileRdr.onload = function() {
			view_box.find('img').attr('src', fileRdr.result);
			img_del(view_box);
		}
		fileRdr.readAsDataURL(fileprop);
	});

	function img_del(target) {
		target.find("a.img_del").on('click', function() {

			if (window.confirm('サーバーから画像を削除します。\nよろしいですか？')) {
				$(this).parent().find('input[type=file]').val('');
				$(this).parent().find('.img_view, br').remove();
				$(this).remove();
			}

			return false;
		});
	}
});
