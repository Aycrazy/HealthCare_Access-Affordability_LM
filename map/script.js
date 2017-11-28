//lots of code from here: https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2

var width = 960,
    height = 500,
    active = d3.select(null);

var projection = d3.geoMercator()
    .scale(1900)
    .center([-90,42.5]);

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var path = d3.geoPath()
    .projection(projection);

var state_name;
var state_abbr;

var svg = d3.select("#chart").append("svg")
    .attr('value',state_name)
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

var options = {state: "Illinois"}

// allows user to zoom back out if they click away from the
 svg.append("rect")
     .attr("class", "background")
     .attr("width", width)
     .attr("height", height)
     .on("click", reset);

var countyG = svg.append("g"),
    stateG = svg.append("g");


d3.json("county_level_geojson.json", function(error, county) {
  if (error) throw error;

  countyG.selectAll("path")
      .data(county.features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .on("click", clicked);
});

d3.json("state_level_geojson.json", function(error, state) {
  if (error) throw error;

  stateG.selectAll("path")
      .data(state.features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .on("click", clicked);
});

function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);
  
  state_name = d.properties.NAME;
  state_abbr = d.properties.STUSPS;

  console.log(state_name, state_abbr);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4

}


function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
     .call( zoom.transform, d3.zoomIdentity );
}

function zoomed() {
  stateG.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  stateG.attr("transform", d3.event.transform);
  countyG.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  countyG.attr("transform", d3.event.transform); 
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

// function changeState(value){

//   console.log(state_name);
//   options.state = value;

//   console.log(options.state);

//   };




