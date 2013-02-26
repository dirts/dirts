;(function($){

	$.fn.rememberit = function(){
		if($(this).length == 0) return;
	}

	/* $.fn.selectPreview */
	$.fn.selectPreview = function(img,selection){
		if($(this).length == 0) return;
		
		var $this = $(this);
		var $imgwidth = $(img).attr('w');
		var $imgheight = $(img).attr('h');
		//var $maximgwidth = Math.max($imgwidth,210);
		var scales = 210 / $imgwidth;

		return $this.each(function(){
			var $img = $(this);
			var $viewport = $img.parent();//.css({'position':'absolute'});
			var $maxnum = $img.parent().width();

			var viewport_width = $viewport.width();
			var viewport_height = $viewport.width();

			var scaleX = (viewport_width / (selection.width)) * scales;
			var scaleY = (viewport_height / (selection.height)) * scales;

			if($img.attr('src') !== img.src){
				$img.attr('src', img.src);
			}

			$img.css({
				'position':'absolute',
				'width': Math.round(scaleX * $imgwidth)  + 'px',
				'height': Math.round(scaleY * $imgheight) + 'px',
				'left': '-' + Math.round(scaleX * selection.x1*($imgwidth/210)) + 'px',
				'top': '-' + Math.round(scaleY * selection.y1*($imgwidth/210)) + 'px'
			});
		});
	}

	/* $.fn.uploadimg */
	$.fn.uploadimg = function(settings){
		var $this = $(this);
		var defaults = {
			'fn' : function(){}
		};
		var opts = $.extend(defaults,settings);

		return $this.each(function(){
			var $form = $(this);
			$form.on('change','input[type="file"]',function(){
				var $fileinput = $(this);
				var options = {
					'success' : function(data){
						opts.fn(data);
						var $cf = $fileinput.clone();
						$fileinput.after($cf);
						$fileinput.remove();
					}
				}
				$form.ajaxSubmit(options);
			});
		});
	}

}(jQuery));