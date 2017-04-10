window.onload = start;

function start() {
  var radius = 50,
      padding = 10;

  var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius*.8);

  // we want to pass 2 values: the data value, and max Of the col - this data value
  // pie is a function that given a dataset, returns an array of objects rep'ing each datum's arc angles
  var arcGen = d3.layout.pie()
      .sort(null) // dont sort arcs from largest to smallest going clockwise
      // .value(function(d) { 
      //   console.log(d);
      //   return d[0]; }); // this sets the value of the key named "value" in the object

  var canvasColor = "white";

  d3.csv("data_sushi.csv", function(error, data) {
  // d3.csv("data.csv", function(error, data) {
    if (error) throw error;

    console.log(data);
    // data = an array of an Object for each row in the dataset
    console.log(data[0]);
    // is an associative array: from headers to values

    // add an assoc array to each datum: category:population
    // data.forEach(function(d) {
    //   d.ages = color.domain().map(function(name) {
    //     return {name: name, population: +d[name]};
    //   });
    //   console.log(d.ages);
    // });


    data.forEach(function(d) {
        // console.log(d); // a row
        // console.log(d["oiliness"]);
        // console.log(+d["oiliness"]);
        d.oily = [+d["oiliness"], 4-(+d["oiliness"])];
        // console.log(d.oily);    
    });


    // donut charts

    var svg = d3.select("#graphs").selectAll(".pie") // .pie
    // var svg = d3.select("body").selectAll(".pie") // .pie
        .data(data)
      .enter().append("svg") // create an svg for each row
        .attr("class", "pie")
        .attr("width", radius * 2)
        .attr("height", radius * 2)
      .append("g") // create a g in it, to hold all the arcs
        .attr("transform", "translate(" + radius + "," + radius + ")"); // translate it inside the g

    svg.selectAll(".arc") // .arc
        .data(function(d) { 
          // console.log(d.oily); // row
          // console.log(d); // row

          return arcGen(d.oily); }) //pie should be named arcs...
      .enter().append("path") // create a path (an arc) for each wedge in the pie/donut chart
        .attr("class", "arc")
        .attr("d", arc) // arc is the arc function we created earlier
        // .style("fill", "red");
        .style("fill", function(d, i) { 
          console.log(i);
          if (i==0) {
            return "blue";
          } 
          else {
            return canvasColor;  
          }
        
        });

    svg.append("text")
        .attr("dy", "-.5em")
        .attr("class", "label")
        .attr("font-size", "13")
        .style("text-anchor", "middle")
        // .text("temp");
        .text(function(d) { return d.name; });
    svg.append("text")
        .attr("dy", "1.5em")
        .attr("class", "label")
        .attr("font-size", "12")
        .style("text-anchor", "middle")
        // .text("temp");
        .text(function(d) { return Math.floor(d.oily[0] * 100) / 100; });

  });

}

