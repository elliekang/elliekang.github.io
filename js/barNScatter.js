

var numCharts = 4; // 2,3,4 are ok
var duoCharts = 2;
// var numCharts = 3; // 2,3,4 are ok
var viewWidth = document.documentElement.clientWidth;
var viewHeight = document.documentElement.clientHeight;
var sidebarWidth = 200;
var wid = (viewWidth - sidebarWidth)/numCharts-30, //30 is for padding
    hei = Math.min(viewHeight/2, 350),
    // hei = Math.max(viewHeight/2, 450),
    axisPadding = 121; // for names


// bar chart scale funcs
var yScale = d3.scale.ordinal().rangeBands([0, hei], 0.3);
var xScale = d3.scale.linear().range([0, wid-axisPadding-10]);                        

var data_all;

var barVar = "price";

var yVar = "price"; 
var xVar = "shopFreq"; 
var varDomains = {
  "price": [1,5],
  "oiliness": [0,4],
  "eatFreq": [0,3],
  "shopFreq": [0,1]
}
var typeSum = {
  "name":0,
  "type":0,
  "major":0,
  "minor":0
}

var showYBox = true;
var showXBox = false;

window.onload = start; // call after initializing all vars 

function start() {    

  document.getElementById("sortValue").addEventListener("click", sortValue);
  document.getElementById("sortName").addEventListener("click", sortName);
  
  document.getElementById("yAxis-select").addEventListener("change", selectYChange);
  document.getElementById("xAxis-select").addEventListener("change", selectXChange);
  yVar = document.getElementById("yAxis-select").value; 
  xVar = document.getElementById("xAxis-select").value; 

  document.getElementById("yCheck").checked = showYBox;
  document.getElementById("xCheck").checked = showXBox;
  document.getElementById("yCheck").addEventListener("change", yCheckChange);
  document.getElementById("xCheck").addEventListener("change", xCheckChange);

  barVar = document.getElementById("var").elements.namedItem("var").value;
  // radio buttons
  document.getElementById("radioPrice").addEventListener("change", updatedBarVar);
  document.getElementById("radioOily").addEventListener("change", updatedBarVar);
  document.getElementById("radioEat").addEventListener("change", updatedBarVar);
  document.getElementById("radioSold").addEventListener("change", updatedBarVar);

  d3.selectAll(".myCheckbox").on("change",updatedBarType);

  d3.csv("data_sushi.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d['name'] =  capitalize_words(d['name'].replace(/[^a-zA-Z]+/g, " "))
    })
    data_all = data;
    aggregated_data = aggregateByType(data, "name");
    createBarCharts(data, "name", aggregated_data);
    createScatterPlot();

  });

}

// for cleaning names
function capitalize_words(str) {
  return str.replace(/\w\S*/g, function(txt) { 
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function aggregateByType(data, barType) {
  var avgVar = d3.nest().key(function(d) { return d[barType]; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d[barVar]; }); })
  .entries(data);

  avgVar.forEach(function(d) {
      d[barType] = d.key;
      if (barType == "style") {
        d[barType] = sushi_style(d);
      } else if (barType == "majorGroup") {
        d[barType] = major_group(d);
      } else if (barType == "minorGroup") {
        d[barType] = minor_group(d);
      }
      d[barVar] = d.values;
  });
  return avgVar;
}