var pod = crosscloud.connect();

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



pod.onLogin(function (userID){

        //===============================================================================================
        //
        // Image upload stuff
        //
        //===============================================================================================
        var dataURL;
        var imagePreview = $('#imagePreview');
        function handleFileSelect (evt) {
            evt.preventDefault();
            console.log("handling");
            var files = evt.target.files; // FileList object

            // Loop through the FileList and render image files as thumbnails.
            for (var i = 0, f; f = files[i]; i++) {

              // Only process image files.
              if (!f.type.match('image.*')) {
                console.log("is an image)");
                continue;
              }

              var reader = new FileReader();

              // Closure to capture the file information.
              reader.onload = (function(theFile) {
                console.log("reading image");
                return function(e) {
                  dataURL = e.target.result;
                  // Render thumbnail.
                  var thumbnail = ['<img src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('');
                  console.log(thumbnail);
                  imagePreview.html(thumbnail);

                };
              })(f);

              // Read in the image file as a data URL.
              reader.readAsDataURL(f);
            }
          }

        document.getElementById('imagePick').addEventListener('change', handleFileSelect, false);

    $("#products").html("waiting for data...");

    pod.onLogout(function () {
        $("#products").html("<i>not connected</i>");
    });

    //===============================================================================================
    // displayMessages
    // Create divs for each new item that we retrieve, called after we get all results on query
    // Appends each new item to the end of the document
    //===============================================================================================

    var displayMessages = function (messages) {
        
        messages.sort(function(a,b){return a.when<b.when?1:(a.when===b.when?0:-1)});
        var out = document.getElementById("products");
        out.innerHTML="";
        var i;
        
        for (i=0; i<messages.length; i++) {
            var message = messages[i];

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

            var del = "delete";
            var div = document.createElement("div");
            div.className = "productInfo";
            message.timeDate = new Date(Number(message.time))
            var date = message.timeDate.toLocaleString();
                
            if(message.brand!=""){
                var line = "<div class='displayInfo' id='displayBrand'><center>"+message.brand+"</center></div>";
                if(message.owner==pod.podURL){line += "<center><button type = 'button' class = 'deleteButton' messageId= " + message._id+">Remove</button></center>";}
                if(message.dataURL!=null){line+='<div class = "imagePlace"><img src = "'+message.dataURL+'"/></div>';}
                line += "<div>Price: "+message.price+"</div>";
                line += "<div>Condition: "+conditions[message.condition]+"</div>";
                line += "<div>Description: "+message.description+"</div>";
                line += "<div>Type: "+itemType+"</div>";
                line += "<div>Location: "+message.location+"</div>";
                if (message.isBooks){line += "<div>Genre: " + message.genre+"</div>";}
                
                var link = document.createElement("a");

                div.innerHTML += line;
                link.href=message._id;

                link.appendChild(document.createTextNode("item"));
                div.appendChild(link);
                
                out.appendChild(div);
            }
        }
    }
        
    };

    //===========================================================================================
    // Delete button function
    //===========================================================================================

    $(document).on('click', '.deleteButton', function(){
        var thisEntry = $(this).attr("messageId");
        console.log(thisEntry);
        pod.delete({_id:thisEntry});
    });



    pod.query()
        .filter( {isForSale3:true} )
        .onAllResults(displayMessages)
        .start();



    //===============================================================================================
    // Processing for form
    //===============================================================================================
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


    //===============================================================================================
    //
    // Makes the actual JSON file.
    //
    //===============================================================================================
    function makeJSON(brand, type, condition, description, price, location, genre, dataURL){
    var file = {};
    file["CrossCloudReuseList"] = true;
    file["brand"] = brand;
    file["condition"] = condition;
    file["description"] = description;
    file["price"] = price;
    //file["color"] = color;
    file["location"] = location;
    file["genre"] = genre;
    file["dataURL"] = dataURL;
    file["owner"]= pod.podURL;
    
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
    file["isForSale3"] =  true; //temporarily set this as true, since we don't have a 'looking for' feature
    file["time"] = Date.now();
    console.log(file);
    return file;
    }



    $(function(){
    $("#error").html("");  // clear the "Missing Javascript" error message


    //===============================================================================================
    //
    // sendProduct
    // Function that is called when an item is submitted. Takes into account special variables
    // if an item has different form parameters (electronics vs. books vs. other vs. clothing)
    //
    //===============================================================================================
    var sendProduct = function () {
        var genre = "";
        var color = "";
        var type = document.getElementById("formType").value;
        
        if (type == "books"){var brand = document.getElementById("bookFormTitle").value;}
        else{ var brand = document.getElementById("formTitle").value;}

        if (type=="books"){var genre = document.getElementById("genre").value;}
        else {var genre = "";}
        

        var condition = document.getElementById("condition").value;
        var description = document.getElementById("description").value;
        var price = document.getElementById("price").value;
        var location = document.getElementById("location").value;
        var image = dataURL;
        var thisJSON = makeJSON(brand, type, condition, description, price, location, genre, image);
        console.log(thisJSON);
        var content = JSON.stringify(thisJSON);

       pod.push(thisJSON);

        document.getElementById("formTitle").value = "";
        document.getElementById("bookFormTitle").value = "";
        //document.getElementById("formType").value = "";
        document.getElementById("genre").value = "";
        document.getElementById("color").value = "";
        document.getElementById("description").value = "";
        //document.getElementById("condition").value = "";
        document.getElementById("price").value = "";
        document.getElementById("location").value = "";


    };

    $("#submitbutton").click(sendProduct);
    //===============================================================================================
    //
    // Individual queries for the different categories. Should clean this up...
    //
    //===============================================================================================

    function qElec(){
    clearList();
    pod.query()
            .filter( { isElectronics:true, isForSale3: true} )
            .onAllResults(displayMessages)
            .start();
        }
    function qBook(){
    clearList();
    pod.query()
            .filter( { isBooks:true, isForSale3:true} )
            .onAllResults(displayMessages)
            .start();
        }

    function qClothing(){
    clearList();
    pod.query()
            .filter( { isClothing:true, isForSale3:true } )
            .onAllResults(displayMessages)
            .start();
        }

    function qFurniture(){
    clearList();
    pod.query()
            .filter( { isFurniture:true, isForSale3:true } )
            .onAllResults(displayMessages)
            .start();
        }

    function qOther(){
    clearList();
    pod.query()
            .filter( { isOther:true , isForSale3:true} )
            .onAllResults(displayMessages)
            .start();
        }
    $('#electronicsLink').click(qElec);
    $('#booksLink').click(qBook);
    $('#clothingLink').click(qClothing);
    $('#furnitureLink').click(qFurniture);
    $('#otherLink').click(qOther);

    //===============================================================================================
    //
    // clearList
    // Removes all elements in the products div for each new query
    //
    //===============================================================================================
    function clearList(){
        var out = document.getElementById("products");
            out.innerHTML="";
    }
});
});


var hiddenFields = ["genreField", "colorField", "titleField", "bookTitleField"];

//===============================================================================================
//
// processChange
// Used when a different item type is selected for item submit form
//
//===============================================================================================

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

//===============================================================================================
//
// hideAll
// Hides all fields that could be hidden, used when new item type is selected
//
//===============================================================================================
function hideAll(){
    //console.log("hiding all hidden fields");
    for (i = 0; i<hiddenFields.length; i++){
        document.getElementById(hiddenFields[i]).style.display="none";
    }
}

//===============================================================================================
//
// Freebase widget
//
//===============================================================================================
$(function() {
  $("#bookFormTitle").suggest({"filter":"(all type:/book/book/)",
                                "key": "AIzaSyA-dZJY_JIQjV6zMlEvmkyi-ymQInQzSwk",
                              "suggest_new": "Click on me if you don't see anything in the list"});
});


