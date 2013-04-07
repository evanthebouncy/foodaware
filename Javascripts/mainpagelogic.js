var center_display = $('menu_display');
//var RestaurantList = new Menu(); 

$(document).ready(function()
{
	// Global Event Listeners
	$('#user_settings_button').click(function(event)
	{
		alert("Changing to User Settings");
	});
	$('.dish_item').hover(function(event){
		console.log("Enter Hover");
		var width = $(this).attr("width");
		var height = $(this).attr("height");
		width *= 1.05;
		height *= 1.05;
		$(this).attr("width",width);
		$(this).attr("width",height);
	},
	function(event){
		console.log("Left Hover");
	});
	
	center_display.filter = function(event)
	{
		alert("testing dynamic filter");
	};
	center_display.filter();
});