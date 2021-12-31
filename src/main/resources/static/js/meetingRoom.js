
// layout
$(function() {
	
	// 読み込み時にPostの高さを決定する
	$(document).ready(function() {
		decide_topics_height();
		change_addImg_text();
	});
	
	$(window).on('resize', function() {
		decide_topics_height();
		change_addImg_text();
	});
	
	// accordion
	$('.link').on('click', function() {
		accodion_do($(this))
		setTimeout(function() {
			decide_topics_height()
			},
			450
		);		
	});
	
	// Accodeionの開閉ロジック
	function accodion_do(e){
		var parent = e.closest('.ac-parent');
		parent.nextAll('.ac-child').slideToggle();
		parent.toggleClass("open");
		$('.ac-parent').not(parent).removeClass('open');
		$('.ac-parent').not(parent).nextAll('.ac-child').slideUp();
	}
	
	// 画像投稿エリアの文字を変更する
	function change_addImg_text(){
		var content_width = $('.two').innerWidth();
		var addImgBox_text = $('.drag-text');
		if(content_width < 664){
			addImgBox_text.each(function (){
				$(this).html('<h3>Drag and drop or Click.</h3>');
			})
		} else {
			addImgBox_text.each(function (){
				$(this).html('<h3>Drag and drop or Click to add image.</h3>');
			})
		}
	}
	
	//　Postの高さを決定する
	function decide_topics_height(){
		var column_height = $(window).height() - 40;
		var sc_height = $('.search-container').outerHeight(true);
		var mc_height = $('.moodle-container').outerHeight(true);
		var search_box = $('.search-content');
		var topics_height = column_height - (sc_height + mc_height)
		$('.topics').outerHeight(topics_height);
		if(search_box.innerWidth() < 398){
			search_box.attr('placeholder', 'by topic, user, post.');
		} else {
			search_box.attr('placeholder', 'ユーザー名、トピック名、投稿内容 を検索できます。');
		}
	}
	
})


// ファイルのUPLOAD
function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('.image-upload-wrap').hide();
			$('.file-upload-image').attr('src', e.target.result);
			$('.file-upload-content').show();
			$('.image-title').html(input.files[0].name);
		};
		reader.readAsDataURL(input.files[0]);
	} else {
		removeUpload();
	}
}

// ファイル削除
function removeUpload() {
	$('.file-upload-content').hide();
	$('.image-upload-wrap').show();
}

// ドラッグ時処理
$('.image-upload-wrap').bind('dragover', function() {
	$('.image-upload-wrap').addClass('image-dropping');
});

// ドロップ時処理
$('.image-upload-wrap').bind('dragleave', function() {
	$('.image-upload-wrap').removeClass('image-dropping');
});
	
	
// コメントとドロップダウンの非表示処理
$(function() {
	$(document).ready(function() {
		var comment_list = $('.comment');
	});
});
	

// コメントボックスの開閉
$(function() {
	// 開く
	$('.comment').on('click', function(){
		var comment_box = $(this).parent().nextAll('.comment-box');
		if(comment_box.hasClass('open')){
			comment_box.css('display', 'none');
			comment_box.removeClass('open');
		} else {
			comment_box.css('display', 'block');
			comment_box.addClass('open');
		}
	});
});
	
	
// tooltip
$(function() {
	$('[data-toggle="tooltip"]').tooltip();
});
	
	
//send options
$(function() {

	$(document).ajaxSend(function(e, xhr, options) {
		let token = $("meta[name='_csrf']").attr("content");
		let header = $("meta[name='_csrf_header']").attr("content");
		xhr.setRequestHeader(header, token);
	});

	
	// コメント投稿時の非同期通信処理
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

	// Post評価時の非同期通信処理
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


	// Post編集時の非同期通信処理
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


	// Post編集時の非同期通信処理
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
			/**
			let targetId = '#' + paramTopicNo;
			$(targetId).html(data);
			 */
		});
	});
	

	// Post削除時の非同期通信処理
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


	// Topic削除時の非同期通信処理
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


/**
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
 */
