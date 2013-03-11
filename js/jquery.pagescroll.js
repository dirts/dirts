
;(function($, win) {

	if($.pagescroll) {
		return;
	}

	var $win = $(win), $body = $('body');


	$.pagescroll = function($cur,$target) {

		$cur.bind('click',function(e){
			var offset = $target.offset();
			$('html, body').animate({scrollTop: offset.top },300);
		});

		function isViewing($target){
			var offset = $target.offset();
			if( (offset.top + $target.height() ) >= $win.scrollTop() + $win.height() / 2 &&  $win.scrollTop() + $win.height() / 2 >= offset.top ){
				return true;
			}
			return false;
		}

		$win.bind('scroll',function(){
		
			if( isViewing($target) ){
				$cur.addClass('cur');
			}else{
				$cur.removeClass('cur');
			}
		});
	}

	$.pagescroll($('.nav-trigger-phototype'),$('#phototype'));
	$.pagescroll($('.nav-trigger-a'),$('.cat-target-a'));
	$.pagescroll($('.nav-trigger-b'),$('.cat-target-b'));
	$.pagescroll($('.nav-trigger-c'),$('.cat-target-c'));
	$.pagescroll($('.nav-trigger-d'),$('.cat-target-d'));
	$.pagescroll($('.nav-trigger-e'),$('.cat-target-e'));
	$.pagescroll($('.nav-trigger-f'),$('.cat-target-f'));
	$.pagescroll($('.nav-trigger-g'),$('.cat-target-g'));

}(jQuery, window));



;(function($){

	if($.fn.pagescroll) {
		return;
	}

	$.fn.pagescroll = function(settings) {
		
	}
}(jQuery));

