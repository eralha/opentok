function parseComponent(elem, scope){
    scope = scope || {};
    var htmlElement = elem;

    if($(htmlElement).attr("data-init") == "false") { return; }

    require([$(htmlElement).attr("data-component")], function(component){
        if(typeof component == 'function'){
            var comp = new component(htmlElement, scope);
        }
    });
}

function deferImagesLoad(container, callBack){
    $(container).each(function(){
        var sup = this;
        var images = $(this).find("img");
        var imagesNr = $(images).length;
        var loaded = 0;

        $(images).one("load", function() {
          loaded ++;
          if(loaded >= imagesNr){
            //console.log('all images loaded');
            callBack(sup);
          }
        }).each(function() {
          if(this.complete) $(this).load();
        });
    });
}

(function($){
    $(document).ready(function(){

        console.log('js running');

        function appendMsg(type, msg){

            $('.c-chat-box').append('<div class="c-msg c-msg--'+type+'">'+msg+'</div>');

            var $target = $('.c-chat-box'); 
            $target.animate({scrollTop: $target.prop("scrollHeight")}, 100);
        }

        function sendMsg(){
            var value = $('#chatMessage').val();

            //cclear field
            $('#chatMessage').val('')

            socket.emit('emit', { data: value });

            appendMsg('send', value);
        }

        var socket = io.connect('/rtc');
            socket.on('msg', function (data) {
                console.log('received', data);

                appendMsg('received', data.data);
            });

        $('#sendMessage').click(function(){
            sendMsg();
        });

        $(document).keypress(function(e) {
            if(e.which == 13) {
                sendMsg();
            }
        });

    });
})(jQuery);