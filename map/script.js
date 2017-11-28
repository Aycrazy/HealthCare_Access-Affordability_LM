
// clickable map code from: http://d3indepth.com/geographic/
  var geojson = {}
  var context = d3.select('#content canvas')
    .node()
    .getContext('2d');

  var projection = d3.geoMercator();

  var geoGenerator = d3.geoPath()
    .projection(projection)
    .context(context);

  var state = {
    clickedLocation: null
  };

  function handleClick() {
    var pos = d3.mouse(this)
    state.clickedLocation = projection.invert(pos)
    update()
  };

  function initialise() {
    d3.select('canvas')
      .on('click', handleClick);
  };

  function update() {
    projection.fitExtent([[20, 20], [620, 420]], geojson);
    context.clearRect(0, 0, 800, 400);
    geojson.features.forEach(function(d) {
      if(state.clickedLocation) {
        if(d3.geoContains(d, state.clickedLocation)) {
          state_name = d.properties.NAME
          console.log(state_name)
        };
      }
      context.beginPath();
      context.fillStyle = state.clickedLocation && d3.geoContains(d, state.clickedLocation) ? 'rgba(77, 182, 172, .5)' : 'rgba(77, 182, 172, .2)';
      geoGenerator(d);
      context.fill(); 
      //context.strokeStyle = state.clickedLocation && d3.geoContains(d, state.clickedLocation) ? 'rgba(77, 182, 172, .5)' : 'rgba(77, 182, 172, .2)';
      //context.stroke();    
    })
  };

  // REQUEST state level DATA
  d3.json('state_level_geojson.json', function(err, json) {
    geojson = json;
    initialise();
    update();
  });

  function countyUpdate(counties) {
    projection.fitExtent([[20, 20], [620, 420]], counties);

    context.lineWidth = 0.5;
    context.strokeStyle = '#888';

    context.beginPath();
    geoGenerator({type: 'FeatureCollection', features: counties.features})
    context.stroke();
  };

  // REQUEST county level DATA
  d3.json('county_level_geojson.json', function(err, json) {
    counties = json;
    countyUpdate(counties);
  });