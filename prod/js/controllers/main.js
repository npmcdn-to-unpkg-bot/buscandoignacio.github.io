(function($){
    
    // Functions
    var loadPage = function(){
        var $this = $(this);
        
    },
    hiddeLoader = function(){
        var $loader = $('.preLoader');
        $loader.fadeOut('slow', function(){
            $('body').toggleClass('preloader-ison');
            $('.preLoader-on').each(function(index){
                $(this).delay(800*index).fadeTo('slow', 1);    
            });  
        });  
    };
    
    
    // Document Ready
    $(document).ready(function(){
        $('.menubtn').on('click', loadPage) ;
        $('#preloaderBtn').on('click', hiddeLoader);
    });
    
        
    
})(jQuery);