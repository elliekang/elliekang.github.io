
d3.csv("test.csv", function(error, root) {
// d3.csv("data_sushi.csv", function(error, root) {
  if (error) throw error;
  console.log(root)
  // var table = d3.csvParse("data_sushi.csv")

  
  // var table = d3.csvParse("test.csv")
  var table = root
  var root = d3.stratify()
              .id(function(d) { return d.name; })
              .parentId(function(d) { return d.parent; })
              (table)
  console.log(root)

  seen = [];

  var str = JSON.stringify(root, function(key, val) {
     if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
              return;
          }
          seen.push(val);
      }
      return val;
  });
  console.log(str) // this is the json
  // used online converter to format the string into JSON

}