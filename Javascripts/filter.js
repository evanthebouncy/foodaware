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
    //shuffle(json)
    console.log("here")
    });
    }

   /* var json = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': restaurants.json,
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();*/

// this will return a filter which will return true for menu_items whose ingredients should be excluded
/*function getFilterThatExcludesIngredients(ingredients) {
	return function(item) {
		for(var i=0; i<item.ingredients.length;i++) {
			var ingredient = item.ingredients[i];
			if (_.contains(ingredients, ingredient)) return false;
		}
		return true;
	};
}*/


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

/*function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
}

var array = [1,2 ,3,4,5,6,7,8]
newArray = shuffle(array)
console.log(newArray.toString()));

function applyFilter(filter, json) {
	var okRests = [];
	for(var i=0;i<json.length;i++) {
		var rest = json[i];
		var okMenuItems = []
		for(var j=0;j<rest.menu.length;j++) {
			var menuItem = rest.menu[j];
			if (filter(menuItem)) {
				okMenuItems.push(menuItem);
			}
		}
		if (okMenuItems.length > 0) {
			var restCopy = JSON.parse(JSON.stringify(rest));
			restCopy.menu = okMenuItems;
			okRests.push(restCopy);
		}
	}
	return okRests;
}

var filter = getFilterThatExcludesIngredients(["chicken", "beef"]);
var okItems = applyFilter(filter, data);

console.log(JSON.stringify(okItems));







});






