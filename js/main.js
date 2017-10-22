$(document).ready(function(){


  //h1 loads line by line on page load
  var str = "Sounds of East Boston";
  var spans = '<span>' + str.split(/\s+/).join(' </span><span>') + '</span>';
  $(spans).hide().appendTo('h1').each(function(i) {
    $(this).delay(125 * i).fadeIn();
  }); //end h1 loads line by line on page load

  //navigation menu revealed on click
  $("nav > div").on("click",function(){
    $("ul").toggleClass("hiddenNav");
    if(!$("nav > div").hasClass("hiddenNav")){
      $("li").hide().appendTo("ul").each(function(i){
        $(this).delay(125 * i).fadeIn();
      });
    }
  }); //end navigation menu revealed on click

//if the user clicks on the arrow, show facts
  $("footer").on("click",function(){
    $("div").each(function(i){
      $(this).delay(150 * i).fadeIn().css('opacity','1.0');
    });
    $("footer > p").addClass("hide");

  });

//d3 stuff starts here

  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // Parse the date / time 2017-06-06 15:21:03
  var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse,
      bisectDate = d3.bisector(function(d) { return d.date; }).left;

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(10);

  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

  // Define the line
  var valueline = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  // Adds the svg canvas
  var svg = d3.select(".d3Test")

      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv("http://davidjkelley.net/READINGS-no-id.csv", function(error, data) {
      data.forEach(function(d) {
          d.index = parseFloat(d.index);
          d.close = parseFloat(d.close);
          d.date = parseDate(d.date);
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      //Below is the original Y Axis code that runs from 0 to 100
      //y.domain([0, d3.max(data, function(d) { return d.close; })]);
      //This spans the Y axis from the min and max of the data
      y.domain(d3.extent(data, function(d) { return d.close; }));

      // Add the valueline path.

      svg.append("path")
          .attr("class", "line")
          .attr("d", valueline(data));

      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      var focus = svg.append("g")
         .attr("class", "focus")
         .style("display", "none");

      focus.append("circle")
         .attr("r", 4.5);

      focus.append("text")
         .attr("x", 9)
         .attr("dy", ".35em");

      svg.append("rect")
       .attr("class", "overlay")
       .attr("width", width)
       .attr("height", height)
       .on("mouseover", function() { focus.style("display", null); })
       .on("mouseout", function() { focus.style("display", "none"); })
       .on("mousemove", mousemove);

      function mousemove() {
       var x0 = x.invert(d3.mouse(this)[0]),
           i = bisectDate(data, x0, 1),
           d0 = data[i - 1],
           d1 = data[i],
           d = x0 - d0.date > d1.date - x0 ? d1 : d0;
       focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
       focus.select("text").text(d.close);
     }

  });


});
