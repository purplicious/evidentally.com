

/*dnngo ImgLoad*/
function ImgLoad(callback,e){var imgdefereds=[];e.find('img').each(function(){var dfd=jQuery.Deferred();$(this).bind('load',function(){dfd.resolve();}).bind('error',function(){dfd.resolve();});if(this.complete)setTimeout(function(){dfd.resolve();},1000);imgdefereds.push(dfd);});jQuery.when.apply(null,imgdefereds).done(function(){callback();});}

/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

/*dnngo megamenu*/
(function($){$.fn.dnngomegamenu=function(m){m=$.extend({slide_speed:200,delay_show:150,delay_disappear:500,megamenuwidth:"box",WidthBoxClassName:".container",popUp:"vertical",direction:"ltr"},m||{});var rtl=m.direction=="rtl"?true:false;return this.each(function(index){var me=$(this),primary=me.find(".primary-structure > li"),slide=".menuslide",subs=".sub-menu",subbox="boxslide",hover="menu_hover",slidedefault="slide-menu",interval,interval2;if(rtl){me.addClass("rtl")}if(!!("ontouchstart" in window)){primary.children("a").on("click",function(){if($(this).siblings("div").css("display")=="none"){return false}})}primary.mouseenter(function(){var e=$(this),slides=e.find(slide);clearTimeout(interval);interval2=setInterval(function(){if(slides.css("display")=="none"){e.addClass("menu_hover");slides.attr("style"," ");var space=20;var winwidth=$(window).width()-space,width=slides.width();var c_width=slides.data("width");c_width==0?c_width=false:"";var posBox=$(m.WidthBoxClassName).last();if(m.popUp=="vertical"){var left=e.offset().left;if(slides.find("ul").hasClass(slidedefault)){if(winwidth-left<width){slides.css("left","-"+parseInt(width+left-winwidth+5)+"px")}}if(c_width){if(slides.find("div").hasClass(subbox)){var position=slides.data("position")?slides.data("position"):0;offset=e.innerWidth()/2;c_width=Math.min(c_width,winwidth);if(m.megamenuwidth=="box"){c_width=Math.min(c_width,posBox.innerWidth());var posleft=posBox.offset().left}else{c_width=Math.min(c_width,winwidth);var posleft=space/2}var maxleft=left-posleft;var maxright=left-posleft-c_width;if(position==0){var cur=0}else{if(position==1){var cur=c_width/2-offset}else{if(position==2){var cur=c_width-e.innerWidth()}}}var ju=cur;if(ju>left-posleft){cur=left-posleft}if(left+c_width-ju>posBox.innerWidth()+posleft){cur=left+c_width-(posBox.innerWidth()+posleft)}slides.css({"width":c_width,"left":-cur})}}else{if(m.megamenuwidth=="full"){if(slides.find("div").hasClass(subbox)){slides.css({"width":winwidth,"max-width":winwidth,"left":-left+space/2})}}if(m.megamenuwidth=="box"){if(slides.find("div").hasClass(subbox)){slides.css({"width":posBox.innerWidth(),"max-width":winwidth,"left":posBox.offset().left-left-(Math.min(posBox.innerWidth(),winwidth)-posBox.innerWidth())/2})}}}}if(m.popUp=="level"){if(slides.find("ul").hasClass(slidedefault)){if(rtl){slides.css({"right":"100%","left":"auto"})}else{slides.css("left","100%")}}if(m.megamenuwidth=="box"){var subwidth=$(m.WidthBoxClassName).last().innerWidth()}else{var subwidth=$(window).width();if(c_width){subwidth=Math.min($(window).width(),c_width)}}if(slides.find("div").hasClass(subbox)){if(rtl){slides.css({"width":subwidth,"max-width":slides.parent().offset().left-space/2,"right":"100%","left":"auto"})}else{slides.css({"width":subwidth,"max-width":winwidth-slides.parent().offset().left-slides.parent().innerWidth()+space/2,"left":"100%"})}}var top=e.offset().top-$(window).scrollTop(),winheight=$(window).height(),height=slides.height();if(winheight<height+top){if(winheight<=height){slides.css({"top":-top})}else{slides.css({"top":winheight-(top+height)})}}else{slides.css({"top":0})}}slides.fadeIn(m.slide_speed)}clearTimeout(interval2)},m.delay_show);e.siblings().find(slide).fadeOut(m.slide_speed);e.siblings().find(subs).fadeOut(m.slide_speed);e.siblings().find(slide).find("li").removeClass(hover);e.siblings().find(subs).find("li").removeClass(hover);e.siblings().removeClass(hover)}).mouseleave(function(){var e=$(this);clearTimeout(interval2);interval=setInterval(function(){e.removeClass(hover);e.find("li").removeClass(hover);e.find(slide).fadeOut(m.slide_speed);e.find(subs).fadeOut(m.slide_speed);clearTimeout(interval)},m.slide_speed>m.delay_disappear?m.slide_speed:m.delay_disappear)});primary.find("li").mouseenter(function(){var subbox=$(this).find("> "+subs);if(subbox.css("display")=="none"){$(this).addClass(hover);subbox.fadeIn(m.slide_speed);sub_l=$(this).offset().left;sub_left=sub_l+$(this).width(),winwidth=$(window).width(),sub_width=subbox.width();if(rtl){if(sub_l<sub_width){subbox.css({"left":"100%","right":"auto"})}else{subbox.css({"left":"auto","right":"100%"})}}else{if(winwidth-sub_left<sub_width){subbox.css({"left":"auto","right":"100%"})}else{subbox.css({"left":"100%","right":"auto"})}}if(m.popUp=="level"){var top=$(this).offset().top-$(window).scrollTop(),winheight=$(window).height(),height=subbox.height();if(winheight<height+top){if(winheight<=height){subbox.css({"top":-top})}else{subbox.css({"top":winheight-(top+height)})}}else{subbox.css({"top":0})}}}$(this).siblings().removeClass(hover);$(this).siblings().find(subs).fadeOut(m.slide_speed)});function roller(e,defaultTop){if(e.offset().top+e.height()-$(window).scrollTop()>$(window).height()){var s_top=$(window).scrollTop(),h=e.innerHeight(),w_h=$(window).height(),e_top=0,p_height=e.parent().innerHeight(),n_w=false,min_top,max_top,rollerEv;e.addClass("roller");var up=$('<div class="roller-up"></div>');var down=$('<div class="roller-down"></div>');
up.css({"width":e.width(),});down.css({"width":e.width(),});up.insertBefore(e.children("ul,div.boxslide")).hide();down.insertAfter(e.children("ul,div.boxslide"));if(e.hasClass("sub-menu")||m.popUp=="level"){p_height=0}if(h<w_h){min_top=p_height;max_top=-(e.offset().top-s_top-(w_h-h)-p_height);up.remove();n_w=true}else{if(m.popUp=="level"){min_top=-(e.offset().top-s_top-p_height)+parseInt(defaultTop);max_top=-(h+e.offset().top-w_h-s_top-p_height)+parseInt(defaultTop)}else{min_top=-(e.offset().top-s_top-p_height);max_top=-(h+e.offset().top-w_h-s_top-p_height)}}var rollerEv;function up_d(){e_top=parseInt(e.css("top"))+30;down.show();if(e_top>=min_top){e.css("top",min_top);clearInterval(rollerEv);up.hide()}else{e.css("top",e_top)}}function down_d(){e_top=parseInt(e.css("top"))-30;if(e_top<min_top){up.show()}else{up.hide()}if(e_top<=max_top){e.css("top",max_top);clearInterval(rollerEv);down.hide()}else{e.css("top",e_top)}}up.on("mouseenter",function(){rollerEv=setInterval(up_d,100)}).on("mouseleave",function(){window.clearInterval(rollerEv)});down.on("mouseenter",function(){rollerEv=setInterval(down_d,100)}).on("mouseleave",function(){window.clearInterval(rollerEv)});e.on("mousewheel",function(event){e_top=parseInt(e.css("top"))+event.deltaY*50;if(!n_w){if(e_top>min_top){if(event.deltaY<0){e.stop().css({"top":Math.max(e_top,min_top)});up.show()}if(event.deltaY>0&&parseInt(e.css("top"))<=min_top){e.stop().css({"top":min_top});down.show()}up.hide()}else{if(e_top<=max_top){e.stop().css({"top":max_top});down.hide();if(event.deltaY<0&&parseInt(e.css("top"))>=min_top){up.show()}}else{e.stop().css({"top":e_top});up.show();down.show()}}}else{if(event.deltaY<0){e.stop().css({"top":Math.max(e_top,max_top)});if(e_top<=max_top){down.hide()}}}event.stopPropagation();event.preventDefault()})}}function removeroller(e,defaultTop){if(e.hasClass("roller")){e.css("top",defaultTop);e.removeClass("roller");e.find(".roller-up , .roller-down").remove();e.unbind("mousewheel")}}me.find(".menuslide,.sub-menu").each(function(index,element){var e=$(this),defaultTop=e.css("top"),rollerinterval;e.on("mouseenter",function(){if(!e.hasClass("roller")){if(m.popUp=="level"){defaultTop=e.css("top")}roller(e,defaultTop)}clearTimeout(rollerinterval)});if(e.hasClass("menuslide")){e.on("mouseleave",function(){rollerinterval=setTimeout(function(){removeroller(e,defaultTop)},m.slide_speed>m.delay_disappear?m.slide_speed+m.slide_speed:m.delay_disappear+m.slide_speed)})}if(e.hasClass("sub-menu")){e.parent("li").on("mouseleave",function(){var te=$(this).children(".sub-menu");rollerinterval=setTimeout(function(){removeroller(te,defaultTop)},m.slide_speed>m.delay_disappear?m.slide_speed+m.slide_speed:m.delay_disappear+m.slide_speed)})}})})}})(jQuery);

//roll-menu.js------------------------	version 3.1.0

(function(e){e.fn.rollmenu=function(op){op=$.extend({MTop:450,noroll:767},op||{});var e=$(this),h=op.MTop,p=e.css("position");var roll=function(e){if($(window).width()<op.noroll){if(e.siblings(".roll_replace").length!=0){e.siblings(".roll_replace").remove();e.removeClass("roll-activated");}
return false;};var rollsubmenu=e.find(".boxslide");if($(window).scrollTop()>h){if(e.siblings(".roll_replace").length==0){$("<div class='roll_replace'></div>").insertBefore(e);e.siblings(".roll_replace").height(e.height()).css("position",p);e.addClass("roll-activated").css({"top":-e.height(),"opacity":0}).animate({"top":0,"opacity":1},300); if(e.css("position")!="fixed"){$(".roll_replace").hide()} };rollsubmenu.each(function(){if($(this).height()>$(window).height()-e.height()){$(this).css({"height":$(window).height()-e.height(),"overflow":"auto","marginRight":"-20px","width":$(this).parent(".menuslide").width()+18});if(!e.parent().hasClass("submenu_box")){$(this).wrap("<div class='submenu_box'></div>").parent(".submenu_box").css({"overflow":"hidden"})}}})}
else if(e.siblings(".roll_replace").length!=0){e.siblings(".roll_replace").remove();e.removeClass("roll-activated");rollsubmenu.each(function(){$(this).attr("style"," ")
if($(this).parent().hasClass("submenu_box")){$(this).unwrap();}})}};roll(e);$(window).scroll(function(){roll(e)});$(window).resize(function(){roll(e)})}})(jQuery);


/*visible element*/
(function($){jQuery.fn.visible=function(partial){var $t=$(this),$w=$(window),viewTop=$w.scrollTop(),viewBottom=viewTop+$w.height(),_top=$t.offset().top,_bottom=_top+$t.height(),compareTop=partial===true?_bottom:_top,compareBottom=partial===true?_top:_bottom;if($t.hasClass("visible")){return false}return((compareBottom<=viewBottom)&&(compareTop>=viewTop))};jQuery.fn.dynamicnumbers=function(number,time,speed){var numbers=parseInt(number),i=0,interval,$el=this,times=time?time:1000,speeds=speed?speed:20,cent=RegExp(/[(\%)]+/).test(number)?"%":" ";var dynamic=function(){if(i<numbers){i=i+numbers/(times/speeds);$el.data("separator")?$el.text(String(parseInt(i)).replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")+cent):$el.text(parseInt(i)+cent)}else{$el.data("separator")?$el.text(number.replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")):$el.text(number);clearTimeout(interval)}};interval=setInterval(dynamic,speeds)};var addAnimation=function(element){$(element).each(function(i,el){var el=$(el);if(el.visible(true)&&!el.hasClass("animated")){if(el.attr("data-width")){delay=el.data("delay")!=undefined?el.data("delay"):400;speed=el.data("speed")!=undefined?el.data("speed"):50;el.css("width",el.attr("data-width"));el.find("span").show().dynamicnumbers(el.attr("data-width"),delay,speed)}if(el.attr("data-height")){delay=el.data("delay")!=undefined?el.data("delay"):400;speed=el.data("speed")!=undefined?el.data("speed"):50;el.css("height",el.attr("data-height"));el.find("span").show().dynamicnumbers(el.attr("data-height"),delay,speed)}if(el.attr("data-number")){delay=el.data("delay")!=undefined?el.data("delay"):1500;speed=el.data("speed")!=undefined?el.data("speed"):50;el.dynamicnumbers(el.attr("data-number"),delay,speed)}if(el.hasClass("dg-typewriter")){var array=el.html().split("|");var p_index=0,p_length=array.length;var html=array[p_index],index=0,time=100,l=html.length,loop=el.data("loop")!=undefined?el.data("loop"):true,delay=el.data("delay")!=undefined?el.data("delay"):3000,speed=el.data("speed")!=undefined?el.data("speed"):100;el.addClass("active").html(" ");var printer=function(){if(index<l){if(html.slice(index,index+1)==" "){time=speed*2}else{time=speed}el.html(html.slice(0,index+1));index++;setTimeout(printer,time)}else{if(loop||p_index<p_length-1){setTimeout(delete_printer,delay)}else{el.removeClass("active")}}};var delete_printer=function(){if(index>0){el.html(html.slice(0,index-1));index--;setTimeout(delete_printer,30)}else{p_index<=p_length-2?p_index++:p_index=0;html=array[p_index];l=html.length;setTimeout(printer,300)}};printer()}if(el.hasClass("icon-svg")&&!el.attr("id")){var id="icon-svg-"+i;$(this).attr("id",id);var icon=el.attr("class");icon=icon.substr(icon.indexOf("fa-")+3,40);icon=icon.substr(0,icon.indexOf(" "));if(typeof Vivus=="function"){new Vivus("icon-svg-"+i,{duration:el.data("duration")?el.data("duration"):120,file:"icon-svg/"+icon+".svg",type:el.data("type")?el.data("type"):"sync"})}}el.removeClass("visible").addClass("animated");if(el.hasClass("animationhover")){var t=el.css("animation-duration");t=t.indexOf("ms")>0?parseInt(t):parseInt(t)*1000;el.delay(t).queue(function(){$(this).removeClass("animated").addClass("visible").on("mouseenter",function(){if(!$(this).hasClass("animated")){$(this).addClass("animated").delay(t).queue(function(){$(this).removeClass("animated").dequeue()})}}).dequeue()})}}})};var checkVisible=function(element){$(element).each(function(i,el){var el=$(el);if(el.visible(false)){el.addClass("visible")}})};$(window).load(function(){addAnimation(".animation,.animationhover")});$(window).scroll(function(event){addAnimation(".animation,.animationhover")})})(jQuery);


/*Mouse Event*/
(function ($) {
  $.fn.newMouse = function (options) { 
    var defaults = {
      mousedown: function () {},
      mouseup: function () {},
      mousemove: function () {}
    };
    var o = $.extend(defaults, options);
    var e = $(this);
    e[0].addEventListener("touchstart", touch, false);
    e[0].addEventListener("touchmove", touch, false);
    e[0].addEventListener("touchend", touch, false);
    e[0].addEventListener("mousedown", touch, false);
    e[0].addEventListener("mouseup", touch, false);
    e[0].addEventListener("mousemove", touch, false);
    e[0].addEventListener("mouseleave", touch, false);
    var isdown = false,
      startX = 0,
      startY = 0,
      endX = 0,
      endY = 0;
    function touch(event) {
      var event = event || window.event;
      switch (event.type) {
        case "touchstart":
        case "mousedown":
          events = event.type == "mousedown" ? event : event.touches[0];
          isdown = true;
          o.mousedown();
          break;
        case "touchend":
        case "mouseup":
        case "mouseleave":
          if (isdown) {
            events = event.type != "touchend" ? event : event.changedTouches[0];
            isdown = false;
            o.mouseup()
          }
          break;
        case "touchmove":
        case "mousemove":
          if (isdown) {
            event.preventDefault();
            events = event.type == "mousemove" ? event : event.touches[0];
            o.mousemove()
          }
          break
      }
    }
  }
})(jQuery);


/*tooltip */
jQuery(function(){$("[data-toggle=tooltip]").tooltip();$("a[data-toggle=popover],button[data-toggle=popover]").popover().click(function(e) {e.preventDefault()});});
$('[data-toggle=popover]').each(function() {
	var e=$(this); 
		if(e.data("bg")){
			e.popover({
				template: '<div class="popover custom-bg '+e.data("bg")+'"><div class="arrow '+e.data("bg")+'"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
			});
		}
		if(e.data("header")){
			e.popover({
				template: '<div class="popover custom-header"><div class="arrow"></div><h3 class="popover-title '+e.data("header")+'"></h3><div class="popover-content"></div></div>'
			});
		}
});
(function($,window,undefined){var $allDropdowns=$();$.fn.dropdownHover=function(options){$allDropdowns=$allDropdowns.add(this.parent());return this.each(function(){var $this=$(this).parent(),defaults={delay:300,instantlyCloseOthers:true},data={delay:$(this).data('delay'),instantlyCloseOthers:$(this).data('close-others')},options=$.extend(true,{},defaults,options,data),timeout;$this.hover(function(){if(options.instantlyCloseOthers===true);$allDropdowns.removeClass('open');window.clearTimeout(timeout);$(this).addClass('open');},function(){timeout=window.setTimeout(function(){$this.removeClass('open');},options.delay);});});};$('[data-event="hover"]').dropdownHover();})(jQuery,this);
$('[data-toggle=tooltip]').each(function() {
	var e=$(this); 
		if(e.data("bg")){
			e.tooltip({
				template:'<div class="tooltip custom-bg" role="tooltip"><div class="tooltip-arrow '+e.data("bg")+'"></div><div class="tooltip-inner '+e.data("bg")+'"></div></div>'
			});
		}
});








$(document).ready(function() {
	if(typeof($(document).magnificPopup)!="function"){ return false};
    $('.LightBox_image').each(function() {
        $(this).magnificPopup({
            type: 'image',
            callbacks: {
                beforeOpen: function() { 
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                    this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
                }
            },
            removalDelay: 500,
            closeOnContentClick: true,
            midClick: true
        });
    });
	
    $("[class^='LightBox_image_gallery']").each(function() {
        $("." + $(this).attr("class").split(" ")[0]).magnificPopup({
            type: 'image',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                tError: 'could not be loaded.',
                titleSrc: function(item) {
                    return item.el.attr('title');
                }
            },
            callbacks: {
                beforeOpen: function() {
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                    this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
                },
                open: function() {
                    $.magnificPopup.instance.next = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.next.call(self);
                        }, 120);
                    };
                    $.magnificPopup.instance.prev = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.prev.call(self);
                        }, 120);
                    }
                },
                imageLoadComplete: function() {
                    var self = this;
                    setTimeout(function() {
                        self.wrap.addClass('mfp-ready');
                    }, 16);
                }
            },
            removalDelay: 500,
            closeOnContentClick: true,
            midClick: true
        })
    });
    $('.LightBox_image_group').each(function(index, element) {
        $(this).magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading ...',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [1, 1]
            },
            image: {
                tError: ' could not be loaded.',
                titleSrc: function(item) {
                    return item.el.attr('title');
                }
            },
            callbacks: {
                beforeOpen: function() {
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                    this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
                },
                open: function() {
                    $.magnificPopup.instance.next = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.next.call(self);
                        }, 120);
                    };
                    $.magnificPopup.instance.prev = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.prev.call(self);
                        }, 120);
                    }
                },
                imageLoadComplete: function() {
                    var self = this;
                    setTimeout(function() {
                        self.wrap.addClass('mfp-ready');
                    }, 16);
                }
            },
            removalDelay: 500,
            closeOnContentClick: true,
            midClick: true
        });
    });
    $('.LightBox_youtube, .LightBox_vimeo, .LightBox_gmaps').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        preloader: false,
        fixedContentPos: false,
        callbacks: {
            beforeOpen: function() {
                this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
            }
        },
        removalDelay: 500,
        closeOnContentClick: true,
        midClick: true
    });
    $("[class^='LightBox_youtube_gallery'],[class^='LightBox_vimeo_gallery'],[class^='LightBox_gmaps_gallery']").each(function() {
        $("." + $(this).attr("class").split(" ")[0]).magnificPopup({
            disableOn: 700,
            type: 'iframe',
            preloader: false,
            fixedContentPos: false,
            gallery: {
                enabled: true,
                preload: [0, 1]
            },
            callbacks: {
                beforeOpen: function() {
                    this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
                },
                open: function() {
                    $.magnificPopup.instance.next = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.next.call(self);
                            setTimeout(function() {
                                self.wrap.addClass('mfp-ready');
                            }, 16);
                        }, 120);
                    };
                    $.magnificPopup.instance.prev = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.prev.call(self);
                            setTimeout(function() {
                                self.wrap.addClass('mfp-ready');
                            }, 16);
                        }, 120);
                    }
                },
            },
            removalDelay: 500,
            closeOnContentClick: true,
            midClick: true
        })
    });
    $('.LightBox_youtube_group, .LightBox_vimeo_group, .LightBox_gmaps_group').each(function(index, element) {
        $(this).magnificPopup({
            delegate: 'a',
            disableOn: 700,
            type: 'iframe',
            preloader: false,
            fixedContentPos: false,
            gallery: {
                enabled: true,
                preload: [0, 1]
            },
            callbacks: {
                beforeOpen: function() {
                    this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
                },
                open: function() {
                    $.magnificPopup.instance.next = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.next.call(self);
                            setTimeout(function() {
                                self.wrap.addClass('mfp-ready');
                            }, 16);
                        }, 120);
                    };
                    $.magnificPopup.instance.prev = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.prev.call(self);
                            setTimeout(function() {
                                self.wrap.addClass('mfp-ready');
                            }, 16);
                        }, 120);
                    }
                }
            },
            removalDelay: 500,
            closeOnContentClick: true,
            midClick: true
        });
    });
    $(".LightBox_Box").each(function() {
        $(this).magnificPopup({
            type: 'inline',
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            mainClass: 'LightBox_zoom_in',
            callbacks: {
                beforeOpen: function() {
                    this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
                }
            },
            removalDelay: 500,
            closeOnContentClick: true,
            midClick: true
        })
    });
    $("[class^='LightBox_Box_group']").each(function() {
        $("." + $(this).attr("class").split(" ")[0]).magnificPopup({
            type: 'inline',
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            midClick: true,
            callbacks: {
                beforeOpen: function() {
                    this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
                },
                open: function() {
                    $.magnificPopup.instance.next = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.next.call(self);
                            setTimeout(function() {
                                self.wrap.addClass('mfp-ready');
                            }, 16);
                        }, 120);
                    };
                    $.magnificPopup.instance.prev = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.prev.call(self);
                            setTimeout(function() {
                                self.wrap.addClass('mfp-ready');
                            }, 16);
                        }, 120);
                    }
                }
            },
            removalDelay: 500,
            closeOnContentClick: true,
            midClick: true,
            gallery: {
                enabled: true,
                preload: [0, 1]
            }
        })
    });
    $(".LightBox_ajax").each(function() {
        $(".LightBox_ajax").magnificPopup({
            type: 'ajax',
            alignTop: true,
            overflowY: 'scroll',
            callbacks: {
                beforeOpen: function() {
                    this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
                }
            },
            removalDelay: 500,
            closeOnContentClick: true,
            midClick: true
        });
    });
    $("[class*='LightBox_ajax_group']").each(function() {
        $("." + $(this).attr("class").split(" ")[0]).magnificPopup({
            type: 'ajax',
            alignTop: true,
            overflowY: 'scroll',
            gallery: {
                enabled: true,
                preload: [0, 1]
            },
            callbacks: {
                beforeOpen: function() {
                    this.st.mainClass = this.st.el.attr('data-effect') ? this.st.el.attr('data-effect') : "mfp-zoom-in";
                },
                open: function() {
                    $.magnificPopup.instance.next = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.next.call(self);
                            setTimeout(function() {
                                self.wrap.addClass('mfp-ready');
                            }, 16);
                        }, 120);
                    };
                    $.magnificPopup.instance.prev = function() {
                        var self = this;
                        self.wrap.removeClass('mfp-ready');
                        setTimeout(function() {
                            $.magnificPopup.proto.prev.call(self);
                            setTimeout(function() {
                                self.wrap.addClass('mfp-ready');
                            }, 16);
                        }, 120);
                    }
                }
            },
            removalDelay: 500,
            closeOnContentClick: true,
            midClick: true
        })
    });
});




//animationShow.js------------------------------	version 3.0.0
function animationShow(option){var l=option;var other=function(){for(var t in l){$(t).removeClass("active");$(l[t]).removeClass("active").fadeOut();}}
for(var t in l){q=$(t);b=l[t];q.click(function(){if($(this).hasClass("active")){$(this).removeClass("active");$(l["#"+$(this).attr("id")]).removeClass("active").fadeOut();}else{other();$(this).addClass("active");$(l["#"+$(this).attr("id")]).addClass("active").fadeIn();}});}}


/*
* Copyright (C) 2009 Joel Sutherland
* Licenced under the MIT license
* http://www.newmediacampaigns.com/page/jquery-flickr-plugin
*
* Available tags for templates:
* title, link, date_taken, description, published, author, author_id, tags, image*
*/
(function($){$.fn.jflickrfeed=function(settings,callback){settings=$.extend(true,{flickrbase:'http://api.flickr.com/services/feeds/',feedapi:'photos_public.gne',limit:20,qstrings:{lang:'en-us',format:'json',jsoncallback:'?'},cleanDescription:true,useTemplate:true,itemTemplate:'',itemCallback:function(){}},settings);var url=settings.flickrbase+settings.feedapi+'?';var first=true;for(var key in settings.qstrings){if(!first)
url+='&';url+=key+'='+settings.qstrings[key];first=false;}
return $(this).each(function(){var $container=$(this);var container=this;$.getJSON(url,function(data){$.each(data.items,function(i,item){if(i<settings.limit){if(settings.cleanDescription){var regex=/<p>(.*?)<\/p>/g;var input=item.description;if(regex.test(input)){item.description=input.match(regex)[2]
if(item.description!=undefined)
item.description=item.description.replace('<p>','').replace('</p>','');}}
item['image_s']=item.media.m.replace('_m','_s');item['image_t']=item.media.m.replace('_m','_t');item['image_m']=item.media.m.replace('_m','_m');item['image']=item.media.m.replace('_m','');item['image_b']=item.media.m.replace('_m','_b');delete item.media;if(settings.useTemplate){var template=settings.itemTemplate;for(var key in item){var rgx=new RegExp('{{'+key+'}}','g');template=template.replace(rgx,item[key]);}
$container.append(template)}
settings.itemCallback.call(container,item);}});if($.isFunction(callback)){callback.call(container,data);}});});}})(jQuery);


//IE Fix for "jumpy" fixed bacground
if(navigator.userAgent.match(/Trident\/7\./)) { // if IE
    $('body').on("mousewheel", function () {
        // remove default behavior
        event.preventDefault(); 

        //scroll without smoothing
        var wheelDelta = event.wheelDelta;
        var currentScrollPosition = window.pageYOffset;
        window.scrollTo(0, currentScrollPosition - wheelDelta);
    });
}