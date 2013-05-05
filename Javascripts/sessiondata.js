var RestSelect = Parse.Object.extend("RestSelect");

//create a rest_select object
//bind it to a selection index
//save to the cloud
function create_rest_select(index){
  var user = Parse.User.current();
  var rest_select = new RestSelect();
  rest_select.set("user", user);
  rest_select.set("restaurant", index);
  rest_select.save(null,
    {
      success:function(rest_select){
        //console.log("saved to cloud OMG!");
      },
      error:function(rest_select,error){
        //console.log("failed? impossible");
      }
    }
  );
}

//push a restuarant seelction for the user in the current session to the
//Parse cloud
//we make sure we destroy all the old pushes here as well, since only 1 of this
//information should exist at a time.
function push_restaurant_index(index){
  var rest_query = new Parse.Query(RestSelect);
  var user = Parse.User.current();
  rest_query.equalTo("user", user);

  //we first try to find old ones
  rest_query.find({
    success: function(rest_selects){
      //console.log("size of all the old entrieS");
      //console.log(rest_selects.length);
      //remove the old ones
      for (var i = 0; i < rest_selects.length; i++) {
        rest_selects[i].destroy({
          success: function(myObject) {
          },
          error: function(myObject, error) {
          }
        })
      }
      //add new one
      create_rest_select(index);
    },
    error: function(rest_select, error){
      //add new one
      create_rest_select(index);
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
      var select = rest_select.get("restaurant");
      call_back(select);
    },
    error: function(rest_select, error){
    }
  });
}

