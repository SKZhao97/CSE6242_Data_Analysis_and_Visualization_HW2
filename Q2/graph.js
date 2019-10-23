
links =  [
  {
    "source": "C",
    "target": "Java",
    "value": 1
  },
  {
    "source": "JavaScript",
    "target": "Java",
    "value": 0
  },
  {
    "source": "JavaScript",
    "target": "Ruby",
    "value": 1
  },
  {
    "source": "Haskel",
    "target": "Java",
    "value": 0
  },
  {
    "source": "Haskel",
    "target": "JSON",
    "value": 1
  },
  {
    "source": "JavaScript",
    "target": "Python",
    "value": 0
  },
  {
    "source": "Haskel",
    "target": "Python",
    "value": 1
  },
  {
    "source": "Objact C",
    "target": "Java",
    "value": 0
  },
  {
    "source": "Sharp",
    "target": "Java",
    "value": 1
  },
  {
    "source": "Clojure",
    "target": "C",
    "value": 0
  },
  {
    "source": "AWK",
    "target": "C",
    "value": 1
  },
  {
    "source": "LISP",
    "target": "JSON",
    "value": 0
  },
  {
    "source": "Cobra",
    "target": "Python",
    "value": 1
  },
  {
    "source": "JSON",
    "target": "Python",
    "value": 0
  },
  {
    "source": "Pascal",
    "target": "Haskel",
    "value": 1
  },
  {
    "source": "PHP",
    "target": "C",
    "value": 0
  },
  {
    "source": "Windows-Powershell",
    "target": "Sharp",
    "value": 1
  },
  {
    "source": "Windows-Powershell",
    "target": "Vala",
    "value": 0
  },
  {
    "source": "VBScript",
    "target": "Objact C",
    "value": 1
  },
  {
    "source": "VisualBasic.NET",
    "target": "Sharp",
    "value": 0
  },
  {
    "source": "AppleScript",
    "target": "LISP",
    "value": 1
  },
  {
    "source": "C-Sharp",
    "target": "Java",
    "value": 0
  },
  {
    "source": "Scala",
    "target": "Java",
    "value": 1
  },
  {
    "source": "C++",
    "target": "C",
    "value": 0
  },
  {
    "source": "Groovy",
    "target": "Ruby",
    "value": 1
  },
  {
    "source": "Logo",
    "target": "LISP",
    "value": 0
  },
  {
    "source": "Factor",
    "target": "Haskel",
    "value": 1
  },
  {
    "source": "APL",
    "target": "J",
    "value": 0
  },
  {
    "source": "J",
    "target": "Java",
    "value": 1
  }
];

var nodes = {};


// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source, fixed: false}); //Add fixed
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target, fixed: false});
});


var width = 1200,
    height = 700;

var force = d3.forceSimulation()
    .nodes(d3.values(nodes))
    .force("link", d3.forceLink(links).distance(100))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("charge", d3.forceManyBody().strength(-250))
    .alphaTarget(1)
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// add the links and the arrows

var path = svg.append("g")
.selectAll("path")
.data(links)
.enter()
.append("path")
.attr("class", function(d) { return "link " + d.type; })
.style("stroke-dasharray", function(d){if (d.value == 0) return ("3, 3")})//Set dashed
.style("stroke", function(d) { if (d.value == 1) return "green"; })//Set green
.style("stroke-width", function(d) { if (d.value == 1) return "3px"; });//Set thick




// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
      );

    //Set the label
node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });


// add the nodes
node.append("circle")  
    .attr("r", function(d) {      
        d.weight = links.filter(function(l) {
            return l.source.name == d.name || l.target.name == d.name
        }).length;  
        var minRadius = 3;
        return minRadius + (d.weight*1.2);
      })
    .style("fill", function(d){
      d.weight = links.filter(function(l) {
            return l.source.name == d.name || l.target.name == d.name
        }).length; 

      var color;
        if (d.weight>6) {color ="#3b0099"} 
        else if (4<d.weight&&d.weight<7){color = "#5200cc"}
        else if (2<d.weight&&d.weight<5){color = "#8533ff"}
        else if (d.weight<3){color = "#c099ff"}
      return color
      })
    .each(function() {
      var sel = d3.select(this);
      var state = false;
      sel.on('dblclick', function() {
      state = !state;
      if (state) {
        sel.style('fill', '#33ccff');
      } else {
        sel.style('fill', function(d){
        d.weight = links.filter(function(l) {
            return l.source.name == d.name || l.target.name == d.name
        }).length; 
        var color;
        if (d.weight>6) {color ="#3b0099"}
        else if (4<d.weight&&d.weight<7){color = "#5200cc"}
        else if (2<d.weight&&d.weight<5){color = "#8533ff"}
        else if (d.weight<3){color = "#c099ff"}
        return color
        })
      }
    });
  });


node.on("dblclick",function(d){ 
  if (nodes[d.name].fixed==false){
      d.fx=d.x;
      d.fy=d.y;
      nodes[d.name].fixed=true;
  }
  else if(nodes[d.name]["fixed"]==true){
    d.fx=null;
    d.fy=null;
    nodes[d.name]["fixed"]=false;
  }
})


// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
    });

    node
        .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"; })
};

function dragstarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
};

function dragended(d) {
  if (!d3.event.active) force.alphaTarget(0);
  if (d.fixed == true){
     d.fx = d.x;
     d.fy = d.y;
  }
  else{
    d.fx = null;
    d.fy = null;
  }

};