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


  /*  $(".restaurant").click(function(){
        $(".selected").removeClass("selected");
        $(this).addClass("selected");



    });*/






});
