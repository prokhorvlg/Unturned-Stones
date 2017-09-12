var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var randomX = d3.randomNormal(width / 2, 80),
    randomY = d3.randomNormal(height / 2, 80),
    data = d3.range(90).map(function() { return [randomX(), randomY()]; });

var data2 = d3.range(1).map(function() { return [720, 720]; });

var dataset = [
      { x: 100, y: 110 },
      { x: 83, y: 43 },
      { x: 92, y: 28 },
      { x: 49, y: 74 },
      { x: 51, y: 10 },
      { x: 25, y: 98 },
      { x: 77, y: 30 },
      { x: 20, y: 83 },
      { x: 11, y: 63 },
      { x:  4, y: 55 },
      { x:  0, y:  0 },
      { x: 85, y: 100 },
      { x: 60, y: 40 },
      { x: 70, y: 80 },
      { x: 10, y: 20 },
      { x: 40, y: 50 },
      { x: 25, y: 31 }
    ];

var circle = svg.selectAll("circle")
  .data(data)
  .enter().append("circle")
    .attr("r", 2.5)
    .attr("transform", transform(d3.zoomIdentity));

console.log(data2);

svg.append("rect")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoom)); 

var circle2 = svg.selectAll("circle2")
  .data(d3.range(1).map(function() { return [720, 720]; }))
  .enter().append("circle")
    .attr("r", 9.5)
    .style("fill", "steelblue")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .attr("id", function(d){
      return d.id; //<-- Sets the ID of this county to the path
    })
    .attr("transform", transform(d3.zoomIdentity));     

function zoom() {
  circle.attr("transform", transform(d3.event.transform));
  circle2.attr("transform", transform(d3.event.transform));
}

function transform(t) {
  return function(d) {
    return "translate(" + t.apply(d) + ")";
  };
}

function handleMouseOver() {  // Add interactivity
  // Use D3 to select element, change color and size
  d3.select(this).attr({
    fill: "orange",
    r: radius * 2
  });
}

function handleMouseOut() {
  // Use D3 to select element, change color back to normal
  d3.select(this).attr({
    fill: "black",
    r: radius
  });
}