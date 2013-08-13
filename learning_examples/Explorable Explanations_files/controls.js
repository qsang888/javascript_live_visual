//
//  c_filterParams.js
//  ExplorableExplanations
//
//  Created by Bret Victor on 3/10/11.
//  (c) 2011 Bret Victor.  MIT open-source license.
//


//----------------------------------------------------------
//
//  c_toggle
//
//  click to toggle value between 0 and 1

Tangle.controls.c_toggle = function (el, worksheet) {
	el.addEvent("mousedown", function (event) {
		var isActive = worksheet.getValue(el);
		worksheet.setValue(el, isActive ? 0 : 1);
	});
};



//----------------------------------------------------------
//
//  c_adjustableNumber
//
//  drag a number to adjust
//  (use a transformer to format the text, if necessary)

var isAnyAdjustableNumberDragging = false;  // hack for dragging one value over another one

Tangle.controls.c_adjustableNumber = function (el, worksheet) {
	var bounds = getBounds();
	var container = worksheet.element;
	
	// cursor
	
	var isHovering = false;

	el.addEvent("mouseenter", function () { isHovering = true;   updateRolloverEffects(); });
	el.addEvent("mouseleave", function () { isHovering = false;  updateRolloverEffects(); });
	
	function updateRolloverEffects () {
		updateColor();
		updateCursor();
		updateHelp();
	}
	
	function isActive () {
		return isDragging || (isHovering && !isAnyAdjustableNumberDragging);
	}

	function updateColor () {
		if (isActive()) { el.addClass("c_adjustableNumberHover"); }
		else { el.removeClass("c_adjustableNumberHover"); }
	}

	function updateCursor () {
		var body = document.getElement("body");
		if (isActive()) { body.addClass("cursorDragHorizontal"); }
		else { body.removeClass("cursorDragHorizontal"); }
	}

	// help

	var help   = (new Element("div", { "class": "adjustableNumberHelp" })).inject(container, "top");
	help.setStyle("display", "none");
	help.set("text", "drag");
	
	function updateHelp () {
		var position = el.getPosition(container);
		var size = el.getSize();
		position.y -= size.y - 4;
		position.x += Math.round(0.5 * (size.x - 20));
		help.setPosition(position);
		help.setStyle("display", (isHovering && !isAnyAdjustableNumberDragging) ? "block" : "none");
	}

	// drag

	var isDragging = false;
	var valueAtMouseDown;

	new BVTouchable(el, {

		touchDidGoDown: function (touches) {
			valueAtMouseDown = worksheet.getValue(el);
	    	isDragging = true;
	    	isAnyAdjustableNumberDragging = true;
	    	updateRolloverEffects();
		},
		
		touchDidMove: function (touches) {
    		var value = valueAtMouseDown + touches.translation.x / 5 * bounds.step;
    		value = ((value / bounds.step).round() * bounds.step).limit(bounds.min, bounds.max);
    		worksheet.setValue(el, value);
    		updateHelp();
		},
		
		touchDidGoUp: function (touches) {
	    	help.setStyle("display", "none");
	    	isDragging = false;
	    	isAnyAdjustableNumberDragging = false;
	    	updateRolloverEffects();
		}
	});
	
	// bounds

	function getBounds () {
		var bounds = { min:1, max:10, step:1 };
		var prefix = "bounds_";

		el.className.split(" ").each( function(className) {
			if (className.indexOf(prefix) != 0) { return; }
			var parts = className.split("_");
			bounds.min = parts[1].replace("-",".").toFloat();
			bounds.max = parts[2].replace("-",".").toFloat();
			if (parts[3]) { bounds.step = parts[3].replace("-",".").toFloat(); }
		});
		
		return bounds;
	}

};



//----------------------------------------------------------
//
//  c_filterKnob
//

Tangle.controls.c_filterKnob = function (el, worksheet) {
	var name = worksheet.getVariableName(el);
	var index = name.substr(name.length - 1);

	var xParameter = "fc" + index;
	var xBounds = { min:20, max:20000 };

	var yParameter = "q" + index;
	var yBounds = { min:0.01, max:10 };


	// log-scaled Q
	
	var qLogScaleBase = 24;
	
	function getQForY (y) {
		return (yBounds.max - yBounds.min) * (Math.pow(qLogScaleBase, -y/canvasHeight) - 1/qLogScaleBase) + yBounds.min;
	}
	
	function getYForQ (q) {
		return -canvasHeight * Math.log((q - yBounds.min) / (yBounds.max - yBounds.min) + 1/qLogScaleBase) / Math.log(qLogScaleBase)
	}
	

	// view
	
	el.setStyles({position:"absolute", left:0, top:0});
	
	var canvasEl = el.getParent().getElement("canvas");
	var canvasWidth = canvasEl.get("width");
	var canvasHeight = canvasEl.get("height");
	
	var lineStyle = "position:absolute; display:block; border-left:1px dotted #00f; pointer-events:none; width:1px; height:" + canvasHeight + "px;";
	var lineEl = new Element("div", { style:lineStyle });
	el.grab(lineEl, "bottom");
	
	var knobStyle = "position:absolute; display:none; ";
	var knobWidth = 36, knobHeight = 36;
	var knobEl = new Element("img", { style:knobStyle, src:"Media/FilterParamsKnob.png", width:knobWidth, height:knobHeight });
	el.grab(knobEl, "bottom");

	var helpEl = new Element("div", { "class": "c_filterKnobHelp" });
	helpEl.set("text", "drag");
	el.grab(helpEl, "bottom");
	
	var knobX, knobY;
	
	worksheet.setView(el, function () {
		var freq = worksheet.getValue(xParameter) / worksheet.getValue("fs");
		knobX = Math.round(Tangle.views.v_freqPlot.getXForNormalizedFrequency(freq, canvasWidth));
		knobY = Math.round(getYForQ(worksheet.getValue(yParameter)));
		knobEl.setStyles( { left:knobX - knobWidth/2, top:knobY - knobHeight/2 } );
		lineEl.setStyles( { left:knobX });
		helpEl.setStyles( { left:knobX - knobWidth/2 - 22, top:knobY - knobHeight/2 + 8 } );
	} );
	

	// rollover effects
	
	var isShowing = false;
	var isHovering = false;

	canvasEl.addEvent("mouseenter", function () { isShowing = true;   updateRolloverEffects(); });
	canvasEl.addEvent("mouseleave", function () { isShowing = false;  updateRolloverEffects(); });
	knobEl.addEvent("mouseenter", function () { isHovering = true;   updateRolloverEffects(); });
	knobEl.addEvent("mouseleave", function () { isHovering = false;  updateRolloverEffects(); });
	
	function updateRolloverEffects () {
		updateCursor();
		var isShowingKnob = (isShowing || isHovering || isDragging);
		knobEl.setStyle("display", isShowingKnob ? "block" : "none");
		helpEl.setStyle("display", (isShowingKnob && !didDrag) ? "block" : "none");
	}
	
	function updateCursor () {
		var body = document.getElement("body");
		if (isHovering || isDragging) { body.addClass("cursorDrag"); }
		else { body.removeClass("cursorDrag"); }
	}

	function updateDynamicLabelsShowing () {
		worksheet.element.getElements(".showOnDrag").each( function (hideEl) {
			hideEl.setStyle("display", isDragging ? "block" : "none");
		});
		worksheet.element.getElement(".filterSidebar").setStyle("display", isDragging ? "none" : "block");
	}
	
	
	// drag

	var isDragging = false;
	var didDrag = false;
	var knobXAtMouseDown, knobYAtMouseDown;
	
	new BVTouchable(knobEl, {

		touchDidGoDown: function (touches) {
			knobXAtMouseDown = knobX;
			knobYAtMouseDown = knobY;
	    	isDragging = true;
	    	didDrag = true;
	    	knobEl.set("src", "Media/FilterParamsKnobDrag.png");
	    	updateRolloverEffects();
	    	updateDynamicLabelsShowing();
    		worksheet.setValues( { index:index, isAudioPlaying:true } );
		},
		
		touchDidMove: function (touches) {
    		var obj = { };

    		var newX = knobXAtMouseDown + touches.translation.x;
    		var fc = Tangle.views.v_freqPlot.getNormalizedFrequencyForX(newX, canvasWidth) * worksheet.getValue("fs");
    		obj[xParameter] = fc.limit(xBounds.min, xBounds.max);

    		var newY = knobYAtMouseDown - touches.translation.y;
    		var q = getQForY(newY);
    		obj[yParameter] = q.limit(yBounds.min, yBounds.max);

    		worksheet.setValues(obj);
		},
		
		touchDidGoUp: function (touches) {
	    	isDragging = false;
	    	knobEl.set("src", "Media/FilterParamsKnob.png");
	    	helpEl.setStyle("display", "none");
	    	updateRolloverEffects();
	    	updateDynamicLabelsShowing();
    		worksheet.setValue("isAudioPlaying", false);
		}
	});
};

