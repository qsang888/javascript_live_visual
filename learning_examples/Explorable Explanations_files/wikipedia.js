//
//  wikipedia.js
//  ExplorableExplanations
//
//  Created by Bret Victor on 3/14/11.
//  (c) 2011 Bret Victor.  MIT open-source license.
//


(function () {

var isSearching = false;
var searchTerm = "";
var hoverSpan = null;

var container;
var searchBox;
var wikiBox;

var requestTimer;
var request;
var expandUrl;


//----------------------------------------------------------
//
//  init
//

initWikipediaExample = function () {
	container = $("wikipediaExample");
	wrapWordsInSpans();
	$(document).addEvent("keydown", keyDidGoDown);
}


//----------------------------------------------------------
//
//  which word is pointed at?
//

function wrapWordsInSpans () {
	container.getChildren().each( function (el) {
		var text = el.get("text");
		var words = text.split(/\s+/);
		var spans = words.map( function (word) { return "<span>" + word + "</span>"; });
		var html = spans.join(" ");
		el.set("html", html);
		
		el.getChildren().each( function (span) {
			span.addEvent("mouseenter", mouseDidEnterSpan);
			span.addEvent("mouseleave", mouseDidLeaveSpan);
		});
	});
}

function mouseDidEnterSpan (event) {
	hoverSpan = event.target;
}

function mouseDidLeaveSpan (event) {
	if (hoverSpan === event.target) { hoverSpan = null; }
}


//----------------------------------------------------------
//
//  trigger
//

function keyDidGoDown (event) {
	if (isSearching) {
    	if (event.key == "esc") { stopSearching(); event.stop(); }
    	return;
    }

    var shouldTrigger = (event.key == "w") && !event.shift && !event.control && !event.alt && !event.meta;
    if (!shouldTrigger) { return; }
    
    if (!hoverSpan) { return; }

	event.stop();
	addSearchBoxWithSpan(hoverSpan);
}


//----------------------------------------------------------
//
//  search box
//

function addSearchBoxWithSpan (span) {
	var position = span.getPosition(container);
	var string = span.get("text");

	string = string.replace(/\W+$/, "").replace(/\W+$/, "").replace(/\'s$/, "");  // get rid of leading and trailing punctuation
    if (!string.match(/\w/)) { return; }  // ignore if there are no letters left

	isSearching = true;
	if (searchBox) { searchBox.destroy(); searchBox = null; }

	var useSearchStyle = Browser.Platform.mac && (Browser.safari || Browser.chrome);
	if (useSearchStyle) {
		position.y -= 3;
		position.x -= 11;
	}
	else {
		position.y -= 2;
		position.x -= 2;
	}

	searchBox = new Element("input", {
		type:useSearchStyle ? "search" : "text", 
		value:string + " ",
		"class":"wikipediaSearchBox", 
		size:string.length + 15,
		style:"left:" + position.x + "px; top:" + position.y + "px;"
	});
	searchBox.addEvent("blur", stopSearching);
	searchBox.addEvent("keyup", function (event) {
		if (event.key == "esc") { stopSearching(); return; }
		searchBoxDidChange(true);
	});

	container.grab(searchBox, "bottom");
	searchBox.focus();
	
	searchBoxDidChange(false);
}

function searchBoxDidChange (shouldDelay) {
	var term = searchBox.get("value");
	if (searchTerm == term) { return; }
	searchTerm = term;

	performSearchRequestViaProxy(searchTerm,shouldDelay);
}


//----------------------------------------------------------
//
//  request via cgi proxy (due to cross-site security restrictions)
//

function performSearchRequestViaProxy (searchTerm, shouldDelay)  {
	if (requestTimer) { clearTimeout(requestTimer); requestTimer = null; }
	if (request) { request.cancel(); request = null; }
	
	requestTimer = (function () {
		requestTimer = null;
		if (request) { request.cancel(); request = null; }

		var query = escape(searchTerm);
		var url = "http://worrydream.com/cgi-bin/ExplorableExplanations/WikipediaProxy.pl?q=" + query;
		request = new Request({
			url:url,
			method:"get",
			link:"cancel",
		    onFailure: function(){ },
			onSuccess: proxyResultsDidArrive,
		});
		request.send();
	}).delay(shouldDelay ? 250 : 0);
}

function proxyResultsDidArrive (response) {
	var components = response.split(/<\/?title>/, 3);
	if (components.length != 3) { return; }

	var title = components[1];
	var html = components[2];
	addWikiBoxWithHTML(html, title);
}


//----------------------------------------------------------
//
//  request via javascript (just here for your edification, not used because of cross-site security restrictions)
//

function performSearchRequestDirectly (searchTerm, shouldDelay)  {
	if (requestTimer) { clearTimeout(requestTimer); requestTimer = null; }
	if (request) { request.cancel(); request = null; }
	
	requestTimer = (function () {
		requestTimer = null;
		if (request) { request.cancel(); request = null; }

		var apiKey = "ABQIAAAA-uYuyThVHgHFvB3u9JxTixShm6D3rA_fDxGdb3Y8QgRBTHfkjRQ13AmfNSL_ihPI1dIaVOMSWrqmhQ";
		var query = escape(searchTerm + " site:wikipedia.org");
		var url = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&rsz=large&key=" + apiKey + "&q=" + query;
		request = new Request.JSON({
			url:url,
			method:"get",
			link:"cancel",
		    onFailure: function(){ },
			onSuccess: googleResultsDidArrive,
		});
		request.send();
	}).delay(shouldDelay ? 250 : 0);
}

function googleResultsDidArrive (results) {
	if (!results || !results.responseData || !results.responseData.results || !results.responseData.results[0]) { return; }

	var result = results.responseData.results[0];
	var matches = result.url.match(/\/wiki\/(.+)/);
	var title = matches ? matches[1] : null;
	if (!title) { return; }
	
	var url = "http://mobile.wikipedia.org/transcode.php?go=" + title;
	expandUrl = "http://en.wikipedia.org/wiki/" + title;

	if (request) { request.cancel(); request = null; }
    request = new Request({
    	url:url,
    	evalScripts:false,
    	method:"get",
    	link:"cancel",
        onFailure: function(){ },
    	onSuccess: wikipediaResultsDidArrive,
    });
    request.send();
}

function wikipediaResultsDidArrive (response) {
	var components = response.split("<hr />");
	var body = components[1];
	if (!body) { return; }

	// title
	
	var head = components[0];
	var headComponents = head.split(/\<\/?big\>/);
	if (!headComponents[1]) { return; }
	var title = headComponents[1].replace(/\<[^\>]*\>/g,"");	// remove all html tags

	// content

	var newlineMarker = "!@#$%";
	var text = body.replace(/(<br \/>\s*)+/g, newlineMarker);	// remember where newlines were
	text = text.replace(/\<img.+\n/g,"");	// remove references
	text = text.replace(/\<[^\>]*\>/g,"");	// remove html tags
	text = text.replace(/[\[\]]\n*/g,"");	// remove brackets
	
	var html = "";
	text.split(newlineMarker).each( function (paragraph) {	// split on newlines
		if (!paragraph.match(/\w/)) { return; }
		html += "<p>" + paragraph + "</p>\n";	// reassemble paragraphs in <p> tags
	});
	
	addWikiBoxWithHTML(html,title);
}


//----------------------------------------------------------
//
//  wiki box
//

function addWikiBoxWithHTML (html,title) {
	if (!searchBox) { return; }
	var position = searchBox.getPosition($("everything"));
	position.x -= 2;
	position.y += 24;

	if (wikiBox == null) {
		wikiBox = new Element("div", { "class":"wikipediaWikiBox" });
		var headerBox = new Element("div", { "class":"wikipediaWikiBoxHeader" }).inject(wikiBox, "bottom");
		var contentBox = new Element("div", { "class":"wikipediaWikiBoxContent" }).inject(wikiBox, "bottom");
		$("everything").grab(wikiBox, "bottom");
	}

	wikiBox.setStyles({ left:position.x, top:position.y });
	updateWikiBoxWithHTML(html,title);
}

function updateWikiBoxWithHTML (html,title) {	
	var headerBox = wikiBox.getElement(".wikipediaWikiBoxHeader");
	headerBox.set("text",title);
	
	var contentBox = wikiBox.getElement(".wikipediaWikiBoxContent");
	contentBox.set("html", html);
}


//----------------------------------------------------------
//
//  stop
//

function stopSearching () {
	if (searchBox) { searchBox.destroy(); searchBox = null; }
	if (wikiBox) { wikiBox.destroy(); wikiBox = null; }
	if (requestTimer) { clearTimeout(requestTimer); requestTimer = null; }
	if (request) { request.cancel(); request = null; }
	if (request) { request.cancel(); request = null; }
	
	isSearching = false;
	searchTerm = "";
}

	
//----------------------------------------------------------

})();


