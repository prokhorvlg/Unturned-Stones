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
var xy = [[0, 0], [116, 72], [-73, 41], [300, 72]];

var starNames = ["America", 
    "Yazhou", 
    "Liberty",
    "Qian Xuesen",
    "PLACEHOLDER",
    "PLACEHOLDER",
    "PLACEHOLDER",
    "PLACEHOLDER",
    "PLACEHOLDER",
    "PLACEHOLDER",
    "PLACEHOLDER",
    "PLACEHOLDER",
    "PLACEHOLDER"];

var quoteDescs = ["They were once a proud people.<br>They were brave and free.",
   "The cyberpunk megalopolis of the Conglomerate", 
   "This gun is not authorized to fire at the user"];

var colors = ["#d32823",
   "#4cace8", 
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

var quoteColor = (function(){
  var a = -1;
  return function(){
    a++;
    return colors[a];
  }
})();

var starName = (function(){
  var a = -1;
  return function(){
    a++;
    return starNames[a];
  }
})();

var quoteDesc = (function(){
  var a = -1;
  return function(){
    a++;
    return quoteDescs[a];
  }
})();

// ID Generators
var mainID = (function(){var a = 0; return function(){return a++}})();
var starID = (function(){var a = 0; return function(){return "star_" + a++}})();
var starDotID = (function(){var a = 0; return function(){return "starDot_" + a++}})();
var cardID = (function(){var a = 0; return function(){return "card_" + a++}})();
var textID = (function(){var a = 0; return function(){return "text_" + a++}})();
var textQuoteID = (function(){var a = 0; return function(){return "textQuote_" + a++}})();

var markerID = (function(){var a = 0; return function(){return "marker_" + a++}})();

var ringID = (function(){var a = 0; return function(){return "ring_" + a++}})();
var barID = (function(){var a = 0; return function(){return "bar_" + a++}})();

var cardTLID = (function(){var a = 0; return function(){return "cardTL_" + a++}})();
var cardTRID = (function(){var a = 0; return function(){return "cardTR_" + a++}})();
var cardBLID = (function(){var a = 0; return function(){return "cardBL_" + a++}})();
var cardBRID = (function(){var a = 0; return function(){return "cardBR_" + a++}})();

textQuoteID

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

var widthTextModule = 300;
var verticalOffsetTextModule = 10;
var verticalOffsetTextModuleAfter = -130;

var fontSizeBefore = "16px";
var fontSizeAfter = "24px";

var widthQuoteModule = widthOfCard;
var verticalOffsetQuoteModule = 10;
var verticalOffsetQuoteModuleAfter = -90;

var fontSizeQuote = "14px";

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

var textCard = svg.selectAll(".groupNode").append("foreignObject")
  .attr('pointer-events', 'none')
  .style("opacity", 1)
  .style("color", "#fff")
  .attr("width", widthTextModule)
  .attr("height", "100px")
  .style("font-size", fontSizeBefore)
  .html(starName)
  .attr("id", textID)
  .attr("transform", "translate(" + ((-widthTextModule / 2)) + ", " + (verticalOffsetTextModule) + ")");

var quoteCard = svg.selectAll(".groupNode").append("foreignObject")
  .attr('pointer-events', 'none')
  .style("opacity", 0)
  .style("color", quoteColor)
  .attr("width", widthQuoteModule)
  .attr("height", "100px")
  .style("font-size", fontSizeQuote)
  .style("font-family", "'Roboto Condensed', Arial, sans-serif")
  .style("font-style", "italic")
  .html(quoteDesc)
  .attr("id", textQuoteID)
  .attr("transform", "translate(" + ((-widthQuoteModule / 2)) + ", " + (verticalOffsetQuoteModule) + ")");

var horizontalBar = svg.selectAll(".groupNode").append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", widthOfCardBefore - 10)
  .attr("height", 2)
  .attr("fill", "#fff")
  .attr("class", "horizontalBar")
  .attr("id", barID)
  .attr("transform", "translate(" + ((-widthOfCardBefore / 2) + 5) + ", " + ((-heightOfCardBefore / 2) + 5) + ")");

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
    .style("opacity", 0.2)
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

  d3.select("#text_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("font-size", fontSizeAfter)
    .attr("transform", "translate(" + ((-widthTextModule / 2)) + ", " + (verticalOffsetTextModuleAfter) + ")");

  d3.select("#textQuote_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", 1)
    .attr("transform", "translate(" + ((-widthQuoteModule / 2)) + ", " + (verticalOffsetQuoteModuleAfter) + ")");

  d3.select("#bar_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "1")
    .attr("width", widthOfCard - 50)
    .attr("transform", "translate(" + ((-widthOfCard / 2) + 25) + ", " + (verticalOffsetTextModuleAfter + 35) + ")");
    
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
    .style("opacity", 1)
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

  d3.select("#text_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("font-size", fontSizeBefore)
    .attr("transform", "translate(" + ((-widthTextModule / 2)) + ", " + (verticalOffsetTextModule) + ")");

  d3.select("#textQuote_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", 0)
    .attr("transform", "translate(" + ((-widthQuoteModule / 2)) + ", " + (verticalOffsetQuoteModule) + ")");

  d3.select("#bar_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "0")
    .attr("width", widthOfCardBefore - 10)
    .attr("transform", "translate(" + ((-widthOfCardBefore / 2) + 5) + ", " + ((-heightOfCardBefore / 2) + 5) + ")");

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