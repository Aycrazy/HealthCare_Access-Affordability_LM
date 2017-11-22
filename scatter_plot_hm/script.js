var years = d3.range(2015, 2017 + 1);
var interval = 3000;


var blurStable = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -7';
var blurIn = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -11';
var blurOut = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7';

var margin = { top: 15, right: 15, bottom: 45, left: 55 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;


var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.top)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleLinear()
				.range([0, width]);
var y = d3.scaleLinear()
				.range([height, 0]);
var r = d3.scaleLinear()
				.range([0, 50]);
var color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.axisBottom()
						.scale(x);
var yAxis = d3.axisLeft()
						.scale(y);
var dataset;

var f = d3.format(".2f")

var yearLabel = svg.append('text')
    .attr('class', 'year')
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('dy', '.28em')
    .style('font-size', width / 3)
    .style('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .style('opacity', 0.2)
    .text('2015');


d3.json("scatter_area_data.json", initialize);

function initialize(error, data) {
    if (error) { throw error }

  	//could the issue be here?
    x.domain([200, d3.max(data, function (d) { return d.avg_silver_27 })]).nice()
    y.domain([0, 400000]).nice()
    r.domain([0, 100])
   
   console.log(r(0));

    console.log(f(d3.max(data.map(function (d) { 
    	return d.yes_aptc/d.total_plan_selections})))*100, 'mad max');

    data = d3.nest()
        .key(function (d) { return d.year })
        .key(function (d) { return d.state_name })
        .entries(data)

    data.forEach(function (d) {
        d.values.forEach(function (e) {
            e.total_plan_selections = d3.sum(e.values, function (f) { return f.total_plan_selections })
            e.yes_aptc = +d3.sum(e.values, function (f) { 
                return f.yes_aptc/f.total_plan_selections
            })/+e.values.length
            e.avg_silver_27 = +d3.sum(e.values, function (f) {
                return f.avg_silver_27
            })/+e.values.length
            e.values.forEach(function (f) { f.parent = e })

        })
    })

    //var max_total_plan_selection = d3.max(data[3].values, function (d) { return d.total_plan_selections })
    
    console.log(data);

    var uniqueStates = data[0].values.map(function (d) { console.log(d,'unique'); return d.key });

    // from http://www.visualcinnamon.com/2016/06/fun-data-visualizations-svg-gooey-effect.html
	  // modified to create a filter for each continent group, which can be individually transitioned
	  
	  var filters = svg.append('defs')
	      .selectAll('filter')
	      .data(uniqueStates)
	      .enter()
	      .append('filter') 
	      .attr('id', function (d) { return 'gooeyCodeFilter-' + d.replace(' ', '-') });

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


	  filters.append('feBlend')
	      .attr('in', 'SourceGraphic')
	      .attr('in2', 'gooey');

	  svg.append('g')
	      .attr('class', 'x axis')
	      .attr('transform', 'translate(' + margin.left + ',' + height + ')')
	      .call(xAxis)
	      .append('text')
	      .attr('x', width-55)
	      .attr('y', 30)
	      .style('text-anchor', 'end')
	      .style('font-weight', 'bold')
	      .text('Average Silver Plan Premium Price Per Month ');

	  svg.append('g')
	      .attr('class', 'y axis')
	      .attr('transform','translate('+ margin.left + ',' + 0 + ')')
	      .call(yAxis)
	      .append('text')
	      .attr('transform','rotate(-90)')
	      .attr('x', 0)
	      .attr('y', -55)
	      .style('text-anchor', 'end')
	      .style('font-weight', 'bold')
	      .text('Total Plan Selections (Policy)');

	  var yearIndex = 0;
	  var year = '' + years[yearIndex];
	  var exploded = d3.set();
	  var blurTransition = d3.set();

	  d3.select('#explode')
	  .on('click', function () {
	      uniqueStates.forEach(function (d) {
	      	console.log(d,'hello');
	          if (!exploded.has(d)) {
	              exploded.add(d)
	              blurTransition.add(d)
	          }
	      });
	  })

	  d3.select('#collapse').on('click', function () {
        uniqueStates.forEach(function (d) {
            if (exploded.has(d)) {
                exploded.remove(d)
                blurTransition.add(d)
            }
        })
    })

   console.log(data,"data before year");

    var states = svg.selectAll('.state')
                    .data(data[0].values)
                    .enter().append('g')
                    .attr('class', 'state')
                    .style('filter', function (d) { return 'url(#gooeyCodeFilter-' + d.key.replace(' ', '-') + ')' })

    console.log("HERE")
    //console.log(years);


    states.append('circle')
        .attr('class', 'aggregate')
        .attr('cx', width/2)
        .attr('cy', height / 2)
        //.attr('r',function(d,i) {
        //    return 10*i;
        //})
        .style('fill', function (d) { return color(d.key) })
        .on('click', function (d) { exploded.add(d.key); blurTransition.add(d.state_name) })
        .append('title').text(function (d) { return d.key });

    update()
    d3.interval(incrementYear, interval)

    function incrementYear() {
        year = '' + years[++yearIndex >= years.length ? yearIndex = 0 : yearIndex]
        update()
    }

    function update() {
        yearLabel.transition().duration(0).delay(interval / 2).text(year)
        states = states.data(
            data.find(function (d) { return d.key === year }).values,
            function (d) { return d.key }
        )

        var counties = states.selectAll('.county')
            .data(function (d) { return d.values }, function (d) { return d.county_name })

        counties.exit().remove()

        var enterCounties = counties.enter().insert('circle', '.aggregate')
            .attr('class', 'county')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .style('fill', function (d) { return color(d.state_name) })
            .on('click', function (d) { exploded.remove(d.state_name); blurTransition.add(d.state_name) })

        enterCounties.append('title').text(function (d) { return d.county_name })

        counties = counties.merge(enterCounties)

        var t = d3.transition()
            .ease(d3.easeLinear)
            .duration(interval)

        states.select('.aggregate')
            .transition(t)
            .attr('r', function (d) { return exploded.has(d.key) ? 0 : r(f(d.yes_aptc/d.total_plan_selections*100)) })
            .attr('cx', function (d) { return x(d.avg_silver_27) })
            .attr('cy', function (d) { return y(d.total_plan_selections) })

        counties
            .transition(t)
            .attr('r', function (d) {  return r(f(d.yes_aptc/d.total_plan_selections)*100)})
            .attr('cx', function (d) { return x((exploded.has(d.state_name) ? d : d.parent).avg_silver_27) })
            .attr('cy', function (d) { return y((exploded.has(d.state_name) ? d : d.parent).total_plan_selections) })

        blurValues
            .transition(t)
            .attrTween('values', function (d) {
                if (blurTransition.has(d)) {
                    blurTransition.remove(d)

                    if (exploded.has(d)) {
                        return d3.interpolateString(blurIn, blurOut)
                    } else {
                        return d3.interpolateString(blurOut, blurIn)
                    }
                }

                return function () { return blurStable }
            })
     }

	  };

		
	 