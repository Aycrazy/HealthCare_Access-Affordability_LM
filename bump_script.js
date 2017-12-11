


var options_bump = {state_bump: "all"}

var bump = d3.json('bump_chart_state_data.json', function (d){ 
		 bc = new bumpChart(d,options_bump)
	});

function changeStateBump(value){
	options_bump.state_bump = value;
	if(options_bump.state_bump != 'all'){
		d3.selectAll(".bump_temp")
		    .remove()
		    .exit();

  	d3.json("bump_chart_data.json", function(d) {  
    	dataset = d.filter(function(d) {return d.State == options_bump.state_bump;});
    	bc = bumpChart(dataset,options_bump) 
  		})}
  	else{	
  		d3.selectAll(".bump_temp")
		    .remove()
		    .exit();
  	 	d3.json("bump_chart_state_data.json", function(d) { 
  	 	bc = bumpChart(d,options_bump)
  	 	}) 
  	}};

var bumpChart = function(chart_data, options_bump){
	//load in data
	if(d3.select('.bump_temp')){
		d3.select('.bump_temp').remove().exit()}

	this.data  = chart_data
	this.margin = { top: 30, right: 100, bottom: 30, left: 100 };
	this.width = 960 - this.margin.left - this.margin.right;
	this.height = 600 - this.margin.top - this.margin.bottom;

	//create chart
	chart_bump = d3.select('#bump_chart')
	  .append('svg')
	    .attr('width', this.width + this.margin.left + this.margin.right)
	    .attr('height', this.height + this.margin.top + this.margin.bottom*5)
	    .classed('bump_temp',true)
	  .append('g')
	    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
	    .classed('bump_temp',true)

	this.data.sort(function(a,b){
		if(b['year'] != a['year']) {
     		return b['year'] - a['year'];
    	}
		
		if(b['% Uninsured'] != a['% Uninsured']){
			return a['% Uninsured'] - b['% Uninsured'];
		}})
	

	var pos_bump = 1;
	this.data[0].position = pos_bump;
	for(var i=1; i<this.data.length; i++) {
	  // this is a new year, so start over
	  if(this.data[i - 1].year != this.data[i].year) {
	    pos_bump = 1;} 
	  else {
	    pos_bump++;}
	  this.data[i].position = pos_bump;}

	this.data.forEach(function(d) {d['class'] = d['County'].toLowerCase().replace(/ /g, '-').replace(/\./g,'');})

  ///////////////////////
  // Scales
  var x_bump = d3.scaleBand()
      .domain(this.data.map(function(d) { return d['year']; }).reverse())
      .rangeRound([25, this.width - 30]);

  var y_bump = d3.scaleLinear()
      .domain([d3.min(this.data, function(d) { return d['position'] }), d3.max(this.data, function(d) { return d['position']; })])
      .range([20, this.height]);

  var size = d3.scaleLinear()
      .domain(d3.extent(this.data, function(d) { return d['% Uninsured']; }))
      .range([3, 10]);

  var color = d3.scaleThreshold()
    .domain([0, 25000, 50000, 75000])
    .range(['#ECF830','#F97A4F', '#9B24A0', '#160B97']);

  // Axis
  var xAxis_bump = d3.axisBottom(x_bump);

  var yAxis_bump = d3.axisLeft(y_bump);

  chart_bump.append("g")
      .classed('bump_temp',true)
      .attr("transform", "translate(-"+ this.margin.left/2 +"," + this.height + ")")
      .call(xAxis_bump)
      //.transition()
     	//.duration(1000);

  // chart_bump.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis_bump)
  //     .transition()
  //     .duration(1000);

  ///////////////////////
  // Lines
  var counties = d3.map(this.data, function(d) {return d['County'];})
  	.keys();


  var data = this.data;

  counties.forEach(function(county) {
    currData = data.filter( function(d) {
      if(d.County == county) {
        return d;}});

  var line = d3.line()
      .x(function(d) { return x_bump(d['year']); })
      .y(function(d) { return y_bump(d['position']); });

chart_bump.append("path")
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
  var node = chart_bump.append("g")
    .selectAll("text")
    .data(this.data)
    .enter().append("text")
    //.transition()
    //.duration(4000)
    .attr("class", "uninsured")
    .text( function(d){ if (d.year == 2010){return d.County;} if (d.year == 2017){return d.County;}})
    .attr("x", function(d) { return x_bump(d['year'])-15; })
    .attr("y", function(d) { return y_bump(d['position']); })
    .style('fill',function(d){ return color(d.median_income)
    })
    
    // replace spaces with - and remove '.' (from d.c. united)
    node.attr("class", function(d) { return d['County'].toLowerCase().replace(/ /g, '-').replace(/\./g,'') })
	    .attr("font-family", 'monospace')
	    .attr('opacity', '0.8')

	///////////////////////
	  // Tooltips
	var tooltip_bump = d3.select("#bump_chart").append("div")
	    .attr("class", "tooltip_bump");

	chart_bump.selectAll("text")
		.on("mouseover", function(d) {
	        chart_bump.selectAll('.' + d['class'])
	            .classed('active', true);

	    var tooltip_str = "Uninsured %: " + d['% Uninsured'] +
	    	"<br/>" + "Region: " + d['County'] +
	        "<br/>" + "Median Income: " + d.median_income +
	        "<br/>" + "Year: " + d['year'];

		    tooltip_bump.html(tooltip_str)
		        .style("visibility", "visible");})
	      
	    .on("mousemove", function(d) {
	    	tooltip_bump.style("top", event.pageY - (tooltip_bump.node().clientHeight*14.5 + 5) + "px")
	            .style("left", event.pageX - (tooltip_bump.node().clientWidth) + "px");
	      })
	    
	    .on("mouseout", function(d) {
	        chart_bump.selectAll('.'+d['class'])
	            .classed('active', false);

	    tooltip_bump.style("visibility", "hidden");})
      
      	.on('click', function(d) {
        	chart_bump.selectAll('.' + d['class'])
            	.classed('click-active', function(d) {
              	// toggle state
              	return !d3.select(this).classed('click-active');
            })})

	      // .classed('active',false)

  	by_year = d3.nest()
		.key(function (d){return d.year;})
		.entries(this.data)

  	var by_year_median_income = [];

  	by_year.forEach(function (d){
  		by_year_median_income.push([d3.max(d.values,function(e){return e['% Uninsured'];}),
  		d3.max(d.values,function(e){return e.year;}),
  		d3.min(d.values,function(e){return e['% Uninsured'];})])
  		//return d.median_income
  	});

  	by_year_median_income = by_year_median_income.sort(function(a,b){
  		return a[1] - b[1]})


	chart_bump.append("g")
		.selectAll("text")
		.data(by_year_median_income)
		.enter()
		.append("text")
		.attr("x", function (d){ return x_bump(d[1]);})
		//.attr('transform', 'translate( 0,0)')
			.attr("y", this.height+this.margin.bottom)
			.classed("bump_temp", true)
			.text(function (d){ return d[0];})
			.style('font-size', '10px')
			.style('font-family','monospace')
			.style('font-weight','bold')
			.call(xAxis_bump);

  chart_bump.append("g")
	.selectAll("text")
	.data(by_year_median_income)
	.enter()
	.append("text")
		.attr("x", function (d){ return x_bump(d[1]);})
		//.attr('transform', 'translate( 0,0)')
		.attr("y", this.margin.top/12 - 4)
		.classed("bump_temp", true)
		.text(function (d){ return d[2];})
		.style('font-size', '10px')
		.style('font-family','monospace')
		.style('font-weight','bold')
		.call(xAxis_bump)

	chart_bump.append("text")
		.attr("x", (this.width-this.margin.left*2)/2 )
		.attr("y", -15)
		.classed('bump_temp',true)
		.classed('xaxis_bar',true)
		.text('Lowest % Uninsured')
		//.style('font-size', '14px')
		.style('font-family','monospace')
		.append("text")
		.classed('bump_temp',true)

	chart_bump.append("text")
		.attr("x",  (this.width-this.margin.left*2)/2 )
		.attr("y", this.height+this.margin.bottom*2)
		.classed('bump_temp','true')
		.classed('xaxis_bar',true)
		.style('font-family','monospace')
		.text('Highest % Uninsured')
		//.style('font-size', '14px')
		//.style('font-family','monospace')
		.append("text")
		.classed('bump_temp',true)

	  // create 0-$25,000 legend
	var legend1_bump= chart_bump.append('g')
		.attr('height', 100)
		.attr('width', 100)
		.classed('bump_temp',true);

	legend1_bump
	  	.append('rect')
	    .attr('x', this.width)
	    .attr('y', this.height/2 - 175)
	    .attr('width', 15)
	    .attr('height', 15)
	    .attr('fill','#ECF830')

	legend1_bump
	    .append('text')
	    .attr('x', this.width+25)
	      .attr('y', this.height/2 - 162)
	      .classed('ltext_bump',true)
	      .text('<$25k')

	  // create the 25-$50,000 legend
	var legend3_bump = chart_bump.append('g')
	    .attr('height', 100)
	    .attr('width', 100)
	    .classed('bump_temp',true);

	legend3_bump
	    .append('rect')
	    .attr('x', this.width)
	    .attr('y', this.height/2 - 117)
	    .attr('width', 15)
	    .attr('height', 15)
	    .attr('fill','#F97A4F')

	legend3_bump
	    .append('text')
	    .attr('x', this.width+25)
	    .attr('y', this.height/2 - 105.5)
	    .classed('ltext_bump',true)
	    .text('$25k-$50k')
	    .style('font-family','monospace')

	  // create the 50-$75,000 legend
	var legend4_bump = chart_bump.append('g')
	    .attr('height', 100)
	    .attr('width', 100)
	    .classed('bump_temp',true);

	legend4_bump
	    .append('rect')
	    .attr('x', this.width)
	    .attr('y', this.height/2 - 50)
	    .attr('width', 15)
	    .attr('height', 15)
	    .attr('fill', '#9B24A0')

	legend4_bump
	    .append('text')
	    .attr('x', this.width+25)
	    .attr('y', this.height/2 - 37.5)
	    .classed('ltext_bump',true)
	    .text('$50k-$75k')

	  // create the 75-$100,000 legend
	var legend5_bump = chart_bump.append('g')
	    .attr('height', 100)
	    .attr('width', 100)
	    .classed('bump_temp',true);

	legend5_bump
	    .append('rect')
	    .attr('x', this.width)
	    .attr('y', this.height/2 + 10)
	    .attr('width', 15)
	    .attr('height', 15)
	    .attr('fill', '#160B97')

	legend5_bump
	    .append('text')
	    .attr('x', this.width+25)
	    .attr('y', this.height/2 +23)
	    .classed('ltext_bump',true)
	    .text('$75k<')};


//Convert Bump Chart to Line Chart
	//On some click (button)
		// change var line = d3.line()
    //  .x(function(d) { return x_bump(d['year']); })
    //  .y(function(d) { return y_bump(d['% Uninsured']); });

    // 	ybump.domain()
    //	yScale
    //	xScale
    //	call transition().duration()...

    //remove.exit() old chart

 






