

var options_area = {state_area: "all"}



var f = d3.format(".2f")

var area = d3.json('all_state_metals_data.json', function (d){ 

   keys = d3.keys(d[0]).slice(1,5);

    ac = new areaChart(type(d,columns = keys), options_area)
  });

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


  data  = area_data

  var svg = d3.select("#area_chart").append("svg");


  margin = { top: 65, right: 0, bottom: 30, left: 70 };
  width = 960 - margin.left - margin.right;
  height = 800 - margin.top - margin.bottom;

  var x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);

  var area = d3.area()
    .x(function(d, i) { console.log(d.data.date); return x(d.data.date); })
    .y0(function(d) { console.log(d[0],'hi'); return y(d[0]); })
    .y1(function(d) { console.log(d[1],'hi2'); return y(d[1]); });



  var stack = d3.stack();


  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var keys = ['catastrophic','bronze','silver','gold','platinum']

  console.log(keys);


  x.domain(d3.extent(data, function(d) {console.log(d.date); return d.date; }));
  y.domain([0.00, 700000.00])
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

  layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
    .append("text")
      .attr("x", width - 6)
      .attr("y", function(d) { console.log (f(y(d[d.length - 1][0] + d[d.length - 1][1] / 2)));
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
  console.log(d);
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]];
  return d;
}