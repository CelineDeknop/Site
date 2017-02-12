
function addFieldF(divName) {
	var newdiv = document.createElement('div');
	newdiv.innerHTML = " </br> <p> <label>Durée</label> </br>"+
                            "<input type=\"date\" class=\"form-control\" name=\"ftime\" placeholder=\"01-02-2000 - 01-02-2001\">"+
                            "</p><p><label>Description</label>"+
                            "<textarea type=\"text\" class=\"form-control\" name=\"form\"></textarea></p>";
    newdiv.class = "col-lg-6 text-center";
	document.getElementById(divName).appendChild(newdiv);
}

function addFieldE(divName) {
	var newdiv = document.createElement('div');
	newdiv.innerHTML = " </br> <p> <label>Durée</label> </br>"+
                            "<input type=\"date\" class=\"form-control\" name=\"etime\" placeholder=\"01-02-2000 - 01-02-2001\">"+
                            "</p><p><label>Description</label>"+
                            "<textarea type=\"text\" class=\"form-control\" name=\"exp\"></textarea></p>"+
                            "<p><label>Remarque</label>"+
                            "<input type=\"text\" class=\"form-control\" name=\"erem\"></p>";
	document.getElementById(divName).appendChild(newdiv);
}