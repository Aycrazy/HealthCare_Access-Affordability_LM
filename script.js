


var margin = {top: 100, right: 75, bottom: 75, left: 50}
var width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select('#chart')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleBand().
  rangeRound([0, width]).
  padding(0.1);

var y = d3.scaleLinear().
  rangeRound([height, 0]);

var z = d3.scaleOrdinal()
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.json("bar_graph_data.json", function(d) {
  var ymaxdomain=d3.max(d,function(d){return d.health_status;});
      x.domain(d.map(function(d) {return d.range_income}));
      y.domain([0,ymaxdomain]);

  var x1=d3.scaleBand().rangeRound([0, x.bandwidth()]);
      x1.domain(d.map(function(d) {return d.year;}));

      svg.selectAll("bar")
        .data(d)
        .enter().append("rect")
        .attr("x", function(d,i) {return (x(d.range_income)+x1(d.year)); })
        .attr("y", function(d) {return y(d.health_status); })
        .attr("width",x1.bandwidth())
        .attr("height", function(d) { return height - y(d.health_status); })
        .attr("fill", function(d,i) { return z(d.year); });

        svg.append("g")
          .attr("class", "xaxis")
          .attr('transform', 'translate(0,' + (height) + ')')
          .call(d3.axisBottom(x));

        svg.append("g")
          .attr("class", "yaxis")
          .call(d3.axisLeft(y));

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
          .text('Income Level, State/County, Year, and Population Size')
});