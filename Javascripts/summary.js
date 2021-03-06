function update_restaurant_info(restaurant){
  $("#rest_name").text(restaurant.name);
  $("#rest_addr").text(restaurant.addr);
  $("#rest_logo").attr("src", "menu_ingr_data/rest_picture/"+restaurant.logo);
  $("#rest_name").text("Restaurant: "+ restaurant.name).css("color","blue");
  $("#rest_addr").text("Address: "+restaurant.addr).css("color","blue");
  $("#rest_phone").text("Phone: "+restaurant.phone).css("color","blue");
  //$("#rest_logo").attr("src", "menu_ingr_data/rest_picture/"+restaurant.logo);
}

function add_dish(dish_src, count){
  var li_ele = $('<li/>', {
    class: "sel",
  });

  li_ele.appendTo($("#selection"));

  var name_add = $('<div/>', {
              text: dish_src["name"] + (count == 1 ? "" : " x " + count),
              class: "dish_name"
  });

  var img_cont = $('<div/>', {
    class: "img_container",
  });
  var img_add = $('<img class="dish_img">').attr('width','300');
  img_add.attr('src', 'menu_ingr_data/menu_picture/' + dish_src["image"]).appendTo(img_cont);

  var ingr_add = $('<div/>', {
              text: 'Contains: '+
                    String(dish_src["ingredients"]).replace(
                    /_/g," ").replace(/,/g,", "),
              class: "dish_content"
  });

  li_ele.append(name_add);
  li_ele.append(img_cont);
  li_ele.append(ingr_add);
}

function find_dish(rest_dish, dish_name){
  for (var i = 0; i < rest_dish.length; i++){
    var _dish_name = rest_dish[i].name;
    if (_dish_name == dish_name){
      return i;
    }
  }
  return 0;
}

function callback1(dishes){
  console.log(dishes);

  var render_page = function (rest){
      if(rest == -1)
      {
	  window.location = "filter.html";
      }
      if((dishes == -1 || dishes.length == 0) && rest != -1)
      {
	  window.location = "menu.html";
      }
      var restaurant = restaurants[rest];
      update_restaurant_info(restaurant);

      // Get a count of the number of times each dish was ordered.
      var count = _.countBy(dishes);
      var uniqueDishes = _.uniq(dishes);

      for (var i = 0; i < uniqueDishes.length; i++){
          var dish_name = uniqueDishes[i];
          var dish_idx = find_dish(restaurant.dishes, dish_name);
          add_dish(restaurant["dishes"][dish_idx], count[dish_name]);
      }

  }

  pull_restaurant_index(render_page)
}

$(document).ready(function(){
  callback1(Parse.User.current().get("cart"));

  $("#print_btn").click(
    function(){window.print();}
  );

});
