	/*
	 * Scripts by Dominik Serafin
	 * * http://serafin.io/
	 * * dominikdsgnr@gmail.com
	 *
	 */
/*------------------*\
	Document Ready
\*------------------*/
$(document).ready(function(){

	/*------------------*\
		FUNCTION ShowcaseHeightSet()
		Set '.showcase_stage-wrapper'
		height the same as
		'.showcase_stage-active'
		(which is positioned absolutely
		and doesn't fill wrapper)
	\*------------------*/
	function ShowcaseHeightSet() {
		$(".showcase_stage-wrapper").css("height", $(".showcase_stage-active").height() );
	}
	/*------------------*\
		Run showcase height function
		after image on active slide
		has loaded
	\*------------------*/
	$(".showcase_stage-active img").one("load", function() {
		ShowcaseHeightSet();
	}).each(function() {
		if(this.complete) $(this).load();
	});






	/*------------------*\
		Hamburger navigation in header
	\*------------------*/
	$(".header_hamburger").click(function(event) {
		$(".navigation_bar").fadeToggle(100);
		event.stopPropagation();
	});

	$(".navigation_bar").click(function(event) {
		event.stopPropagation();
	});

	$("html, .navigation_bar a").click(function(event) {
		$(".navigation_bar").slideUp(100);
	});





	/*------------------*\
		Smooth Scroll
	\*------------------*/

	$(".js-smooth-scroll").click(function(event) {
		event.preventDefault();

		var ThisHref = $(this).attr("href");
		//var HeaderHeight = $(".header").height();

		$( ThisHref ).velocity("scroll", {
			duration: 1000,
			//offset: -HeaderHeight,
			easing: "ease",

			begin: function() {
				$(window).on("mousewheel", function(event) {
					return false;
				});
			},

			complete: function() {
				$(window).off("mousewheel");
			}
		});

		window.location.hash = ThisHref;
	});






	/*------------------*\
		Portfolio Showcase
	\*------------------*/
	//responsive slides set
	var slides_settings = {
		auto: true,              // Boolean: Animate automatically, true or false
		speed: 500,              // Integer: Speed of the transition, in milliseconds
		timeout: 8000,           // Integer: Time between slide transitions, in milliseconds
		pager: true,             // Boolean: Show pager, true or false
		nav: false,              // Boolean: Show navigation, true or false
		random: false,           // Boolean: Randomize the order of the slides, true or false
		pause: false,            // Boolean: Pause on hover, true or false
		pauseControls: true,     // Boolean: Pause when hovering controls, true or false
		prevText: " ",           // String: Text for the "previous" button
		nextText: " ",           // String: Text for the "next" button
		maxwidth: "",            // Integer: Max-width of the slideshow, in pixels
		navContainer: "",        // Selector: Where controls should be appended to, default is after the 'ul'
		manualControls: "",      // Selector: Declare custom pager navigation
		namespace: "rslides",    // String: Change the default namespace used
		before: function(){},    // Function: Before callback
		after: function(){}      // Function: After callback
	}
	$(".rslides").responsiveSlides(slides_settings);


	//thumb navigation
	$(".showcase_thumb").click(function(event) {

		if( $(this).hasClass("showcase_thumb-blank") || $(this).hasClass("showcase_thumb-active") ) {
			0;
		}

		else {
			var ProjectNumber = $(this).attr("data-project");

			//thumbnails
			$(".showcase_thumb").removeClass("showcase_thumb-active");
			$(".showcase_thumb[data-project='" + ProjectNumber + "']").addClass("showcase_thumb-active");

			//stage
			$(".showcase_stage").fadeOut(400).removeClass("showcase_stage-active");
			$(".showcase_stage[data-project='" + ProjectNumber + "']").fadeIn(400).addClass("showcase_stage-active");

			//details
			$(".showcase_point-details-full").css("display","none");
			$(".showcase_ellipsis, .showcase_readmore").css("display","inline");

		}

		//set showcase section height
		ShowcaseHeightSet();
	});





	/*------------------*\
		Project details 'read more'
		and 'read less' buttons
	\*------------------*/
	$(".showcase_readmore").click(function(event) {
		$(this).parent().parent().find(".showcase_point-details-full").css("display","inline");
		$(this).parent().find(".showcase_ellipsis").css("display","none");
		$(this).hide();

		//set height
		ShowcaseHeightSet();
	});

	$(".showcase_readless").click(function(event) {
		$(this).parent(".showcase_point-details-full").css("display","none");
		$(this).parent().parent().find(".showcase_ellipsis, .showcase_readmore").css("display","inline");

		//set height
		ShowcaseHeightSet();
	});






	/*------------------*\
		Contact form AJAX script
		which communicates with
		contact_form.php
	\*------------------*/
	$("#contact_submit").click(function(event) {
		event.preventDefault();

		var proceed = true;

		if(proceed) //everything looks good! proceed...
		{
			//get input field values data to be sent to server
			post_data = {
				'sender_name'      : String( $('#sender_name').val() ),
				'sender_email'     : String( $('#sender_email').val() ),
				'message_content'  : String( $('#message_content').val() )
			};


			//Ajax post data to server
			$.post('php/contact_form.php', post_data, function(response)
			{

 				//load json data from server and output message
				//it probably should be refactored a bit...
 				switch (response.type) {

 					case "error_message_content":
						$(".contact_response-ajax-text").hide();
						$(".contact_textarea-wrapper .contact_response-ajax-text").css("display","inline-block").text(response.text);

						$("#message_content, #sender_name, #sender_email").css("box-shadow","none");
						//$("#message_content").css("box-shadow","0 0 10px 0 rgba(255,0,0,0.5)");
						break;

 					case "error_sender_name":
						$(".contact_response-ajax-text").hide();
						$(".contact_input-wrapper-name .contact_response-ajax-text").css("display","inline-block").text(response.text);

						$("#message_content, #sender_name, #sender_email").css("box-shadow","none");
						//$("#sender_name").css("box-shadow","0 0 10px 0 rgba(255,0,0,0.5)");
						break;

 					case "error_sender_email":
						$(".contact_response-ajax-text").hide();
						$(".contact_input-wrapper-email .contact_response-ajax-text").css("display","inline-block").text(response.text);

						$("#message_content, #sender_name, #sender_email").css("box-shadow","none");
						//$("#sender_email").css("box-shadow","0 0 10px 0 rgba(255,0,0,0.5)");
						break;

					default:
						$(".contact_response-ajax-text").hide();

						$("#message_content, #sender_name, #sender_email").css("box-shadow","none");
						$(".contact_button-wrapper").removeClass("ghost-button");
						$(".contact_button-wrapper").addClass("contact_button-wrapper-sent");
						$(".contact_paper-plane-wrapper").addClass("contact_paper-plane-wrapper-takeoff");
						$(".contact_response-description-success").html(response.text);
						$(".contact_response-success").delay(500).fadeIn(100);
						//$(".contact_form input, .contact_form textarea").val("");
						$("#contact_submit").unbind('click');
				}

			}, 'json');

		}
	});






	/*------------------*\
		Hat tip
	\*------------------*/
	$(".header_title-wrapper").hover(function(event) {
		$(".hero_hat").toggleClass("hero_hat-tip");
	});

	$(".hero_title-small").hover(function(event) {
		$(".hero_hat").toggleClass("hero_hat-tip");
	});

});
