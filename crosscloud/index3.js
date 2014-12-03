var pod = crosscloud.connect();
pod.onLogin(function (userID){

	$("#products").html("waiting for data...");

    pod.onLogout(function () {
        $("#products").html("<i>not connected</i>");
    });
    var displayMessages = function (messages) {
        
        messages.sort(function(a,b){return a.when<b.when?1:(a.when===b.when?0:-1)});
        //var count = 0;
        var out = document.getElementById("products");
        out.innerHTML="";
        var i;
        //alert(messages[1].description);
        for (i=0; i<messages.length; i++) {
            var message = messages[i];
            
            //alert(message._id);
            
            var itemType;
            if (message.isBooks){
                itemType = "Books";   
            }
            else if (message.isElectronics){
                itemType = "Electronics"; 
            }
            else if (message.isFurniture){
                itemType = "Furniture";  
            }
            else if (message.isClothing){
                itemType = "Clothing";  
            }
            else{
                itemType = "Other"; 
        }

        if (Number(message.time) > 0) {
            
            var div = document.createElement("div");
            div.className = "productInfo";
            message.timeDate = new Date(Number(message.time))
            var date = message.timeDate.toLocaleString();
            
            var line = "<div class='displayInfo' id='displayBrand'>"+message.brand+"</div>";
            line += "<div>Price: "+message.price+"</div>";
            line += "<div>Condition: "+conditions[message.condition]+"</div>";
            line += "<div>Description: "+message.description+"</div>";
            line += "<div>Type: "+itemType+"</div>";
            line += "<div>Location: "+message.location+"</div>";
            if (message.isBooks){line += "<div>Genre: " + message.genre+"</div>";}

            var link = document.createElement("a");

            div.innerHTML = line;
            link.href=message._id;
            link.appendChild(document.createTextNode("item"));
            div.appendChild(link);
            
            out.appendChild(div);
            
        }
    }
        /*if (count > show) {
            $("#out").append("<p><i>("+(count-show)+" more not shown)</i></p>");
        }*/
    };

    pod.query()
        .filter( { CrossCloudReuseList:true } )
        .onAllResults(displayMessages)
        .start();

	

	$(document).ready(function(){
    	//toggle form visibility
	    $('#forNewItem').click(function(){
	        if(document.getElementById("form-container").style.display=="none")
	            document.getElementById("form-container").style.display="block";
	        else 
	            document.getElementById("form-container").style.display="none";
	        
	    });


    processChange();
	});


	function makeJSON(brand, type, condition, description, price, location, genre, color){
    var file = {};
    file["CrossCloudReuseList"] = true;
    file["brand"] = brand;
    file["condition"] = condition;
    file["description"] = description;
    file["price"] = price;
    //file["color"] = color;
    file["location"] = location;
    file["genre"] = genre;
    file["color"] = color;
    
    var isElectronics = (type == "electronics");
    var isClothing = (type == "clothing");
    var isBooks = (type == "books");
    var isFurniture = (type == "furniture");
    var isOther = (type == "other");
    
    file["isElectronics"] = isElectronics;
    file["isClothing"] = (type == "clothing");
    file["isBooks"] = (type == "books");
    file["isFurniture"] = (type == "furniture");
    file["isOther"] = (type == "other");
    file["isForSale"] =  true; //temporarily set this as true, since we don't have a 'looking for' feature
    file["time"] = Date.now();
    
    return file;
	}



	$(function(){
    $("#error").html("");  // clear the "Missing Javascript" error message

    var pod = crosscloud.connect();
    var myMessages = [];

    var sendProduct = function () {
        var genre = "";
        var color = "";
        var type = document.getElementById("formType").value;
        
        if (type == "books"){var brand = document.getElementById("bookFormTitle").value;}
        else{ var brand = document.getElementById("formTitle").value;}

        if (type=="books"){var genre = document.getElementById("genre").value;}
        else {var genre = "";}
        if (type =="electronics"){var color = document.getElementById("color").value;}
        else{var color = "";}

        var condition = document.getElementById("condition").value;
        var description = document.getElementById("description").value;
        var price = document.getElementById("price").value;
        var location = document.getElementById("location").value;
      

        var thisJSON = makeJSON(brand, type, condition, description, price, location, genre, color);
        console.log(thisJSON);
        var content = JSON.stringify(thisJSON);
        
        
        myMessages.push(thisJSON);
        pod.push(thisJSON);

        document.getElementById("formTitle").value = "";
        document.getElementById("bookFormTitle").value = "";
        document.getElementById("formType").value = "";
        document.getElementById("genre").value = "";
        document.getElementById("color").value = "";
        document.getElementById("description").value = "";
        document.getElementById("condition").value = "";
        document.getElementById("price").value = "";
        document.getElementById("location").value = "";

    };

    $("#submitbutton").click(sendProduct);

    // allow the enter key to be a submit as well
    /*$("#nick").keypress(function (e) {
        if (e.which == 13) {
            $("#helloButton").click();
            return false;
        }
    });*/

    //var show = 12;

    var conditions = {"1": "Like New",
                        "2": "Excellent",
                        "3": "Great",
                        "4": "Good",
                        "5": "Okay",
                        "6": "Passable",
                        "7": "Poor",
                        "8": "Falling Apart",
                        "9": "Junk",
                        "10": "Other"};


    


    function qElec(){
    clearList();
    console.log("refreshing Electronics");
    pod.query()
            .filter( { isElectronics:true } )
            .onAllResults(displayMessages)
            .start();
        }
     function qBook(){
    clearList();
    console.log("refreshing");
    pod.query()
            .filter( { isBooks:true } )
            .onAllResults(displayMessages)
            .start();
        }

     function qClothing(){
    clearList();
    console.log("refreshing");
    pod.query()
            .filter( { isClothing:true } )
            .onAllResults(displayMessages)
            .start();
        }

    function qFurniture(){
    clearList();
    console.log("refreshing");
    pod.query()
            .filter( { isFurniture:true } )
            .onAllResults(displayMessages)
            .start();
        }

     function qOther(){
    clearList();
    console.log("refreshing");
    pod.query()
            .filter( { isOther:true } )
            .onAllResults(displayMessages)
            .start();
        }
    $('#electronicsLink').click(qElec);
    $('#booksLink').click(qBook);
    $('#clothingLink').click(qClothing);
    $('#furnitureLink').click(qFurniture);
    $('#otherLink').click(qOther);

    function clearList(){
        var out = document.getElementById("products");
            out.innerHTML="";
    }

});


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


$(function() {
  $("#bookFormTitle").suggest({"filter":"(all type:/book/book/)",
                                "key": "AIzaSyA-dZJY_JIQjV6zMlEvmkyi-ymQInQzSwk",
                              "suggest_new": "Click on me if you don't see anything in the list"});
});