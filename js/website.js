var currentHeader = 0;

function setHeader(n) {
	currentHeader = n;
	var header = document.getElementById('header').innerHTML = n;
}