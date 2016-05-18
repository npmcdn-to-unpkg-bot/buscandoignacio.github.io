(function($){
    
    // Functions
    var loadPage = function(){
        var $this   = $(this),
            $pages  = $('.page'),
            $link   = $this.attr('data-link');
        
        // $pages.fadeOut('slow', function(){
        //    $('#'+$link).show(); 
        // });
        if( !$('#'+$link).hasClass('show') ){
            $pages.addClass('hide');
            $pages.removeClass('show');
            $('#'+$link).removeClass('hide').addClass('show');
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
    
    
    // Document Ready
    $(document).ready(function(){
        $('.menubtn').on('click touchstart', loadPage) ;
        $('#preloaderBtn').on('click touchstart', hiddeLoader);
    });
    
        
    
})(jQuery);