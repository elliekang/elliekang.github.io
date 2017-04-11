
var sbsh;

function createScatterPlot() {

  var wid = 275
  var margins = {
   wid : wid,
   hei : wid,
   padding : 30,
   yAxisPadX : 25,
   yAxisPadY : 10
  };
  margins.xAxisPadY = margins.hei+10;

  var wid = margins.wid;
  var hei = margins.hei;
  var padding = margins.padding;
  var yAxisPadX = margins.yAxisPadX;
  var yAxisPadY = margins.yAxisPadY;
  var xAxisPadY = margins.xAxisPadY;


  var xScale = d3.scale.linear()
                      .domain(varDomains[xVar]) // change depending on var?
                      .range([0, wid]); 
  var yScale = d3.scale.linear()
                      .domain(varDomains[yVar])
                      .range([hei, 0]);
  var radius_scale = d3.scale.linear()
      .domain([0, d3.max(data_all, function(d) { return d[xVar]; })]) // change
      .range([1,6]);

  var scplotAll = d3.select("#scatterPlot") // includes axes
        .append("svg")
        .attr("class", "svg")
        // .attr("id", "scatterplot")
        .attr("width", wid+padding+yAxisPadX)
        .attr("height", hei+padding);

  var scplot = scplotAll.append("g")
              .attr("transform", "translate("+yAxisPadX+","+yAxisPadY+")")


  // Axes
  var color = "#686868"
  var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");
  var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");
  scplotAll.append("g")
    .attr('transform', 'translate('+(yAxisPadX)+', '+(xAxisPadY)+')')      
    .style("fill", color)
    .attr("font-size", "12")
    .call(xAxis);
  scplotAll.append("g")
    .attr('transform', 'translate('+yAxisPadX+', '+yAxisPadY+')')      
    .style("fill", color)        
    .attr("font-size", "12")
    .call(yAxis);

  // dots/circles
  var sc_dots = scplot.append("g")
  var circles = sc_dots.selectAll("circle")
          .data(data_all)
          .enter().append("circle")
          .attr("class", "dot")

  circles.attr("cx", function(d) {
        return xScale(d[xVar]);
      })
      .attr("cy", function(d) {
        return yScale(d[yVar]);
      })
      .attr("r", function(d) {
        return 4;
        // return radius_scale(d['oiliness']);
        // return Math.sqrt(hei - d["price"]);
      })
      .attr("opacity", 0.8)
      .attr("fill", "none")
      .attr("stroke", "purple")
      // .attr("stroke-width", function(d) {
      //  return d/5;
      // })
      

  if (showYBox) createYBoxAndWhisker(margins, scplot);
  if (showXBox) createXBoxAndWhisker(margins, scplot);

  ///////////////////////////////////////////////              
  // brushing and linking
  var highlightCol = "red"
  sbsh = d3.svg.brush()
    .x(xScale)
    .y(yScale)
    .on("brushend", function() {
      console.log(d3.select("graphs"))
      d3.select("#graphs").selectAll(".bar")
        // .classed("selected", hit_test)
        .transition()
        .delay(function(d, i) { return i * 5; })
        .style("opacity", 1)
        .style("fill", function(d) {
          return hit_test(d)? highlightCol : "steelblue"
        })
      console.log("sdf")
    })
    .on("brush", function() {
      sc_dots.selectAll(".dot")
        .classed("brushed", hit_test)
      d3.select("#graphs").selectAll(".bar")
        .transition()
        .style("fill", function(d) {
          return hit_test(d)? highlightCol : "steelblue"
        })
    })
    
  var sc_ctx = scplot.append("g")
  sc_ctx.append("g")
    .attr("id", "sbsh")
    .call(sbsh)
  ///////////////////////////////////////////


}

//brushing
var hit_test = function(d) {
  var p0 = sbsh.extent()[0] // [x0, y0]
  var p1 = sbsh.extent()[1] // [x1, y1]
  var x_val = d[xVar]
  var y_val = d[yVar]
  return p0[0] <= x_val && x_val <= p1[0]
      && p0[1] <= y_val && y_val <= p1[1]
}

function createYBoxAndWhisker(margins, scplot) {

  var wid = margins.wid;
  var hei = margins.hei;
  var padding = margins.padding;
  var yAxisPadX = margins.yAxisPadX;
  var yAxisPadY = margins.yAxisPadY;
  var xAxisPadY = margins.xAxisPadY;

  var min = Infinity,
      max = -Infinity;

  var plot = d3.box()
      .whiskers(iqr(1.5))
      .width(wid)
      .height(hei);

  var data2 = [];
  data_all.forEach(function(x) {
    // console.log("..: ", x[yVar])
    var s = x[yVar]
    data2.push(s)
    if (s > max) max = s; // max and min are global vars above
    if (s < min) min = s;
  });

  // console.log(varDomains[yVar])
  plot.domain(varDomains[yVar]); //plot = all box plots?
  data = [data2]

  scplot.append("g").selectAll("svg")
    .data(data) //data is an asso array from Expt to an array of Speeds
    .enter().append("svg") // a svg for each box plot (?) - lines up one after another..
      .attr("class", "box")
      .attr("width", wid+padding)
      .attr("height", hei+5)
      // .attr("transform", "translate(" + (yAxisPadX+0) + "," + yAxisPadY + ")")
    .append("g") // to hold one box plot
      .attr("id", "verticPlot")
      .call(plot);
  
}

function createXBoxAndWhisker(margins, scplot) {

  var wid = margins.wid;
  var hei = margins.hei;
  var padding = margins.padding;
  var yAxisPadX = margins.yAxisPadX;
  var yAxisPadY = margins.yAxisPadY;
  var xAxisPadY = margins.xAxisPadY;

  var min = Infinity,
      max = -Infinity;

  var plot = d3.boxHoriz()
      .whiskers(iqr(1.5))
      .width(wid)
      .height(hei);

  var data2 = [];
  data_all.forEach(function(x) {
    var s = x[xVar]
    data2.push(s)
    if (s > max) max = s; // max and min are global vars above
    if (s < min) min = s;
  });

  plot.domain(varDomains[xVar]); 
  data = [data2]

  scplot.append("g").selectAll("svg")
    .data(data) //data is an asso array from Expt to an array of Speeds
    .enter().append("svg") // a svg for each box plot (?) - lines up one after another..
      .attr("class", "box")
      .attr("width", wid+padding)
      .attr("height", hei+5)
      // .attr("transform", "translate(" + (yAxisPadX+0) + "," + yAxisPadY + ")")
    .append("g") // to hold one box plot
      .attr("id", "horizPlot")
      .call(plot);
  
}

// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}



function selectYChange() {
  yVar = document.getElementById("yAxis-select").value
  redrawScatterPlot()
}
function selectXChange() {
  xVar = document.getElementById("xAxis-select").value
  redrawScatterPlot()
}
function redrawScatterPlot() {
  d3.select("#scatterPlot").select("svg").remove()
  createScatterPlot();
  // location.reload()
}

function yCheckChange() {
  showYBox = document.getElementById("yCheck").checked;
  console.log("ybox checked is ", showYBox)
  redrawScatterPlot()
}
function xCheckChange() {
  showXBox = document.getElementById("xCheck").checked;
  console.log("xbox checked is ", showXBox)
  redrawScatterPlot()
}
