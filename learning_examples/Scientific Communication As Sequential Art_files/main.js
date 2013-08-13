//
//  main.js
//  ScientificCommunicationAsSequentialArt
//
//  Created by Bret Victor on 5/21/11.
//  (c) 2011 Bret Victor.  MIT open-source license.
//


(function(){


var gViewsByGlobalID = {};
this.getViewByGlobalID = function (id) { return gViewsByGlobalID[id]; };


//====================================================================================
//
//  domready
//

window.addEvent('domready', function () {

    var elements = $$(".dynamic");
    loadNextElement.delay(100);
    
    function loadNextElement () {
        if (elements.length === 0) { return; }
        
        var element = elements.shift();
        var properties = getPropertiesFromElement(element);
        var className = properties["class"];
        if (className) { 
        	var view = new this[className](element, properties);
        	if (properties.globalID) { gViewsByGlobalID[properties.globalID] = view; }
        }

        loadNextElement.delay(10);
    }
});

function getPropertiesFromElement (element) {
    var properties = {};
    
    var className = element.className || "";
    var names = className.split(" ");

    for (var i=0; i < names.length; i++) {
        var name = names[i];
        var substrings = name.split('-');
        if (substrings.length != 2) { continue; }
        
        var property = substrings[0];
        var value = substrings[1];
        var valueAsInt = parseInt(value);
        var hasNonDigit = value.match(/\D/);
        var hasLeadingZero = (value.length > 1 && value.substr(0,1) === "0");
        if (!hasNonDigit && !hasLeadingZero && !isNaN(valueAsInt)) { value = valueAsInt; }
        
        var percentMatch = property.match(/(.+)Percent$/);
        if (percentMatch) { property = percentMatch[1]; value = value / 100; }
        
        properties[property] = value;
    }
    return properties;
}


//====================================================================================

})();

