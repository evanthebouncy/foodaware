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

    var ptrs = []
    for (var i = 0; i < restaurants.length; i++) {
        ptrs.push(i);
    }
    console.log(ptrs);

    //$(".restaurantList").empty();//cletar my div
    $('.restaurantList').empty();
    var new_order = shuffle(ptrs)
    console.log(new_order);
    for (var i=0; i<new_order.length;i++){
    var rest = restaurants[new_order[i]];
    child= $('<div></div>').addClass("restaurant");

    row1= $('<div> </div>').addClass("row");
    resName = $('<span></span>').addClass("ResName").text(rest.name);
    row1.append(resName)
    row2 =  $('<div></div>').addClass("row");
    span3 = $('<div></div>').addClass("span3");
    image = $("<img>").addClass("res_pic").attr({src: "menu_ingr_data/rest_picture/"+rest.logo})
    span3.append(image)
    row2.append(span3);

    span_3 = $('<div></div>').addClass("span8");
        info = $("<p></p>").addClass("res_Address").text("Address: "+ rest.addr)
        phone = $("<p></p>").addClass("res_Address").text("Phone: "+rest.phone)
        info.append(phone);
        button = $('<button/>', {
        text: "View Menu", //set text 1 to 10
        id: ''+i,
        href: "menu.html",
        click: function () { 
          push_restaurant_index(new_order[parseInt(this.id)],
            function() {
              window.location ="menu.html"; 
            }  
          );
        }
        });
    button.addClass("btn btn-large btn-success");
    span_3.append(info);
    span_3.append(button);
    row2.append(span_3);
    child.append(row1);
    child.append(row2);
    $(".restaurantList").append(child)
    $(".restaurantList").append($('<hr />'))
    }
    $(".restaurantList").css({display:"block"});
   //console.log("")
    });

/*
var data = [
	{
		name: "Fancy Chinese Resturant",
		logo: "chr1.png",
		addr: "Cambridge MA 02139",
		phone: "xxx-xxx-xxxx"

		dishes: [{
			image:"...png",
			name: "Pad Thai",
			ingredients: ["cucumber", "noodles", "nuts"]
		}, {
			name: "Hunan Triple Delight",
			ingredients: ["chicken", "beef", "brocolli"]
		}]
	}
];
*/


function shuffle(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


/*var array = [1,2 ,3,4,5,6,7,8]
newArray = shuffle(array)
console.log(newArray);*/
});






