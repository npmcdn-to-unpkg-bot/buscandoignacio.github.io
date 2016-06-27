(function($){
    // Global Variables
    var ua      = navigator.userAgent,
        event   = (ua.match(/iPad/i)) ? "touchstart" : "click"; 
    
    // Functions
    var loadPage = function(){
        var $this   = $(this),
            $pages  = $('.page'),
            $link   = $this.attr('data-link');
           
        
        if( !$('#'+$link).hasClass('show') ){
            $pages.addClass('hide');
            $pages.removeClass('show');
            $('#'+$link).removeClass('hide').addClass('show');
            goLayout();
        }
        
    },
    hiddeLoader = function(){
        if( jQuery.isReady ){
            var $loader = $('.preLoader');
            $loader.fadeOut('slow', function(){
                $('body').removeClass('preloader-ison');
                $('.preLoader-on').each(function(index){
                    $(this).delay(800*index).fadeTo('slow', 1); 
                });  
            });  
        } else{
            console.log('Is loading');
        }
    };
    
    // Masonry
    function goLayout(){
        var $galery = $('.galery').masonry({
          itemSelector: '.galery-item',
          fitWidth: true,
          gutter: 0,
          percentPosition: true
        });

        $galery.imagesLoaded().progress( function() {
          $galery.masonry('layout');
        });
    }

    // Document Ready
    $(document).ready(function(){
        $('.menubtn').bind(event, loadPage) ;
        $('#preloaderBtn').bind(event, hiddeLoader);
        goLayout();
    });
    
    
})(jQuery);