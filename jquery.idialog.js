
;(function($, win) {

	if($.icard) {
		return;
	}

	var $win = $(win);


	$.icard = function(settings) {

		var html = [
			'<div class="i-dialog tip-card">', 
				'<div class="i-dialog-arrow"></div>',
				'<div class="i-dialog-title clearfix">', 
					'<span>{%title%}</span><div class="i-dialog-close"></div>', 
				'</div>', 
				'<div class="i-dialog-content">{%content%}</div>', 
				'</div>'
			].join('');

		var defaults = {
			'targets':null,
			'title': '标题',
			'content': '内容',
			'mask': true,
			'drag': false
		}

		var opts = $.extend(defaults, settings);

		var $this = $(html)//.attr('style', 'background:#fff;border:1px solid #ccc;position:absolute;width:200px;height100px;z-index:999999');

		//method : content
		$this.content = function(html) {
			$this.find('.i-dialog-content').html(html);
			return this;
		}

		//method : content
		$this.getRects = function(targets,e){
			var Rects = null;
			
			targets = targets ? targets[0] : $this[0];
			//debugger
			if(e){
				
				var targetsx = e.clientX;
				
				Rects = targets.getClientRects();

				for(var i = 0, len = Rects.length, index = 0 ; i < len ; i++ ){
					if(( Rects[i].left < targetsx ) && ( targetsx  < Rects[i].right )) index = i;
				}
				return Rects[index];
			}else{
				Rects = targets.getBoundingClientRect();
				return Rects;
			}
		}

		$this.align = function($targets,e) {

			if(!$this.is(':visible')){
				return;
			}
			
			var re = $this.getRects();

			var width = re.width,
				height = re.height;

			var viewport_h = $win.height(),
				viewport_w = $win.width();

			var offset = {};
			var rects = {};

			if($targets){

				rects = $this.getRects($targets,e);

				if((viewport_h - rects.bottom) >= rects.top){
					offset.left = rects.left + parseInt(rects.width/2);
					offset.top =  rects.top + $win.scrollTop() + rects.height ;
				}else{
					offset.left = rects.left + parseInt(rects.width/2);
					offset.top =  rects.top + $win.scrollTop() - height ;
				}

			}else{

				offset.left = parseInt( (viewport_w - width)/2 );
				offset.top = parseInt( (viewport_h - height)/2 );
			}

			this.css(offset);
			
			return this;
		}

		//method : content
		$this.close = function() {
			$this.hide();
		}

		$this.find('.i-dialog-close').bind('click', function() {
			$this.hide();
		});

		$win.bind('resize', function() {
			//$this.align();
		});

		$('body').prepend($this);

		if(opts.targets){
			$this.align(opts.targets);
		}else{
			$this.align();
		}

		return $this;
	}


}(jQuery, window));



;(function($){

	if($.fn.icard) {
		return;
	}

	$.fn.icard = function(settings) {
		

		var $this = this;
		var defaults = {};
		var opts = $.extend(defaults, settings);

		this.each(function() {
			
			var $this = $(this);
			var $card = $.icard(opts);

			$this.data({'card': $card });

			$this.bind('mouseenter',function(e){
				$card.show().align($this,e);
			});

			$this.bind('mouseleave',function(){
				$card.close();
			})
			
		});

		return this;
	}
}(jQuery));


(function($){


$(function(){

	$(document).on('mouseenter','a[action-type="user-card"]',function(){

		var $this = $(this);

		if($this.data('card')){
			return;
		}

		$this.icard({
			targets: $(this),
			className: "tip-card",
			content: '测试数据',
			width: 352
		});

		var $card = $this.data('card');
		$card.content($this.find('img').clone())
	})

});


}(jQuery));
