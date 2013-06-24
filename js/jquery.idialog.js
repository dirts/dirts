
;(function($, win) {

	if($.icard) return false;

	var $win = $(win), $body = $('body');

	$.icard = function(settings) {

		var defaults = {
			'align':null,
			'title': '标题',
			'content': '内容',
			'mask': true,
			'drag': false
		}
		var opts = $.extend(defaults, settings);

		var html = [
			'<div class="i-dialog-wrap ', opts['class'] ,'" style="display:none">', 
				'<div class="i-dialog-arrow">◆</div>',
				'<div class="i-dialog-title clearfix">', 
					'<span>',opts['title'],'</span><div class="i-dialog-close">x</div>', 
				'</div>', 
				'<div class="i-dialog-content">', opts['content'] ,'</div>', 
			'</div>'
			].join('');

		var $this = $(html)
        if(opts.width){
          $this.css({'width':opts.width});//.attr('style', 'background:#fff;border:1px solid #ccc;position:absolute;width:200px;height100px;z-index:999999');
        }
		var $arrow = $this.find('.i-dialog-arrow');

		//method : content
		$this.content = function(html) {
			$this.find('.i-dialog-content').html(html);
			return this;
		}

		//method : content
		$this.getRects = function(targets,e){
			var Rects = null;
			
			targets = targets ? targets[0] : $this[0];
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

		// align : tips.
		$this.align = function($targets,e) {

			//$this is $tips
			if(!$this.is(':visible')) return;
	
			var $tipRect = $this.getRects();
			var width = $tipRect.right - $tipRect.left, height = $tipRect.bottom - $tipRect.top;
			var viewport = {
				'height' : $win.height(),
				'width' : $win.width()
			}

			var offset = {};
			var $targetRects = {};

			if($targets){

				$targetRects = $this.getRects($targets,e);

				//var $arrow_pos_left = parseInt( $arrow.position().left + $arrow.width()/2 );
				var $arrow_pos_left = parseInt( (width - $arrow.width()) / 2 );

				$arrow.css({'left':$arrow_pos_left});
				offset.left = $targetRects.left + parseInt(($targetRects.right - $targetRects.left - width) / 2);

				if(offset.left + width > viewport.width){
					offset.left = viewport.width - width;
					$arrow.css({'left':$targetRects.left + parseInt(($targetRects.right - $targetRects.left)/2) - offset.left - $arrow.width() / 2});
				}
				if(offset.left < 0){
					offset.left = 0;
					$arrow.css({'left':$targetRects.left + parseInt(($targetRects.right - $targetRects.left - $arrow.width()) / 2 ) });
				}

				if((viewport.height - $targetRects.bottom) >= $targetRects.top){
					// if offset is bottom more .
					offset.top =  $targetRects.top + $win.scrollTop() + $targetRects.height + ( $arrow.height() / 2 ) ;
					$arrow.css({'top': -($arrow.height() / 2), 'bottom' : ''});

				}else{
					// if offset is top more.
					offset.top =  $targetRects.top + $win.scrollTop() - height - ( $arrow.height() / 2 );
					$arrow.css({'top': '' ,'bottom': -($arrow.height() / 2)});
				
				}

			}else{

				offset.left = parseInt( (viewport.width - width)/2 );
				offset.top = parseInt( (viewport.height - height)/2 );
			}

			$this.css(offset);
			
			return this;
		}

		$this.close = function() {
			$this.hide();
		}

		$this.find('.i-dialog-close').bind('click', function() {
			$this.hide();
		});

		$win.bind('resize', function() {
			//$this.align();
		});

		$body.prepend($this);

		return $this;

	}


}(jQuery, window));

;(function($){

	if($.fn.icard) 	return false;

	$.fn.icard = function(settings) {
	
		var $this = this;
		var defaults = { 'type' : 'mouserover'};
		var opts = $.extend(defaults, settings);

		var timer = null;

		this.each(function() {
			
			var $this = $(this);
			var $card = $.icard(opts);

			$this.data({'card': $card });
				
			if(opts.type == 'click'){
				$this.bind('click',function(e){
					$card.show().align();
				});
			}else{ 
				$this.bind('mouseenter',function(e){
					timer = setTimeout(function(){
						$card.show().align($this,e);
					},200)
				});

				$this.bind('mouseleave',function(){
					clearTimeout(timer);
					$card.close();
				});
			}
			
		});

		return this;
	}
}(jQuery));

