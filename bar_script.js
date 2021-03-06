

var options_bar = {state_bar: "all"}

var bar = d3.json("bar_graph_data.json", function(d) {  
      dataset = d.filter(function(d) {return d.state == options_bar.state_bar; });
      barChart(dataset, options_bar);
  });

function changeStateBar(value){
  options_bar.state_bar = value;

  if(options_bar.state_bar != "All") {
    d3.selectAll(".bar_temp")
      .remove()
      .exit();
    
    d3.json("bar_graph_data.json", function(d) {  
      dataset = d.filter(function(d) {return d.state == options_bar.state_bar; });
      barChart(dataset, options_bar);  
    })}
  
  else{
    d3.selectAll(".bar_temp")
      .remove()
      .exit();

    d3.json("bar_graph_data.json", function(d) { 
      dataset = d.filter(function(d) {return d.state == "all"; })
      barChart(dataset,options_bar);

  })}};

var barChart = function(chart_data, options_bar) {

  if(d3.select('.bar_temp')) {
    d3.select('.bar_temp')
    .remove()
    .exit()
  }

  this.data = chart_data;
  this.margin = { top: 10, right: 0, bottom: 130, left: 70 };
  this.width = 550 - this.margin.left - this.margin.right;
  this.height = 400 - this.margin.top - this.margin.bottom;
  


  //set up chart
  chart_bar = d3.select('#bar_chart')
    .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .classed('bar_temp', true)
    .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .classed('bar_temp', true)

  //scales
  var x_bar = d3.scaleBand()
    .range([0, this.width])
    .domain(["<200%", "200-250%", "250-300%", "300%+"])
    .padding(0.1);

  var y_bar = d3.scaleLinear()
    .range([this.height, 0])
    .domain([0, d3.max(this.data, function(d) {return d.health_status})]);

  var xAxis_bar = d3.axisBottom(x_bar);
  var yAxis_bar = d3.axisLeft(y_bar);

  var color_bar = d3.scaleOrdinal()
    .range(["#CC4678", "#E1E707", "#0D0888"]);

  //draw x axis
  chart_bar.append("g")
      .attr("class", "xaxis_bar")
      .attr('transform', 'translate(0,' + (this.height)+ ')')
      .call(xAxis_bar)
      .style('font-family','Lucidatypewriter');

  // draw y axis
  chart_bar.append("g")
    .attr("class", "yaxis_bar")
    .attr('transform', 'translate(0,' + 0 + ')')
    .call(yAxis_bar.tickFormat(function(d) { return d + "%"; }))
    .style('font-family','Lucidatypewriter');

  // add x axis text
  chart_bar.append('text')             
    .attr('transform', 'translate(' + (this.width/2) + ' ,' + (this.height+40) + ')')
    .classed('xText_bar',true)
    .style('text-anchor', 'middle')
    .text('Median Income Level (Percent FPL)');

  // add y axis text
  chart_bar.append('text')
    .attr('transform', 'rotate(-90)translate(-' + this.height/2 + ',-10)')
    .attr('class', 'yText_bar')
    .attr('dy', '-2.5em')
    .style('text-anchor', 'middle')
    .text('Percent Reporting Fair/Poor Health');

  var x1_bar = d3.scaleBand()
    .rangeRound([0, x_bar.bandwidth()])
    .domain(this.data.map(function(d_bar) { return d_bar['year'];}));

  //var tooltip_bar = d3.select("#bar_chart").append("div").attr("class", "tooltip_bar");

  // add bars
  var bars = chart_bar.selectAll("rect")
    .remove()
    .exit()
    .data(this.data);

  bars.enter().append("rect")
    .transition()
       .duration(4000)
       .ease(d3.easeBack)
      .attr("width", x1_bar.bandwidth())
      .attr("x", function(d_bar) {return (x_bar(d_bar['range_income'])+x1_bar(d_bar['year'])); })
      .attr("height", function(d_bar) { return (260 - (y_bar(d_bar["health_status"]))); })
      .attr("y", function(d_bar) {return y_bar(d_bar['health_status']); })
      .attr("fill", function(d_bar) { return color_bar(d_bar['year']); });

  var tooltip_bar = d3.select("#bar_chart").append("div").attr("class", "tooltip_bar");

  chart_bar.selectAll("rect")
    .on("mouseover", function(d_bar) {
      chart_bar.selectAll("rect")
        .classed('active', true);
      var tooltip_str = "year: " + (d_bar["year"]) + "<br>" + "health status: "  + (d_bar["health_status"])  + "%" + "<br>" + "state: " + (d_bar["state"]);
      tooltip_bar.html(tooltip_str)
        .style("visibility", "visible");})
    
    .on("mousemove", function(d_bar) {
      tooltip_bar.style("top", event.pageY - (tooltip_bar.node().clientHeight*9.5 + 5) + "px")
        .style("left", event.pageX - (tooltip_bar.node().clientWidth ) + "px");})
 
    .on("mouseout", function(d_bar) {
      chart_bar.selectAll("rect")
        .classed('active', false);
      tooltip_bar.style("visibility", "hidden");
        });

  // create 2013 legend
  var legend1_bar = chart_bar.append('g')
    .attr('height', 100)
    .attr('width', 100)

  legend1_bar.selectAll('rect')
    .data(this.data)
    .enter().append('rect')
    .attr('x', this.width/2 - 100)
    .attr('y', this.height + 60)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', "#CC4678")

  legend1_bar.selectAll('text')
    .data(this.data)
    .enter().append('text')
    .attr('x', this.width/2 - 75)
      .attr('y', this.height + 73)
      .attr('class', 'ltext_bar')
      .text('2013')

  // create the 2014 legend
  var legend2_bar = chart_bar.append('g')
    .attr('height', 100)
    .attr('width', 100)

  legend2_bar.selectAll('rect')
    .data(this.data)
    .enter().append('rect')
    .attr('x', this.width/2-15)
    .attr('y', this.height + 60)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', "#E1E707")

  legend2_bar.selectAll('text')
    .data(this.data)
    .enter().append('text')
    .attr('x', this.width/2+10)
      .attr('y', this.height + 73)
      .attr('class', 'ltext_bar')
      .text('2014')

  // create the 2015 legend
  var legend3_bar = chart_bar.append('g')
    .attr('height', 100)
    .attr('width', 100)

  legend3_bar.selectAll('rect')
    .data(this.data)
    .enter().append('rect')
    .attr('x', this.width/2 +70)
    .attr('y', this.height + 60)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', "#0D0888")

  legend3_bar.selectAll('text')
    .data(this.data)
    .enter().append('text')
    .attr('x', this.width/2 +95)
      .attr('y', this.height + 73)
      .attr('class', 'ltext_bar')
      .text('2015')
};