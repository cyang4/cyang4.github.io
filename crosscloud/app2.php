
<html>
<head>
<title>Crosscloud Profiles App</title>
<link type="text/css" rel="stylesheet" href="stylesheet2.css"/>

<script src="./script2.js"></script>

<style>
</style>

</head>
<body>
    <form action="#" >
	<p style="float:right">Enter Username:<input id="podurl" type="text" size="20" value="http://try.fakepods.com" /><input type="submit" value="Go" onclick='reload();return false;'  />
		
	</form>

	<h1>Crosscloud Sales App</h1>
	<hr/>
	<div id="items" style = "visibility: hidden">
	<center><h3><a href="javascript:void(0)" onclick="load('Electronics');return false;">Electronics</a> | <a href="javascript:void(0)" onclick="alert('clothing');">Clothing</a> | <a href="javascript:void(0)" onclick="alert('books');">Books</a> | <a href="javascript:void(0)" onclick="alert('other');">Other</a> </h3></center>

	<form id = "entry" action="#" onsubmit='newmsg();return false;' >
		<center><h2>Submit An Item For Sale</h2>
	<p>Brand:<input id="brand" type="text" placeholder="Sony, LG, Tommy Hilfiger, etc." size="20"/></p>
	<p>Type: <select id="type">
		<option value="electronics">Electronics</option>
		<option value="clothing">Clothing</option>
		<option value="books">Books</option>
		<option value="other">Other</option>
	</select>
	<p>Description:<input id="description" type="text" size="10"/></p>
	<p>Condition:<input id="condition" type="text" size="10"/></p>
	<p>Price:<input id="price" type="text" size="10"/></p>
	<input type="submit" value="OK" />
</center>
	</form>


	<h1>Items For Sale:</h1>
	<div id="products"></div>

	
	</div>

</body>
</html>
