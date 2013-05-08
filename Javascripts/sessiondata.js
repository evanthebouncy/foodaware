var RestSelect = Parse.Object.extend("RestSelect");
var DishesSelect = Parse.Object.extend("DishesSelect");

//push a restuarant seelction for the user in the current session to the
//Parse cloud
//we make sure we destroy all the old pushes here as well, since only 1 of this
//information should exist at a time.
function push_restaurant_index(index, callback){
  var rest_query = new Parse.Query(RestSelect);
  var user = Parse.User.current();

  //we first try to find old ones
  rest_query.equalTo("user",user).first({
    success: function(rest_select){
      //if we can't find it we make a new one
      var to_push = rest_select || new RestSelect({user: user})
      to_push.set("restaurant", index);

      to_push.save(null, {
        success: function() {
          console.log("Successfully saved!");
          callback();
        },
        error: function(obj, error) {
          console.error("Save failure: ", error);
        }
      });
    },
    error: function(rest_select, error){
      var to_push = rest_select || new RestSelect({user: user})
      to_push.set("restaurant", index);
      to_push.save(null, {
        success: function() {
          console.log("Successfully saved!");
          callback();
        },
        error: function(obj, error) {
          console.error("Save failure: ", error);
        }
      });
    }
  });
}

//pull the restuarant selection for the current user
function pull_restaurant_index(call_back){
  var user = Parse.User.current();
  var rest_query = new Parse.Query(RestSelect);
  
  rest_query.equalTo("user", user).first({
    success: function(rest_select){
      //console.log("found old entry for rest_query of this user");
      //console.log(rest_select);
      if(rest_select == null)
      {
      call_back(-1);
      }
      var select = rest_select.get("restaurant");
      call_back(select);
    },
    error: function(rest_select, error){
    }
  });
}

//push a dishes seelction for the user in the current session to the
//Parse cloud, if one already exist we update that one and push it
function push_dish_select(a_list, callback){
  var dish_query = new Parse.Query(DishesSelect);
  var user = Parse.User.current();

  //we first try to find old ones
  dish_query.equalTo("user",user).first({
    success: function(dish_select){
      //if we can't find it we make a new one
      var to_push = dish_select || new DishesSelect({user: user})
      to_push.set("dishes", a_list);

      to_push.save(null, {
        success: function() {
          console.log("Successfully saved!");
          callback();
        },
        error: function(obj, error) {
          console.error("Save failure: ", error);
        }
      });
    },
    error: function(dish_select, error){
      var to_push = dish_select || new DishesSelect({user: user})
      to_push.set("dishes", a_list);
      to_push.save(null, {
        success: function() {
          console.log("Successfully saved!");
          callback();
        },
        error: function(obj, error) {
          console.error("Save failure: ", error);
        }
      });
    }
  });

}

//pull the dishes selection for the current user
function pull_dishes_list(call_back){
  var user = Parse.User.current();
  var dish_query = new Parse.Query(DishesSelect);
  
  dish_query.equalTo("user", user).first({
    success: function(dish_select){
      //console.log("found old entry for dish_query of this user");
      //console.log(dish_select);
      if(dish_select == null){
        call_back([]);
      }
      else{
        var select = dish_select.get("dishes");
        call_back(select);
      }
    },
    error: function(dish_select, error){
    }
  });
}

//a function that deals with multiple pulls and callback annoyance
//qs = a list of queries, i.e. [pull_rest, pull_dish, pull_ingr]
//render = the render page function, which takes in multiple arguments
//one argument for each thing that it wants to pull
function multi_pull(qs,render){
  _multi_pull(qs, render, []);
}

function _multi_pull(qs, render, args){
  if (qs.length == 0){
    render(args);
  }
  else{
    q_head = qs[0];
    q_tail = qs.slice(1);
    function cb(x){
      new_args = args.concat([x]);
      _multi_pull(q_tail, render, new_args);
    }
    q_head(cb);
  }
}

