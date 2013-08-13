//
//	Slider.js
//	ScientificCommunicationAsSequentialArt
//
//	Created by Bret Victor on 5/21/11.
//	(c) 2011 Bret Victor.  MIT open-source license.
//

(function(){


//====================================================================================
//
//	Slider
//

var Slider = this.Slider = new Class({

	initialize: function (hostElement, properties) {
		var view = properties.viewID ? getViewByGlobalID(properties.viewID) : null;
		var layer = new SliderLayer(null, properties, view);
		
		layer.element.setStyle("position", "relative");
		hostElement.grab(layer.element);
	}

});



//====================================================================================
//
//	SliderLayer
//

var SliderLayer = this.SliderLayer = new Class({

	Extends: BVLayer,

	initialize: function (superlayer, properties, view) {
		this.parent(superlayer);
		this.properties = properties;
		this.view = view;
		
		this.setTouchable(true);
		this.setHoverable(true);
		
		this.xMargin = 40;
		this.trackWidth = properties.width;
		this.setSize(this.trackWidth + this.xMargin * 2, 16);
		this.setX(-this.xMargin);

		var preloadKnob = new BVLayer(this);
		preloadKnob.setContentsURLAndSize("Images/SliderKnob.png", 1, 1);
		preloadKnob.setPosition(20,-8);
		
		var leftCap = new BVLayer(this);
		leftCap.setContentsURLAndSize("Images/SliderLeft.png", 8,4);
		leftCap.setPosition(this.xMargin, -6);

		var rightCap = new BVLayer(this);
		rightCap.setContentsURLAndSize("Images/SliderRight.png", 8,4);
		rightCap.setPosition(this.xMargin + this.trackWidth - rightCap.width, -6);

		var centerFill = new BVLayer(this);
		centerFill.setContentsURLAndSize("Images/SliderCenter.png", this.trackWidth - leftCap.width - rightCap.width, 4);
		centerFill.setPosition(this.xMargin + leftCap.width, -6);
		
		this.knob = new BVLayer(this);
		this.knob.setContentsURLAndSize("Images/SliderKnob.png", 13, 13);
		this.knob.setY(-2);
		this.setKnobPositionWithStep(this.view.getStep());
	},
	
	setKnobPositionWithStep: function (step) {
		step = step || 0;
		var stepCount = this.view.getStepCount();
		this.knob.setX(this.xMargin + Math.round(step * this.trackWidth / this.view.getStepCount()) - 6);
	},
	
	cursorMovedToPoint: function (x,y) {
		var trackX = x - this.xMargin;
		if (trackX < -6 || trackX > this.trackWidth + 6) { return; }	// don't respond until we get close

		var progress = (trackX / this.trackWidth).limit(0,1);
		var step = Math.round(progress * this.view.getStepCount());

		this.knob.setContentsURL("Images/SliderKnobDown.png");
		this.setKnobPositionWithStep(step);
		this.view.setStep(step);
	},
	
	cursorExited: function () {
		this.knob.setContentsURL("Images/SliderKnob.png");
		var step = this.view.getDefaultStep();
		this.setKnobPositionWithStep(step);
		this.view.setStep(step);
	},
	
	mouseEntered: function () {
	},
	
	mouseMovedToPoint: function (x,y) {
		if (this.touches) { return; }
		this.cursorMovedToPoint(x,y);
	},

	mouseExited: function () {
		if (this.touches) { return; }
		this.cursorExited();
	},
	
	touchDidGoDown: function (touches) {
		this.cursorMovedToPoint(touches.localPoint.x, touches.localPoint.y);
	},

	touchDidMove: function (touches) {
		this.cursorMovedToPoint(touches.localPoint.x, touches.localPoint.y);
	},
	
	touchDidGoUp: function (touches) {
		if (this.containsLocalPoint(touches.localPoint)) { return; }
		this.cursorExited();
	}


});


})();

