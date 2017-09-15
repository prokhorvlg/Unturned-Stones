var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = window.innerWidth,
    height = window.innerHeight;

var svg = d3.select("body").append("svg")
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
var text = ["test1", "test2", "test3"];

// ID Generators
var mainID = (function(){var a = 0; return function(){return a++}})();
var starID = (function(){var b = 0; return function(){return "star_" + b++}})();
var cardID = (function(){var c = 0; return function(){return "card_" + c++}})();

// Radius of invisible circle that intercepts hover event over stars
var hitBoxRadius = 15;

// Rectangles generated around individual stars
var cardRectangle = svg.selectAll("rect:not(.otherRects):not(.fullScreenSize)")
  .data(xy)
  .enter().append("rect")
    .attr("width", 50)
    .attr("height", 50)
    .style("stroke", "#fff")
    .style("stroke-width", "2")
    .style("fill", "none")
    .attr("class", "cardRectangle")
    .attr("id", cardID)
    .attr("transform", transform(d3.zoomIdentity));

// Circles generated for star visual
var starCircle = svg.selectAll("circle")
  .data(xy)
  .enter().append("circle")
    .attr("r", "8")
    .style("stroke", "#fff")
    .style("stroke-width", "2")
    .style("fill", "#151515")
    .attr("class", "starCircles")
    .attr("id", starID)
    .attr("transform", transform(d3.zoomIdentity));

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

// Invisible circles generated to intercept hover event
var hoverCircle = svg.selectAll("circle:not(.starCircles)")
  .data(xy)
  .enter().append("circle")
    .attr("r", hitBoxRadius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .attr("id", mainID)
    .attr("transform", transform(d3.zoomIdentity));

// Allows zooming over rectangle
function zoom() {
  cardRectangle.attr("transform", transform(d3.event.transform));
  starCircle.attr("transform", transform(d3.event.transform));
  hoverCircle.attr("transform", transform(d3.event.transform));
}

// Allows panning across rectangle
function transform(t) {
  return function(d) {
    return "translate(" + t.apply(d) + ")";
  };
}

// Handles MouseOver event for stars
function handleMouseOver(d, i) {
  /*d3.select(this).transition()
    .duration(100)
    .attr("r", "20");*/

  d3.select("#star_" + this.id).transition()
    .duration(100)
    .attr("r", "20");

  d3.select("#card_" + this.id).transition()
    .duration(100)
    .attr("width", "90");

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
function handleMouseOut(d, i) {
  d3.select("#star_" + this.id).transition()
    .duration(100)
    .attr("r", "8");

  d3.select("#card_" + this.id).transition()
    .duration(100)
    .attr("width", "50");
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