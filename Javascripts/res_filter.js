/**
 * Created with JetBrains PhpStorm.
 * User: Wei
 * Date: 4/14/13
 * Time: 3:15 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function()
{

    $("#searchBtn").click(function(){
        $(".restaurantList").css({"display": "block"});
        $('.restaurantList').shuffle();

    });


    $(".restaurant").click(function(){
        $(".selected").removeClass("selected");
        $(this).addClass("selected");



    });

    (function($){

        $.fn.shuffle = function() {

            var allElems = this.get(),
                getRandom = function(max) {
                    return Math.floor(Math.random() * max);
                },
                shuffled = $.map(allElems, function(){
                    var random = getRandom(allElems.length),
                        randEl = $(allElems[random]).clone(true)[0];
                    allElems.splice(random, 1);
                    return randEl;
                });

            this.each(function(i){
                $(this).replaceWith($(shuffled[i]));
            });

            return $(shuffled);

        };

    })(jQuery);





});
