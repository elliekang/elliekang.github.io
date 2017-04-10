
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
  var aggregated_data = aggregateByType(data_all, "name", "value");
  createBarCharts(data_all, "name", aggregated_data);

  d3.selectAll(".myCheckbox").each(function(d) {
      checkType = d3.select(this);
      checked = checkType.property("checked");
      t = checkType.property("value");
      if(checked){
        var aggregated_data = aggregateByType(data_all, t, "value");
        createBarCharts(data_all, t, aggregated_data);
      }
  });
}

function sortName() {
  var aggregated_data = aggregateByType(data_all, "name", "name");
  createBarCharts(data_all, "name", aggregated_data);

  d3.selectAll(".myCheckbox").each(function(d) {
      checkType = d3.select(this);
      checked = checkType.property("checked");
      t = checkType.property("value");
      if(checked){
        var aggregated_data = aggregateByType(data_all, t, "name");
        createBarCharts(data_all, t, aggregated_data);
      }
  });
}

function createBarCharts(data, barType, avgVar) {
  removeBarCharts(barType);

  console.log(d3.select("#additional_graphs"));
  d3.select(function() {
      if (barType == "name") {
        return "#graphs";
      } else {
        return "#additional_graphs";
      }
    })
    .append('text')
    .style("font", "20px times")
    .style("font-weight", "bold") 
    .attr('fill', '#000')
    .attr("id", barType + "txt")
    .attr("padding", "20px")
    .html("<br/>" + barType +" vs. " + barVar +  "<br/>");

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
    var svg = d3.select(function() {
      if (barType == "name") {
        return "#graphs";
      } else {
        return "#additional_graphs";
      }
    }).append("svg") // create an svg for each row
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
  var aggregated_data1 = aggregateByType(data_all, "name", "none");
  createBarCharts(data_all, "name", aggregated_data1);
  d3.selectAll(".myCheckbox").each(function(d) {
    checkType = d3.select(this);
    checked = checkType.property("checked");
    t = checkType.property("value");
    if(checked){
      var aggregated_data = aggregateByType(data_all, t, "none");
      createBarCharts(data_all, t, aggregated_data);
    }
  });
}

function updatedBarType() {
  d3.selectAll(".myCheckbox").each(function(d) {
    checkType = d3.select(this);
    checked = checkType.property("checked");
    t = checkType.property("value");
    if(checked){
      var aggregated_data = aggregateByType(data_all, t, "none");
      createBarCharts(data_all, t, aggregated_data);
    } else {
      removeBarCharts(t);
    }
  });
}