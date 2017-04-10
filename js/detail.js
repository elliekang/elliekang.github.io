var tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

var sushi_style = function(d) {
    if (d["style"] == 0) {
    return "Maki";
    } else { 
    return "Other";
    }
};

var major_group = function(d) {
    if (d["majorGroup"] == 0) {
    return "Seafood";
    } else { 
    return "Other";
    }
};

var minor_group = function(d) {
    var minor_num = d["minorGroup"];
    if (minor_num == 0) {
    return "Aomono";
    } else if (minor_num == 1) {
    return "Akami";
    } else if (minor_num == 2) {
    return "Shiromi";
    } else if (minor_num == 3) {
    return "Tare";
    } else if (minor_num == 4) {
    return "Clam or Shell";
    } else if (minor_num == 5) {
    return "Squid or Octopus";
    } else if (minor_num == 6) {
    return "Shrimp or Crab";
    } else if (minor_num == 7) {
    return "Roe";
    } else if (minor_num == 8) {
    return "Other Seafood";
    } else if (minor_num == 9) {
    return "Egg";
    } else if (minor_num == 10) {
    return "Meat other than fish";
    } else if (minor_num == 11) {
    return "Vegetables";
    } else { 
    return "Other";
    }
};

var oiliness = function(d) { return d["oiliness"]; };

var eatFreq = function(d) { return d["eatFreq"]; };

var price = function(d) { return d["price"];};

var shopFreq = function(d) { return d["shopFreq"];};

function hover_tip(d) {
    tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
    tooltip.html("<b>Name:</b> " + d["name"]
            + "<br/> <b>Style:</b> " + sushi_style(d)
  	        + "<br/> <b>Major Group:</b> " + major_group(d)
            + "<br/> <b>Minor Group:</b> " + minor_group(d)
            + "<br/> <b>Oiliness:</b> " + oiliness(d)
            + "<br/> <b>Eating Frequency:</b> " + eatFreq(d)
            + "<br/> <b>Price:</b> " + price(d)
            + "<br/> <b>Shop Frequency:</b> " + shopFreq(d))
            .style("left", (d3.event.pageX + 16) + "px")
            .style("top", (d3.event.pageY + 16) + "px");
}

function out_tip(d) {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}

function convert_code_to_str(barType, d) {
    if (barType == "style") {
        return sushi_style(d);
    } else if (barType == "majorGroup") {
        return major_group(d);
    } else if (barType == "minorGroup") {
        return minor_group(d);
    } else {
        return d[barType]; 
    }
}