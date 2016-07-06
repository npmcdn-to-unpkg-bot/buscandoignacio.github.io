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
    // Photoswipe
    var initPhotoSwipeFromDOM = function(gallerySelector) {
        // parse slide data (url, title, size ...) from DOM elements 
        // (children of gallerySelector)
        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item;

            for(var i = 0; i < numNodes; i++) {

                figureEl = thumbElements[i]; // <figure> element

                // include only element nodes 
                if(figureEl.nodeType !== 1) {
                    continue;
                }

                linkEl = figureEl.children[0]; // <a> element

                size = linkEl.getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };



                if(figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML; 
                }

                if(linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('src');
                } 

                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }

            return items;
        };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };

        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            // find root element of slide
            var clickedListItem = closest(eTarget, function(el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });

            if(!clickedListItem) {
                return;
            }

            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) { 
                    continue; 
                }

                if(childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }



            if(index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };

        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
            params = {};

            if(hash.length < 5) {
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');  
                if(pair.length < 2) {
                    continue;
                }           
                params[pair[0]] = pair[1];
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);

            // define options (if needed)
            options = {

                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                getThumbBoundsFn: function(index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect(); 

                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                }

            };

            // PhotoSwipe opened from URL
            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used 
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            // exit if index not found
            if( isNaN(options.index) ) {
                return;
            }

            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll( gallerySelector );

        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
            galleryElements[i].onclick = onThumbnailsClick;
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if(hashData.pid && hashData.gid) {
            openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
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
    // Send Form
    function messageForm(to, type, message){
        var respond = $('.' + to);
        respond.addClass(type);
        respond.html( message );
        $('.form-send')[0].reset();
        setTimeout(function(){ respond.html( '' ); respond.attr('class', ''); respond.addClass(to); }, 6000);
    }
    function sendForm(event){
        event.preventDefault();
        var adress = $(this).attr('action');
        var datos = {};
        var success  = $(this).attr('data-success');
        var error = $(this).attr('data-error');
        
        $(this).children().each(function() {
            var $this = $(this);
            if(  $this.is('input') || $this.is('textarea') || $this.attr('type') !== 'submit' ){
                if( $this.val() !== "" ){
                    datos[$this.attr('name')] = $this.val();
                }
            }
        });
        $.ajax({
            url: adress, 
            beforeSend : function(){
                messageForm('form-respond','enviando', 'Enviando ...');
            },
            method: "POST",
            data: datos,
            dataType: "json"
        }).done(function() {
            messageForm('form-respond','success',success);
        }).fail(function() {
            messageForm('form-respond','error',error);
        });
    }

    // Document Ready
    $(document).ready(function(){
        $('.menubtn').bind(event, loadPage) ;
        $('#preloaderBtn').bind(event, hiddeLoader);
        goLayout();
        $('.form-send').submit(sendForm); 
        

        // execute above function
        initPhotoSwipeFromDOM('.galery');   
    });
    
    
})(jQuery);