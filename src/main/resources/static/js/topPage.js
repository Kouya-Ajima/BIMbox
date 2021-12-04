const $main = $(".page-content");
const $header = $(".page-header");
const $navCollapse = $(".navbar-collapse");
const scrollClass = "scroll";

$(window).on("scroll", () => {
	if (this.matchMedia("(min-width: 992px)").matches) {
		const scrollY = $(this).scrollTop();
		scrollY > 0
			? $main.addClass(scrollClass)
			: $main.removeClass(scrollClass);
	} else {
		$main.removeClass(scrollClass);
	}
});

$(".page-header .nav-link, .navbar-brand").on("click", function(e) {
	e.preventDefault();
	const href = $(this).attr("href");
	$("html, body").animate({
		scrollTop: $(href).offset().top - 71
	}, 600);
});



$(function() {
	$(".flip-container:not(.active)").on("click", function(e) {
		
		$(this).addClass("active"), setTimeout(function() {
			$(".lightbox").addClass("active");
		}, 500);
		
	}),
	
		$(".lightbox").on("click", function() {
			
			$(".flip-container.temp").after(
				$(".flip-container.active")
			),
			setTimeout(function() {
				$(".active").removeClass(
					"active"
				), $(".flip-container.temp").remove();
			});
			
		});
});
