(function($){
    
    // Functions
    var loadPage = function(){
        var $this = $(this);
        
    },
    hiddeLoader = function(){
        var $loader = $('.preLoader');
        $loader.fadeOut('slow', function(){
            $('.preLoader-on').each(function(index){
                $(this).delay(800*index).fadeIn('slow');    
            });  
        });  
    };
    
    
    // Document Ready
    $(document).ready(function(){
        $('.menubtn').on('click', loadPage) ;
        $('#preloaderBtn').on('click', hiddeLoader);
    });
    
        
    
})(jQuery);