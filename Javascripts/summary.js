function update_restaurant_info(restaurant){
  $("#rest_name").text(restaurant.name); 
  $("#rest_addr").text(restaurant.addr); 
  $("#rest_phone").text("phone: "+restaurant.phone); 
  $("#rest_logo").attr("src", "menu_ingr_data/rest_picture/"+restaurant.logo);
}

function add_dish(dish_src){
  var li_ele = $('<li/>', {
    class: "sel",
  });

  li_ele.appendTo($("#selection"));

  var name_add = $('<div/>', {
              text: dish_src["name"],
              class: "dish_name"
  });

  var img_cont = $('<div/>', {
    class: "img_container",
  });
  var img_add = $('<img class="dish_img">').attr('width','300');
  img_add.attr('src', 'menu_ingr_data/menu_picture/' + dish_src["image"]).appendTo(img_cont);

  var ingr_add = $('<div/>', {
              text: 'contains: '+
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
    var restaurant = restaurants[rest];
    update_restaurant_info(restaurant);

    for (var i = 0; i < dishes.length; i++){
      var dish_name = dishes[i];
      var dish_idx = find_dish(restaurant.dishes, dish_name);
      add_dish(restaurant["dishes"][dish_idx]);
    }

  }

  pull_restaurant_index(render_page)
}

$(document).ready(function(){
  pull_dishes_list(callback1);

  $("#print_btn").click(
    function(){window.print();}
  );

});


