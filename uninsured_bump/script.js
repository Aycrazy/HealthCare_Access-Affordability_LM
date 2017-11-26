

// Chart Size Setup
var margin = { top: 35, right: 0, bottom: 30, left: 70 };

var width = 960 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;

options = {state: "Illinois"}
//Load in JSON Data

d3.json('bump_chart_data.json', function(d){
		dataset = d.filter(function(d) {return d.State == options.state; });
    console.log(dataset);

    makeBumpChart(dataset);
 });

function makeBumpChart(data){
	
	d3.select('body')
		.append('div')
		.attr('id','chart')

	console.log(data);

	data.sort(function(a,b){
		if(b['year'] != a['year']) {
      return b['year'] - a['year'];
    }
		if(b['% Uninsured'] != a['% Uninsured']){
			return b['% Uninsured'] - a['% Uninsured'];
		}
	})

	

	var pos = 1;
	data[0].position = pos;
	for(var i=1; i<data.length; i++) {
	  // this is a new year, so start over
	  if(data[i - 1].year != data[i].year) {
	    pos = 1;
	  } else {
	    pos++;
	  }
	  data[i].position = pos;
	}

	data.forEach(function(d) {
    d['class'] = d['County'].toLowerCase().replace(/ /g, '-').replace(/\./g,'');
     })



  var chart = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.top)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  ///////////////////////
  // Scales
  var x = d3.scaleBand()
      .domain(data.map(function(d) { return d['year']; }).reverse())
      .rangeRound([25, width - 15]);

  var y = d3.scaleLinear()
      .domain([d3.min(data, function(d) { return d['position'] }), d3.max(data, function(d) { return d['position']; })])
      .range([20, height - 30]);

  var size = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d['% Uninsured']; }))
      .range([3, 10]);

  // /
  
  var color = d3.scaleThreshold()
    .domain([0, 25000, 50000, 75000, 100000])
    .range(["#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"]);

  //console.log(d3.extent(data, function(d) { return d.position; }));
  ///////////////////////
  // Axis
  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(-"+ x.bandwidth()/2.0 +"," + height + ")")
      .call(xAxis);

  console.log('worked2');

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  ///////////////////////
  // Lines
  var counties = d3.map(data, function(d) {
    return d['County'];
  }).keys();

  counties.forEach(function(county) {
    var currData = data.filter(function(d) {
      if(d['County'] == county) {
        return d;
      }
    });

    var line = d3.line()
        .x(function(d) { return x(d['year']); })
        .y(function(d) { return y(d['position']); });

    chart.append("path")
        .datum(currData)
        .attr("class", county.toLowerCase().replace(/ /g, '-').replace(/\./g,'') )
    		.attr("style", "fill:none !important")
        .style('stroke','#7D818A')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.1)
        .attr("d", line);
  });


  ///////////////////////
  // Nodes
  var node = chart.append("g")
    .selectAll("text")
    .data(data)
    .enter().append("text")
    .attr("class", "uninsured")
    .text( function(d){ return d.County;})
    .attr("x", function(d) { return x(d['year'])-15; })
    .attr("y", function(d) { return y(d['position']); })
    .style('fill',function(d) { console.log(d.median_income,color(d.median_income));
    	return color(d.median_income)})
    // replace spaces with - and remove '.' (from d.c. united)
    .attr("class", function(d) { return d['County'].toLowerCase().replace(/ /g, '-').replace(/\./g,'') })
    .attr("font-family", 'monospace')
    .attr('font-size', '8px')
    //.attr("stroke-width", .3)
    .attr('opacity', '0.8');

	///////////////////////
	  // Tooltips
	  var tooltip = d3.select("body").append("div")
	      .attr("class", "tooltip");

	  chart.selectAll("text")
	      .on("mouseover", function(d) {
	        chart.selectAll('.' + d['class'])
	            .classed('active', true);

	        var tooltip_str = "Uninsured %: " + d['% Uninsured'] +
	        				"<br/>" + "County: " + d['County'] +
	                "<br/>" + "Year: " + d['year'] ;

	        tooltip.html(tooltip_str)
	            .style("visibility", "visible");
	      })
	      .on("mousemove", function(d) {
	        tooltip.style("top", event.pageY - (tooltip.node().clientHeight + 5) + "px")
	            .style("left", event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
	      })
	      .on("mouseout", function(d) {
	        chart.selectAll('.'+d['class'])
	            .classed('active', false);

	        tooltip.style("visibility", "hidden");
	      })
	      .on('click', function(d) {
	        chart.selectAll('.' + d['class'])
	            .classed('click-active', function(d) {
	              // toggle state
	              return !d3.select(this).classed('click-active');
	            });
	      })

				};

function changeState(value){
	
	// console.log(value);
	chart.remove()
	
	d3.select('body')
		.append('div')
		.attr('#chart')

  options.state = value;

  d3.json("bump_chart_data.json", function(d) {  
    dataset = d.filter(function(d) {return d.State == options.state; });
  makeBumpChart(dataset);
	});
}


