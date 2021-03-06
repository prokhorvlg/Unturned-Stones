// Defines dimensions of SVG
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = window.innerWidth,
    height = window.innerHeight;

// Defines procedure for elements that intercept zoom/pan events
var d3Zoom = d3.zoom()
  .scaleExtent([0.2, 4])
  .translateExtent([[-3000 + width/2, -2000 + height/2], [3000 + width/2, 2000 + height/2]])
  .on("zoom", zoom);

// Function that moves the hovered node/card to the top
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// Appends SVG Canvas to document body
var svg = d3.select("#svgContainer").append("center").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3Zoom)
    .on("dblclick.zoom", null);

// Appends grey rectangle across entire canvas
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("id", "bg")
    .attr("class", "otherRects")
    .attr("class", "fullScreenSize")
    .attr("fill", "#111");

// Initialize arrays to store data regarding items to be generated on SVG

// XY Coordinates of all nodes
var xy = [];
// Name of all nodes
var starNames = [];
// Quote line of all nodes
var quoteDescs = [];
// Description text of all nodes
var descDescs = [];
// Color of all nodes
var colors = [];
// Icon filename for all nodes
var markers = [];

var popRs = [];

// First coordinate set for lines
var paths1 = [];
// First coordinate set for lines, not adjusted for centering on screen
var paths1Uncentered = [];
// Second coordinate set for lines
var paths2 = [];

// Dasharray of lines (dashed, solid, etc...)
var pathStrokes = [];
var pathWidths = [];
var pathColors = [];
var pathOpacitys = [];

// Coordinates for the top-left corner of the "overlay" foreground (the grid that looks like it's above everything)
var bgCoord = [[0 - (width*20.5/2),0 - (height*20.5/2)]];

var multiConst = 1;

var placeColors = { "homeColor": "#34D48F",
    "coreColor": "#34D48F",
    "colonialHomeColor": "#3D8FCE",
    "colonialColor": "#3D8FCE",
    "fringeColor": "#3D8FCE",
    "riftColor": "#c04deb",
    "deepColor": "#c04deb"
  };

// Parses CSV file with all node data, appends it to appropriate array
// Relies on Papa library
Papa.parse("places.csv", {
  download: true,
  step: function(row) {
    if (row.data[0][0] != "x" && row.data[0][0] != ""){
      if (row.data[0][0] == "path"){
        paths1.push([row.data[0][1], row.data[0][2]]);
        paths2.push([row.data[0][3], row.data[0][4]]);
        paths1Uncentered.push([row.data[0][1], row.data[0][2]]);
        pathStrokes.push(row.data[0][5]);
        pathWidths.push(row.data[0][6]);
        //console.log(row.data[0][7]);
        pathColors.push(placeColors[row.data[0][7].toString()].toString());
        //console.log(placeColors[row.data[0][7].toString()]);
        pathOpacitys.push(row.data[0][8]);
      }
      else if (row.data[0][0] == "star"){
        xy.push([parseInt(row.data[0][1]), parseInt(row.data[0][2])]);
        starNames.push(row.data[0][3]);
        quoteDescs.push(row.data[0][4]);
        descDescs.push(row.data[0][5]);
        colors.push(placeColors[row.data[0][6].toString()].toString());
        markers.push(row.data[0][7]);
        popRs.push(row.data[0][8]);
      }
    }

  },
  complete: function() {
    // Once parse is complete, run the function that draws the elements
    for (var i = 0; i < xy.length; i++){
      xy[i][0] = xy[i][0] * multiConst;
      xy[i][1] = xy[i][1] * multiConst;
    }
    for (var i = 0; i < paths1.length; i++){
      paths1[i][0] = paths1[i][0] * multiConst;
      paths1[i][1] = paths1[i][1] * multiConst;

      paths2[i][0] = paths2[i][0] * multiConst;
      paths2[i][1] = paths2[i][1] * multiConst;

      paths1Uncentered[i][0] = paths1Uncentered[i][0] * multiConst;
      paths1Uncentered[i][1] = paths1Uncentered[i][1] * multiConst;
    }
    makeMap();
  }
});

// Accepts array of coordinates of nodes, adjusts each value 50% of the height and width of the canvas to center them on the screen
function centerCoordinates(xy){
  for (var i = 0; i < xy.length; i++){
    xy[i][0] = xy[i][0] + width/2;
    xy[i][1] = xy[i][1] + height/2;
  }
  return xy;
}

// Accepts array of coordinates of nodes (the first coordinate for the lines), adjusts each value 50% of the height and width of the canvas to center them on the screen
function centerCoordinatesLine(paths1){
  var newPaths1 = paths1;
  for (var i = 0; i < paths1.length; i++){
    newPaths1[i][0] = parseInt(paths1[i][0]) + (width/2);
    newPaths1[i][1] = parseInt(paths1[i][1]) + height/2;
  }
  return newPaths1;
}

// When called, these return the next value in the appropriate array
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

var flatCircleColor = (function(){
  var a = -1;
  return function(){
    a++;
    return colors[a];
  }
})();

var popR = (function(){
  var a = -1;
  return function(){
    a++;
    return popRs[a];
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

var descDesc = (function(){
  var a = -1;
  return function(){
    a++;
    return descDescs[a];
  }
})();

var marker = (function(){
  var a = -1;
  return function(){
    a++;
    return "img/mapmarkers/" + markers[a] + ".svg";
  }
})();

var path2X = (function(){
  var a = -1;
  return function(){
    a++;
    return parseInt(paths2[a][0]) - parseInt(paths1Uncentered[a][0]);
  }
})();

var path2Y = (function(){
  var a = -1;
  return function(){
    a++;
    return parseInt(paths2[a][1]) - parseInt(paths1Uncentered[a][1]);
  }
})();

var pathStroke = (function(){
  var a = -1;
  return function(){
    a++;
    return pathStrokes[a];
  }
})();

var pathWidth = (function(){
  var a = -1;
  return function(){
    a++;
    return pathWidths[a];
  }
})();

var pathWidth2 = (function(){
  var a = -1;
  return function(){
    a++;
    return pathWidths[a];
  }
})();

var pathColor = (function(){
  var a = -1;
  return function(){
    a++;
    return pathColors[a];
  }
})();

var pathOpacity = (function(){
  var a = -1;
  return function(){
    a++;
    return pathOpacitys[a];
  }
})();

var lineElStrokes = {};

// Generate custom IDs for each element when called.
// Any given item in a group will have the same number as the other items associated with it
var mainID = (function(){var a = 0; return function(){return a++}})();
var gID = (function(){var a = 0; return function(){return "g_" + a++}})();
var gHoverID = (function(){var a = 0; return function(){return "gHover_" + a++}})();
var linegID = (function(){var a = 0; return function(){return "lineg_" + a++}})();
var lineID = (function(){var a = 0; return function(){return "line_" + a++}})();
var starID = (function(){var a = 0; return function(){return "star_" + a++}})();
var starDotID = (function(){var a = 0; return function(){return "starDot_" + a++}})();
var cardDarkID = (function(){var a = 0; return function(){return "cardDark_" + a++}})();
var cardID = (function(){var a = 0; return function(){return "card_" + a++}})();
var textID = (function(){var a = 0; return function(){return "text_" + a++}})();
var textQuoteID = (function(){var a = 0; return function(){return "textQuote_" + a++}})();
var textDescID = (function(){var a = 0; return function(){return "textDesc_" + a++}})();
var ringID = (function(){var a = 0; return function(){return "ring_" + a++}})();
var barID = (function(){var a = 0; return function(){return "bar_" + a++}})();

var cardTLID = (function(){var a = 0; return function(){return "cardTL_" + a++}})();
var cardTRID = (function(){var a = 0; return function(){return "cardTR_" + a++}})();
var cardBLID = (function(){var a = 0; return function(){return "cardBL_" + a++}})();
var cardBRID = (function(){var a = 0; return function(){return "cardBR_" + a++}})();

var listItem = (function(){var a = 0; return function(){return a++}})();

// Radius of invisible circle that intercepts hover event over nodes
var hitBoxRadius = 30;

// Width and height of color card
//After hover event
var widthOfCard = 240;
var heightOfCard = 310;
// Before hover event (when it is invisible)
var widthOfCardBefore = 50;
var heightOfCardBefore = 100;

// Radius of white circle that appears around the node after hover event
// After hover event 
var circleR = 14;
// Before hover event (while invisible)
var circleRBefore = 100;

// Width/height of center icon on a node
// After/Before hover event
var circleStarWidth = 23;
var circleStarWidthBefore = 10;
var circleStarHeight = circleStarWidth;
var circleStarHeightBefore = circleStarWidthBefore;

// Radius of colored circle that is always around a node
// After hover event
var circleRingR = 35;
// Before hover event
var circleRingRBefore = 8;

// Name of node text box
// Width
var widthTextModule = 350;
// Vertical offset before hover event
var verticalOffsetTextModule = 10;
// Vertical offset after hover event
var verticalOffsetTextModuleAfter = -130;
// Font size before hover event
var fontSizeBefore = "12px";
// Font size after hover event
var fontSizeAfter = "24px";

// Quote of node text box
// Width
var widthQuoteModule = widthOfCard;
// Vertical offset before hover event
var verticalOffsetQuoteModule = 10;
// Vertical offset after hover event
var verticalOffsetQuoteModuleAfter = -90;
// Font size
var fontSizeQuote = "14px";

// Description of node text box
// Width
var widthDescModule = widthOfCard -20;
// Vertical offset before hover event
var verticalOffsetDescModule = 10;
// Vertical offset after hover event
var verticalOffsetDescModuleAfter = 45;
// Font size
var fontSizeDesc = "12px";

// Function that draws the elements in the arrays after the parse is complete
function makeMap(){

  var gridScale = 50;

// Appends a defs element, and the pattern to be used on the "overlay" foreground
svg.append("defs")
    .append("pattern")
    .attr("id", "bgPattern")
    .attr('patternUnits', 'userSpaceOnUse')
    .attr("width", gridScale)
    .attr("height", gridScale)
    .append("image")
    .attr("xlink:href", "img/mapmarkers/gridTile.png")
    .attr("width", gridScale)
    .attr("height", gridScale);

  // Appends icons for each node's center
var bgStars = svg.selectAll("rect:not(#bg):not(#bgPatternRect)")
  .data([[0,0]])
    .enter().append("svg:image")
    .attr('pointer-events', 'none')
    //.attr('x', -409)
    //.attr('y', -1167)
    
    .attr('x', -339)
    .attr('y', -1067)
    .attr('width', 3600)
    .attr('height', 3600)
    
    /*.attr('x', 0)
    .attr('y', 0)
    .attr('width', 1920)
    .attr('height', 1080)*/
    .style("opacity", 0)
    .attr("class", "bgStars")
    //.attr("xlink:href", "img/mapmarkers/dark-nebula-29059-1920x1080.jpg")
    .attr("xlink:href", "img/mapmarkers/untsmap2.png")
    .attr("transform", transform(d3.zoomIdentity));

// Appends the "overlay" foreground element with the pattern defined previously
var bgNode = svg.selectAll("rect:not(#bg)")
  .data(bgCoord)
  .enter().append("rect")
      .attr("id", "bgPatternRect")
      .style("opacity", 0.2)
      .attr("width", width*20)
      .attr("height", height*20)
      .attr('x', 0)
      .attr('y', 0)
      .attr("class", "otherRects")
      .attr("fill", "url(#bgPattern)")
      .attr("transform", transform(d3.zoomIdentity));

/*

var zoomNode = svg.append("g")
  .attr("id", "zoomNode")
  .attr("pointer-events", "all")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "otherRects")
  .attr("class", "fullScreenSize")
  .call(d3Zoom);

*/

/*

  .call(d3.zoom()
    .scaleExtent([1, 4]) 
    .duration(500)
    .on("zoom", zoom));

*/

// .select("#zoomNode")

// Appends "g" (group) elements according to the data in the paths1 coordinate array
// These nodes will house everything related to lines on the map
// Class is "lineNode"
var lineNode = svg.selectAll("g:not(.groupNode):not(#zoomNode)")
  .data(centerCoordinatesLine(paths1), function(d) { return d.name; })
  .enter().append("g")
    .attr("class", "lineNode")
    .attr("pointer-events", "none")
    .attr("id", linegID)
    .attr("transform", transform(d3.zoomIdentity));

// Appends lines to all "lineNode" elements, starting from 0,0 (since they already originate at the appropriate coordinates) and ending at the second set of path coordinates
var line = svg.selectAll(".lineNode").append("line")
  .style("stroke", pathColor)
  .style("stroke-width", pathWidth)
  .style("stroke-linecap", "round")
  .style("stroke-dasharray", pathStroke)
  .style("opacity", pathOpacity)
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("id", lineID)
  .attr("class", "lineEl")
  //.attr("id", pathWidth2)
  .attr("x2", (path2X))
  .attr("y2", (path2Y));

// Appends "g" (group) elements according to the data in the xy coordinate array
// These nodes will house everything related to stars/points on map
// Class is "groupNode"
var groupNode = svg.selectAll("g:not(#zoomNode):not(.lineNode)")
  .data(centerCoordinates(xy), function(d) { return d.name; })
  .enter().append("g")
    .attr("class", "groupNode")
    .attr("pointer-events", "none")
    .attr("id", gID)
    .attr("transform", transform(d3.zoomIdentity));

// Appends "g" (group) elements according to the data in the xy coordinate array
// These nodes will house everything related to stars/points on map
// Class is "groupNode"
var groupNodeHover = svg.selectAll(".groupNode").append("g")
    .attr("class", "groupNodeHover")
    .attr("pointer-events", "none")
    .attr("id", gHoverID);
    //.attr("transform", transform(d3.zoomIdentity));

// Appends icons for each node's center
var starDot = svg.selectAll(".groupNode").append("svg:image")
  .attr('pointer-events', 'none')
  .attr('width', circleStarWidthBefore)
  .attr('height', circleStarHeightBefore)
  .attr("transform", "translate(" + (-circleStarWidthBefore / 2) + ", " + (-circleStarHeightBefore / 2) + ")")
  .style("opacity", 1)
  .attr("xlink:href", marker)
  .attr("class", "starCirclesDot")
  .attr("id", starDotID);

// Appends colored rings around node centers
var starRing = svg.selectAll(".groupNode").append("circle")
  .attr('pointer-events', 'none')
  .attr("r", circleRingRBefore)
  .style("opacity", 1)
  .style("stroke", ringColor)
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "starCirclesRing")
  .attr("id", ringID);

// Appends colored rings around node centers
var flatCircle = svg.selectAll(".groupNode").append("circle")
  .attr('pointer-events', 'none')
  .attr("r", popR)
  .style("opacity", 0.1)
  .style("fill", flatCircleColor)
  .attr("class", "flatCircle");

// Appends main name/title of nodes
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

// Appends invisible circles that intercept hover event
var hoverCircle = svg.selectAll(".groupNode").append("circle")
  .attr("r", hitBoxRadius)
  .attr("fill", "none")
  .attr("pointer-events", "all")
  .on("mouseover", handleMouseOverStar)
  .on("mouseout", handleMouseOutStar)
  .on("click", handleClick)
  .attr("id", mainID);
  //.call(d3Zoom);

d3.selectAll(".lineEl").each( function(d, i){
  lineElStrokes[this.id.substring(5)] = pathWidth2;
});

// Calls function that redraws canvas according to screen size
redraw();
// Calls that function whenever window is resized
window.addEventListener("resize", redraw);

d3Zoom.scaleBy(svg, 2);

}

/*function zoom() {
  g.attr("transform", d3.event.transform);
}*/

// Allows zooming over rectangle
function zoom() {
  var groupNode = svg.selectAll("g:not(.groupNodeHover)");
  groupNode.attr("transform", transform(d3.event.transform));

  var bgStars = svg.selectAll(".bgStars");
  bgStars.attr("transform", d3.event.transform);

  var bgPatternRect = svg.selectAll("#bgPatternRect");
  bgPatternRect.attr("transform", transformNSGrid(d3.event.transform));

  var line = svg.selectAll(".lineNode");
  line.attr("transform", transformNS(d3.event.transform));

  var lineEl = svg.selectAll(".lineEl");
  //[lineEl..substring(5)]
  lineEl.style("stroke-width", 2/d3.event.transform.k);

  /*d3.selectAll(".lineEl").each( function(d, i){
    d3.select(this).style("stroke-width", lineElStrokes[this.id]/d3.event.transform.k);
  });*/
}

// Allows panning across rectangle
function transform(t) {
  return function(d) {
    //console.log(d)
    return "translate(" + t.apply(d) + ")";

    // Equivalent code, splitting X and Y amount
    //return "translate(" + t.applyX(d[0]) + ", " + t.applyY(d[1]) + ")";
  };
}

function transformNS(t) {
  return function(d) {
    return "translate(" + t.applyX(d[0]) + ", " + t.applyY(d[1]) + ") scale(" + d3.event.transform.k + ")";
  };
}

function transformBG(t) {
  return function(d) {
    return "translate(" + t.applyX(d[0]) + ", " + t.applyY(d[1]) + ") scale(" + d3.event.transform.k + ")";
  };
}

function transformNSGrid(t) {
  return function(d) {
    //var bgPatternRect = svg.selectAll("#bgPatternRect");
    //bgPatternRect.attr("x", -d3.event.transform.k*1920/t.applyX(d[0]));
    //bgPatternRect.attr("y", -d3.event.transform.k*1080/t.applyY(d[1]));

    return "translate(" + (0.8 * t.applyX(d[0])) + ", " + (0.8 * t.applyY(d[1])) + ") scale(" + d3.event.transform.k + ")";
  };
}

function transformBGTrue(t) {
  return function(d) {
    //console.log(d[0])
    var bgStars = svg.selectAll(".bgStars"); 
    bgStars.attr("x", -d3.event.transform.k*1920/t.applyX(d[0]));
    bgStars.attr("y", -d3.event.transform.k*1080/t.applyY(d[1]));

    return "translate(" + (0.1 * t.applyX(d[0])) + ", " + (0.1 * t.applyY(d[1])) + ") scale(" + d3.event.transform.k + ")";
  };
}

// Handles MouseOver event for stars
function handleMouseOverStar(d, i) {

  d3.select("#g_" + this.id).moveToFront();

  // Appends a dark background rectangle to "groupNode" element, to block out the background in the card area when hovering
d3.select("#gHover_" + this.id).append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", widthOfCardBefore)
  .attr("height", heightOfCardBefore)
  .style("fill", "rgba(0,0,0,1)")
  //.attr("class", "cardRectangleDark")
  .attr("class", "cardComponents" + this.id)
  .attr("id", "cardDark_" + this.id)
  .attr("transform", "translate(" + (-widthOfCardBefore / 2) + ", " + (-heightOfCardBefore / 2) + ")");

// Appends a colored background rectangle to "groupNode" element
d3.select("#gHover_" + this.id).append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", widthOfCardBefore)
  .attr("height", heightOfCardBefore)
  .style("fill", colors[this.id])
  //.attr("class", "cardRectangle")
  .attr("class", "cardComponents" + this.id)
  .attr("id", "card_" + this.id)
  .attr("transform", "translate(" + (-widthOfCardBefore / 2) + ", " + (-heightOfCardBefore / 2) + ")");

// Appends corner pieces for rectangles
d3.select("#gHover_" + this.id).append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", "50px")
  .attr("height", "50px")
  .style("stroke", "#fff")
  .style("stroke-dasharray", "50,50,00")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "cardRectangleBorder")
  .attr("class", "cardComponents" + this.id)
  .attr("id", "cardTL_" + this.id)
  .attr("transform", "translate(" + ((-widthOfCardBefore / 2) -10) + ", " + ((-heightOfCardBefore / 2) -10) + ")");

d3.select("#gHover_" + this.id).append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", "50px")
  .attr("height", "50px")
  .style("stroke", "#fff")
  .style("stroke-dasharray", "50,0,50")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "cardRectangleBorder")
  .attr("class", "cardComponents" + this.id)
  .attr("id", "cardTR_" + this.id)
  .attr("transform", "translate(" + ((+widthOfCardBefore / 2) +10) + ", " + ((-heightOfCardBefore / 2) -10) + ")");

d3.select("#gHover_" + this.id).append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", "50px")
  .attr("height", "50px")
  .style("stroke", "#fff")
  .style("stroke-dasharray", "0,100,00")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "cardRectangleBorder")
  .attr("class", "cardComponents" + this.id)
  .attr("id", "cardBL_" + this.id)
  .attr("transform", "translate(" + ((-widthOfCardBefore / 2) -10) + ", " + ((+heightOfCardBefore / 2) +10) + ")");

d3.select("#gHover_" + this.id).append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", "50px")
  .attr("height", "50px")
  .style("stroke", "#fff")
  .style("stroke-dasharray", "00,50,50")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "cardRectangleBorder")
  .attr("class", "cardComponents" + this.id)
  .attr("id", "cardBR_" + this.id)
  .attr("transform", "translate(" + ((+widthOfCardBefore / 2) +10) + ", " + ((+heightOfCardBefore / 2) +10) + ")");



// Appends quote text to card, visible after hover
d3.select("#gHover_" + this.id).append("foreignObject")
  .attr('pointer-events', 'none')
  .style("opacity", 0)
  .style("color", colors[this.id])
  .attr("width", widthQuoteModule)
  .attr("height", "100px")
  .style("font-size", fontSizeQuote)
  .style("font-family", "'Roboto Condensed', Arial, sans-serif")
  .style("font-style", "italic")
  .attr("class", "cardComponents" + this.id)
  .html(quoteDescs[this.id])
  .attr("id", "textQuote_" + this.id)
  .attr("transform", "translate(" + ((-widthQuoteModule / 2)) + ", " + (verticalOffsetQuoteModule) + ")");

// Appends description text to card, visible after hover
d3.select("#gHover_" + this.id).append("foreignObject")
  .attr('pointer-events', 'none')
  .style("opacity", 0)
  .style("color", "#fff")
  .style("text-align", "center")
  .style("text-align-last", "center")
  .attr("width", widthDescModule)
  .attr("height", "500px")
  .style("font-size", fontSizeDesc)
  .attr("class", "cardComponents" + this.id)
  .html(descDescs[this.id])
  .attr("id", "textDesc_" + this.id)
  .attr("transform", "translate(" + ((-widthDescModule / 2)) + ", " + (verticalOffsetDescModule) + ")");

// Appends horizontal line to card under title, visible after hover
d3.select("#gHover_" + this.id).append("rect")
  .attr('pointer-events', 'none')
  .style("opacity", "0")
  .attr("width", widthOfCardBefore - 10)
  .attr("height", 2)
  .attr("fill", "#fff")
  .attr("class", "horizontalBar")
  .attr("class", "cardComponents" + this.id)
  .attr("id", "bar_" + this.id)
  .attr("transform", "translate(" + ((-widthOfCardBefore / 2) + 5) + ", " + ((-heightOfCardBefore / 2) + 5) + ")");

// Appends white circle that appears around node center on hover
d3.select("#gHover_" + this.id).append("circle")
  .attr('pointer-events', 'none')
  .attr("r", circleRBefore)
  .style("opacity", 0)
  .style("stroke", "#fff")
  .style("stroke-width", "2")
  .style("fill", "none")
  .attr("class", "starCircles")
  .attr("class", "cardComponents" + this.id)
  .attr("id", "star_" + this.id);

  d3.select("#star_" + this.id).transition()
    .duration(200)
    .style("opacity", 1)
    .attr("r", circleR);

  d3.select("#starDot_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .attr("transform", "translate(" + (-circleStarWidth / 2) + ", " + (-circleStarHeight / 2) + ")")
    .attr("width", circleStarWidth)
    .attr("height", circleStarHeight);

  d3.select("#ring_" + this.id).transition()
    .duration(200)
    .style("opacity", 0.2)
    .attr("r", circleRingR);

  d3.select("#cardDark_" + this.id).transition()
    .duration(300)
    .ease(d3.easeExp)
    .style("opacity", "0.8")
    .attr("transform", "translate(" + (-widthOfCard / 2) + ", " + (-heightOfCard / 2) + ")")
    .attr("width", widthOfCard)
    .attr("height", heightOfCard);

  d3.select("#card_" + this.id).transition()
    .duration(300)
    .ease(d3.easeExp)
    .style("opacity", "0.2")
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

  d3.select("#textDesc_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", 1)
    .attr("transform", "translate(" + ((-widthDescModule / 2)) + ", " + (verticalOffsetDescModuleAfter) + ")");

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
    .ease(d3.easeExp)
    .attr("transform", "translate(" + (-circleStarWidthBefore / 2) + ", " + (-circleStarHeightBefore / 2) + ")")
    .attr("width", circleStarWidthBefore)
    .attr("height", circleStarHeightBefore);

    d3.select("#ring_" + this.id).transition()
    .duration(200)
    .style("opacity", 1)
    .attr("r", circleRingRBefore);

  d3.select("#cardDark_" + this.id).transition()
    .duration(300)
    .style("opacity", "0")
    .attr("transform", "translate(" + (-widthOfCardBefore / 2) + ", " + (-heightOfCardBefore / 2) + ")")
    .attr("width", widthOfCardBefore)
    .attr("height", heightOfCardBefore)
    .remove();

  d3.select("#card_" + this.id).transition()
    .duration(300)
    .style("opacity", "0")
    .attr("transform", "translate(" + (-widthOfCardBefore / 2) + ", " + (-heightOfCardBefore / 2) + ")")
    .attr("width", widthOfCardBefore)
    .attr("height", heightOfCardBefore)
    .remove();

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

  d3.select("#textDesc_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", 0)
    .attr("transform", "translate(" + ((-widthDescModule / 2)) + ", " + (verticalOffsetDescModule) + ")");

  d3.select("#bar_" + this.id).transition()
    .duration(200)
    .ease(d3.easeExp)
    .style("opacity", "0")
    .attr("width", widthOfCardBefore - 10)
    .attr("transform", "translate(" + ((-widthOfCardBefore / 2) + 5) + ", " + ((-heightOfCardBefore / 2) + 5) + ")");

    svg.selectAll(".cardComponents" + this.id).transition(1).remove();

}

function handleClick(d, i) {

  d3Zoom.translateTo(svg, xy[this.id][0], xy[this.id][1]);

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

//groupNode.attr("transform", "translate(" + (-width / 2) + ", " + (-height / 2) + ")")