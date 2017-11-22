


var margin = {top: 100, right: 75, bottom: 75, left: 50}
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

options = {state: "all"}
options.state = d3.selectAll(("input[name='all-each']")).on("change", function() {console.log(this.value)})
//var radio = document.getElementByID("all-each").value;
//var radio = d3.selectAll(("input[name='all-each']")).on("change", function() {console.log(this.value)})

d3.json("bar_graph_data.json", function(d) {  
  all = d.filter(function(d) {return d.state == "all"; });
  Illinois = d.filter(function(d) {return d.state == "Illinois"; });
  Indiana = d.filter(function(d) {return d.state == "Indiana"; });
  Michigan = d.filter(function(d) {return d.state == "Michigan"; });
  Wisconsin = d.filter(function(d) {return d.state == "Wisconsin"; });
  //pleasework = d3.selectAll(("input[name='all-each']")).on("change", function() {console.log(this.value)});
  ///console.log(pleasework)

  dataset = Illinois;
  //if (this.value == "Illinois") {
  //  dataset = Illinois;
 // }

  console.log(dataset);
  makeBarGraph();
});

function makeBarGraph() {
  // set up scales
var xScale = d3.scaleBand()
  .rangeRound([0,width])
  .padding(0.1)
  .domain(dataset.map(function(d) {return d.range_income; }));

var x1Scale = d3.scaleBand()
        .rangeRound([0, xScale.bandwidth()])
        .domain(dataset.map(function(d) { return d.year;}));

var yScale = d3.scaleLinear()
  .rangeRound([height,0])
  .domain([0, d3.max(dataset, function(d){return d.health_status;})]);

var color = d3.scaleOrdinal()
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  // draw x axis
  svg.append("g")
    .attr("class", "xaxis")
    .attr('transform', 'translate(0,' + (height) + ')')
    .call(d3.axisBottom(xScale));
  
  // draw y axis
  svg.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(yScale));

  // add x axis text
  svg.append('text')             
    .attr('transform', 'translate(' + (width/2) + ' ,' + (height+40) + ')')
    .attr('class', 'xText')
    .style('text-anchor', 'middle')
    .text('Median Income Level (Percent FPL)');
  
  // add y axis text
  svg.append('text')
    .attr('transform', 'rotate(-90)translate(-' + height/2 + ',0)')
    .attr('class', 'yText')
    .attr('dy', '-2.5em')
    .style('text-anchor', 'middle')
    .text('Percent Reporting Fair/Poor Health');

  // add title
  svg.append('text')
    .attr('transform', 'translate(' + (-40) + ' ,' + (-60) + ')')
    .attr('class', 'title')
    .text('Percent Reporting Fair/Poor Health by Median')
  svg.append('text')
    .attr('transform', 'translate(' + (-40) + ' ,' + (-35) + ')')
    .attr('class', 'title')
    .text('Income Level, and Year')

      // add bars
  svg.selectAll("bar")
    .data(dataset)
    .enter().append("rect")
    //.filter(function(d) {return d.state == "all"; })
      .attr("x", function(d) {return (xScale(d.range_income)+x1Scale(d.year)); })
      .attr("y", function(d) {return yScale(d.health_status); })
      .attr("width", x1Scale.bandwidth())
      .attr("height", function(d) { return height - yScale(d.health_status); })
      .attr("fill", function(d) { return color(d.year); })
      .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("year: " + (d.year) + "<br>" + "health status: "  + "<br>" + (d.health_status)  + "%" + "<br>" + "population size: "  + "<br>" + (d.num_18plus) + "<br>" + "state: " + "<br>" + (d.state));
        })
      .on("mouseout", function(d){ tooltip.style("display", "none");});

// create 2013 legend
var legend1 = svg.append('g')
  .attr('class', 'legend')
    .attr('height', 100)
    .attr('width', 100)

 legend1.selectAll('rect')
    .data(dataset)
    .enter().append('rect')
    .attr('x', width - 400)
    .attr('y', height + 60)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', "#98abc5")

 legend1.selectAll('text')
  .data(dataset)
  .enter().append('text')
  .attr('x', width - 375)
    .attr('y', height + 73)
    .attr('class', 'ltext')
    .text('2013')

// create the 2014 legend
var legend2 = svg.append('g')
  .attr('class', 'legend')
    .attr('height', 100)
    .attr('width', 100)

 legend2.selectAll('rect')
    .data(dataset)
    .enter().append('rect')
    .attr('x', width - 300)
    .attr('y', height + 60)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', "#8a89a6")

 legend2.selectAll('text')
  .data(dataset)
  .enter().append('text')
  .attr('x', width - 275)
    .attr('y', height + 73)
    .attr('class', 'ltext')
    .text('2014')

// create the 2015 legend
var legend3 = svg.append('g')
  .attr('class', 'legend')
    .attr('height', 100)
    .attr('width', 100)

 legend3.selectAll('rect')
    .data(dataset)
    .enter().append('rect')
    .attr('x', width - 200)
    .attr('y', height + 60)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', "#7b6888")

 legend3.selectAll('text')
  .data(dataset)
  .enter().append('text')
  .attr('x', width - 175)
    .attr('y', height + 73)
    .attr('class', 'ltext')
    .text('2015')

};