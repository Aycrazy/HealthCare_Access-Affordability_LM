

var options_bar = {state_bar: "all"}

var bar = d3.json("bar_graph_data.json", function(d) {  
      dataset = d.filter(function(d) {return d.state == options_bar.state_bar; });
      barChart(dataset, options_bar);
  });

function changeStateBar(value){
  options_bar.state_bar = value;
  console.log(options_bar.state_bar, "line 10")
  
  if(options_bar.state_bar != "All") {
    d3.selectAll(".bar_temp")
      .remove()
      .exit();
    
    d3.json("bar_graph_data.json", function(d) {  
      dataset = d.filter(function(d) {return d.state == options_bar.state_bar; });
      barChart(dataset, options_bar);  
    })}
  
  else{
    console.log("I'm running all!")
    d3.selectAll(".bar_temp")
      .remove()
      .exit();

    d3.json("bar_graph_data.json", function(d) { 
      dataset = d.filter(function(d) {return d.state == "all"; })
      console.log(dataset, "line 30")
      barChart(dataset,options_bar);

  })}};

var barChart = function(chart_data, options_bar) {

  if(d3.select('.bar_temp')) {
    d3.select('.bar_temp')
    .remove()
    .exit()
  }

  this.data = chart_data;
  this.margin = { top: 65, right: 0, bottom: 130, left: 70 };
  this.width = 600 - this.margin.left - this.margin.right;
  this.height = 600 - this.margin.top - this.margin.bottom;
  
  //console.log(this.data, "in barChart")
  
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
    .range(["#CEBD89", "#CA7C2A", "#653900"]);

  //draw x axis
  chart_bar.append("g")
      .attr("class", "xaxis_bar")
      .attr('transform', 'translate(0,' + (this.height) + ')')
      .call(xAxis_bar);

  // draw y axis
  chart_bar.append("g")
    .attr("class", "yaxis_bar")
    .call(yAxis_bar);

  // add x axis text
  chart_bar.append('text')             
    .attr('transform', 'translate(' + (this.width/2) + ' ,' + (this.height+40) + ')')
    .attr('class', 'xText_bar')
    .style('text-anchor', 'middle')
    .text('Median Income Level (Percent FPL)');

  // add y axis text
  chart_bar.append('text')
    .attr('transform', 'rotate(-90)translate(-' + this.height/2 + ',0)')
    .attr('class', 'yText_bar')
    .attr('dy', '-2.5em')
    .style('text-anchor', 'middle')
    .text('Percent Reporting Fair/Poor Health');

  var x1_bar = d3.scaleBand()
    .rangeRound([0, x_bar.bandwidth()])
    .domain(this.data.map(function(d_bar) { return d_bar['year'];}));

  var tooltip_bar = d3.select("#bar_chart").append("div").attr("class", "tooltip_bar");

  // add bars
  var bars = chart_bar.selectAll("rect")
    .remove()
    .exit()
    .data(this.data);

  bars.enter().append("rect")
      .attr("x", function(d_bar) {return (x_bar(d_bar['range_income'])+x1_bar(d_bar['year'])); })
      .attr("y", function(d_bar) {return y_bar(d_bar['health_status']); })
      .attr("width", x1_bar.bandwidth())
      .attr("height", function(d_bar) { return (405 - (y_bar(d_bar["health_status"]))); })
      .attr("fill", function(d_bar) { return color_bar(d_bar['year']); })
      .on("mouseover", function(d_bar){
            tooltip_bar
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("year: " + (d_bar.year) + "<br>" + "health status: "  + (d_bar.health_status)  + "%" + "<br>" + "state: " + (d_bar.state));
        })
      .on("mouseout", function(d_bar){ tooltip_bar.style("display", "none");});

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
    .attr('fill', "#CEBD89")

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
    .attr('fill', "#CA7C2A")

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
    .attr('fill', "#653900")

  legend3_bar.selectAll('text')
    .data(this.data)
    .enter().append('text')
    .attr('x', this.width/2 +95)
      .attr('y', this.height + 73)
      .attr('class', 'ltext_bar')
      .text('2015')
};