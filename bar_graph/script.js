

var margin = {top: 100, right: 75, bottom: 75, left: 50}
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

options = {state: "all"}

d3.json("bar_graph_data.json", function(d) {  
    ymax = d3.max(d, function(d){return d.health_status;});
    console.log(ymax);
    dataset = d.filter(function(d) {return d.state == options.state; });
    makeBarGraph(dataset, ymax);
  });

function changeState(value){
  options.state = value;
  d3.json("bar_graph_data.json", function(d) {  
    dataset = d.filter(function(d) {return d.state == options.state; });
    makeBarGraph(dataset);
});};

function makeBarGraph() {
  var x1Scale = d3.scaleBand()
    .rangeRound([0, xChart.bandwidth()])
    .domain(dataset.map(function(d) { return d.year;}));

  var color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  // add bars
  var bars = svg.selectAll("rect")
    .remove()
    .exit()
    .data(dataset);

  bars.enter().append("rect")
      .attr("x", function(d) {return (xChart(d.range_income)+x1Scale(d.year)); })
      .attr("y", function(d) {return yChart(d.health_status); })
      .attr("width", x1Scale.bandwidth())
      .attr("height", function(d) { return height - yChart(d.health_status); })
      .attr("fill", function(d) { return color(d.year); })
      .on("mouseover", function(d){
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

var svg = d3.select('#chart')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var xChart = d3.scaleBand()
  .range([0, width])
  .domain(["<200%", "200-250%", "250-300%", "300%+"])
  .padding(0.1);

var yChart = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 33]);

var xAxis = d3.axisBottom(xChart);
var yAxis = d3.axisLeft(yChart);

//set up axis
//x axis
  svg.append("g")
      .attr("class", "xaxis")
      .attr('transform', 'translate(0,' + (height) + ')')
      .call(xAxis);
      //.attr("dx", )

  // draw y axis
  svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis);

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
    .text('Income Level and Year')



