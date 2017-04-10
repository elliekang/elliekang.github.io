
function removeBarCharts(barType) {
  var type_header = document.getElementById(barType + "txt");
  if (type_header != null) {
    type_header.parentNode.removeChild(type_header);  
  }

  var partition_num = 0;
  if (barType == "style" || barType == "majorGroup") {
    partition_num = duoCharts;
  } else {
    partition_num = numCharts;
  }

  for (var i=0; i<partition_num; i++) {
    removeOneBarChart(barType+"svg"+i);
  }
}
function removeOneBarChart(svgID) {
  var child = document.getElementById(svgID);
  if (child != null) {
    child.parentNode.removeChild(child);  
  }
}

function sortValue() {
  // sort highest to lowest

  new_data = data_all.sort(function(item1, item2) {
    return item2[barVar] - item1[barVar];
  });

  // createBarCharts(new_data, "name");
  createBarCharts(new_data, "minorGroup");

  // d3.selectAll(".myCheckbox").each(function(d) {
  //     checkType = d3.select(this);
  //     checked = checkType.property("checked");
  //     t = checkType.property("value");
  //     if(checked){
  //       createBarCharts(new_data, t);
  //     }
  // });
}
function sortName() {
  //sorting name graph
  // var new_data1 = data_all.sort(function(a, b) {
  //   var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  //   var nameB = b.name.toUpperCase(); // ignore upper and lowercase

  //   if (nameA < nameB) {
  //     return -1;
  //   }
  //   if (nameA > nameB) {
  //     return 1;
  //   }

  //   // names must be equal then
  //   return 0;
  // });
  // createBarCharts(new_data1, "name");

  d3.selectAll(".myCheckbox").each(function(d) {
      checkType = d3.select(this);
      checked = checkType.property("checked");
      t = checkType.property("value");
      if(checked){
        console.log("sort name of : " + t);
        var new_data2 = data_all.sort(function(a, b) {
          // return a[t] - b[t];
          // var a1 = "";
          // var b1 = "";
          // if (t == "style") {
          //   a1 = sushi_style(a);
          //   b1 = sushi_style(b);
          // } else if (t == "majorGroup") {
          //   a1 = major_group(a);
          //   b1 = major_group(b);
          // } else if (t == "minorGroup") {
          //   a1 = minor_group(a);
          //   b1 = minor_group(b);
          // }
          var c1 = minor_group(a);
          var d1 = minor_group(b);

          var nameC = c1.toUpperCase(); 
          var nameD = d1.toUpperCase(); 

          if (nameC < nameD) {
            return -1;
          }
          if (nameC > nameD) {
            return 1;
          }
          return 0;
        });
        createBarCharts(new_data2, t);
      }
  });
}

function createBarCharts(data, barType) {
  removeBarCharts(barType);

  d3.select('#graphs')
    .append('text')
    .style("font", "20px times")
    .style("font-weight", "bold") 
    .attr('fill', '#000')
    .attr("id", barType + "txt")
    .attr("padding", "20px")
    .html("<br/>" + barType +" vs. " + barVar +  "<br/>");

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

  xScale.domain(varDomains[barVar]); // change var later

  var partition_num = 0;
  if (barType == "style" || barType == "majorGroup") {
    partition_num = duoCharts;
  } else {
    partition_num = numCharts;
  }

  var part_size = avgVar.length/partition_num;
  for (var i=0; i<partition_num; i++) {
    var startIndex = part_size*i;
    var endIndex = startIndex+part_size;
    data_part = avgVar.slice(startIndex, endIndex);

    yScale.domain(data_part.map(function(d) {
      return d[barType];
    }));

    // axis generator func
    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient('left')
    
    var svgID = barType+"svg"+i;
    createOneBarChart(yScale, data_part, yAxis, svgID, barType);

  }

}


function createOneBarChart(yScale, data, yAxis, svgID, barType) {
    // console.log(data);

    // create svg
    var svg = d3.select("#graphs")
                .append("svg") // create an svg for each row
                .attr("id", svgID)
                .attr("width", wid)
                .attr("height", hei);


    barGroup = svg.append('g');

    // Append the names axis to the graph
    barGroup.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate('+axisPadding+', 0)')
        .attr("font-size", "15")
        .attr("font-family", "\"Tahoma, Geneva, sans-serif\"")
        // .attr("font-family", "\"Lucida Sans Unicode, Lucida Grande, sans-serif\"")
        // .attr("font-family", "\"Verdana, Geneva, sans-serif\"")
        .call(yAxis);

    svg.selectAll("rect") 
        .data(data) 
        .enter().append("rect")
        .attr("class", "bar selected")
        // .style("height", function(d) {
        //   return d[barVar] * 10000;  
        //   // return d[currVar];  
        // })
        .attr('y', function(d) {
            return yScale(d[barType]);
        })
        .attr('x', axisPadding)          
        .attr('height', function(d) {
            return  yScale.rangeBand();
        })
        .attr('width', function(d) {
            console.log(d[barVar]);
            return xScale(d[barVar]);
        })
        .style("fill", "steelblue")
        .on("mouseover", function(d) {hover_tip(d);})
        .on("mouseout", function(d) {out_tip(d)});
}

function updatedBarVar() {
  barVar = document.getElementById("var").elements.namedItem("var").value;
  createBarCharts(data_all, "name");
  d3.selectAll(".myCheckbox").each(function(d) {
    checkType = d3.select(this);
    checked = checkType.property("checked");
    t = checkType.property("value");
    if(checked){
      createBarCharts(data_all, t);
    }
  });
}

function updatedBarType() {
  // createBarCharts(data_all, "name");
  d3.selectAll(".myCheckbox").each(function(d) {
    checkType = d3.select(this);
    checked = checkType.property("checked");
    t = checkType.property("value");
    if(checked){
      createBarCharts(data_all, t);
    } else {
      removeBarCharts(t);
    }
  });
}