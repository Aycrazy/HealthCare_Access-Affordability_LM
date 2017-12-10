//ideas
    //add drop down to choose county
    //grey out all bubbles exept selected county or state
    //tooltip on click

var value_bubble = 'all';

d3.json("scatter_area_data.json",initialize);

var counties;
var bubble_data;
var bubble;
var color ;
var tool_tip_bubble;



function initialize(error, data) {
    if (error) { throw error }

    console.log(value_bubble, 'value 19')
    

    if(value_bubble != 'all'){
      data = data.filter(function(d) {return d.state_name == value_bubble;});
    }

    var blurStable = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -7'
    var blurIn = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -10'
    var blurOut = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -7'

    var margin = { top: 15, right: 15, bottom: 100, left: 55 };
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;


    bubble = d3.select('#bubble_chart')
        .append('svg')
        .classed('bubble_temp',true)
        .attr('width', width + margin.left + margin.top*2)
        .attr('height', height + margin.top*2 + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        //.attr("fill", "#d3d3d3");

    var x = d3.scaleLinear()
                    .range([0, width]);
    var y = d3.scaleLinear()
                    .range([height, 0]);

    var r = d3.scaleLinear()
                    .range([10, 50]);

    color = d3.scaleOrdinal()
        .domain(["IL","IN",'MI','WI'])
        .range(['#9289d4', '#89ccd4', '#d489a6','#a6d489']);

    var xAxis = d3.axisBottom()
      .scale(x);
    var yAxis = d3.axisLeft()
      .scale(y);
    var dataset;

    var f = d3.format(".2f")

    var yearLabel = bubble.append('text')
        .attr('class', 'year')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('dy', '.28em')
        .style('font-size', width / 3)
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('opacity', 0.2)
        .text('2015');

    x.domain([200, d3.max(data, function (d) { return d.avg_silver_27 })]).nice()
    y.domain([60.00, 100.00]).nice()
    r.domain([0, 400000])

    //if(first_time = true){
    bubble_data = data

    data = d3.nest()
        .key(function (d) { return d.year })
        .key(function (d) { return d.state_name })
        .entries(data)

    data.forEach(function (d) {
        d.values.forEach(function (e) {
            e.total_plan_selections = d3.sum(e.values, function (f) { return f.total_plan_selections })
            e.yes_aptc =   d3.sum(e.values , function (f) {
                return f.yes_aptc})
            e.county_name = d3.max(e.values,function(f){ return f.state_name;})
            e.state = 'yes'
            e.avg_silver_27 = +d3.sum(e.values, function (f) {
                return f.avg_silver_27
            })/+e.values.length
            e.values.forEach(function (f) { f.parent = e })
        })})
    //}

    dataset = data  

    var uniqueStates = data[0].values.map(function (d) { return d.key });

    // from http://www.visualcinnamon.com/2016/06/fun-data-visualizations-svg-gooey-effect.html
	  // modified to create a filter for each continent group, which can be individually transitioned
	  
    var years = d3.range(2015, 2017 + 1);
    var interval = 3000;
    
	  var filters = bubble.append('defs')
	      .selectAll('filter')
	      .data(uniqueStates)
	      .enter()
	      .append('filter') 
	      .attr('id', function (d) { return 'gooeyCodeFilter' + d.replace(' ', '-') });

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

	  bubble.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + margin.left + ',' + (height+10) + ')')
      .call(xAxis)
      .append('text')
	      .attr('x', width-30)
	      .attr('y', 30)
	      .style('text-anchor', 'end')
	      .style('font-weight', 'bold')
	      .text('Average Silver Plan Premium');

	  bubble.append('g')
      .attr('class', 'y axis')
      .attr('transform','translate('+ margin.left + ',' + 10 + ')')
      .call(yAxis.tickFormat(function(d) { return d + "%"; }))
      .append('text')
	      .attr('transform','rotate(-90)')
	      .attr('x', 0)
	      .attr('y', -55)
	      .style('text-anchor', 'end')
	      .style('font-weight', 'bold')
	      .text('Percent with Tax Credits');

	  var yearIndex = 0;
	  var year = '' + years[yearIndex];
	  var exploded = d3.set();
	  var blurTransition = d3.set();

	  d3.select('#explode')
	  .on('click', function () {
	      uniqueStates.forEach(function (d) {
	          if (!exploded.has(d)) {
	              exploded.add(d)
	              blurTransition.add(d)
	          }})


    //     bubble.selectAll('.bubble_temp')
    //                .remove().exit();


    //     d3.select("#controls")
    //       .append('div')
    //       .attr('id','countyDropDown');

    //       var topicMenu = d3.select('#countyDropDown')
    //         .classed('bubble_temp',true);

    //       //bubble_data = d3.map(x  = )

    //       console.log( bubble_data, 'bubb_data');

    //       topicMenu.append("select")
    //             .selectAll("option")
    //             .data(bubble_data)
    //             .enter()
    //             .append("option")
    //             .classed('bubble_temp',true)
    //             .attr("value",function(d){
    //             return d.county_name})
    //             .text(function(d){
    //             return d.county_name+', '+d.state_name})

    //         topicMenu.on('change', function(){

    // // Find which topic was selected from the dropdown
    //         var selectedTopic = d3.select(this)
    //                 .select("select")
    //                 .property("value")

    //             // Run update function with the selected fruit

    //         updateCircles(selectedTopic)
            

	   //    })
        ;})//end explode
	  

	  d3.select('#collapse').on('click', function () {
        uniqueStates.forEach(function (d) {

            if (exploded.has(d)) {
                exploded.remove(d)
                blurTransition.add(d)
            }
        })
    })

      d3.select('#reset')
        .on('click', function () {
          bubble.selectAll('.tooltip_bubble')
            .remove().exit();

          yearIndex = 0
          year = '' + years[yearIndex]
          first_time=false;
        update()

      })


    var states = bubble.selectAll('.state')
      .data(data[0].values)
      .enter().append('g')
      .attr('class', 'state')
      //.attr('id',function (d) { //console.log(d.key.replace('','text'), 'EXP'); return d.key.toLowerCase().replace(' ','text') })
      .attr('id',function (d) { return d.key.replace('','bubble')})
      .style('filter', function (d) { return 'url(#gooeyCodeFilter' + d.key.replace(' ', '-') + ')' })

    states.append('circle')
        .attr('class', 'aggregate')
        .attr('cx', width/2)
        .attr('cy', height / 2)
        .style('fill', function (d) {return color(d.key) })
        .attr('fill-opacity', 0.5)
        .attr('stroke', "#cecece")
        .on('click', function (d) { //console.log(d.state_name,'line 198 explode');
         exploded.add(d.key); blurTransition.add(d.key) })
        //.append('title').text(function (d) { return d.key })

    update()
    d3.interval(incrementYear, interval)
    
    function incrementYear() {
        if(year < 2017){
        year = '' + years[++yearIndex >= years.length ? yearIndex = 0 : yearIndex]
        update()
        }
        //make a button to reset
    }
    
    function update() {

        bubble.selectAll('.tooltip_bubble')
          .exit()
          .remove()

        yearLabel.transition().duration(0).delay(interval/2).text(year)
    

        //states.append('title').text(function (d) { return d.state_name })

        states = states.data(
            data.find(function (d) { return d.key === year }).values,
            function (d) { return d.key }
        )

        counties = states.selectAll('.county')
            .data(function (d) { return d.values }, function (d) { return d.county_name })

        counties.exit().remove()

        var enterCounties = counties.enter().insert('circle', '.aggregate')
            .attr('class', 'county')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('fill', function (d) { return color(d.state_name) })
            .attr('fill-opacity', 0.5)
            .attr('stroke', "#cecece")
            .on('click', function (d) {//console.log(d.state_name, d.county_name,'line 237 explode');
             exploded.remove(d.state_name); blurTransition.add(d.state_name);})

        //enterCounties.append('title').text(function (d) { return d.county_name })

        counties = counties.merge(enterCounties)

        //console.log(counties,'counties after merge');

        var t =  d3.transition()
                    .ease(d3.easeLinear)
                    .duration(1400)
                     .delay(interval/2)

        //console.log("before selecting .aggregate");
        //console.log(exploded,"exploded")

        states.select('.aggregate')
            .transition(t)
            .attr('r', function (d) { return
                exploded.has(d.key) ? 0 : r(d.total_plan_selections);
            })
            .attr('cx', function (d) { return x(d.avg_silver_27) })
            .attr('cy', function (d) { var retval = exploded.has(d.key) ? 0 : y(f(d.yes_aptc/d.total_plan_selections*100));
                return retval
            })
            


        //console.log("after selecting .aggregate");

        counties
            .transition(t)
            .attr('r', function (d) {
                var retval = (exploded.has(d.state_name) ? d: d.parent).total_plan_selections;
                return r(retval); })
            .attr('cx', function (d) {
                return x((exploded.has(d.state_name) ? d : d.parent).avg_silver_27) })
            .attr('cy', function (d) {
                var retval = y(f((exploded.has(d.state_name) ? d : d.parent).yes_aptc/(exploded.has(d.state_name) ? d : d.parent).total_plan_selections *100));
                //console.log(retval);
                if(retval){ return retval;}})
                        
         // Tooltips
         
            var tooltip_bubble = d3.select("#bubble_chart").append("div")
                .attr("class", "tooltip_bubble");
                //.classed('bubble_temp',true);

            bubble.selectAll("circle")
                .on("mouseover", function(d) {  
                  //console.log(exploded.size(), 'explode length');
                  if(year == '2017'){
                    if(!exploded.size()){
                      bubble.selectAll('.state');

                       tooltip_bubble.html("Yes APTC %: " + f(d.yes_aptc/d.total_plan_selections *100) +
                                  "<br/>" + "Region: " + d.state_name+
                          "<br/>" + "Total Plan Selection: " + d.total_plan_selections +
                          "<br/>" + "Year: " + d.year)
                          .style("visibility", "visible");

                        tooltip_bubble.style("top", event.pageY - (tooltip_bubble.node().clientHeight + 5) + "px")
                       .style("left", event.pageX - (tooltip_bubble.node().clientWidth)*4 + "px");
                      }
                    else{
                      bubble.selectAll('.county');

                      tooltip_bubble.html("Yes APTC %: " + f(d.yes_aptc/d.total_plan_selections *100) +
                                  "<br/>" + "Region: " + d.county_name+
                                  //"<br/>" + "County: " + d.county_name+
                          "<br/>" + "Total Plan Selection: " + d.total_plan_selections +
                          "<br/>" + "Year: " + d.year)
                          .style("visibility", "visible");

                       tooltip_bubble.style("top", event.pageY - (tooltip_bubble.node().clientHeight + 5) + "px")
                       .style("left", event.pageX - (tooltip_bubble.node().clientWidth*4 ) + "px");
                      }}
                    else{

                      bubble.selectAll('.tooltip_bubble')
                        .exit()
                        .remove()
                            }
                    
                    })

              //.on("mousemove", function(d) {
                //tooltip_bubble.style("top", event.pageY - (tooltip_bubble.node().clientHeight + 55) + "px")
                //    .style("left", event.pageX - (tooltip_bubble.node().clientWidth / 2.0) + "px");
              //})
              .on("mouseout", function(d) {
                bubble.selectAll('.county');

                tooltip_bubble.style("visibility", "hidden");
              })//end tooltip
       

          
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

    // create Illinois legend
  var legend1_area= bubble.append('g')
    .attr('height', 100)
    .attr('width', 100);
    
  legend1_area.append('rect')
    .attr('x', width/2 - 160)
    .attr('y', height + margin.top*4)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#9289d4')

  legend1_area.append('text')
    .attr('x', width/2 - 135)
      .attr('y', height + margin.top*4.7)
      .attr('class', 'ltext_area')
      .text('Illinois')

  // create Indi legend
  var legend2_area = bubble.append('g')
    .attr('height', 100)
    .attr('width', 100);
    
  legend2_area.append('rect')
    .attr('x', width/2 - 60)
    .attr('y', height + margin.top*4)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#89ccd4')

  legend2_area.append('text')
    .attr('x', width/2 - 35)
      .attr('y', height + margin.top*4.7)
      .attr('class', 'ltext_area')
      .text('Indiana')

  // create the Mich legend
  var legend3_area = bubble.append('g')
    .attr('height', 100)
    .attr('width', 100);

  legend3_area.append('rect')
    .attr('x', width/2 +30)
    .attr('y', height + margin.top*4)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#d489a6')

  legend3_area.append('text')
    .attr('x', width/2 +55)
      .attr('y', height + margin.top*4.7)
      .attr('class', 'ltext_area')
      .text('Michigan')

  // create the Wisco legend
  var legend4_area = bubble.append('g')
    .attr('height', 100)
    .attr('width', 100);

  legend4_area.append('rect')
    .attr('x', width/2 + 130 )
    .attr('y', height + margin.top*4)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill','#a6d489')

  legend4_area.append('text')
    .attr('x', width/2 + 155 )
      .attr('y', height + margin.top*4.7)
      .attr('class', 'ltext_area')
      .text('Wisconsin')

	  };//end scatter function


function changeStateBubble(value_bubble){

  // for(key in all_abbr){
  //   if(key != value){

  //      console.log(value,'VALUE');

  //      var active   = all_abbr[key].active ? false : true,
  //      newOpacity = active ? 0 : 1;
  //      // hide or show the elements
  //      //console.log('#bubble'+key);
  //      d3.select('#bubble'+key).style("opacity", newOpacity);
  //      // update whether or not the elements are active
  //      all_abbr[key].active = active;
  //   }}
    value_bubble = value_bubble;

    console.log(value_bubble,'value 508');

    d3.selectAll(".bubble_temp")
        .remove()
        .exit();

    d3.json("scatter_area_data.json",initialize);

};
   // determine if current circle is visible


//not currently working
    function updateCircles(value){

              bubble.selectAll('circle')
                .transition()
                .duration(1000)
                .on("start",function(d){
                  console.log(d.county_name);
                  if(!d.hasOwnProperty(value)){
                  d3.select(this)
                    .attr('opacity', 0);}
                  })
                .transition()
                .duration(1000)
                .attr("opacity", .4)
              }
