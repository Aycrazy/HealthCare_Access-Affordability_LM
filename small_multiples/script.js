

var options_area = {state_area: "all"}


var f = d3.format(".2f")



var aChart = d3.json('all_state_metals_data.json', function (d){ 

  d = makeOrderVal(d);
  
  d = d.sort(function(a,b){return a.month - b.month;
      });

  console.log(d)

  var keys = ['catastrophic','bronze','silver','gold','platinum'];

  ac = new areaChart(type(d,columns = keys), options_area)
  });

//var parseDate = d3.timeParse("%B %Y");

function changeStateArea(value){
    options_area.state_area = value;
    console.log(options_area, "line 4 area")
    if(options_area.state_area != 'all'){
      console.log('i ran a state');
      d3.selectAll(".area_temp")
          .remove()
          .exit();

      d3.json("state_metals_data.json", function(d) {  
        dataset = d.filter(function(d) {return d.state == options_area.state_area;});
         
         keys = d3.keys(dataset[0]).slice(1,5);

        dataset = type(dataset,columns = keys)
        ac = areaChart(dataset,options_area) 
        })}
    else{   
        console.log('i ran all');
        d3.selectAll(".area_temp")
          .remove()
          .exit();
        d3.json("all_state_metals_data.json",function(d) { 
          keys = d3.keys(d[0]).slice(1,5);
          d = type(d,columns = keys)
          ac = areaChart(d,options_area)
        }) 
      }};

function areaChart(area_data, options_area){



  var data = area_data;
  console.log(data);

  margin = { top: 65, right: 0, bottom: 30, left: 70 };
  width = 700 - margin.left - margin.right;
  height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#area_chart")
            .append("svg")
            .attr('height',700)
            .attr('width',500);

  var x = d3.scaleBand().range([0, 500]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);

  var area = d3.area()
    .x(function(d, i) { console.log(d.data.date); return x(d.data.date); })
    .y0(function(d) { console.log(d[0],'hi'); return y(d[0]); })
    .y1(function(d) { console.log(d[1],'hi2'); return y(d[1]); });



  var stack = d3.stack();


  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var keys = ['catastrophic','bronze','silver','gold','platinum'];

  console.log(keys);


  x.domain(['December 2014','March 2015', 'June 2015','September 2015','December 2015','March 2016']);
  y.domain([0.00, 1200000.00])
  z.domain(keys);
  stack.keys(keys);


  var layer = g.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
      .attr("class", "layer");

  console.log(layer,'layer');

  layer.append("path")
      .attr("class", "area")
      .style("fill", function(d) { console.log(d.key, z(d.key),'z'); return z(d.key); })
      .attr("d", area);

  layer.filter(function(d) { console.log(d); return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
    .append("text")
      .attr("x", width - 6)
      .attr("y", function(d) { 
        console.log(d,'what am i');
        return f(y(d[d.length - 1][0] + d[d.length - 1][1] / 2)); })
      .attr("dy", ".35em")
      .style("font", "10px sans-serif")
      .style("text-anchor", "end")
      .text(function(d) { console.log(d.key,'key'); return d.key; });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

}

function type(d, columns) {
  //d.date = parseDate(d.date);
  

  console.log(d.date)
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]];
  return d;
}

function makeOrderVal(d){

  keys = ['catastrophic','bronze','silver','gold','platinum'];
  console.log(d);

  switch(d.date){
    case 'December 2014':
     d['month']= 1 ;
     break;

    case 'March 2015':
     d['month']= 2 ;
     break;

    case 'June 2015':
      d['month']= 3 ;
     break;

    case 'September 2015':
     d['month']= 4 ;
     break;

    case 'December 2015':
     d['month']= 5 ;
     break;

    case 'March 2016':
     d['month']= 6 ;
     break;
    };

  console.log(d['month']);
  return d;
}