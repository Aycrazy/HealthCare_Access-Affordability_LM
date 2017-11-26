

// Chart Size Setup
var margin = { top: 35, right: 0, bottom: 30, left: 70 };

var width = 960 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;

options = {state: "Illinois"}
//Load in JSON Data

d3.json('bump_chart_state_data.json', function(d){
		//dataset = d.filter(function(d) {return d.State == options.state; });
    console.log(d);

    makeBumpChartState(d);
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
			return a['% Uninsured'] - b['% Uninsured'];
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
    .attr('height', height + margin.top*3 + margin.bottom*3)
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
    .style('fill',function(d) {
    	return color(d.median_income)})
    // replace spaces with - and remove '.' (from d.c. united)
    .attr("class", function(d) { return d['County'].toLowerCase().replace(/ /g, '-').replace(/\./g,'') })
    .attr("font-family", 'monospace')
    //.style('font-size', '8px')
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

	  	by_year = d3.nest()
	  							.key(function (d){return d.year;})
	  							.entries(data)

	  	console.log(by_year.length);

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
  			.attr("y", height+margin.bottom*1.25)
  			.text(function (d){ return d[0];})
  			.style('font-size', '14px')
  			.style('font-family','monospace')
  			.style('font-weight','bold')
  			.call(xAxis)

			chart.append("text")
			.attr("x",  width/12)
			//.attr('transform', 'translate( 0,0)')
			.attr("y", height+margin.bottom*3)
			.text('Source: Source: County Health Rankings')
			.style('font-size', '14px')
			.style('font-family','monospace')
			.append("text")

			chart.append("text")
			.attr("x",  width/12)
			//.attr('transform', 'translate( 0,0)')
			.attr("y", height+margin.bottom*4)
			.text('Credit: Heavily inspired by Chas Jhin https://gist.github.com/cjhin/b7a5f24a0853524414b06124c559961a')
			.style('font-size', '14px')
			.style('font-family','monospace')
			.append("text")

			chart.append("text")
			.attr("x",  (width-margin.left*2)/2 )
			.attr("y", -15)
			.text('Lowest % Uninsured')
			.style('font-size', '14px')
			.style('font-family','monospace')
			.append("text")

			chart.append("text")
			.attr("x",  (width-margin.left*2)/2 )
			.attr("y", height+margin.bottom*2)
			.text('Highest % Uninsured')
			.style('font-size', '14px')
			.style('font-family','monospace')
			.append("text")
					};

function makeBumpChartState(data){


	d3.select('body')
		.append('div')
		.attr('id','chart')

	console.log(data);

	data.sort(function(a,b){
		if(b['year'] != a['year']) {
      return b['year'] - a['year'];
    }
		if(b['Uninsured'] != a['Uninsured']){
			return a['Uninsured'] - b['Uninsured'];
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
    d['class'] = d['State'].toLowerCase().replace(/ /g, '-').replace(/\./g,'');
     })


  var chart = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.top)
    .attr('height', height + margin.top + margin.bottom*4)
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
      .domain(d3.extent(data, function(d) { return d['Uninsured']; }))
      .range([3, 10]);

  // /
  
  var color = d3.scaleOrdinal()
    .domain(["Illinois","Indiana",'Michigan','Wisconsin'])
    .range(['#7B22FF', '#E84927', '#0D4EFF','#0CE846']);

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
  var states = d3.map(data, function(d) {
    return d['State'];
  }).keys();

  states.forEach(function(state) {
    var currData = data.filter(function(d) {
      if(d.State == state) {
        return d;
      }
    });

  var line = d3.line()
      .x(function(d) { return x(d['year']); })
      .y(function(d) { return y(d['position']); });

    chart.append("path")
        .datum(currData)
        .attr("class", state.toLowerCase().replace(/ /g, '-').replace(/\./g,'') )
    		.attr("style", "fill:none !important")
        .style('stroke','#7D818A')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.4)
        .attr("d", line);
  });

  
  ///////////////////////
  // Nodes
  var node = chart.append("g")
    .selectAll("text")
    .data(data)
    .enter().append("text")
    .attr("class", "uninsured")
    .text( function(d){ return d.State;})
    .attr("x", function(d) { return x(d['year'])-15; })
    .attr("y", function(d) { return y(d['position']); })
    .style('fill',function(d) {
    	return color(d.State)})
    // replace spaces with - and remove '.' (from d.c. united)
    .attr("class", function(d) { return d['State'].toLowerCase().replace(/ /g, '-').replace(/\./g,'') })
    .attr("font-family", 'monospace')
    .attr('font-size', '14px')
   	.attr("font-weight", 'bold')
    .attr('opacity', '0.8');

	///////////////////////
	  // Tooltips
	  var tooltip = d3.select("body").append("div")
	      .attr("class", "tooltip");

	  chart.selectAll("text")
	      .on("mouseover", function(d) {
	        chart.selectAll('.' + d['class'])
	            .classed('active', true);

	        var tooltip_str = "Uninsured %: " + d['Uninsured'] +
	        				"<br/>" + "State: " + d['State'] +
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

	  	by_year = d3.nest()
	  							.key(function (d){return d.year;})
	  							.entries(data)

	  	console.log(by_year.length);

	  	var by_year_median_income = [];



	  	by_year.forEach(function (d){
	  		by_year_median_income.push([d3.max(d.values,function(e){
	  				return e['Uninsured'];}),
	  		d3.max(d.values,function(e){
	  				return e.year;}),
	  		d3.min(d.values,function(e){
	  				return e['Uninsured'];})])
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
				.attr("height", margin.top)
				.text(function (d){return d[2];})
				.style('font-size', '14px')
				.style('font-weight','bold')
				.style('font-family','monospace')

				chart.append("g")
				.selectAll("text")
				.data(by_year_median_income)
				.enter()
				.append("text")
  			.attr("x", function (d){ return x(d[1]);})
  			//.attr('transform', 'translate( 0,0)')
  			.attr("y", height+margin.bottom)
  			.text(function (d){ return d[0];})
  			.style('font-size', '14px')
  			.style('font-family','monospace')
  			.style('font-weight','bold')
  			.call(xAxis)

			chart.append("text")
			.attr("x",  width/12)
			//.attr('transform', 'translate( 0,0)')
			.attr("y", height+margin.bottom*3)
			.text('Source: Source: County Health Rankings')
			.style('font-size', '14px')
			.style('font-family','monospace')
			.append("text")

			chart.append("text")
			.attr("x",  width/12)
			//.attr('transform', 'translate( 0,0)')
			.attr("y", height+margin.bottom*4)
			.text('Credit: Heavily inspired by Chas Jhin https://gist.github.com/cjhin/b7a5f24a0853524414b06124c559961a')
			.style('font-size', '14px')
			.style('font-family','monospace')
			.append("text")

			chart.append("text")
			.attr("x",  (width-margin.left*2)/2 )
			.attr("y", -15)
			.text('Lowest % Uninsured')
			.style('font-size', '14px')
			.style('font-family','monospace')
			.append("text")

			chart.append("text")
			.attr("x",  (width-margin.left*2)/2 )
			.attr("y", height+margin.bottom*2)
			.text('Highest % Uninsured')
			.style('font-size', '14px')
			.style('font-family','monospace')
			.append("text")
		}

function changeState(value){
	
	// console.log(value);
	chart.remove()

	d3.select('body')
		.append('div')
		.attr('#chart')


  options.state = value;

	if(options.state != 'all'){
  	d3.json("bump_chart_data.json", function(d) {  
    	dataset = d.filter(function(d) {return d.State == options.state;});
    	makeBumpChart(dataset);
  	 }
  	 )}
  else{
  	 	d3.json("bump_chart_state_data.json", function(d) {  
    	makeBumpChartState(d);
  	 	}) 
  	 }
  
	};


