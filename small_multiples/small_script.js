
var data = d3.json('metals_data.json', function(d){
	makeSmallMultiples(d);})

console.log(data);

d3.json("metals_data.json", function(d) {  
	    	sM = makeSmallMultiples(d) 
	  		})

function makeSmallMultiples(dataset){

	//console.log(dataset);
	var margin = {top: 8, right: 10, bottom: 2, left: 10},
  width = 100 - margin.left - margin.right,
  height = 69 - margin.top - margin.bottom;

	var nested = d3.nest()
			.key(function(k){
				//console.log(k);
				return k.county;
			})
			.key(function(k){
				return k.year
			})
			.entries(dataset);

		console.log(nested);

	var x = d3.scaleTime()
    .range([0, width]);

	var y = d3.scaleLinear()
	    .range([height, 0]);

	var area = d3.svg.area()
	    .x(function(d) { return x(d.year); })
	    .y0(height)
	    .y1(function(d) { return y(d.catastrophic); })
	    .y1(function(d) { return y(d.bronze); })
	    .y1(function(d) { return y(d.silver); });
	    .y1(function(d) { return y(d.); })

	var line = d3.svg.line()
	    .x(function(d) { return x(d.year); })
	    .y(function(d) { return y(d.insured); });


	// 	var yExtent = fc.extentLinear()
 //      .accessors([function(d) {
 //      	console.log(d.num_uninsured, 'county 25')
 //       return d.county; }])
 //    	.pad([0, 0.2])
 //    	.include([0]);
  
 //  	var xExtent = fc.extentLinear()
 //    	.accessors([function(d) { return d.year; }]);

 //    var area = fc.seriesSvgArea()
 //      .crossValue(function(d) { return d.year; })
 //      .mainValue(function(d) { return d.county; });
  
 //  	var line = fc.seriesSvgLine()
 //      .crossValue(function(d) { return d.year; })
 //      .mainValue(function(d) { return d.county; });
  	
 //  	var multi = fc.seriesSvgMulti()
 //    	.series([area, line, gridlines, line, point])
 //      .mapping(function(data, index, series) {
 //      	console.log(data);
 //        switch (series[index]) {
 //        case point:            
 //        case line:
 //          return data.trackball;
 //        default:
 //          return data.values;
 //        }
 //      });

 //  	var gridlines = fc.annotationSvgGridline()
 //    	.xTicks(0)
 //    	.yTicks(3);

 //    var point = fc.seriesSvgPoint()
 //      .crossValue(function(d) { return d.year; })
 //      .mainValue(function(d) { return d.value; })
 //    	.size(25)
 //    	.decorate(function(selection) {
 //        selection.enter()
 //        	.append('text');        
 //        selection.select('text')
 //        	.text(d => d.value)
 //      })

 //    var xScale = d3.scaleLinear();
 
    // create a chart
    // var chart = fc.chartSvgCartesian(
    //     xScale,
    //     d3.scaleLinear())
    //   .yDomain(yExtent(d))
    // 	.xDomain(xExtent(d))
    // 	.xLabel(function(d) { return d.key; })
    // 	.yTicks(3)
    // 	.xTicks(2)
    // 	.xTickFormat(d3.format('0'))
    //   .yOrient('left')
    // 	.plotArea(multi);

   //  var xScale = d3.scaleLinear();
 
   //  // create a chart
   //  var chart = fc.chartSvgCartesian(
   //      xScale,
   //      d3.scaleLinear())
   //    .yDomain(yExtent(d))
   //  	.xDomain(xExtent(d))
   //  	.xLabel(function(d) { return d.key; })
   //  	.yTicks(3)
   //  	.xTicks(2)
   //  	.xTickFormat(d3.format('0'))
   //    .yOrient('left')
   //  	.plotArea(multi);
  
   //  function render() {
   //  	var update = d3.select('#small-multiples')
   //      .selectAll('div.multiple')
   //      .data(nested);
   //    update.enter()
   //      .append('div')
   //    	.classed('multiple', true)
   //    	.merge(update)
   //      .call(chart)
   //      .classed('tooltip', function(d) { return d.trackball.length; });

   //    // add the pointer component to the plot-area, re-rendering
   //    // each time the event fires.
   //    var pointer = fc.pointer()
   //      .on('point', function(event) {
   //        if (event.length) {
   //          // determine the year
   //          var year = Math.round(xScale.invert(event[0].x));
   //          // add the point to each series
   //          nested.forEach(function(group) {
   //            var value = group.values.find(function(v) { return v.year === year; });
   //            group.trackball = [{
   //              year: year,
   //              value: value.county
   //            }];
   //          })
   //        } else {
   //          nested.forEach(function(g) {
   //            g.trackball = [];
   //          })
   //        }
   //        render();
   //      });

   //    d3.selectAll('#small-multiples .plot-area')
   //      .call(pointer);  
   //  }
  
  	// render();
	};
