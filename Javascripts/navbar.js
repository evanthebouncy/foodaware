Parse.initialize("NJaqeDB583JMB1TdWF2Tkpwkn9UbFsOOMhxhhPds", "69wSIovgcpBxqhsdhjlgohBJ2cTWGD3O1Y8JHQET");

// I'm pretty sure this is a mortal sin, but in prod we'll be using a
// templating system so it's OK.
var navBar = "<div class='navbar'> <div class='navbar-inner'> <a class='brand' href='home.html'>FoodAware</a> <ul class='nav'>  <li><a href='restriction_prefs.html'><i class='icon-info-sign'></i> Diet Profile</a></li>  <li><a href='filter.html'><i class='icon-glass'></i> Restaurant</a></li>  <li><a href='menu.html'><i class='icon-food'></i> Menu</a></li>  <li><a href='summary.html'><i class='icon-reorder'></i> Summary</a></li><li class='pull-right'><a href='login.html'><i class='icon-user'></i> <span id='navbar-username'>Log in</span></a></li> </ul> </div> </div>"

$(document).ready(function() {
    $navBar = $(navBar);
    $(".container").prepend($navBar);
    $(".navbar").css({position: "fixed",
                      "font-size": "24px",
                      "width": "1170px",
                      "z-index": 100});
    $(".navbar").next().css("margin-top", ($(".navbar").height() + 20) + "px");

    var user = Parse.User.current();
    if (user) {
        $("#navbar-username").text(user.get("username"));
    }
});
