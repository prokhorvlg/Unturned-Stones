var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = window.innerWidth,
    height = window.innerHeight;

var svg = d3.select("body").append("center").append("svg")
    .attr("width", width)
    .attr("height", height);

// Background
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "otherRects")
    .attr("class", "fullScreenSize")
    .attr("fill", "#151515");

// Base coordinates of all 
var xy = [[0, 0], [233, 175], [146, 43]];
var starNames = ["America", "Yazhou", "Liberty"];
var starDesc = ["The pristine home of the Federation",
   "The cyberpunk megalopolis of the Conglomerate", 
   "This gun is not authorized to fire at the user//"];

var colors = ["#4cace8",
   "#fff", 
   "#984deb"];

var cardColor = (function(){
  var a = -1;
  return function(){
    a++;
    return colors[a];
  }
})();

var ringColor = (function(){
  var a = -1;
  return function(){
    a++;
    return colors[a];
  }
})();

// ID Generators
var mainID = (function(){var a = 0; return function(){return a++}})();
var starID = (function(){var a = 0; return function(){return "star_" + a++}})();
var starDotID = (function(){var a = 0; return function(){return "starDot_" + a++}})();
var cardID = (function(){var a = 0; return function(){return "card_" + a++}})();
var textID = (function(){var a = 0; return function(){return "text_" + a++}})();
var markerID = (function(){var a = 0; return function(){return "marker_" + a++}})();

var ringID = (function(){var a = 0; return function(){return "ring_" + a++}})();

var cardTLID = (function(){var a = 0; return function(){return "cardTL_" + a++}})();
var cardTRID = (function(){var a = 0; return function(){return "cardTR_" + a++}})();
var cardBLID = (function(){var a = 0; return function(){return "cardBL_" + a++}})();
var cardBRID = (function(){var a = 0; return function(){return "cardBR_" + a++}})();

// Generates an increment to pull the next item from the array.
var listItem = (function(){var a = 0; return function(){return a++}})();

// Radius of invisible circle that intercepts hover event over stars
var hitBoxRadius = 30;

var widthOfCard = 200;
var heightOfCard = 300;

var widthOfCardBefore = 50;
var heightOfCardBefore = 100;

var circleR = 14;
var circleRBefore = 100;

var circleStarR = 10;
var circleStarRBefore = 5;

var circleRingR = 35;
var circleRingRBefore = 8;

// Invisible Rectangle that intercepts Zoom/pan events across entire screen
svg.append("rect")
  .attr("fill", "none")
  .attr("pointer-events", "all")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "otherRects")
  .attr("class", "fullScreenSize")
  .call(d3.zoom()
      .scaleExtent([1, 4])
      .on("zoom", zoom));

var groupNode = svg.selectAll("g")
  .data(xy)
  .enter().append("g")
    .attr("class", "groupNode")
    .attr("pointer-events", "none")
    .attr("transform", transform(d3.zoomIdentity));

var cardRectangle = svg.selectAll(".groupNode").append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", widthOfCardBefore)
  .attr("height", heightOfCardBefore)
  /*.style("stroke", "#fff")
  .style("stroke-width", "2")*/
  .style("fill", cardColor)
  .attr("class", "cardRectangle")
  .attr("id", cardID)
  .attr("transform", "translate(" + (-widthOfCardBefore / 2) + ", " + (-heightOfCardBefore / 2) + ")");

var cardRectangleTopLeft = svg.selectAll(".groupNode").append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", "50px")
  .attr("height", "50px")
  .style("stroke", "#fff")
  .style("stroke-dasharray", "50,50,00")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "cardRectangleBorder")
  .attr("id", cardTLID)
  .attr("transform", "translate(" + ((-widthOfCardBefore / 2) -10) + ", " + ((-heightOfCardBefore / 2) -10) + ")");

var cardRectangleTopRight = svg.selectAll(".groupNode").append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", "50px")
  .attr("height", "50px")
  .style("stroke", "#fff")
  .style("stroke-dasharray", "50,0,50")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "cardRectangleBorder")
  .attr("id", cardTRID)
  .attr("transform", "translate(" + ((+widthOfCardBefore / 2) +10) + ", " + ((-heightOfCardBefore / 2) -10) + ")");

var cardRectangleBottomLeft = svg.selectAll(".groupNode").append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", "50px")
  .attr("height", "50px")
  .style("stroke", "#fff")
  .style("stroke-dasharray", "0,100,00")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "cardRectangleBorder")
  .attr("id", cardBLID)
  .attr("transform", "translate(" + ((-widthOfCardBefore / 2) -10) + ", " + ((+heightOfCardBefore / 2) +10) + ")");

var cardRectangleBottomRight = svg.selectAll(".groupNode").append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", "50px")
  .attr("height", "50px")
  .style("stroke", "#fff")
  .style("stroke-dasharray", "00,50,50")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "cardRectangleBorder")
  .attr("id", cardBRID)
  .attr("transform", "translate(" + ((+widthOfCardBefore / 2) +10) + ", " + ((+heightOfCardBefore / 2) +10) + ")");

//.style("stroke-dasharray", "50,0,50")

// Circles generated for star visual

var starDot = svg.selectAll(".groupNode").append("circle")
  .attr('pointer-events', 'none')
  .attr("r", circleStarRBefore)
  .style("opacity", 1)
  .style("fill", "#fff")
  .attr("class", "starCirclesDot")
  .attr("id", starDotID);

var starCircle = svg.selectAll(".groupNode").append("circle")
  .attr('pointer-events', 'none')
  .attr("r", circleRBefore)
  .style("opacity", 0)
  .style("stroke", "#fff")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "starCircles")
  .attr("id", starID);

var starRing = svg.selectAll(".groupNode").append("circle")
  .attr('pointer-events', 'none')
  .attr("r", circleRingRBefore)
  .style("opacity", 1)
  .style("stroke", ringColor)
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "starCirclesRing")
  .attr("id", ringID);

/*var textCard = svg.selectAll(".groupNode").append("div")
  .attr('pointer-events', 'none')
  .style("opacity", 1)
  .style("background", "white")
  .style("width", "100px")
  .style("height", "100px")
  .html("FIRST LINE <br> SECOND LINE")
  .attr("id", textID);*/

// Invisible circles generated to intercept hover event
var hoverCircle = svg.selectAll(".groupNode").append("circle")
  .attr("r", hitBoxRadius)
  .attr("fill", "none")
  .attr("pointer-events", "all")
  .on("mouseover", handleMouseOverStar)
  .on("mouseout", handleMouseOutStar)
  .attr("id", mainID);

/*

var starMarker = svg.selectAll(".groupNode").append("svg:image")
  .attr('pointer-events', 'none')
  .attr("class", "starMarkers")
  .attr('width', 50)
  .attr('height', 50)
  .attr("xlink:href","img/mapmarkers/star0.png")
  .attr("transform", "translate(" + (-50 / 2) + ", " + (-50 / 2) + ")")
  .attr("id", markerID);

*/

// Allows zooming over rectangle
function zoom() {
  groupNode.attr("transform", transform(d3.event.transform));

  //cardRectangle.data(recalculateCard(d3.event.transform.k));

  // non-semantic zoom code
  // cardRectangle.attr("transform", 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
}

// Allows panning across rectangle
function transform(t) {
  return function(d) {
    return "translate(" + t.apply(d) + ")";
  };
}

// Handles MouseOver event for stars
function handleMouseOverStar(d, i) {

  d3.select("#star_" + this.id).transition()
    .duration(200)
    .style("opacity", 1)
    .attr("r", circleR);

  d3.select("#starDot_" + this.id).transition()
    .duration(200)
    .attr("r", circleStarR);

  d3.select("#ring_" + this.id).transition()
    .duration(200)
    .attr("r", circleRingR);

  d3.select("#card_" + this.id).transition()
    .duration(300)
    .ease(d3.easeExp)
    .style("opacity", "0.1")
    .attr("transform", "translate(" + (-widthOfCard / 2) + ", " + (-heightOfCard / 2) + ")")
    .attr("width", widthOfCard)
    .attr("height", heightOfCard);

  d3.select("#cardTL_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "1")
    .attr("transform", "translate(" + ((-widthOfCard / 2) -10) + ", " + ((-heightOfCard / 2) -10) + ")");

  d3.select("#cardTR_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "1")
    .attr("transform", "translate(" + ((+widthOfCard / 2) -40) + ", " + ((-heightOfCard / 2) -10) + ")");

  d3.select("#cardBL_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "1")
    .attr("transform", "translate(" + ((-widthOfCard / 2) -10) + ", " + ((+heightOfCard / 2) -40) + ")");

  d3.select("#cardBR_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "1")
    .attr("transform", "translate(" + ((+widthOfCard / 2) -40) + ", " + ((+heightOfCard / 2) -40) + ")");

  /*svg.append("text")
    .attr("id", "t_" + d.id),
    .attr("": function() { return xScale(d.x) - 30; }),
    .attr(y: function() { return yScale(d.y) - 15; })
    })
    .text(function() {
      return [d.x, d.y];  // Value of the text
    });*/
}

// Handles MouseOut event for stars
function handleMouseOutStar(d, i) {
  d3.select("#star_" + this.id).transition()
    .duration(200)
    .style("opacity", 0)
    .attr("r", circleRBefore);

  d3.select("#starDot_" + this.id).transition()
    .duration(200)
    .attr("r", circleStarRBefore);

    d3.select("#ring_" + this.id).transition()
    .duration(200)
    .attr("r", circleRingRBefore);

  d3.select("#card_" + this.id).transition()
    .duration(300)
    .style("opacity", "0")
    .attr("transform", "translate(" + (-widthOfCardBefore / 2) + ", " + (-heightOfCardBefore / 2) + ")")
    .attr("width", widthOfCardBefore)
    .attr("height", heightOfCardBefore);

  d3.select("#cardTL_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "0")
    .attr("transform", "translate(" + ((-widthOfCardBefore / 2) -10) + ", " + ((-heightOfCardBefore / 2) -10) + ")");

  d3.select("#cardTR_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "0")
    .attr("transform", "translate(" + ((+widthOfCardBefore / 2) -40) + ", " + ((-heightOfCardBefore / 2) -10) + ")");

  d3.select("#cardBL_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "0")
    .attr("transform", "translate(" + ((-widthOfCardBefore / 2) -10) + ", " + ((+heightOfCardBefore / 2) -40) + ")");

  d3.select("#cardBR_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "0")
    .attr("transform", "translate(" + ((+widthOfCardBefore / 2) -40) + ", " + ((+heightOfCardBefore / 2) -40) + ")");
}

function redraw(){

  // Extract the width and height that was computed by CSS.
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Use the extracted size to set the size of an SVG element.
  svg
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

  d3.selectAll(".fullScreenSize")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);
}

redraw();

window.addEventListener("resize", redraw);

//groupNode.attr("transform", "translate(" + (-width / 2) + ", " + (-height / 2) + ")");