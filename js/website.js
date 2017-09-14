var currentHeader = 0;

function setSection(n) {
	var headerElement = document.getElementById('header');
	var contentElement = document.getElementById('content');
	
	if(n == 0) {
		document.body.style.backgroundColor = "#f5f5f5";
		headerElement.innerHTML = "<h1>hi, i'm nick</h1>";
		contentElement.innerHTML = "<p>i'm a fourth year undergraduate studying Computer Science at University of California, San Diego.</p>";
	}
	else if(n == 1) {
		document.body.style.backgroundColor = "#f0ffff";
		headerElement.innerHTML = "<h1>about me</h1>";
		contentElement.innerHTML = "<p>I like games.</p>";
	}
	else if(n == 2) {
		document.body.style.backgroundColor = "#e6e6fa";
		headerElement.innerHTML = "<h1>projects</h1>";
		contentElement.innerHTML = "<p>TBD</p>";
	}
	else {
		document.body.style.backgroundColor = "#f5fffa";
		headerElement.innerHTML = "<h1>contact</h1>";
		contentElement.innerHTML = "<p>Links</p>";
	}
}

function setSectionStay(n) {
	// Set previous button lighter
	document.getElementById("button"+currentHeader).style.opacity = "0.4";
	currentHeader = n;
	document.getElementById("button"+currentHeader).style.opacity = "1";
	setSection(n);
}

function revertSection() {
	setSectionStay(currentHeader);
}

function move(evnt) {
	var imageElement = document.getElementById("megif");
	
	var contentElement = document.getElementById('content');
	
	switch (evnt.keyCode) {
		case 37:
		imageElement.style.left = parseInt(imageElement.style.left || 0, 10) - 5 + 'px';
		break;
		case 38:
		imageElement.style.top = parseInt(imageElement.style.top || 0, 10) - 5 + 'px';
		break;
		case 39:
		imageElement.style.left = parseInt(imageElement.style.left || 0, 10) + 5 + 'px';
		break;
		case 40:
		imageElement.style.top = parseInt(imageElement.style.top || 0, 10) + 5 + 'px';
		break;
	}
}