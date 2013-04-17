var center_display = $('menu_display');
var selectedDiv;
var selectionWindow;
var SelectedDish;
var RestrictedIngs;
var PreferredIngs;

$(document).ready(function() {
    // Global Event Listeners
    $('#user_settings_button').click(function(event) {
	console.log("Changing to User Settings");
    });
    $('#selection_summary_button').click(function(event) {
	console.log("Changing to Selection Summary");
    });
    $('#close_selection_button').click(function(event) {
	selectionWindow.style.display = "none";
	selectedDiv.style.border = "1px solid #dddddd";
    });
    $('#order_button').click(function(event) {
	selectionWindow.style.display = "none";
	selectedDiv.style.border = "1px solid #dddddd";
    });
    $('.thumbnail').click(function() {
	if(selectedDiv != null) {
	    selectedDiv.style.border = "1px solid #dddddd";
	}
	selectedDiv = this;
	selectedDiv.style.border = "1px solid green";
	selectionWindow.style.display = "block";
    });

    $('.ingredient_option_like').click(function() {
	$(this).addClass("active");
	var par = $(this).parent();
	var child = par.children(".ingredient_option_dislike");
	$(child[0]).removeClass("active");
    });
    $('.ingredient_option_dislike').click(function() {
	$(this).addClass("active");
	var par = $(this).parent();
	var child = par.children(".ingredient_option_like");
	$(child[0]).removeClass("active");
    });

    $('.ingredient_option_name').click(function() {
	var par = $(this).parent();
	var child = par.children(".ingredient_option_like");
	$(child[0]).removeClass("active");
	var child2 = par.children(".ingredient_option_dislike");
	$(child2[0]).removeClass("active");
    });

    $('.thumbnail').hover(
        function() {
	    if (this == selectedDiv) {
	        return;
	    } else {
	        $(this).css("border","1px solid black");
	    }},
	function() {
	    if(this == selectedDiv) {
		return;
	    } else {
		$(this).css("border","1px solid #dddddd");
	    }
	});

    center_display.filter = function(event) {
	console.log("testing dynamic filter");
    };
    selectionWindow = document.getElementById("dish_selection");
});
