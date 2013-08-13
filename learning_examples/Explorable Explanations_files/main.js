//
//  main.js
//  ExplorableExplanations
//
//  Created by Bret Victor on 3/10/11.
//  (c) 2011 Bret Victor.  MIT open-source license.
//


(function () {

window.addEvent('domready', function() {
	var tangle = new Tangle();
	if (window.initParkExample) { initParkExample(tangle); }
    if (window.initFilterExample) { initFilterExample(tangle); }
    if (window.initWikipediaExample) { initWikipediaExample(); }
});


})();