

var bumpChart = function(chart_data){
	
	//load in data
	if(d3.select('svg')){
		d3.select('svg').remove()
	}

	this.data  = chart_data
	this.margin = { top: 35, right: 0, bottom: 30, left: 70 };
	this.width = 960 - this.margin.left - this.margin.right;
	this.height = 800 - this.margin.top - this.margin.bottom;


		//create chart
		chart = d3.select('#chart')
		  .append('svg')
		    .attr('width', this.width + this.margin.left + this.margin.right)
		    .attr('height', this.height + this.margin.top + this.margin.bottom*6)
		  .append('g')
		  	.classed('bump_temp',true)
		    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

	console.log(this.data);

	this.data.sort(function(a,b){
		if(b['year'] != a['year']) {
      return b['year'] - a['year'];
    }
		if(b['% Uninsured'] != a['% Uninsured']){
			return a['% Uninsured'] - b['% Uninsured'];
		}
	})
	

	var pos = 1;
	this.data[0].position = pos;
	for(var i=1; i<this.data.length; i++) {
	  // this is a new year, so start over
	  if(this.data[i - 1].year != this.data[i].year) {
	    pos = 1;
	  } else {
	    pos++;
	  }
	  this.data[i].position = pos;
	}

	this.data.forEach(function(d) {
    d['class'] = d['County'].toLowerCase().replace(/ /g, '-').replace(/\./g,'');
     })


  ///////////////////////
  // Scales
  var x = d3.scaleBand()
      .domain(this.data.map(function(d) { return d['year']; }).reverse())
      .rangeRound([25, this.width - 15]);

  var y = d3.scaleLinear()
      .domain([d3.min(this.data, function(d) { return d['position'] }), d3.max(this.data, function(d) { return d['position']; })])
      .range([20, this.height - 30]);

  var size = d3.scaleLinear()
      .domain(d3.extent(this.data, function(d) { return d['% Uninsured']; }))
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
      .classed('bump_temp',true)
      .attr("transform", "translate(-"+ this.margin.left/2 +"," + this.height + ")")
      .call(xAxis);

  console.log('worked2');

  chart.append("g")
      .attr("class", "y axis")
      .classed('bump_temp',true)
      .call(yAxis);

  ///////////////////////
  // Lines

  

  var counties = d3.map(this.data, function(d) {
    return d['County'];
  }).keys();


  console.log(this.data.filter(function(d) {
      if(d.County == 'Illinois') {
        return d;
      }}));


  var data = this.data;

  counties.forEach(function(county) {
    currData = data.filter( function(d) {
      if(d.County == county) {
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
        .style('stroke','#65627A')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.1)
        .attr("d", line)
        .classed('bump_temp',true);
  });

  
  ///////////////////////
  // Nodes
  var node = chart.append("g")
    .selectAll("text")
    .data(this.data)
    .enter().append("text")
    .attr("class", "uninsured")
    .text( function(d){ return d.County;})
    .attr("x", function(d) { return x(d['year'])-15; })
    .attr("y", function(d) { return y(d['position']); })
    .style('fill',function(d) {
    	return color(d.median_income)})
    // replace spaces with - and remove '.' (from d.c. united)
    .attr("class", function(d) { return d['County'].toLowerCase().replace(/ /g, '-').replace(/\./g,'') })
    .attr("font-family", 'monospace')
    //.style('font-size', '8px')
    //.attr("stroke-width", .3)
    .attr('opacity', '0.8')
    .classed('bump_temp',true);

	///////////////////////
	  // Tooltips
	  var tooltip = d3.select("#chart").append("div")
	      .attr("class", "tooltip");

	  chart.selectAll("text")
	      .on("mouseover", function(d) {
	        chart.selectAll('.' + d['class'])
	            .classed('active', true);

	        var tooltip_str = "Uninsured %: " + d['% Uninsured'] +
	        				"<br/>" + "Region: " + d['County'] +
	                "<br/>" + "Median Income: " + d.median_income +
	                "<br/>" + "Year: " + d['year'];

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
	      .classed('bump_temp',true)

	  	by_year = d3.nest()
	  							.key(function (d){return d.year;})
	  							.entries(this.data)

	  	var by_year_median_income = [];



	  	by_year.forEach(function (d){
	  		by_year_median_income.push([d3.max(d.values,function(e){
	  				return e['% Uninsured'];}),
	  		d3.max(d.values,function(e){
	  				return e.year;}),
	  		d3.min(d.values,function(e){
	  				return e['% Uninsured'];})])
	  		//return d.median_income
	  	});

	  	by_year_median_income = by_year_median_income.sort(function(a,b){
	  		return a[1] - b[1]})

	  	console.log(by_year_median_income);

			chart.append("g")
				.selectAll("text")
				.data(by_year_median_income)
				.enter()
				.append("text")
				.attr("x", function (d){ return x(d[1]);})
				.attr("height", -10)
				.attr("class", "bump_temp")
				.text(function (d){return d[2];})
				.style('font-size', '14px')
				.style('font-weight','bold')
				.style('font-family','monospace')
				.call(xAxis)

			chart.append("g")
				.selectAll("text")
				.data(by_year_median_income)
				.enter()
				.append("text")
	  			.attr("x", function (d){ return x(d[1]);})
	  			//.attr('transform', 'translate( 0,0)')
	  			.attr("y", this.height+this.margin.bottom)
	  			.attr("class", "bump_temp")
	  			.text(function (d){ return d[0];})
	  			.style('font-size', '14px')
	  			.style('font-family','monospace')
	  			.style('font-weight','bold')
	  			.call(xAxis)

			chart.append("text")
				.attr("x",  this.width/12)
				.attr("y", this.height+this.margin.bottom*3)
				.attr("class", "bump_temp")
				.text('Source: Source: County Health Rankings')
				.style('font-size', '14px')
				.style('font-family','monospace')
				.append("text")

			chart.append("text")
				.attr("x",  this.width/12)
				.attr("y", this.height+this.margin.bottom*4)
				.attr("class", "bump_temp")
				.text('Credit: Heavily inspired by Chas Jhin https://gist.github.com/cjhin/b7a5f24a0853524414b06124c559961a')
				.style('font-size', '14px')
				.style('font-family','monospace')
				.append("text")

			chart.append("text")
				.attr("x",  (this.width-this.margin.left*2)/2 )
				.attr("y", -15)
				.attr("class", "bump_temp")
				.text('Lowest % Uninsured')
				.style('font-size', '14px')
				.style('font-family','monospace')
				.append("text")

			chart.append("text")
				.attr("x",  (this.width-this.margin.left*2)/2 )
				.attr("y", this.height+this.margin.bottom*2)
				.attr("class", "bump_temp")
				.text('Highest % Uninsured')
				.style('font-size', '14px')
				.style('font-family','monospace')
				.append("text")
						};


 function changeState(value){

	 	chart.remove();

		options_bump.state = value;

		if(options_bump.state != 'all'){
	  	d3.json("bump_chart_data.json", function(d) {  
		

	    	dataset = d.filter(function(d) {return d.State == options_bump.state;});
	    	
	    	bumpChart(dataset) 

	  		}
	  	)}
	  else{

	  	 	d3.json("bump_chart_state_data.json", function(d) { 

	  	 	bumpChart(d) 

	  	 	}) 
	  	}
	  
	};

var options_bump = {state: "all"}

var bump = d3.json('bump_chart_state_data.json', function (d){ 

var bump = new bumpChart(d)


	});








