setup = function() {
	var body = document.getElementById('body');
	var canvas = document.createElement('canvas');

	var ctx = canvas.getContext('2d');
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	body.appendChild(canvas);

	// Create a new image with:
	// a 'src' attribute of "/media/img/gamedev/ralphyrobot.png"
	// and an 'onload' attribute of onImageLoad
	// YOUR CODE HERE
    var img = document.createElement('img');
    img.src = "/media/img/gamedev/ralphyrobot.png";
    img.onload.onImageLoad();
};

onImageLoad = function(){
	// Use the console.log function to print a statement to the browser console.
	// This will print once the image has been downloaded.
	// YOUR CODE HERE
    console.log('image load');
};

// We'll call your setup function in our test code, so
// don't call it in your code.
setup();

