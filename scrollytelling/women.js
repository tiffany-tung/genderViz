// Piechart data 
var groups = [
    "male",
    "female"
];

var pieData = [{
    id: "Google",
    male: "70",
    female: "30"
}, {
    id: "Twitter",
    male: "70",
    female: "33"
}, {
    id: "Cisco",
    male: "77",
    female: "23"
}, {
    id: "Intel",
    male: "76",
    female: "28"
}, {
    id: "Microsoft",
    male: "72",
    female: "28"
}, {
    id: "Apple",
    male: "70",
    female: "30"
}, {
    id: "Facebook",
    male: "69",
    female: "31"
}, {
    id: "HP",
    male: "67",
    female: "33"
}, {
    id: "Yahoo",
    male: "62",
    female: "38"
}, {
    id: "LinkedIn",
    male: "61",
    female: "38"
}, {
    id: "Pinterest",
    male: "60",
    female: "40"
}, {
    id: "eBay",
    male: "58",
    female: "42"
}]

var genderData = [
  [{
    "Percent": "44",
    "gender":"\u2642", 
    "color":"#00D0FE"
  }, 
  {
    "Percent": "56",
    "gender":"\u2640", 
    "color":"#EA83DB"
  }], 
  [{
    "Percent": "74",
    "gender":"\u2642",
    "color":"#00D0FE"
  },
  {
    "Percent":"36",
    "gender":"\u2640", 
    "color":"#EA83DB"
  }],
  [{
    "Percent":"65",
    "gender":"\u2642",
    "color":"#00D0FE"
  },
  {
    "Percent":"35",
    "gender":"\u2640", 
    "color":"#EA83DB"
  }],
  [{
    "Percent":"74",
    "gender":"\u2642",
    "color":"#00D0FE"
  },
  {
    "Percent":"26",
    "gender":"\u2640", 
    "color":"#EA83DB"
  }],
  [{
    "Percent":"100",
    "gender":"\u2642",
    "color":"#00D0FE"
  },
  {
    "Percent":"77",
    "gender":"\u2640", 
    "color":"#EA83DB"
  }],
  [{
    "Percent":"18",
    "gender":"\u2642",
    "color":"#00D0FE"
  },
  {
    "Percent":"40",
    "gender":"\u2640", 
    "color":"#EA83DB"
  }],
  [{
    "Percent":"27",
    "gender":"\u2642",
    "color":"#00D0FE"
  },
  {
    "Percent":"56",
    "gender":"\u2640", 
    "color":"#EA83DB"
  }],
  [{
    "Percent":"13",
    "gender":"\u2642",
    "color":"#00D0FE"
  },
  {
    "Percent":"60",
    "gender":"\u2640", 
    "color":"#EA83DB"
  }]
];

var arc = null;
var pie = null;

var scrollVis = function() {

    var width = 880,
        height = 460,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .domain(groups)
        .range(["#00D0FE", "#EA83DB"]);

    arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70)

    pie = d3.layout.pie()
    .sort(null);

    var companies = d3.map();
    pieData.forEach(function(d) {
        companies.set(d.id, d);
    });
    var currCompany = companies.get("Google");
    
    // constants to define the size
    // and margins of the vis area.
    var margin = {top: 15, right: 20, bottom: 50, left: 20}

    // main svg used for visualization
    var svg = null;
    var barsvg = null;

    // d3 selection that will be used
    // for displaying visualizations
    var g = null;

    var x = d3.scale.linear()
        .domain([0,100])
        .range([0, 600 - margin.left - margin.right]); 

    var y = d3.scale.ordinal()
        .domain(genderData[0].map(function(d) { return d.gender;} ))
        .rangeBands([0, height - margin.top - margin.bottom]); 
        
    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(10)
        .orient("bottom")
        .tickPadding(6);
        
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(1)
        .tickSize(1)
        .tickPadding(6);

    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;

    // Sizing for the grid visualization
    var squareSize = 6;
    var squarePad = 2;
    var numPerRow = width / (squareSize + squarePad);

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function(selection) {
    selection.each(function(rawData) {
        
    var selectDiv = d3.select("#vis").append("div");
    
    var select = selectDiv.append("select")
        .style("opacity", 0)
        .on("change", function() {
            currCompany = companies.get($("div select option:selected").text())
            updatePie(currCompany);
        });
        
    select.selectAll("option")
        .data(companies.values())
        .enter().append("option")
        .attr("value", function(d) {
            console.log(d.id);
            return d.id;
        })
        .text(function(d) {
            return d.id;
        })
        .attr("transform", "translate(" + width / 2 + "," + 0 + ")")
      // create svg and give it a width and height
      svg = d3.select(this).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
                
      barsvg = svg.append("g")
                .data(genderData[0])
                .attr("class", "barsvg")
                .attr('width', 400)
                .attr('height', 300)
                .attr("transform", "translate(" + (margin.left + margin.right) + "," + 0 + ")");
    
      svg.append("g").data(rawData)
            .attr('class', 'piesvg');

      // this group element will be used to contain all
      // other elements.
      g = svg.select(".piesvg")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
      setupVis(rawData);

      setupSections();

    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param wordData - data object for each word.
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  setupVis = function(pieData) {

    d3.select('.barsvg').append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
        .call(xAxis)
    d3.select('.barsvg').append('g')
        .attr('class', 'y-axis axis')
        .call(yAxis)
    updateBar(genderData[0]); // update(data[1]);
    d3.select('.barsvg')
        .attr('opacity', 0)
    d3.select('#vis')
        .append('div')
        .attr('class', 'hetero')
        .append('text')
        .text('\u26A4')
        .style('opacity', 1)
    var womenFade = d3.select('#vis')
        .append('div')
        .attr('class', 'womenMen')
        
    womenFade.append('img')
        .attr('class', 'women')
        .attr('src', 'women.jpg')
        .style('opacity', 0)
    womenFade.append('img')
        .attr('class', 'men')
        .attr('src', 'men.jpg')
        .style('opacity', 0)
        
  	d3.select('#vis')
        .append('div')
        .attr('class', 'percent')
        .style('opacity', 0)
        
   var percentDiv = d3.select(".percent")
        .append('div')
        .attr('id', 'text')
        .text('Only ')
       percentDiv.append('span')
        .attr('id', 'percent')
       percentDiv.append('text')
        .text(' of the Employees at ')
       percentDiv.append('span')
        .attr('id', 'company')
       percentDiv.append('text')
        .text(' are ')
       percentDiv.append('span')
        .attr('id', 'women')
        .text('Women')

    var path = g.selectAll("path")
        .data(groups)
        .enter().append("path")
        .style("fill", color)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("opacity", 0)
        .each(function() { this._current = {startAngle: 0, endAngle: 0}; });
        updatePie(currCompany, 0);
  };
  
  function updateBar(data) {
        barsvg.select('.x-axis').call(xAxis)
        
        var text = barsvg.selectAll(".text")
            .data(data)
        
        text.text(function(d) {return d.gender + " " + d.Percent + "%"})
            .attr('x', function(d) { return x(d.Percent) + 15})
        
        text.enter().append("text")
            .attr('class', 'text')
            .text(function(d) {
                return (d.Percent);
            })
            .attr('x', function(d) { return x(d.Percent)})
            .attr('y', function(d, i ){ return y.rangeBand() * i + 90; })
            
        var bar = barsvg.selectAll('.bar')
            .data(data)
            
        //updating bars
        bar.attr('y', function(d,i) { return y.rangeBand() * i + 40; })
            .transition()
            .duration(100)
            .ease("linear")
            .attr('width', function(d) { return x(d.Percent) })
            .attr('fill', function(d) { return d.color })  
            
        //creating bars
        bar.enter().append('rect')
            .attr('class', 'bar')
            .attr('x', 1)
            .attr('y', function(d, i ){ return y.rangeBand() * i + 40; })
            .attr('height', 80)
            .attr('width', function(d) { return x(d.Percent) })
            .attr('fill', function(d) { return d.color })  
            //transition
            .transition()
            .duration(100)
            .ease("linear")
        
        //title
        bar.exit().remove();
    }
    
    function updatePie(d, opacity) {
        g.selectAll("path").data(pie.value(function(g) {
            return d[g];
        })(groups)).transition()
        .attr('opacity', opacity)
        .attrTween("d", function(d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
            return arc(interpolate(t));
            };
        });
        updatePercent(d);
    }

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  setupSections = function() {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = fadePieChart;
    activateFunctions[2] = fadePieChart;
    activateFunctions[3] = fadePieChart;
    activateFunctions[4] = fadePieChart;
    activateFunctions[5] = fadePieChart;
    activateFunctions[6] = fadePieChart;
    activateFunctions[7] = fadePieChart;
    activateFunctions[8] = fadePieChart;
    activateFunctions[9] = fadePieChart;
    activateFunctions[10] = fadePieChart;
    activateFunctions[11] = partial(showPieChart, "Apple");
    activateFunctions[12] = partial(showPieChart, "Google");
    activateFunctions[13] = partial(showPieChart, "Twitter");
    activateFunctions[14] = partial(fadePieChartAndBarChart, .3);
    activateFunctions[15] = partial(fadePieChartAndBarChart, .3);
    activateFunctions[16] = partial(fadePieChartAndBarChart, .4);
    activateFunctions[17] = partial(fadePieChartAndBarChart, .6);
    activateFunctions[18] = partial(fadePieChartAndBarChart, .8);
    activateFunctions[19] = partial(fadePieChartAndBarChart, 1);

    

    for(var i = 11; i < 17; i++) {
      updateFunctions[i] = function() {};
    }
    updateFunctions[0] = function() {};
    updateFunctions[1] = regressBarChart;
    updateFunctions[2] = progressBarChart;
    updateFunctions[3] = function() {};
    updateFunctions[4] = progressBarChart1;
    updateFunctions[5] = progressBarChart2;
    updateFunctions[6] = function() {};
    updateFunctions[7] = progressBarChart3;
    updateFunctions[8] = progressBarChart4;
    updateFunctions[9] = progressBarChart5;
    updateFunctions[10] = progressBarChart6;
  };
  
  function showTitle() { 
      d3.select('select')
        .transition()
        .duration(600)
        .style('opacity', 0);
      updatePie(currCompany, 0);   
      d3.select('.percent')
        .transition()
        .duration(600)
        .style('opacity', 0);
     d3.select('.barsvg')
        .transition()
        .duration(600)
        .style('opacity', 0);
     d3.select('.hetero')
        .transition()
        .duration(600)
        .style('opacity', 1);
     d3.select('.men')
        .transition()
        .duration(600)
        .style('opacity', 0);
      d3.select('.women')
        .transition()
        .duration(600)
        .style('opacity', 0);
  }

  function showPieChart(company) {
      d3.select('.hetero')
        .transition()
        .duration(600)
        .style('opacity', 0);
      $("div select option[value=" + company + "]").attr('selected','selected');
      currCompany= companies.get(company);
      d3.selectAll('select')
        .transition()
        .duration(600)
        .style('opacity', 1);
      updatePie(currCompany, 1);
      d3.select('.percent')
        .transition()
        .duration(600)
        .style('opacity', 1);
      d3.select('.barsvg')
        .transition()
        .duration(600)
        .style('opacity', 0);
     d3.select('.men')
        .transition()
        .duration(600)
        .style('opacity', 0);
      d3.select('.women')
        .transition()
        .duration(600)
        .style('opacity', 0);
        
  }
  
  function fadePieChart() {
      d3.select('.hetero')
        .transition()
        .duration(600)
        .style('opacity', 0);
      d3.selectAll('select')
        .transition()
        .duration(600)
        .style('opacity', 0);
      updatePie(currCompany, 0);
      d3.select('.percent')
        .transition()
        .duration(600)
        .style('opacity', 0);
      d3.select('.barsvg')
        .transition()
        .duration(600)
        .style('opacity', 1);
      d3.select('.men')
        .transition()
        .duration(600)
        .style('opacity', 0);
      d3.select('.women')
        .transition()
        .duration(600)
        .style('opacity', 0);
  }
  
  function fadePieChartAndBarChart(opacity) {
      d3.select('.hetero')
        .transition()
        .duration(600)
        .style('opacity', 0);
      d3.selectAll('select')
        .transition()
        .duration(600)
        .style('opacity', 0);
      updatePie(currCompany, 0);
      d3.select('.percent')
        .transition()
        .duration(600)
        .style('opacity', 0);
      d3.select('.barsvg')
        .transition()
        .duration(600)
        .style('opacity', 0);
      d3.select('.men')
        .transition()
        .duration(600)
        .style('opacity', 1);
      d3.select('.women')
        .transition()
        .duration(600)
        .style('opacity', opacity);
  }

  /**
   * UPDATE FUNCTIONS
   *
   * These will be called within a section
   * as the user scrolls through it.
   *
   * We use an immediate transition to
   * update visual elements based on
   * how far the user has scrolled
   *
   */
  function regressBarChart() {
      updateBar(genderData[0])
  }
   
  function progressBarChart() {
      updateBar(genderData[1]);
  }

  function progressBarChart1() {
      updateBar(genderData[2]);
  }
  function progressBarChart2() {
      updateBar(genderData[3]);
  }
  function progressBarChart3() {
      updateBar(genderData[4]);
  }
  function progressBarChart4() {
      updateBar(genderData[5]);
  }
  function progressBarChart5() {
      updateBar(genderData[6]);
  }
  function progressBarChart6() {
      updateBar(genderData[7]);
  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function(index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function(i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function(index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};

/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select("#vis")
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function(index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity',  function(d,i) { return i == index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function(index, progress){
    plot.update(index, progress);
  });
}

display(pieData);

// Coerce population counts to numbers and compute total per state.
function type(d) {
  d.total = d3.sum(groups, function(k) {
    return d[k] = +d[k];
  });
  return d;
}

function updatePercent(d) {
    d3.select("#percent")
        .text(d.female + "%")
    d3.select("#company")
        .text(d.id);
}

function partial(func /*, 0..n args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
}