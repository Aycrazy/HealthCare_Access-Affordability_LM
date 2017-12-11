

var options_area = {state_area: "all"}

var f = d3.format(".2f")

var aChart = d3.json('all_state_metals_data.json', function (d){ 
  ac = new areaChart(d, options_area)
  });


function changeStateArea(value){
    options_area.state_area = value;
    
    if(options_area.state_area != 'all'){
      d3.selectAll(".area_temp")
          .remove()
          .exit();

      d3.json("state_metals_data.json", function(d) {  
        dataset = d.filter(function(d) { return d.state == options_area.state_area;});
        ac = areaChart(dataset,options_area) 
        })}

    else{   
        //console.log('i ran all');
        d3.selectAll(".area_temp")
          .remove()
          .exit();
        
        d3.json("all_state_metals_data.json",function(d) { 
          
          
        ac = areaChart(d,options_area)
        })}};

function areaChart(area_data, options_area){
  var data = area_data;

  margin = { top: 10, right: 40, bottom: 130, left: 70 };
  width = 550-margin.left-margin.right;
  height = 400-margin.top-margin.bottom;

  d3.select("#area_chart")
    .append('div')
    .attr('id','uninsured')
    .classed('area_temp',true);

  var svg = d3.select("#area_chart")
    .append("svg")
    .attr('width',width+margin.left+margin.right)
    .attr('height',height+margin.top+margin.bottom)
    .classed('area_temp',true);

  var unButton = d3.select('#uninsured');

  unButton.append("button")
    .text('Number Uninsured')

  var x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal().range(['#C468CC','#CCBA97','#958E99','#FFDA68','#83C2CC']);

  var stack = d3.stack();

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .classed('area_temp',true);

  var keys = ['catastrophic','bronze','silver','gold','platinum'];
  

  data = makeOrderVal(data,'area').sort(function(a,b){return a.date - b.date;})
  data = type(data,'area')

  x.domain(d3.extent(data, function(d) {return d.date; }));
  y.domain([0, d3.max(data, function(d){ return d.total;})]);
  z.domain(keys);
  stack.keys(keys);

  var f_date = d3.timeFormat('%b')
  var f_date2 = d3.timeFormat("%y")

  var area = d3.area()
    .x(function(d, i) { return x(d.data.date); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

  var layer = g.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
      .attr("class", "layer");

  layer.append("path")
      .attr("class", "area")
      .style("fill", function(d) { return z(d.key); })
      .attr("d", area);

  layer.filter(function(d) {  return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
    .append("text")
      .attr("x", width - 6)
      .attr("y", function(d) { 
        //console.log(d,'what am i');
        return f(y(d[d.length - 1][0] + d[d.length - 1][1] / 2)); })
      .attr("dy", ".25em")
      .style("font", "10px sans-serif")
      .style("text-anchor", "end");
      //.text(function(d) { console.log(d.key,'key'); return d.key; });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr('transform', 'translate(0,' + (height) + ')')
      .call(d3.axisBottom(x))
      .call(d3.axisBottom(x).tickFormat(function(d){if(f_date(d) == 'Jan'){return f_date2(d)}
        else{return f_date(d)}}))

      .selectAll("text")
        .attr("class", "xaxis_area")
        .attr("transform","translate(0,0)rotate(0)");

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

  g.append('text')             
    .attr('transform', 'translate(' + (70) + ' ,' + (height+43) + ')')
    .attr('class', 'xText_area')
    //.style('text-anchor', 'middle')
    .text('Median Income Level (Percent FPL)');

  // add y axis text
  g.append('text')
    .attr('transform', 'rotate(-90)translate(-' + height + ',-15)')
    .attr('class', 'yText_area')
    .attr('dy', '-2.5em')
    //.style('text-anchor', 'middle')
    .text('Percent Reporting Fair/Poor Health');

  // create catastrophic legend
  var legend1_area= svg.append('g')
    .attr('height', 100)
    .attr('width', 100)
    .classed('area_temp',true);

  legend1_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2 - 165)
    .attr('y', height + 70)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#C468CC')

  legend1_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2 - 140)
    .attr('y', height + 83)
    .attr('class', 'ltext_area')
    .text('Catastrophic')

  // create bronze legend
  var legend2_area = svg.append('g')
    .attr('height', 100)
    .attr('width', 100)
    .classed('area_temp',true);

  legend2_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2 - 30)
    .attr('y', height + 70)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#CCBA97')

  legend2_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2-5)
      .attr('y', height + 83)
      .attr('class', 'ltext_area')
      .text('Bronze')

  // create the silver legend
  var legend3_area = svg.append('g')
    .attr('height', 100)
    .attr('width', 100)
    .classed('area_temp',true);

  legend3_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2 +60)
    .attr('y', height + 70)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#958E99')

  legend3_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2 +85)
      .attr('y', height + 83)
      .attr('class', 'ltext_area')
      .text('Silver')

  // create the Gold legend
  var legend4_area = svg.append('g')
    .attr('height', 100)
    .attr('width', 100)
    .classed('area_temp',true);

  legend4_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2 + 150 )
    .attr('y', height + 70)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#FFDA68')

  legend4_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2 + 175 )
      .attr('y', height + 83)
      .attr('class', 'ltext_area')
      .text('Gold')

  // create the Platinum legend
  var legend5_area = svg.append('g')
    .attr('height', 100)
    .attr('width', 100)
    .classed('area_temp',true);

  legend5_area.selectAll('path')
    .data(data)
    .enter().append('rect')
    .attr('x', width/2+230)
    .attr('y', height + 70)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#83C2CC')

  legend5_area.selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', width/2+255)
      .attr('y', height + 83)
      .attr('class', 'ltext_area')
      .text('Platinum')

  // svg.append('text')
  //   .attr("transform", "translate(" + ( margin.left ) + " ," + margin.top/1.7 + ")")
  //   .text("Area Chart of Metal Plans Purchased by Year " + options_area.state_area)
  //   .style('font-size','16')
  //   .style('font-weight', 'bold')
  //   .style('font-family','monospace')
  //   .append('text')
  //   .classed('area_temp',true)
//tried it, works. No use to it.  Uninsured rate is way higher. Best way to visualize
//this would be with bump chart conversion to line chart.  Instead created button that
//presents number of uninsured in January of new year

  var selected = false;

  d3.select('#uninsured')
    .on('click', function () {
        if(selected == true){
          d3.selectAll('.uText')
            .remove().exit()

          selected = false;}
        
        else{
          selected = true
          lc = makelineChart(options_area)
        }})

function makelineChart(options_area){
  //inspired by Jasmin Dial https://github.com/jdial8/D3-Inequality-/blob/master/index.html

    if(options_area.state_area == 'all'){

      d3.json('all_uninsured_14_16.json', function(d){

        
        lineChart(d);});
    }
    else{
      d3.json('uninsured_14_16.json', function(d){

        
        d = makeOrderVal(d,'line')

        d.filter(function(d) { return  d.state == options_area.state_area;})

          lineChart(d, options_area);})
    }

function lineChart(data){

  var parseYear=d3.timeParse('%Y')

  data = makeOrderVal(data,'line').sort(function(a,b){return a.year - b.year;})

  console.log(data, 'line data');

  y.domain(d3.extent(data, function(d){ return d.num_uninsured;}));

  var g2 = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .classed('area_temp',true);

  // points
   uninsured = g2.selectAll(".uText")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "uText")
    .attr("x", function(d) { if(options_area.state_area != 'all')
      {if(d.state == options_area.state_area){
        return x(parseYear(d.year));}}
    else{
        return x(parseYear(d.year));}
      })
    .attr("y", function (d) {if(options_area.state_area != 'all')
      {if(d.state == options_area.state_area){
        return y(d.num_uninsured);}}
      else
      {return y(d.num_uninsured)}})
    .attr('z',10)
    .text(function (d) {if(options_area.state_area != 'all')
      {if(d.state == options_area.state_area){
        return d.num_uninsured;}}
      else
      {
        return d.num_uninsured}})
    .classed('active',true)
    .classed('area_temp',true);     
    }
  };//end of area chart
 }

function type(d, chartType) {
  //d.date = parseDate(d.date);
  if(chartType == 'area'){
  columns = ['catastrophic','bronze','silver','gold','platinum'];
    }
  else{
  columns = ['num_uninsured'];
    }

  for (var i = 1, n = columns.length; i < n; ++i){ 
    //console.log(d[columns[i]],'bug 263');
    d[columns[i]] = d[columns[i]];
  return d;}
}

function makeOrderVal(d, chartType){
  console.log(d);
  if(chartType == 'area'){

    var parseDate=d3.timeParse('%m/%Y')

    d.forEach( function(e){
    switch(e.date){
      case 'December 2014':
        //console.log('hello');
       e['date']= parseDate('12/2014') ;
       break;

      case 'March 2015':
       e['date']= parseDate('03/2015') ;
       break;

      case 'June 2015':
        e['date']= parseDate('06/2015') ;
       break;

      case 'September 2015':
       e['date']= parseDate('09/2015');
       break;

      case 'December 2015':
       e['date']= parseDate('12/2015');
       break;

      case 'March 2016':
       e['date']= parseDate('03/2016');
       break;
      };})

    return d;
    }//end if
  else{
    d.forEach(function(e){
      switch(e.state){
        
        case 'Illinois':
          e['state']= 'IL';
          break;

        case 'Indiana':
          e['state']= 'IN';
          break;

        case 'Michigan':
          e['state']= 'MI';
          break;

        case 'Wisconsin':
          e['state']= 'WI';
          break;
        };})

    return d
  }//end else
};

