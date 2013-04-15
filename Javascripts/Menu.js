var center_display = $('menu_display');
var selectedDiv;
var selectionWindow;
var SelectedDish;
var RestrictedIngs;
var PreferredIngs;

$(document).ready(function()
{
	// Global Event Listeners
	$('#user_settings_button').click(function(event)
	{
		console.log("Changing to User Settings");
	});
	$('#selection_summary_button').click(function(event)
	{
		console.log("Changing to Selection Summary");
	});
	$('#close_selection_button').click(function(event)
	{
		selectionWindow.style.display = "none";
		selectedDiv.style.border = "1px solid black";
	});
	$('#order_button').click(function(event)
	{
		selectionWindow.style.display = "none";
		selectedDiv.style.border = "1px solid black";
	});
	$('.dish_item').hover(function(){
		this.style.width = "105px";
		this.style.height = "105px";
		this.style.margin = "5px";
	},
	function(){
		this.style.height = "100px";
		this.style.width = "100px";
		this.style.margin = "10px";
	});
	
	$('.dish_item').click(function()
	{
		if(selectedDiv != null)
		{
			selectedDiv.style.border = "1px solid black";
		}
		selectedDiv = this;
		this.style.border = "2px solid green";
		selectionWindow.style.display = "block";
	});
	center_display.filter = function(event)
	{
		console.log("testing dynamic filter");
	};
	selectionWindow = document.getElementById("dish_selection");
});