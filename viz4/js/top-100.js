var window_width = function(){
	return ($(window).width() > 1170) ? '1170' : $(window).width();
}


var data,
	min_100,
	max_100;

var build_nav = function(data){

	var nav_margin = {
			top: 10,
			right: 20,
			bottom: 0,
			left: 10	
		},
		nav_padding = 20,
		nav_width = window_width() - nav_margin.right - nav_margin.left,
		nav_height = 200,
		nav_circle_padding = 1;
	
	// create svg
	var nav_svg = d3.select('#top-100-svg').append('svg')
		.attr({
			width: nav_width,
			height: nav_height
		});
	
	
	// scales
	var nav_scale_x = d3.scale.linear().range([nav_padding,nav_width - nav_padding]).domain([min_100,max_100]);
	
	var nav_circle_scale= d3.scale.sqrt().range([1,20]).domain([min_100,max_100]);
	
	// baseline
	var baseline_height = (nav_margin.top + nav_height)/2;
	
	var nav_line = nav_svg.append("g")
        .attr("class", "bubbles")
        .attr("transform", 
              "translate(0," + baseline_height + ")");
    
    nav_line.append("line")
        .attr("x1", nav_scale_x.range()[0])
        .attr("x2", nav_scale_x.range()[1])
        .style('stroke','#efefef');
	
	
/******** CODE FROM AMELIA BELLAMY-ROYDS http://fiddle.jshell.net/6cW9u/8/ *********************************/	
	 //D3 program to fit circles of different sizes along a 
    //horizontal dimension, shifting them up and down
    //vertically only as much as is necessary to make
    //them all fit without overlap.
    //By Amelia Bellamy-Royds, in response to 
    //http://stackoverflow.com/questions/20912081/d3-js-circle-packing-along-a-line
    //inspired by
    //http://www.nytimes.com/interactive/2013/05/25/sunday-review/corporate-taxes.html
    //Freely released for any purpose under Creative Commons Attribution licence: http://creativecommons.org/licenses/by/3.0/
    //Author name and link to this page is sufficient attribution.
    
    
    //Create Quadtree to manage data conflicts & define functions//
    
var quadtree = d3.geom.quadtree()
        .x(function(d) { return nav_scale_x(1); }) 
        .y(0) //constant, they are all on the same line
        .extent([[nav_scale_x(-1),0],[nav_scale_x(2),0]]);
    //extent sets the domain for the tree
    //using the format [[minX,minY],[maxX, maxY]]
    //optional if you're adding all the data at once

var quadroot = quadtree([]);
          //create an empty adjacency tree; 
          //the function returns the root node.
    
// Find the all nodes in the tree that overlap a given circle.
// quadroot is the root node of the tree, scaledX and scaledR
//are the position and dimensions of the circle on screen
//maxR is the (scaled) maximum radius of dots that have
//already been positioned.
//This will be most efficient if you add the circles
//starting with the smallest.  
function findNeighbours(root, scaledX, scaledR, maxR) {

    var neighbours = [];
   // console.log("Neighbours of " + scaledX + ", radius " + scaledR);
    
   //console.log(root);
    
  root.visit(function(node, x1, y1, x2, y2) {
      //console.log("visiting (" + x1 + "," +x2+")");
    var p = node.point; 
   // console.log(p);
    if (p) {  //this node stores a data point value
        var overlap, x2=nav_scale_x(parseInt(p.species)), r2=nav_circle_scale(parseInt(p.species));        
        if (x2 < scaledX) {
            //the point is to the left of x
            overlap = (x2+r2 + nav_circle_padding >= scaledX-scaledR);
            /*console.log("left:" + x2 + ", radius " + r2 
                        + (overlap?" overlap": " clear"));//*/
        }      
        else {
            //the point is to the right
            overlap = (scaledX + scaledR + nav_circle_padding >= x2-r2);
            /*console.log("right:" + x2 + ", radius " + r2 
                        + (overlap?" overlap": " clear"));//*/
        }
        if (overlap) neighbours.push(p);
    }
   
    return (x1-maxR > scaledX + scaledR + nav_circle_padding ) 
            && (x2+maxR < scaledX - scaledR - nav_circle_padding ) ;
      //Returns true if none of the points in this 
      //section of the tree can overlap the point being
      //compared; a true return value tells the `visit()` method
      //not to bother searching the child sections of this tree
  });
    
    return neighbours;
}

function calculateOffset(maxR){
    return function(d) {
        neighbours = findNeighbours(quadroot, 
                                   nav_scale_x(parseInt(d.species)),
                                   nav_circle_scale(parseInt(d.species)),
                                   maxR);
                                   
       // console.log(quadroot);
                                   
        var n=neighbours.length;
        //console.log(j + " neighbours");
        var upperEnd = 0, lowerEnd = 0;      
        
        if (n){
            //for every circle in the neighbour array
            // calculate how much farther above
            //or below this one has to be to not overlap;
            //keep track of the max values
            var j=n, occupied=new Array(n);
            while (j--) { 
                var p = neighbours[j];
                var hypoteneuse = nav_circle_scale(parseInt(d.species))+nav_circle_scale(parseInt(p.species))+nav_circle_padding; 
                //length of line between center points, if only 
                // "padding" space in between circles
                
                var base = nav_scale_x(parseInt(d.species)) - nav_scale_x(parseInt(p.species)); 
                // horizontal offset between centres
                
                var vertical = Math.sqrt(Math.pow(hypoteneuse,2) -
                    Math.pow(base, 2));
                //Pythagorean theorem
                
                occupied[j]=[p.offset+vertical, 
                             p.offset-vertical];
                //max and min of the zone occupied
                //by this circle at x=nav_scale_x(d.x)
            }
            occupied = occupied.sort(
                function(a,b){
                    return a[0] - b[0];
                });
            //sort by the max value of the occupied block
            //console.log(occupied);
            lowerEnd = upperEnd = 1/0;//infinity
                
            j=n;
            while (j--){
                //working from the end of the "occupied" array,
                //i.e. the circle with highest positive blocking
                //value:
                
                if (lowerEnd > occupied[j][0]) {  
                    //then there is space beyond this neighbour  
                    //inside of all previous compared neighbours
                    upperEnd = Math.min(lowerEnd,
                                        occupied[j][0]);
                    lowerEnd = occupied[j][1];
                }
                else {
                    lowerEnd = Math.min(lowerEnd,
                                        occupied[j][1]);
                }
            //console.log("at " + formatPercent(d.x) + ": "
              //          + upperEnd + "," + lowerEnd);
            }
        }
            
            //assign this circle the offset that is smaller
            //in magnitude:
        return d.offset = 
                (Math.abs(upperEnd)<Math.abs(lowerEnd))?
                        upperEnd : lowerEnd;
    };
}




/********* END ******************************************************************************************/	
	var maxR = 0;
	
	// draw circles
	var nav_circles = nav_line.selectAll('.nav-circle')
		.data(data.sort(function(a,b){return parseInt(a.species) - parseInt(b.species);}))
		.enter()
		.append('circle')
		.attr("r", function(d){
            var r=nav_circle_scale(parseInt(d.species));
            maxR = Math.max(r,maxR);
            return r;})
        .each(function(d, i) {
            //for each circle, calculate it's position
            //then add it to the quadtree
            //so the following circles will avoid it.
            
            //console.log("Bubble " + i);
            var scaledX = nav_scale_x(parseInt(d.species));            
            d3.select(this)
                .attr("cx", scaledX)
                .attr("cy", -baseline_height + nav_margin.top)
                //.transition().delay(300*i).duration(250)
                .attr("cy", calculateOffset(maxR));
            quadroot.add(d);
            

        }).attr('class','nav-circle');
		


			
	};

	
	
var build_viz = function(){
	
	d3.json('js/authors.json',function(data){
	
		min_100 = d3.min(data, function(d){return parseInt(d.species);});
		max_100 = d3.max(data, function(d){return parseInt(d.species);});
		
		build_nav(data);
	});
	
		
};
build_viz();