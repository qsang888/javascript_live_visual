//
//	Ring.js
//	ScientificCommunicationAsSequentialArt
//
//	Created by Bret Victor on 5/21/11.
//	(c) 2011 Bret Victor.  MIT open-source license.
//

(function(){

var lerp = function (a,b,t) { return a + (b - a) * t; };


//====================================================================================
//
//	BVCanvas
//

var BVCanvas = this.BVCanvas = new Class({

	initialize: function (canvas, properties) {
		this.canvas = this.element = canvas;
		this.properties = properties;
		
		this.width = parseInt(canvas.get("width"));
		this.height = parseInt(canvas.get("height"));
		this.ctx = this.canvas.getContext("2d");
	},
	
	clear: function () {
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(0,0,this.width,this.height);
	}
	
});


//====================================================================================
//
//	Ring
//

var Ring = this.Ring = new Class({

	Extends: BVCanvas,

	initialize: function (canvas, properties) {
		this.parent(canvas, properties);

		this.radius = this.width/2 - 4;
		this.center = { x:Math.round(this.width/2), y:Math.round(this.height/2) };
		
		this.vertexCount = this.getVertexCount();
		this.neighborCount = this.getNeighborCount();

		this.style = "normal";
		this.styleProperties = {};
		this.addStyleProperties();

		this.vertices = [];
		this.addVertices();
		
		this.edgeSet = new EdgeSet(this);
		this.addInitialEdges();
		
		this.draw();
	},
	
	getVertexCount: function () { return this.properties.vertexCount || 12; },
	getNeighborCount: function () { return this.properties.neighborCount || 4; },
	

	//----------------------------------------------------------------------------------
	//
	//	styles
	//
	
	addStyleProperties: function () {

		this.styleProperties.normal = {
			radius: 2,
			fillStyle: "#000",
			strokeStyle: "rgba(0,0,0,0.4)",
			lineWidth: 1
		};
		this.styleProperties.dim = {
			radius: 2,
			fillStyle: "#999",
			strokeStyle: "rgba(0,0,0,0.25)",
			lineWidth: 1
		};
		this.styleProperties.bold = {
			radius: 2.5,
			fillStyle: "#000",
			strokeStyle: "#f10",
			lineWidth: 1.5
		};
		this.styleProperties.bolder = {
			radius: 3.5,
			fillStyle: "#000",
			strokeStyle: "#f10",
			lineWidth: 2.5
		};

	},
	
	setStyle: function (style) {
		this.style = style;
		var properties = this.styleProperties[style];
		this.ctx.fillStyle = properties.fillStyle;
		this.ctx.strokeStyle = properties.strokeStyle;
		this.ctx.lineWidth = properties.lineWidth;
	},

	getStyleProperty: function (property) {
		return this.styleProperties[this.style][property];
	},
	

	//----------------------------------------------------------------------------------
	//
	//	edges
	//

	addInitialEdges: function () {
		this.vertexCount.times( function (index) {
			this.addInitialEdgesFromVertex(index);
		}, this);
	},
	
	addInitialEdgesFromVertex: function (index) {
		for (var offset = -this.neighborCount/2; offset <= this.neighborCount/2; offset++) {
			if (offset != 0) { this.edgeSet.setEdge(index, index + offset, true); }
		}
	},
	
	getStyleForEdge: function (index1, index2) {
		return "normal";
	},
	

	//----------------------------------------------------------------------------------
	//
	//	vertices
	//

	addVertices: function () {
		this.vertexCount.times( function (i) {
			var vertex = new Vertex(this,i);
			this.vertices.push(vertex);
		}, this);
	},
	
	getVertex: function (index) {
		index = index % this.vertexCount;
		return this.vertices[index];
	},
	
	getStyleForVertex: function (index) {
		return "normal";
	},


	//----------------------------------------------------------------------------------
	//
	//	draw
	//

	draw: function () {
		this.clear();
		this.drawEdges();
		this.drawVertices();
	},

	drawEdges: function () {
		this.edgeSet.draw();
	},
	
	drawVertices: function () {
		this.vertices.each(function (vertex) { vertex.draw(); });
	}

});


//====================================================================================
//
//	Vertex
//

var Vertex = this.Vertex = new Class({

	initialize: function (ring, index) {
		this.ring = ring;
		this.index = index;
		
		this.angle = -Math.PI/2 + index * 2*Math.PI / this.ring.vertexCount;
		this.x = this.ring.center.x + this.ring.radius * Math.cos(this.angle);
		this.y = this.ring.center.y + this.ring.radius * Math.sin(this.angle);
	},
	
	draw: function () {
		var ctx = this.ring.ctx;
		var style = this.ring.getStyleForVertex(this.index);
		this.ring.setStyle(style);

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.ring.getStyleProperty("radius"), 0, 2*Math.PI, false);
		ctx.fill();
		ctx.closePath();
	}

});


//====================================================================================
//
//	EdgeSet
//

var EdgeSet = this.EdgeSet = new Class({

	initialize: function (ring) {
		this.ring = ring;
		this.vertexCount = this.ring.vertexCount;
		
		this.edges = [];
		this.vertexCount.times( function (i) {
			this.edges.push(0);
		}, this);
	},
	
	clone: function () {
		var edgeSet = new EdgeSet(this.ring);
		this.vertexCount.times( function (i) {
			edgeSet.edges[i] = this.edges[i];
		}, this);
		
		return edgeSet;
	},
	
	
	//----------------------------------------------------------------------------------
	//
	//	edges
	//

	hasEdge: function (index1, index2) {
		var vertexCount = this.vertexCount;
		index1 = (index1 + vertexCount) % vertexCount;
		index2 = (index2 + vertexCount) % vertexCount;
		
		var low = Math.min(index1,index2);
		var high = Math.max(index1,index2);
		
		return (this.edges[low] & (1 << high)) != 0;
	},
	
	setEdge: function (index1, index2, value) {
		var vertexCount = this.vertexCount;
		index1 = (index1 + vertexCount) % vertexCount;
		index2 = (index2 + vertexCount) % vertexCount;
		
		var low = Math.min(index1,index2);
		var high = Math.max(index1,index2);
		
		if (value) { this.edges[low] |= (1 << high); }
		else { this.edges[low] &= ~(1 << high); }
	},

	
	//----------------------------------------------------------------------------------
	//
	//	draw
	//

	draw: function () {
		var vertexCount = this.vertexCount;
		var edges = this.edges;
		
		for (var low = vertexCount - 1; low >= 0; low--) {
			for (var high = vertexCount - 1; high >= low; high--) {
				if (edges[low] & (1 << high)) {
					this.drawEdge(low, high);
				}
			}
		}
	},
	
	drawEdge: function (index1, index2, isHighlighted) {
		var vertexCount = this.vertexCount;
		index1 = (index1 + vertexCount) % vertexCount;
		index2 = (index2 + vertexCount) % vertexCount;
		if (index1 === index2) { return; }  // don't draw self edges
	
		var ctx = this.ring.ctx;
		var style = this.ring.getStyleForEdge(index1,index2);
		this.ring.setStyle(style);
		
		var left = index1;
		var right = index2;
		var distance = (right - left + vertexCount) % vertexCount;
		if (distance > vertexCount/2) {  // distance should go clockwise
			distance = vertexCount - distance;
			left = index2;
			right = index1;
		} 

		var vertex1 = this.ring.getVertex(left);
		var vertex2 = this.ring.getVertex(right);
		
		ctx.beginPath();
		
		if (distance == 1) {	// adjacent vertices
			ctx.arc(this.ring.center.x, this.ring.center.y, this.ring.radius, vertex1.angle, vertex2.angle, false);
		}
		else {
			var t = 0.4;
			ctx.moveTo(vertex1.x, vertex1.y);
			ctx.bezierCurveTo(lerp(vertex1.x, this.ring.center.x, t), lerp(vertex1.y, this.ring.center.y, t),
								 lerp(vertex2.x, this.ring.center.x, t), lerp(vertex2.y, this.ring.center.y, t),
								 vertex2.x, vertex2.y);
		}
		
		ctx.stroke();
		ctx.closePath();
	}

});




//====================================================================================
//
//	subclasses
//
//====================================================================================


//====================================================================================
//
//	RingWithNoEdges
//

var RingWithNoEdges = this.RingWithNoEdges = new Class({

	Extends: Ring,

	addInitialEdges: function () { return; },

});


//====================================================================================
//
//	RingWithOnlyTopEdges
//

var RingWithOnlyTopEdges = this.RingWithOnlyTopEdges = new Class({

	Extends: Ring,

	addInitialEdgesFromVertex: function (index) {
		if (index === 0) { this.parent(index); }
	},
	
	getStyleForVertex: function (index) {
		if (index === 0 || this.edgeSet.hasEdge(0,index)) { return "bold"; }
		return "dim";
	},

	getStyleForEdge: function (index1, index2) {
		return "bold";
	}

});

//====================================================================================
//
//	RingWithHighlightedTopEdges
//

var RingWithHighlightedTopEdges = this.RingWithHighlightedTopEdges = new Class({

	Extends: Ring,

	getStyleForVertex: function (index) {
		if (index === 0 || this.edgeSet.hasEdge(0,index)) { return "bold"; }
		return "dim";
	},

	getStyleForEdge: function (index1, index2) {
		return (index1 === 0) ? "bold" : "dim";
	}

});


//====================================================================================
//
//	RingWithRewiringInProgress
//

var RingWithRewiringInProgress = this.RingWithRewiringInProgress = new Class({

	Extends: Ring,
	
	addInitialEdges: function () {
		this.parent();
		this.lap = this.properties.lap;

		(this.lap + 1).times(function (lap) {
			this.edgeSetBeforeLap = this.edgeSet;
			this.rewireLap(lap);
		}, this);

		this.stepCount = this.edgeSets.length;
		this.defaultStep = (this.properties.step || 0);
		this.step = this.defaultStep;
		
		this.didBeginLap = (this.properties.step !== undefined);
		this.edgeSet = this.didBeginLap ? this.edgeSets[this.step] : this.edgeSetBeforeLap;
	},
	
	rewireLap: function (lap) {
		this.edgeSets = [ ];
		this.rewireIndexes = (lap == 0) ?
			 [ 5, 2, 11, 4, 7, 6, 0, 8, 4, 10, 5, 0 ] :
			 [ 7, 3, 9, 5, 0, 7, 1, 9, 2, 11, 1, 1 ];

		var edgeSet = this.edgeSet;
		this.rewireIndexes.each( function (index2, index1) {
			edgeSet = edgeSet.clone();
			edgeSet.setEdge(index1, index1 + lap + 1, false);
			edgeSet.setEdge(index1, index2, true);
			this.edgeSets.push(edgeSet);
		}, this);
		
		this.edgeSet = edgeSet;
	},
	
	getStep: function () { return this.step; },
	getDefaultStep: function () { return this.defaultStep; },
	getStepCount: function () { return this.stepCount; },
	
	setStep: function (step) {
		step = step.limit(0, this.stepCount - 1);
		if (step === this.step) { return; }
		this.step = step;
		
		this.edgeSet = this.edgeSets[step];
		this.draw();
	},
	
	getStyleForVertex: function (index) {
		return (index === this.step) ? "bolder" : "dim";
	},

	getStyleForEdge: function (index1, index2) {
		var a = this.step;
		var b = this.didBeginLap ? this.rewireIndexes[this.step] : ((this.step + this.lap + 1) % this.vertexCount);
		return ((index1 === a && index2 === b) || (index1 === b && index2 === a)) ? "bolder" : "dim";
	}

});


//====================================================================================
//
//	RingWithRewiringComplete
//

var RingWithRewiringComplete = this.RingWithRewiringComplete = new Class({

	Extends: Ring,
	
	addInitialEdges: function () {
		this.parent();
		
		this.canVaryP = (this.properties.p === undefined);
		this.p = this.properties.p || 0;
		
		if (this.canVaryP == false) {
			this.rewire();
		}
		else {
			this.stepCount = 100;
			this.defaultStep = 15;

			var initialEdgeSet = this.edgeSet;
			this.edgeSets = [];

			this.stepCount.times( function (step) {
				this.p = this.getPForStep(step);
				this.edgeSet = initialEdgeSet.clone();
				this.rewire();
				this.edgeSets.push(this.edgeSet);
			}, this);
			
			this.step = this.defaultStep;
			this.edgeSet = this.edgeSets[this.step];
			
			this.updateNote();
		}
	},
	
	rewire: function () {
		if (this.p === 0) { return; }
		var lapCount = this.neighborCount/2;
		lapCount.times( function (lap) {
			this.rewireLap(lap);
		}, this);
	},
	
	rewireLap: function (lap) {
		this.vertexCount.times(function (index1) {
			if (this.shouldRewire()) {
				var index2 = this.getRewiredVertexForVertex(index1);
				this.edgeSet.setEdge(index1, index1 + lap + 1, false);
				this.edgeSet.setEdge(index1, index2, true);
			}
		}, this);
	},

	shouldRewire: function () {
		return Math.random() < this.p;
	},
	
	getRewiredVertexForVertex: function (index1) {
		var index2;
		for (var i = 0; i < 1000; i++) {
			index2 = Math.floor(Math.random() * this.vertexCount);
			if (index1 !== index2 && !this.edgeSet.hasEdge(index1,index2)) { break; }
		}
		return index2;
	},
	

	getPForStep: function (step) {
		return step / this.stepCount;
	},
	
	getStep: function () { return this.step; },
	getDefaultStep: function () { return this.defaultStep; },
	getStepCount: function () { return this.stepCount; },
	
	setStep: function (step) {
		step = step.limit(0, this.stepCount - 1);
		if (step === this.step) { return; }
		this.step = step;
		
		this.edgeSet = this.edgeSets[step];
		this.draw();
		this.updateNote();
	},
	
	updateNote: function () {
		var id = this.properties.globalID;
		if (!id) { return; }
		var noteElement = document.id(id + "-note");
		if (!noteElement) { return; }

		var text = "" + this.getPForStep(this.step).round(2);
		if (text.length < 4) { text += ("0.00").substring(text.length, 4); }
		noteElement.set("text", "p=" + text);
	}

});



//====================================================================================
//
//	RingWithHops
//

var RingWithHops = this.RingWithHops = new Class({

	Extends: Ring,

	getStyleForVertex: function (index) {
		var neighborhoodRadius = 1;
		if (index === 0) { return "bolder"; }
		if (index >= this.vertexCount/2 - neighborhoodRadius && index <= this.vertexCount/2 + neighborhoodRadius) {
			return "bold";
		}
		return "dim";
	},

	getStyleForEdge: function (index1, index2) {
		for (var i = 0; i < this.vertexCount/2; i += 2) {
			if (index1 === i && index2 === i + 2) { return "bold"; }
		}
		return "dim";
	}

});



//====================================================================================
//
//	RingWithShortcut
//

var RingWithShortcut = this.RingWithShortcut = new Class({

	Extends: Ring,

	addInitialEdges: function () {
		this.parent();
		this.edgeSet.setEdge(0, 1, false);
		this.edgeSet.setEdge(0, this.vertexCount/2 - 1, true);
	},
	
	getStyleForVertex: function (index) {
		var neighborhoodRadius = 1;
		if (index === 0) { return "bolder"; }
		if (index >= this.vertexCount/2 - neighborhoodRadius && index <= this.vertexCount/2 + neighborhoodRadius) {
			return "bold";
		}
		return "dim";
	},

	getStyleForEdge: function (index1, index2) {
		if (index1 === 0 && index2 === this.vertexCount/2 - 1) { return "bold"; }
		return "dim";
	}

});



//====================================================================================
//
//	RingWithNeighbors
//

var RingWithNeighbors = this.RingWithNeighbors = new Class({

	Extends: Ring,

	addInitialEdges: function () {
		this.parent();
		this.centerIndex = Math.round(this.vertexCount * 3/4);
	},
	
	getStyleForVertex: function (index) {
		if (index === this.centerIndex) { return "bolder"; }
		return this.edgeSet.hasEdge(index, this.centerIndex) ? "bold" : "dim";
	},

	getStyleForEdge: function (index1, index2) {
		if (this.edgeSet.hasEdge(index1, this.centerIndex) && this.edgeSet.hasEdge(index2, this.centerIndex)) {
			return "bold";
		}
		return "dim";
	}

});



//====================================================================================
//
//	RingWithNeighborsAndShortcut
//

var RingWithNeighborsAndShortcut = this.RingWithNeighborsAndShortcut = new Class({

	Extends: Ring,

	addInitialEdges: function () {
		this.parent();
		this.centerIndex = Math.round(this.vertexCount * 3/4);
		this.edgeSet.setEdge(0, 1, false);
		this.edgeSet.setEdge(0, this.vertexCount/2 - 1, true);
	},
	
	getStyleForVertex: function (index) {
		if (index === this.centerIndex) { return "bolder"; }
		return this.edgeSet.hasEdge(index, this.centerIndex) ? "bold" : "dim";
	},

	getStyleForEdge: function (index1, index2) {
		if (index1 === 0 && index2 === this.vertexCount/2 - 1) {
			return "normal";
		}
		if (this.edgeSet.hasEdge(index1, this.centerIndex) && this.edgeSet.hasEdge(index2, this.centerIndex)) {
			return "bold";
		}
		return "dim";
	}
});




//====================================================================================
//
//	MetricsRing
//

var MetricsRing = this.MetricsRing = new Class({

	Extends: Ring,

	addInitialEdges: function () {
		MetricsRing.connections.each( function (connection, index1) {
			connection.each( function (index2) {
				this.edgeSet.setEdge(index1, index2, true);
			}, this);
		}, this);
	},
	
	getShortestPathBetweenVertices: function (index1, index2) {
		var low = Math.min(index1,index2);
		var high = Math.max(index1,index2);
		var path = MetricsRing.shortestPaths[low][high];
		if (!path) { path = [low,high]; }
		return path;
	},
	
	pathContainsEdge: function (path, index1, index2) {
		for (var i = 0; i < path.length - 1; i++) {
			if (index1 === path[i] && index2 === path[i+1] || index2 === path[i] && index1 === path[i+1]) { return true; }
		}
	}

});


//====================================================================================
//
//	MetricsRingWithPath
//

var MetricsRingWithPath = this.MetricsRingWithPath = new Class({

	Extends: MetricsRing,

	addInitialEdges: function () {
		this.parent();
		
		this.shortestPath = this.getShortestPathBetweenVertices(this.properties.pathFrom, this.properties.pathTo);
	},
	
	getStyleForVertex: function (index) {
		if (index === this.properties.pathTo || index == this.properties.pathFrom) { return "bold"; }
		return "dim";
	},

	getStyleForEdge: function (index1, index2) {
		if (this.pathContainsEdge(this.shortestPath, index1, index2)) { return "bold"; }
		return "dim";
	}

});


//====================================================================================
//
//	MetricsRingWithNeighbors
//

var MetricsRingWithNeighbors = this.MetricsRingWithNeighbors = new Class({

	Extends: MetricsRing,

	getStyleForVertex: function (index) {
		if (index === this.properties.neighborsOf) { return "bold"; }
		return "dim";
	},

	getStyleForEdge: function (index1, index2) {
		if (index1 === this.properties.neighborsOf || index2 === this.properties.neighborsOf) { return "bold"; }
		return "dim";
	}

});


//====================================================================================
//
//	MetricsRingWithClique
//

var MetricsRingWithClique = this.MetricsRingWithClique = new Class({

	Extends: MetricsRing,

	addInitialEdges: function () {
		this.parent();
		
		if (this.properties.removeNeighbors) {
			this.edgeSet.setEdge(2,6,false);
			this.edgeSet.setEdge(6,7,false);
		}
	},

	getStyleForVertex: function (index) {
		if (index === this.properties.neighborsOf) { return "bold"; }
		return "dim";
	},

	getStyleForEdge: function (index1, index2) {
		if (this.edgeSet.hasEdge(this.properties.neighborsOf, index1) &&
			  this.edgeSet.hasEdge(this.properties.neighborsOf, index2)) { return "bold"; }
		return "dim";
	}

});


//====================================================================================
//
//	MetricsRingWithStep
//

var MetricsRingWithStep = this.MetricsRingWithStep = new Class({

	Extends: MetricsRing,

	addInitialEdges: function () {
		this.parent();

		this.stepCount = this.vertexCount * (this.vertexCount - 1) / 2;
		this.step = null;
	},

	getStyleForVertex: function (index) {
		if (index === this.pathTo || index == this.pathFrom) { return "bold"; }
		return "dim";
	},

	getStyleForEdge: function (index1, index2) {
		if (this.shortestPath && this.pathContainsEdge(this.shortestPath, index1, index2)) { return "bold"; }
		return "dim";
	},

	getStep: function () { return this.step || 0; },
	getDefaultStep: function () { return null; },
	getStepCount: function () { return this.stepCount; },
	
	clearStep: function () {
		this.step = null;
		this.shortestPath = undefined;
		this.pathTo = undefined;
		this.pathFrom = undefined;
		this.draw();
	},
	
	setStep: function (step) {
		if (step === null) {
			this.clearStep();
			return;
		}
	
		step = step.limit(0, this.stepCount - 1);
		if (step === this.step) { return; }
		this.step = step;
		
		this.pathFrom = 0;
		while (step >= this.vertexCount - this.pathFrom - 1) {
			step -= this.vertexCount - this.pathFrom - 1;
			this.pathFrom++;
		}
		this.pathTo = this.pathFrom + step + 1;

		this.shortestPath = this.getShortestPathBetweenVertices(this.pathFrom, this.pathTo);
		this.draw();
	}
	
});


MetricsRing.connections = [
	[1,8],
	[11],
	[4,6,7,10,11],
	[2,4,5],
	[6,7,10],
	[8],
	[7,10],
	[9,10],
	[9],
	[11],
	[],
	[]
];

MetricsRing.shortestPaths = [
	[ 0, 0, [0,1,11,2], [0,8,5,3], [0,1,11,2,4], [0,8,5], [0,1,11,2,6], [0,8,9,7], 0, [0,8,9], [0,1,11,2,10], [0,1,11]	 ],
	[ 0, 0, [1,11,2], [1,11,2,3], [1,11,2,4], [1,0,8,5], [1,11,2,6], [1,11,9,7], [1,0,8], [1,11,9], [1,11,2,10], 0 ],
	[ 0, 0, 0, 0, 0, [2,3,5], 0, 0, [2,3,5,8], [2,11,9], 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, [3,4,6], [3,4,7], [3,5,8], [3,2,11,9], [3,4,10], [3,2,11]	],
	[ 0, 0, 0, 0, 0, [4,3,5], 0, 0, [4,3,5,8], [4,7,9], 0, [4,2,11] ],
	[ 0, 0, 0, 0, 0, 0, [5,3,4,6], [5,3,4,7], 0, [5,8,9], [5,3,4,10], [5,3,2,11] ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, [6,7,9,8], [6,7,9], 0, [6,2,11] ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, [7,9,8], 0, 0, [7,9,11] ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [8,9,7,10], [8,9,11] ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [9,7,10], 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [10,2,11] ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
];

})();

