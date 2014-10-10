"use strict";

var etag=null;

function podURL() {
	// temporary hack until we have a nice way for users to select their pod
	//return "http://"+document.getElementById("username").value+".fakepods.com";
	return document.getElementById("podurl").value
}


function reload(type) {
	//alert(type);
	if(typeof(type)==='undefined') 
		{	
			type = "all";
		}
	var request = new XMLHttpRequest();

	// just fetch everything, for now, since queries don't work yet
	request.open("GET", podURL()+"/_nearby", true);
	if (etag !== null) {
		request.setRequestHeader("Wait-For-None-Match", etag);
		console.log('doing a long poll', etag);
	} else {
		console.log('initial fetch, not a long poll');
	}

	request.onreadystatechange = function() {
		if (request.readyState==4 && request.status==200) {
			console.log("handling response type "+type);
    		handleResponse(request.responseText, type);
    	}
 	}

	request.send();
}


function handleResponse(responseText, type) {
	console.log('got response');
	var responseJSON = JSON.parse(responseText);
	etag = responseJSON._etag;
	var all = responseJSON._members;
	var messages = [];
	console.log('got response');
	for (var i=0; i<all.length; i++) {
		var item = all[i];
		// consider the 'text' property to be the essential one
		var now = Date.now();
		if ('products' in item) {
			item.timeDate = new Date(Number(item.products.time))
			//alert ('found product! ' + item.products.description);
			if (now - item.timeDate < 86400000) {
				//alert(item.products.type);
				if (type == "all"){
					//alert("looking for all");
					messages.push(item);}
				else if (item.products.type == type){
					//alert("got a match");
					messages.push(item);
					}
			}
		}
	}
	messages.sort(function(a,b){return Number(a.time)-Number(b.time)});
	
	var out = document.getElementById("products")
	while(out.firstChild) { out.removeChild(out.firstChild) }
	var padding = String("                             ");
	for (i=0; i<messages.length; i++) {
		var message = messages[i];

		if (Number(message.products.time) > 0) {
			
			var div = document.createElement("div");
			message.timeDate = new Date(Number(message.products.time))
			var date = message.timeDate.toLocaleString();
			
			var line = "<h2>"+message.products.description+"</h2>";
			line += "<p><b>Price: </b>"+message.products.price+"</b>";
			line += "<p><b>Condition: </b>"+message.products.condition+"</b>";
			line += "<p><b>Brand: </b>"+message.products.brand+"</b>";
			line += "<p><b>Type: </b>"+message.products.type+"</b>";

			var link = document.createElement("a");

			div.innerHTML = line;
			link.href=message._id;
			link.appendChild(document.createTextNode("item"));
			div.appendChild(link);
			
			out.appendChild(div);
			
		}
	}
	window.scrollTo(0,document.body.scrollHeight);
	document.getElementById("items").style.visibility = "visible"
	// wait for 100ms then reload when there's new data.  If data
	// comes faster than that, we don't really want it.
	setTimeout(reload, 50);
}


function newmsg() {
    var brand = document.getElementById("brand").value;
    var e = document.getElementById("type");
	var type = e.options[e.selectedIndex].text;
    var description = document.getElementById("description").value;
    var condition = document.getElementById("condition").value;
    var price = document.getElementById("price").value;
	document.getElementById("brand").value = "";
	document.getElementById("type").value = "";
	document.getElementById("description").value = "";
	document.getElementById("condition").value = "";
	document.getElementById("price").value = "";
    if (description&&condition&&price) {
     	var request = new XMLHttpRequest();
	    request.open("POST", podURL());
    	request.onreadystatechange = function() {
            if (request.readyState==4 && request.status==201) {
				// why does this always print null, even though it's not?
				// console.log("Location:", request.getResponseHeader("Location"));
     		}
		}
		request.setRequestHeader("Content-type", "application/json");
		var content = JSON.stringify({products: {brand: brand, type: type, description: description, condition: condition, price: price, time:Date.now()}});
		request.send(content);
	} 
}