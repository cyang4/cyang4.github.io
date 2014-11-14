$(document).ready(function(){
	processChange();
});

var hiddenFields = ["genreField", "colorField"];

function processChange(){
	var t = document.getElementById("formType").value;
	//alert(t);
	if (t=="books"){
		hideAll();
		document.getElementById("genreField").style.display="block";
	}
	else if (t=="electronics")
	{
		hideAll();
		document.getElementById("colorField").style.display="block";
	}
	else{
		hideAll();
	}
	
}

function hideAll(){
	console.log("hiding all hidden fields");
	for (i = 0; i<hiddenFields.length; i++){
		document.getElementById(hiddenFields[i]).style.display="none";
	}
}

function alertColor(){
	var c = document.getElementById("color").value;
	var myElement = document.querySelector("#form-container");
	//myElement.style.backgroundColor=c;
}