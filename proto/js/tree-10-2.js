$(function(){

var window_width = function(){
	return ($(window).width() < 1280) ? '1280' : $(window).width();
}

// cache some variables
var data,
	min_count = 0,
	max_count,
	min_phylum_count,
	max_phylum_count,
	min_year,
	max_year;

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
	"Porifera":"#efefef"
};



/******* BUILD_MAIN ***********/	
var build_main = function(data){

	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    x = w.innerWidth || e.clientWidth || g.clientWidth,
	    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

	var margin = {
			top: 50,
			right: 50,
			bottom: 0,
			left: 50	
		},
		padding = 40,
		width = x,
		height = y,
		circle_padding = 24,
		root_height = 100,
		root_width = 1,
		opacity = .3;
	
	// create svg
	var svg = d3.select('#top-100-svg').append('svg')
		.attr({
			width: width,
			height: height
		});
		
		
	// get max total count, max phylum count, min and max years
	var phylum_counts = [],
		total_counts = [],
		temp_count,
		describe_years = [];
	
	for (var i = 0; i<data.length; i++){
		temp_count = 0;
		
		for (var x = 0; x<data[i].years.length; x++){
			phylum_counts.push(data[i].years[x].count);
			temp_count += data[i].years[x].count;
			describe_years.push(data[i].years[x].year);
		}
		total_counts.push(temp_count);
		data[i].total = temp_count;
	}
		
	min_phylum_count = d3.min(phylum_counts);
	max_phylum_count = d3.max(phylum_counts);
	phylum_counts = null;
	
	max_count = d3.max(total_counts);
	total_counts = null;
	
	min_year = d3.min(data,function(d){return d.birth;});
	max_year = d3.max(describe_years);
	
	
	/** DEFINE SCALES *****/
	var line_width = 1;
	
	var year_scale = d3.scale.linear().range([margin.left,width - margin.right]).domain([min_year,max_year]);
	
	var trunk_scale = d3.scale.linear().range([width - (line_width * 50),width + (line_width * 50)]).domain([0,99]);
	
	var leaf_y_scale = d3.scale.log().range([height - margin.bottom - (root_height*2) - 5,margin.top ]).domain([1,max_phylum_count]);
	
	var leaf_r_scale = d3.scale.sqrt().range([5,40]).domain([min_phylum_count,max_phylum_count]);
	
	var root_y_scale = d3.scale.linear().range([0,root_height]).domain([0,max_count]);
	
	//branches
	
	var branch = function(x1,y1,x2,y2,count) {
				var path;
				var branch_data = [];
				
				var temp_data;
					
				branch_data.push({x:x1,y:y1});
				
				branch_data.push({
					x:x1,
					y: y2
				});
				
				branch_data.push({x:x2,y:y2});
								
				var line_function = d3.svg.line()
					.x(function(d){return d.x;})
					.y(function(d){return d.y;})
					.interpolate('cardinal');
				
				return line_function(branch_data);
			};
			
	var branch_g = svg.append('g')
		.attr('transform','translate(' + margin.left + ',0)');
	
	branch_g.selectAll('.branch')
		.data(data).enter()
		.append('g')
		.attr('class','branch_g')
		.each(function(d,i){
			for (var i = 0; i< d.years.length; i++){
				d3.select(this).append('path')
					.attr({
						d: branch(year_scale(d.birth),height - root_height,year_scale(d.years[i].year),leaf_y_scale(d.years[i].count)),
						'class': 'branch',
						"data-count": d.years[i].count,
						"data-year": d.years[i].year,
						"data-author": d.full_name
					}).style('stroke',function(d){return colors[d.years[i].phylum]})
					.style('opacity',opacity)
					.style('fill','transparent');
			}
		})
	
	
	//roots
	var root_g = svg.append('g')
		.attr('transform','translate(' + margin.left + ',' + (height - root_height - margin.bottom ) + ')');
	
	
	root_g.selectAll('.root')
		.data(data).enter()
		.append('rect')
		.attr({
			x: function(d){return year_scale(d.birth);},
			y: 0,
			width: root_width,
			height: function(d){return root_y_scale(d.total);},
			"class": 'root'
		})
	
	//leafs
	var leaf_g = svg.append('g')
		.attr('transform','translate(' + margin.left + ',0)');
	
	leaf_g.selectAll('.leaf_g')
		.data(data).enter()
		.append('g')
		.attr('class','leaf_g')
		.each(function(d,i){
			for (var i = 0; i< d.years.length; i++){
				d3.select(this).append('circle')
					.attr({
						cx: function(){ return year_scale(d.years[i].year);},
						cy: function(){ return leaf_y_scale(d.years[i].count);},
						r: function(){ return leaf_r_scale(d.years[i].count);},
						'class': 'leaf',
						"data-count": d.years[i].count,
						"data-year": d.years[i].year,
						"data-author": d.author
					}).style('fill',function(d){return colors[d.years[i].phylum]})
					.style('opacity',opacity);
			}
		});

	
		var leaves = leaf_g.selectAll('.leaf');
        
    
    	leaves.on("mouseover", function(d){ 
    		var that = d3.select(this);
    		tooltip.text(
    			that.attr("data-count") + '<br />' + that.attr("data-year") + '<br />'+that.attr("data-author")
    			); 
    			tooltip.style("visibility", "visible");
    		var author = this.__data__.author;
      		
    		leaves.transition().duration(50).style('opacity',function () {
	        	return (this.__data__.author == author) ? opacity : 0;
			});

    	})
		.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
		.on("mouseout", function(){
			tooltip.style("visibility", "hidden");
			leaves.transition().duration(50).style('opacity',opacity);
		});
        
        
	var tooltip = d3.select("body")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.style('background-color','#fff')
		.text("a simple tooltip");
		
		
		

	}; // end build nav


	

	
var build_viz = function(){
	
	d3.json('js/tree-authors-utf8.json',function(data){
		var half_data = [];
		for(var i = 0; i<10;i++){
			half_data.push(data[i]);
		}
	
	
		build_main(half_data);
	});
	
		
};
build_viz();

});