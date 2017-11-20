	var years = d3.range(2014, 2017 + 1);
	var interval = 500;


  var blurStable = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -7'
  var blurIn = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -11'
  var blurOut = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7'

	var margin = { top: 15, right: 15, bottom: 45, left: 55 };
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;


	var svg = d3.select('chart')
	    .append('svg')
	    .attr('width', width + margin.left + margin.top)
	    .attr('height', height + margin.top + margin.bottom)
	    .append('g')
	    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	var x = d3.scaleLinear()
					.range([0, width]);
	var y = d3.scaleLinear()
					.range([height, 0]);
	var r = d3.scaleSqrt()
					.range([0, 50]);
	var color = d3.scaleOrdinal()
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis = d3.axisBottom()
							.scale(x);
	var yAxis = d3.axisLeft()
							.scale(y);
	var dataset;

	var yearLabel = svg.append('text')
	    .attr('class', 'year')
	    .attr('x', width / 2)
	    .attr('y', height / 2)
	    .attr('dy', '.28em')
	    .style('font-size', width / 3)
	    .style('text-anchor', 'middle')
	    .style('font-weight', 'bold')
	    .style('opacity', 0.2)
	    .text('2014');


	d3.json("scatter_area_data.json", initialize, function (error,data) {

			dataset = data;
	    // console.log(data);
	  });

	function initialize(error, data) {
	    if (error) { throw error }

	    console.log(data);

	    x.domain([0, d3.max(data, function (d) { return d.avg_silver_27 })]);//.nice()
	    y.domain([0, d3.max(data, function (d) { return d.total_plan_selections })]);//.nice()
	    r.domain([0, d3.max(data, function (d) { return d.yes_aptc})]);

	    data = d3.nest()
	        .key(function (d) { return d.year })
	        .key(function (d) { return d.state_name })
	        .entries(data)

	    data.forEach(function (d) {
	        d.values.forEach(function (e) {
	            e.total_plan_selections = d3.sum(e.values, function (f) { return f.total_plan_selections })
	            e.yes_aptc = d3.sum(e.values, function (f) { 
	                return f.total_plan_selections * f.yes_aptc
	            }) / e.total_plan_selections
	            e.avg_silver_27 = d3.sum(e.values, function (f) {
	                return f.total_plan_selections * f.avg_silver_27
	            }) / e.total_plan_selections
	            e.values.forEach(function (f) { f.parent = e })
	        })
	    })

	    var uniqueStates = data[0].values.map(function (d) { console.log(d,'unique'); return d.key });
	    // from http://www.visualcinnamon.com/2016/06/fun-data-visualizations-svg-gooey-effect.html
		  // modified to create a filter for each continent group, which can be individually transitioned
		  
		  console.log(uniqueStates,'test')

		  var filters = svg.append('defs')
		      //.selectAll('filter')
		      .data(uniqueStates)
		      .enter()
		      .append('filter') 
		      .attr('id', function (d) { return 'gooeyCodeFilter-' + d.replace(' ', '-') });

		   console.log(filters);

		  filters.append('feGaussianBlur')
		      .attr('in', 'SourceGraphic')
		      .attr('stdDeviation', '10')
		      .attr('color-interpolation-filters', 'sRGB')
		      .attr('result', 'blur');

		  var blurValues = filters.append('feColorMatrix')
		      .attr('class', 'blurValues')
		      .attr('in', 'blur')
		      .attr('mode', 'matrix')
		      .attr('values', blurStable)
		      .attr('result', 'gooey');

		  console.log(blurValues);

		  filters.append('feBlend')
		      .attr('in', 'SourceGraphic')
		      .attr('in2', 'gooey');

		  svg.append('g')
		      .attr('class', 'x axis')
		      .attr('transform', 'translate(0,' + height + ')')
		      .call(xAxis)
		      .append('text')
		      .attr('x', width)
		      .attr('y', 30)
		      .style('text-anchor', 'end')
		      .style('font-weight', 'bold')
		      .text('Fertility (births per woman)');

		  svg.append('g')
		      .attr('class', 'y axis')
		      .call(yAxis)
		      .append('text')
		      .attr('transform', 'rotate(-90)')
		      .attr('x', 0)
		      .attr('y', -30)
		      .style('text-anchor', 'end')
		      .style('font-weight', 'bold')
		      .text('Life expectancy (years)');

		  var yearIndex = 0
		  var year = '' + years[yearIndex]
		  var exploded = d3.set()
		  console.log(exploded);
		  var blurTransition = d3.set()

		  // d3.select('#explode')
		  // .on('click', function () {
		  //     uniqueStates.forEach(function (d) {
		  //     	console.log(d,'hello');
		  //         if (!exploded.has(d)) {
		  //             exploded.add(d)
		  //             blurTransition.add(d)
		  //         }
		  //     });
		  // })

		  // d3.select('#collapse').on('click', function () {
	   //      uniqueStates.forEach(function (d) {
	   //          if (exploded.has(d)) {
	   //              exploded.remove(d)
	   //              blurTransition.add(d)
	   //          }
	   //      })
	   //  })

	    var states = svg.select('.state_name')
	        .data(data[0].values)
	        .enter()
	        .append('g')
	        .attr('class', 'state_name')
	        .style('filter', function (d) { console.log(d.key, 'test2'); return 'url(#gooeyCodeFilter-' + d.key.replace(' ', '-') + ')' })

	    console.log(states);

	    states.append('circle')
	        .attr('class', 'aggregate')
	        .attr('cx', width / 2)
	        .attr('cy', height / 2)
	        .style('fill', function (d) { console.log(d); return color(d.key) })
	        //.on('click', function (d) { exploded.add(d.key); blurTransition.add(d.state_name) })
	        .append('title').text(function (d) { return d.key })

	    // update()
	    // d3.interval(incrementYear, interval)

	    // function incrementYear() {
	    //     year = '' + years[++yearIndex >= years.length ? yearIndex = 0 : yearIndex]
	    //     update()
	    // }

	    // function update() {
	    //     yearLabel.transition().duration(0).delay(interval / 2).text(year)
	    //     states = states.data(
	    //         data.find(function (d) { console.log(d); return d.key === year }).values,
	    //         function (d) { return d.key }
	    //     )

	    //     var counties = counties.selectAll('.county_name')
	    //         .data(function (d) { return d.values }, function (d) { return d.county_name })

	    //     counties.exit().remove()

	    //     var enterCounties = countries.enter().insert('circle', '.aggregate')
	    //         .attr('class', 'country')
	    //         .attr('cx', width / 2)
	    //         .attr('cy', height / 2)
	    //         .style('fill', function (d) { return color(d.state_name) })
	    //         .on('click', function (d) { exploded.remove(d.state_name); blurTransition.add(d.state_name) })

	    //     enterCounties.append('title').text(function (d) { return d.country })

	    //     counties = counties.merge(enterCounties)

	    //     var t = d3.transition()
	    //         .ease(d3.easeLinear)
	    //         .duration(interval)

	    //     states.select('.aggregate')
	    //         .transition(t)
	    //         .attr('r', function (d) { return exploded.has(d.key) ? 0 : r(d.yes_aptc) })
	    //         .attr('cx', function (d) { return x(d.avg_silver_27) })
	    //         .attr('cy', function (d) { return y(d.total_plan_selections) })

	    //     states
	    //         .transition(t)
	    //         .attr('r', function (d) { return r(d.population) })
	    //         .attr('cx', function (d) { return x((exploded.has(d.state_name) ? d : d.parent).avg_silver_27) })
	    //         .attr('cy', function (d) { return y((exploded.has(d.state_name) ? d : d.parent).total_plan_selections) })

	    //     blurValues
	    //         .transition(t)
	    //         .attrTween('values', function (d) {
	    //             if (blurTransition.has(d)) {
	    //                 blurTransition.remove(d)

	    //                 if (exploded.has(d)) {
	    //                     return d3.interpolateString(blurIn, blurOut)
	    //                 } else {
	    //                     return d3.interpolateString(blurOut, blurIn)
	    //                 }
	    //             }

	    //             return function () { return blurStable }
	    //         })
	    // }

		  };

			
		 