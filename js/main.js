$(document).ready(function(){

  //facts and examples arrays
  var facts = [
     "At 100 decibels, damage to the human ear is possible after 15 minutes.",
     "At 90 decibels, damage to the human ear is possible after two hours.",
     "At 80 decibels, damage to the human ear is possible after eight hours.",
     "70 decibels",
     "60 decibels",
     "50 decibels"
   ]
   var examples = [
     "Everyday examples: Chainsaws, rock concerts, and leaf blowers",
     "Everyday examples: Hair dryer, gas mower",
     "Everyday examples: city traffic",
     "Everyday examples: washing machine",
     "Everyday examples: typical conversation",
     "Everyday examples: rainfall"
   ]

   function removeClasses() {
     $("section:last-of-type").removeClass("d100").removeClass("d90").removeClass("d80").removeClass("d70").removeClass("d60").removeClass("d50");
   }

   function removeParagraphs() {
     $("section:last-of-type").children("p").remove()
   }

//load 100 dba facts on initial load - eventually add a delay
$(".infoBox").addClass("d100").append("<p>" + facts[0] + "<br>" + examples[0] + "</p>");

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

  //short data: https://goo.gl/A7X3xN OR http://davidjkelley.net/READINGS-no-id2.csv
  //all data:  https://goo.gl/oSKFt9 OR http://davidjkelley.net/READINGS-no-id.csv
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

      var path = svg.append("path")
          .attr("class", "line")
          .attr("d", valueline(data));

      var totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
          .duration(2000)
          .ease("linear")
          .attr("stroke-dashoffset", 0);

      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      //http://bl.ocks.org/duopixel/4063326
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
       updateFacts();

       function updateFacts() {
         removeClasses();
         removeParagraphs();
         if((d.close) > 99){
           $(".infoBox").addClass("d100").append("<p>" + facts[0] + "<br>" + examples[0] + "</p>");
         } else if ((d.close) > 89){
           $(".infoBox").addClass("d90").append("<p>" + facts[1] + "<br>" + examples[1] + "</p>");
         } else if ((d.close) > 79){
           $(".infoBox").addClass("d80").append("<p>" + facts[2] + "<br>" + examples[2] + "</p>");
         } else if ((d.close) > 69){
           $(".infoBox").addClass("d70").append("<p>" + facts[3] + "<br>" + examples[3] + "</p>");
         } else if ((d.close) > 59){
           $(".infoBox").addClass("d60").append("<p>" + facts[4] + "<br>" + examples[4] + "</p>");
         } else if ((d.close) < 60){
           $(".infoBox").addClass("d50").append("<p>" + facts[5] + "<br>" + examples[5] + "</p>");
         } else {
           console.log("it works so far");
         }
       }

     }

     $("svg").mouseout(function(){
       removeClasses();
       removeParagraphs();
       $(".infoBox").removeClass("d50").removeClass("d60").addClass("d100").append("<p>" + facts[0] + "<br>" + examples[0] + "</p>");
     });






  });


});
