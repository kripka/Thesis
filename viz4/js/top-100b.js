$(function(){


var window_width = function(){
	return ($(window).width() > 1170) ? '1170' : $(window).width();
}


var data,
	min_100,
	max_100;
	
	

	
var colors = {
	"Arthropoda":"rgb(228, 152, 22)",
	"Chordata":"#4e810a",
	"Mollusca":"rgb(164, 170, 20)",
	"Cnidaria":"#cd2d9d",
	"Ctenophora":"#6e0c00",
	"Annelida":"#6e006b",
	"Echinodermata":"#652dcd",
	"Nematoda":"#2d9acd",
	"Acanthocephala":"#cdca2d",
	"Platyhelminthes":"#350a81",
	"Nematomorpha":"#810a52",
	"Onychophora":"#cd472d",
	"Sipuncula":"#9e735c",
	"Rotifera":"#909e5c",
	"Gastrotricha":"#566455",
	"Brachiopoda":"#ccc",
	"Bryozoa":"#444",
	"Nemertea":"#000",
	"Porifera":"#fff"
};




	
/******** CODE BASED ON FIDDLE FROM AMELIA BELLAMY-ROYDS http://fiddle.jshell.net/6cW9u/8/ *********************************/	


var create_quadtree = function(xscale) {
	return d3.geom.quadtree()
        .x(function(d) { return xscale(1); }) 
        .y(0) //constant, they are all on the same line
        .extent([[xscale(-1),0],[xscale(2),0]]);
    //extent sets the domain for the tree
    //using the format [[minX,minY],[maxX, maxY]]
    //optional if you're adding all the data at once
};

// Find the all nodes in the tree that overlap a given circle.
// quadroot is the root node of the tree, scaledX and scaledR
//are the position and dimensions of the circle on screen
//maxR is the (scaled) maximum radius of dots that have
//already been positioned.
//This will be most efficient if you add the circles
//starting with the smallest.  
function findNeighbours(root, species, maxR, xscale, rscale, circle_padding) {
	
	scaledX = xscale(species);
	scaledR = rscale(species);


    var neighbours = [];
   // console.log("Neighbours of " + scaledX + ", radius " + scaledR);
    
   //console.log(root);
    
  root.visit(function(node, x1, y1, x2, y2) {
      //console.log("visiting (" + x1 + "," +x2+")");
    var p = node.point; 
   // console.log(p);
    if (p) {  //this node stores a data point value
        var overlap, x2=xscale(parseInt(p.species)), r2=rscale(parseInt(p.species));        
        if (x2 < scaledX) {
            //the point is to the left of x
            overlap = (x2+r2 + circle_padding >= scaledX-scaledR);
            /*console.log("left:" + x2 + ", radius " + r2 
                        + (overlap?" overlap": " clear"));//*/
        }      
        else {
            //the point is to the right
            overlap = (scaledX + scaledR + circle_padding >= x2-r2);
            /*console.log("right:" + x2 + ", radius " + r2 
                        + (overlap?" overlap": " clear"));//*/
        }
        if (overlap) neighbours.push(p);
    }
   
    return (x1-maxR > scaledX + scaledR + circle_padding ) 
            && (x2+maxR < scaledX - scaledR - circle_padding ) ;
      //Returns true if none of the points in this 
      //section of the tree can overlap the point being
      //compared; a true return value tells the `visit()` method
      //not to bother searching the child sections of this tree
  });
    
    return neighbours;
}

function calculateOffset(quadroot,maxR,xscale, rscale, circle_padding){
    return function(d) {
        neighbours = findNeighbours(quadroot, 
                                   parseInt(d.species),
                                   maxR,xscale, rscale, circle_padding);
                                   
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
                var hypoteneuse = rscale(parseInt(d.species))+rscale(parseInt(p.species))+circle_padding; 
                //length of line between center points, if only 
                // "padding" space in between circles
                
                var base = xscale(parseInt(d.species)) - xscale(parseInt(p.species)); 
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

/******* BUILD_NAV ***********/	
var build_nav = function(data){

	var margin = {
			top: 10,
			right: 20,
			bottom: 0,
			left: 20	
		},
		padding = 10,
		width = window_width() - margin.right - margin.left,
		height = 180,
		circle_padding = 2;
	
	// create svg
	var nav_svg = d3.select('#top-100-nav').append('svg')
		.attr({
			width: width,
			height: 160
		});
	
	
	// scales
	var nav_scale_x = d3.scale.linear().range([padding,width - padding]).domain([1200,15000]);
	
	var nav_circle_scale= d3.scale.sqrt().range([1.5,15]).domain([min_100,max_100]);
	
	// baseline
	var baseline_height = (margin.top + 180)/2;
	
	var nav_line = nav_svg.append("g")
        .attr("class", "bubbles")
        .attr("transform", 
              "translate(0," + (baseline_height - 35) + ")");
              
              
	var axis_g = nav_svg.append('g');
	
	var maketicks = function(){
		var ticks = [1200];
		for (var i = 1500; i <= 15000; i+=1000) {
			ticks.push(i);
		}	
		ticks.push(15000);
		return ticks;
	};
	
	var ticks = maketicks();

	var axis = d3.svg.axis()
			.scale(nav_scale_x)
			.tickValues(ticks)
			.orient('bottom')
			.tickFormat(d3.format("d"))
			.tickPadding([5])
			.innerTickSize([20]);
			
	axis_g.attr('transform','translate(0,'+(height-60)+')').call(axis);
    

	    //Create Quadtree to manage data conflicts & define functions//
	    
	var quadtree = create_quadtree(nav_scale_x);
	
	var quadroot = quadtree([]);
          //create an empty adjacency tree; 
          //the function returns the root node.

	var maxR = 0;
	
	// draw circles
	var nav_circles = nav_line.selectAll('.nav-circle')
		.data(data.sort(function(a,b){return parseInt(a.num) - parseInt(b.num);}))
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
                .attr("cy", -baseline_height + margin.top)
                //.transition().delay(300*i).duration(250)
                .attr("cy", calculateOffset(quadroot,maxR,nav_scale_x, nav_circle_scale, circle_padding));
            quadroot.add(d);
            

        }).attr('class','nav-circle');

	}; // end build nav


/******* BUILD_MAIN ***********/	
var build_main = function(data){

	var margin = {
			top: 10,
			right: 0,
			bottom: 0,
			left: 0	
		},
		padding = 40,
		width = 10000,
		height = 550,
		circle_padding = 24;
	
	// create svg
	var svg = d3.select('#top-100-svg').append('svg')
		.attr({
			width: width,
			height: height
		});
	
	
	// scales
	var main_scale_x = d3.scale.linear().range([padding,width - padding]).domain([1200,15000]);
	
	var main_circle_scale= d3.scale.sqrt().range([10,75]).domain([min_100,max_100]);
	
	// baseline
	var baseline_height = (margin.top + height)/2;


/*
	var makegrid = function(){
		var ticks = [];
		for (var i = 1200; i <= 15000; i+=200) {
			console.log(i);
			ticks.push(i);
		}	
		return ticks;
	};
*/

	var axis_g = svg.append('g');

	var maketicks = function(){
	var ticks = [];
		for (var i = 1200; i <= 15000; i+=200) {
			ticks.push(i);
		}	
		return ticks;
	};
	var ticks = maketicks();
	
	
	axis_g.selectAll('.gridline').data(ticks)
		.enter()
		.append('line')
		.attr({
			x1: function(d){return main_scale_x(d);},
			x2: function(d){return main_scale_x(d);},
			y1: 0,
			y2: height,
			class: 'gridline'
		});
	
	var axis = d3.svg.axis()
			.scale(main_scale_x)
			.tickValues(ticks)
			.orient('top')
			.tickFormat(d3.format("d"))
			.tickPadding([5])
			.innerTickSize([20]);
			
	axis_g.attr('transform','translate(0,35)').call(axis);
		
		
			
	var main_g = svg.append("g")
        .attr("class", "main_g")
        .attr("transform", 
              "translate(0," + (baseline_height + 30) + ")");

    
	    //Create Quadtree to manage data conflicts & define functions//
	    
	var quadtree = create_quadtree(main_scale_x);
	
	var quadroot = quadtree([]);
          //create an empty adjacency tree; 
          //the function returns the root node.

	var maxR = 0;
	
	// draw circles and donuts
	var authors = main_g.selectAll('.author')
		.data(data.sort(function(a,b){return parseInt(a.num) - parseInt(b.num);}))
		.enter()
		.append('g')
		.attr('class','author')
		.attr('id',function(d){return 'author-'+ d.num})
		.append('circle')
		.attr("r", function(d){
            var r=main_circle_scale(parseInt(d.species));
            maxR = Math.max(r,maxR);
            return r;})
        .each(function(d, i) {
            //for each circle, calculate it's position
            //then add it to the quadtree
            //so the following circles will avoid it.
            
            //console.log("Bubble " + i);
            var scaledX = main_scale_x(parseInt(d.species));  
            var yoffset =   calculateOffset(quadroot,maxR,main_scale_x, main_circle_scale, circle_padding);        
            d3.select(this)
                .attr("cx", scaledX)
                .attr("cy", yoffset);
            quadroot.add(d);
            
            data[i].radius = main_circle_scale(parseInt(d.species));
            data[i].x = scaledX;

        }).attr('class','main-circle');
        
        
        var min_radius = d3.min(data, function(d){return parseInt(d.radius);});
        var max_radius = d3.max(data, function(d){return parseInt(d.radius);});
        var font_scale = d3.scale.linear().range([9,21]).domain([min_radius,max_radius]);
        
        main_g.selectAll('.author')
        	.data(data.sort(function(a,b){return parseInt(a.num) - parseInt(b.num);}))
        	.append('text')
        	.text(function(d){ return d.num})
        	.style({
        		fill:'#fff',
        		'text-anchor':'middle',
        		'font-size':function(d){return font_scale(d.radius)}
        	})
        	.attr({
	        	x:function(d){ return d.x;},
	        	y:function(d){ return d.offset + (font_scale(d.radius)/2) -2;}
        	});
        
        var arc_radius = d3.scale.sqrt().range([6,16]).domain([min_100,max_100]);
        
        var arc, pie, donut_holder;
        
        for (var i = 0; i<data.length; i++) {
        	        
	     arc = d3.svg.arc()
		    .outerRadius(data[i].radius + arc_radius(data[i].species))
		    .innerRadius(data[i].radius+2);
	
		 pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) {return d.value; });
		    
		 donut_holder = d3.select('#author-' + data[i].num).append('g')
		 	.attr('transform','translate(' +  data[i].x + ',' +  data[i].offset + ')');
		 
		 
		 dg = donut_holder.selectAll('.arc')
		 	.data(pie(data[i].phylums))
		 	.enter().append('g')
		 	.attr('class','arc');
		 	
		dg.append("path")
		      .attr("d", arc)
		      .style("fill", function(d,i){return colors[d.data.label];} );

		 
		    
        } // end for
        
    main_g.selectAll('.author')
    	.on("mouseover", function(d){ tooltip.text(d.full_name);  return tooltip.style("visibility", "visible");})
		.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
		.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
        
        
	var tooltip = d3.select("body")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.style('background-color','#fff')
		.text("a simple tooltip");
		
		
		

	}; // end build nav


var build_drag = function(){

	var $nav = $('#top-100-nav');

	var $drag_container = $('<div />').attr('id','drag-container');
	var $drag = $('<div />').attr('id','drag');
	$drag_container.append($drag);
	$nav.append($drag_container);
	
	var $svg = $('#top-100-svg');
	
	nav_width = d3.select('#top-100-nav svg').attr('width');
	viz_width = d3.select('#top-100-svg svg').attr('width');
	
	console.log(nav_width);

	var ratio = $(window).width()/viz_width;
	ratio = nav_width * ratio;
	$drag.css('width',ratio + 'px');
	$drag_container.css('width',nav_width);
	
	var scroll_scale = d3.scale.linear().range([0,10000]).domain([0,parseInt(nav_width) - 10]);
	
	$drag.draggable({ 
		axis: "x",
		containment: "parent",
		drag: function(){
			$svg.css('marginLeft', - scroll_scale(parseInt($(this).css('left'))) + 'px');
		},
		start: function(){
			$('body').addClass('dragging').css('cursor','-webkit-grabbing');
		},
		stop: function(){
			$('body').removeClass('dragging');
		}
	});
	
	
	
		
};
	
	
var build_viz = function(){
	
	d3.json('js/authors.json',function(data){
	
		min_100 = d3.min(data, function(d){return parseInt(d.species);});
		max_100 = d3.max(data, function(d){return parseInt(d.species);});
		
		build_nav(data);
		build_main(data);
		build_drag();
	});
	
		
};
build_viz();


});