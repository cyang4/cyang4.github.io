"use strict";

var etag=null;

	
//other code

function podURL() {
	// temporary hack until we have a nice way for users to select their pod
	//return "http://"+document.getElementById("username").value+".fakepods.com";
	return document.getElementById("podurl").value
}


function reload(type) {

	var t = type;
	var request = new XMLHttpRequest();

	// just fetch everything, for now, since queries don't work yet
	request.open("GET", podURL()+"/_nearby", true);
	if (etag !== null) {
		request.setRequestHeader("Wait-For-None-Match", etag);
		//console.log("In the if and state is "+request.readyState);
	}

	request.onreadystatechange = function() {
		console.log("State is "+request.readyState);
		if (request.readyState==4 && request.status==200) {
    		handleResponse(request.responseText, t);
    	}
 	}

	request.send();
}

function handleResponse(responseText, type) {
	
	var responseJSON = JSON.parse(responseText);
	etag = responseJSON._etag;
	var all = responseJSON._members;
	var messages = [];
	for (var i=0; i<all.length; i++) {
		var item = all[i];
		if ('profiles' in item ) {
			if (item.profiles.name != "") //only want forms that are filled out
				messages.push(item);
		}
	}
	if (type == "date"){
		messages.sort(function(a,b){return a.time-b.time});
		
	}
	else { //default is sort by name
		messages.sort(compareName); //I arbitrarily chose to sort by name, this can change
	}
	//Sorting functions... more to come probably later
	function compareName(a, b) {
	    if (a.profiles.name === b.profiles.name) {
	        return 0;
	    }
	    else {
	        return (a.profiles.name < b.profiles.name) ? -1 : 1;
	    }
	}

	var out = document.getElementById("profiles")
	while(out.firstChild) { out.removeChild(out.firstChild) }
	for (i=0; i<messages.length; i++) {
		var message = messages[i];
		message.timeDate = new Date(Number(message.time));
		var div = document.createElement("div");
		div.innerHTML = "<p><b>Submitter: </b>"+message._owner+"<p><b>Name: </b>"+message.profiles.name
							+"<p><b>Birthday: </b>"+message.profiles.birthday+"<p><b>Height: </b>"+message.profiles.height
							+"<p><b>Date Submitted: </b>" + message.timeDate.toLocaleString();
		out.appendChild(div);
	}
	document.getElementById("chat").style.visibility = "visible"
	// wait for 100ms then reload when there's new data.  If data
	// comes faster than that, we don't really want it.
	setTimeout(reload, 500);
}


function newmsg() {
	var name = document.getElementById("name").value;
	var birthday = document.getElementById("birthday").value;
    var height = document.getElementById("height").value;
    
    var message = "<p>"+"<b>Name: </b>"+name+"<p>"+"<b>Birthday: </b>"+birthday+"<p>"+"<b>Height: </b>"+height;
	document.getElementById("name").value = "";
	document.getElementById("birthday").value=""; //maybe in the future make sure this is in a valid format
	document.getElementById("height").value="";
    if (message) {
     	var request = new XMLHttpRequest();
	    request.open("POST", podURL());
    	request.onreadystatechange = function() {
            if (request.readyState==4 && request.status==201) {
				// why does this always print null, even though it's not?
				// console.log("Location:", request.getResponseHeader("Location"));
     		}
		}
		request.setRequestHeader("Content-type", "application/json");
		var content = JSON.stringify({profiles: {name: name, birthday: birthday, height:height},
			time:Date.now()});
		request.send(content);
	} 
}
