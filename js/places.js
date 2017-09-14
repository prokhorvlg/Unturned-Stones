var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = window.innerWidth,
    height = window.innerHeight;

    // parse the date / time
    /*var parseTime = d3.timeParse("%d-%b-%y");*/

    // set the ranges
    /*var x = d3.scaleLinear().range([height / 2, width]);
    var y = d3.scaleLinear().range([height, width / 2]);*/

    // define the line
    /*var valueline = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });*/

        // append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)/*
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")*/;

          // Get the data
//d3.csv("places.csv", function(data) {

//console.log(data);

  // format the data
  /*
  data.forEach(function(d) {
      d.x = +d.x;
      d.y = +d.y;
  });*/

  // Background
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("class", "otherRects")
      .attr("fill", "#151515");

  // Add the valueline path.
  /*svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);*/

      // Add the valueline path.
/*svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);*/

// Add the scatterplot
/*svg.selectAll("dot")
    .data(data)
  .enter().append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return x(d.x); })
    .attr("cy", function(d) { return y(d.y); });*/

// Add the X Axis
/*
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));*/

// Add the Y Axis
/*
svg.append("g")
    .call(d3.axisLeft(y));*/

/*var svg = d3.select("body").append("svg").attr({
    width: w,
    height: h
  });*/

/*var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");*/

svg.append("rect")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "otherRects")
    .call(d3.zoom()
        .scaleExtent([1, 4])
        .on("zoom", zoom));

var i, z = 0;

var xy = [[0, 0], [233, 175], [146, 43]];
var text = ["test1", "test2", "test3"];
var starID = (function(){var a = 0; return function(){return a++}})();
var cardID = (function(){var b = 0; return function(){return "card_" + b++}})();

/*var circle = svg.selectAll("circle")
  //.data(d3.range(1).map(function() { return [width / 2, height / 2]; }))
  //.data(data)
  .enter().append("circle")
    .attr("cx", function(d, i) {
      for(i = 0; i<3; i++) {
        return x[i];
      }
    })
    .attr("cy", function(d, z) {
      for(z = 0; z<3; z++) {
        return y[z];
      }
    })
    .attr("r", "4")
    .style("stroke", "#fff")
    .style("stroke-width", "2")
    .style("fill", "#151515")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .attr("id", function(d){
      return d.id; //<-- Sets the ID of this county to the path
    })
    .attr("transform", transform(d3.zoomIdentity));*/

var card = svg.selectAll("rect:not(.otherRects)")
  .data(xy)
  .enter().append("rect")
    .attr("width", 50)
    .attr("height", 50)
    .style("stroke", "#fff")
    .style("stroke-width", "2")
    .style("fill", "none")
    .attr("id", cardID)
    .attr("transform", transform(d3.zoomIdentity));

var circle = svg.selectAll("circle")
  .data(xy)
  .enter().append("circle")
    .attr("r", "8")
    .style("stroke", "#fff")
    .style("stroke-width", "2")
    .style("fill", "#151515")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .attr("id", starID)
    .attr("transform", transform(d3.zoomIdentity));

// Allows zooming over rectangle
function zoom() {
  circle.attr("transform", transform(d3.event.transform));
  card.attr("transform", transform(d3.event.transform));
}

// Allows panning across rectangle
function transform(t) {
  return function(d) {
    return "translate(" + t.apply(d) + ")";
  };
}

// Handles MouseOver event for stars
function handleMouseOver(d, i) {
  d3.select(this).transition()
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
  d3.select(this).transition()
    .duration(100)
    .attr("r", "8");

  d3.select("#card_" + this.id).transition()
    .duration(100)
    .attr("width", "40");
}

//});

