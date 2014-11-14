$(document).ready(function(){
	processChange();
});

var hiddenFields = ["genreField", "colorField", "titleField", "bookTitleField"];

function processChange(){
	var t = document.getElementById("formType").value;
	//alert(t);
	if (t=="books"){
		hideAll();
		document.getElementById("genreField").style.display="block";
		document.getElementById("bookTitleField").style.display="block";
	}
	else if (t=="electronics")
	{
		hideAll();
		document.getElementById("colorField").style.display="block";
		document.getElementById("titleField").style.display="block";
	}
	else{
		hideAll();
		document.getElementById("titleField").style.display="block";
	}
	
}

function hideAll(){
	//console.log("hiding all hidden fields");
	for (i = 0; i<hiddenFields.length; i++){
		document.getElementById(hiddenFields[i]).style.display="none";
	}
}

function alertColor(){
	var c = document.getElementById("color").value;
	var myElement = document.querySelector("#form-container");
	//myElement.style.backgroundColor=c;
}

$(function() {

    var availableTags = [
      "Programming Interviews Exposed",
      "Game of Thrones",
      "The Wind-Up Bird Chronicle",
      "Harry Potter and the Sorceror's Stone",
      "Introduction to Algorithms",
      "Harry Potter and the Chamber of Secrets",
      "Harry Potter and the Prisoner of Azkaban",
      "Harry Potter and the Goblet of Fire",
      "Harry Potter and the Order of the Phoenix",
      "Harry Potter and the Half Blood Prince",
      "Harry Potter and the Deathly Hallows"
    ];
    $( "#bookFormTitle" ).autocomplete({
      source: availableTags
    });
  });