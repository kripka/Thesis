$(function(){

// cache some variables
var data,
	min_count = 0,
	max_count,
	min_phylum_count,
	max_phylum_count,
	min_year,
	max_year,
	year_scale,
	leaf_y_scale,
	leaf_r_scale,
	root_y_scale,
	root_width_scale,
	branch_width_scale,
	svg,
	main_g,
	branch_wrapper,
	leaf_wrapper,
	root_wrapper;

var colors = {
	"Arthropoda":"rgb(164, 170, 20)",
	"Chordata":"#2d9acd",
	"Mollusca":"rgb(228, 152, 22)",
	"Cnidaria":"#cd2d9d",
	"Ctenophora":"#6e0c00",
	"Annelida":"#6e006b",
	"Echinodermata":"#652dcd",
	"Nematoda":"#4e810a",
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


	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    x = w.innerWidth || e.clientWidth || g.clientWidth,
	    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

	var padding = {
			top: 50,
			right: 50,
			bottom: 50,
			left: 100	
		},
		width = x,
		height = y,
		root_height = 100,
		root_width = 1,
		opacity = .5,
		max_radius = 20,
		min_radius = 1,
		branch_opacity = .15,
		opacity = {
			branch: .15,
			root : 1,
			leaf: 1,
			lifetime: 1
		};
		
		
		var unique_phylums = [];
		
		
		
/*
		
		// for print version
		width = 1440;
		height=1728;
		
		aspect_ratio = width/height;
		height = y;
		width = x * aspect_ratio;
		
*/


function AUTHOR_TREE(){
	return null;
}


	
	
AUTHOR_TREE.prototype.branch = function(x1,y1,x2,y2,count,highYear,year){
	return function(){
		var path;
				var branch_data = [];
				
				var temp_data;
					
				branch_data.push({x:x1,y:y1});
				
												
				branch_data.push({
					x: x1,
					y: leaf_y_scale(count)
				});
				
				if (year < highYear) {
					branch_data.push({x:x2 + (leaf_r_scale(count)),y:y2});
				} else if (year == highYear) {
					branch_data.push({x:x2,y:y2 + (leaf_r_scale(count))});
				} else {
					branch_data.push({x:x2 - (leaf_r_scale(count)),y:y2});
				}
			
				var line_function = d3.svg.line()
					.x(function(d){return d.x;})
					.y(function(d){return d.y;})
					.interpolate('basis');
					
									
				return line_function(branch_data);
	};
};	


var tree = new AUTHOR_TREE();


/******** BUILD SCALES ************/
var build_scales = function(data) {
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
	

	year_scale = d3.scale.linear().range([padding.left,width - padding.right]).domain([min_year,max_year]);	
	//leaf_y_scale = d3.scale.linear().range([height - padding.bottom - (root_height*2) -padding.bottom,padding.top ]).domain([1,max_phylum_count]);
	leaf_y_scale = d3.scale.linear().range([height - padding.bottom - (root_height) - 2,padding.top ]).domain([1,max_phylum_count]);
	leaf_r_scale = d3.scale.sqrt().range([min_radius,max_radius]).domain([min_phylum_count,max_phylum_count]);
	root_y_scale = d3.scale.linear().range([0,root_height]).domain([0,max_count]);
	root_width_scale = d3.scale.linear().range([1,10]).domain([min_phylum_count,max_phylum_count]);
	branch_width_scale = d3.scale.linear().range([1,4]).domain([min_phylum_count,max_phylum_count]);
};


/***** BUILD BASE ************/
var build_base = function(data){
	svg = d3.select('#top-100-svg').append('svg')
	.attr({
		width: width,
		height: height
	});
	
	main_g = svg.append('g').attr('id','main_g');
	
	
	var dirt = main_g.append('rect').attr({
		x: 0,
		y: height - root_height - padding.bottom,
		width: width,
		height: root_height + padding.bottom,
		id : 'dirt'
	});
	
	
	/*

	var year_axis = main_g.append('line')
		.attr({
			x1: year_scale(min_year),
			y1: height - root_height -padding.bottom,
			x2: year_scale(max_year),
			y2: height - root_height -padding.bottom,
			"class": 'yearline'	
		}).style('stroke','black');
*/
		
		
	var year_grid = main_g.append('g').attr('id',"year_grid");
	
	for (var i =min_year; i < max_year; i++) {
		if (i % 5 == 0) {
			year_grid.append('line').attr({
				x1: year_scale(i),
				y1: leaf_y_scale(Math.ceil(max_phylum_count/100)*100),
				x2: year_scale(i),
				y2: height - root_height - padding.bottom + + root_y_scale(Math.ceil(max_count/2000)*2000)
			});
		}
	}
	
	
	var leaf_grid = main_g.append('g').attr('id',"leaf_grid");
	
	for (var i = 0; i < max_phylum_count + 100; i+=100) {
		leaf_grid.append('line').attr({
			x1: padding.left,
			y1: leaf_y_scale(i),
			x2: width - padding.right,
			y2: leaf_y_scale(i)
		});
	}
	
	var root_grid = main_g.append('g').attr('id',"root_grid")
		.attr('transform','translate(0,' + (height - root_height -padding.bottom ) + ')');
	
	for (var i = 0; i < max_count + 2000; i+=2000) {
		root_grid.append('line').attr({
			x1: padding.left,
			y1: root_y_scale(i),
			x2: width - padding.right,
			y2: root_y_scale(i)
		});
	}
	
	var leaf_numbers = main_g.append('g').attr('class','numbers');
	
	for (var i = 0; i < max_phylum_count + 100; i+=100) {
		leaf_numbers.append('text').attr({
			x: padding.left - 10,
			y: leaf_y_scale(i) + 5,
		}).text(i)
		.style('text-anchor','end');
	}
	
	var root_numbers = main_g.append('g').attr('class','numbers')
		.attr('transform','translate(0,' + (height - root_height -padding.bottom ) + ')');
	
	for (var i = 4000; i < max_count + 2000; i+=4000) {
		root_numbers.append('text').attr({
			x: padding.left - 10,
			y: root_y_scale(i) + 5,
		}).text(i)
		.style('text-anchor','end');
	}
	
	leaf_numbers.append('text').text('Species Described By Phylum')
		.attr('transform','rotate(-90),translate(-'+width/4+',55)')
		.attr('class','title');

		
	var root_title = root_numbers.append('text').text('Total Species Described')
		.attr({
			x:0,
			y:0,
			"class":'title'
		});
	var rt_length = root_title.node().getComputedTextLength();
	root_title.attr('transform','rotate(-90),translate(-'+(rt_length + (rt_length/4))+',55)');
	
	var year_title = main_g.append('text').attr({
			x: width/2,
			y: height - 10,
			"class":'title'
	}).text('Years')
	.style('font-size','10px');
	
	var year_axis_titles = main_g.append('g').attr('id','year-axis-titles');
	
	year_axis_titles.append('text').attr({
			x: year_scale(min_year),
			y: height - 20,
			"class":'year_axis_title'
		}).text(min_year)
		.style('text-anchor','middle');
		
	year_axis_titles.append('text').attr({
		x: year_scale(max_year),
		y: height - 25,
		"class":'year_axis_title'
	}).text(max_year)
	.style('text-anchor','middle');
	
	for (var i = 1750; i < max_year + 49; i+=50) {
		year_axis_titles.append('text').attr({
			x: year_scale(i),
			y: height - 25,
			"class":'year_axis_title'
		}).text(i)
		.style('text-anchor','middle');
		
		year_grid.append('line')
			.attr({
				x1:year_scale(i),
				y1:height - 40,
				x2:year_scale(i),
				y2:height - 32,
				"class":'year-line-1'
			})
			.style('stroke','black')
			.style('opacity',1);
		
	}
	
	
	branch_wrapper = main_g.append('g').attr('id','branch-wrapper');
	
	leaf_wrapper = main_g.append('g').attr('id','leaf-wrapper');
	
	root_wrapper = main_g.append('g').attr('id','root-wrapper');
	

};


/***** BUILD AUTHOR *********/	
var build_author = function(data){

	var author = [data];
	var years_no_zeroes = [];
		

	// set high hear
	function compare(a,b) {
	  if (a.count > b.count)
	     return -1;
	  if (a.count < b.count)
	    return 1;
	  return 0;
	}
	
	var ayears;
	ayears = author[0].years;	
	ayears.sort(compare);	
		
	if (ayears[0].year == 0) {
		author[0].highYear = ayears[1].year;
	} else {
		author[0].highYear = ayears[0].year;
	}
	
	for (var i = 0; i< author[0].years.length; i++){
		// handle unknown years
		if (author[0].years[i].year == 0) {
			author[0].years[i].year = author[0].birth;
			author[0].hasUnknown = true;
		}

		
	}
			
		
	//branches
/*
	var branch = function(x1,y1,x2,y2,count,highYear,year) {
				var path;
				var branch_data = [];
				
				var temp_data;
					
				branch_data.push({x:x1,y:y1});
				
												
				branch_data.push({
					x: x1,
					y: leaf_y_scale(count)
				});
				
				if (year < highYear) {
					branch_data.push({x:x2 + (leaf_r_scale(count)),y:y2});
				} else if (year == highYear) {
					branch_data.push({x:x2,y:y2 + (leaf_r_scale(count))});
				} else {
					branch_data.push({x:x2 - (leaf_r_scale(count)),y:y2});
				}
			
				var line_function = d3.svg.line()
					.x(function(d){return d.x;})
					.y(function(d){return d.y;})
					.interpolate('basis');
					
									
				return line_function(branch_data);
			};
			
*/
			
	var branch_g = branch_wrapper.append('g');
	
	
		
	//leafs
	var build_leaf = function(leaf_d){
	
		var leaf_g = leaf_wrapper.append('g');
			
		var leaf = leaf_g.selectAll('.leaf').data([leaf_d]).enter().append('circle');
		
		
		leaf.style('fill',colors[leaf_d.phylum])
			.style('stroke',colors[leaf_d.phylum])
			.style('fill-opacity',.5)
			.attr({
				cx: function(){ return year_scale(leaf_d.year);},
				cy: function(){ return leaf_y_scale(leaf_d.count);},
				r: 0,
				'class': 'leaf',
				"data-count": leaf_d.count,
				"data-year": leaf_d.year,
				"data-author": leaf_d.author
			}).transition().duration(500)
			.attr('r', function(){ return leaf_r_scale(leaf_d.count);});
			
			
			
	};
	
	
	
	var leaf_functions = [];
	
	var create_leaf_func = function(data,i){
		return function(){
			if (i == leaf_functions.length - 1){
				d3.selectAll('.branch').style('stroke-dasharray',function(d){ return (d.birth == d.year) ? "2 2" : 0;   });
			}
			build_leaf(data);
		}	
	};
	
	branch_g.selectAll('.branch')
		.data(author).enter()
		.append('g')
		.attr('class','branch_g')
		.each(function(d,i){
			for (var x = 0; x < d.years.length-1; x++){	
				var leaf_data = {
							year : 	d.years[x].year,
							count : d.years[x].count,
							author : d.author,
							phylum : d.years[x].phylum,
							birth: d.birth
						};
						
				leaf_functions[x] = create_leaf_func(leaf_data,x);
				
				var path = d3.select(this).append('path')
					.style('stroke',function(d){
					phy = d.years[x].phylum;
					return colors[d.years[x].phylum]})
					.style('opacity',opacity['branch'])
					.style('fill','transparent')
					.style('stroke-width',function(d){return branch_width_scale(d.years[x].count)})
					.attr({
						d: tree.branch(year_scale(d.highYear),height - root_height - padding.bottom ,year_scale(d.years[x].year),leaf_y_scale(d.years[x].count),d.years[x].count,d.highYear,d.years[x].year),
						'class': 'branch',
						"data-count": d.years[x].count,
						"data-year": d.years[x].year,
						"data-author": d.author
					});
				
				var totalLength = path.node().getTotalLength();	

				path.attr("stroke-dasharray", totalLength + " " + totalLength)
				  .attr("stroke-dashoffset", totalLength)
				  .transition()
				    .duration(500)
				    .ease("linear")
				    .attr("stroke-dashoffset", 0)
				    .each('end',leaf_functions[x]);
				    
				 
				// set phylum for data 
				var path_data = [{
					author: d.author,
					phylum:d.years[x].phylum,
					year : d.years[x].year,
					birth: d.birth	
				}];
				
				path.data(path_data);
				

			}
		});
		
	
	
	//roots
		
	var root_g = root_wrapper.append('g')
		.attr('transform','translate(0,' + (height - root_height -padding.bottom ) + ')');
	
	
		var aut;
		root_g.selectAll('.root')
			.data(author).enter()
			.append('rect')
			.attr({
				x: function(d){ aut = d.author; return year_scale(d.highYear) - 1;},
				y: 0,
				width: 2,
				height: function(d){return root_y_scale(d.total);},
				"class": 'root'
			});
			
		var lifetime = main_g.append('g').attr('class','lifetime')
			.attr('transform','translate(0,' + (height - root_height -padding.bottom ) + ')');

		lifetime.data([{author:aut}]);
		
		lifetime.selectAll('.lifetime-line')
			.data(author).enter()
			.append('line')
			.attr({
				x1: function(d){return year_scale(d.birth);},
				y1: function(d){return root_y_scale(d.total);},
				x2: function(d){return year_scale(d.death);},
				y2: function(d){return root_y_scale(d.total);},
				"class":'lifetime-line'
			});
			
		lifetime.selectAll('.lifetime-birth-tick')
			.data(author).enter()
			.append('line')
			.attr({
				x1: function(d){return year_scale(d.birth);},
				y1: function(d){return root_y_scale(d.total) - 5;},
				x2: function(d){return year_scale(d.birth);},
				y2: function(d){return root_y_scale(d.total) + 5;},
				"class":'lifetime-birth-tick'
			});
			
		lifetime.selectAll('.lifetime-death-tick')
			.data(author).enter()
			.append('line')
			.attr({
				x1: function(d){return year_scale(d.death);},
				y1: function(d){return root_y_scale(d.total) - 5;},
				x2: function(d){return year_scale(d.death);},
				y2: function(d){return root_y_scale(d.total) + 5;},
				"class":'lifetime-birth-tick'
			});
			
		lifetime.selectAll('.lifetime-birth').data(author).enter().append('text')
			.text(function(d){return d.birth;})
			.attr({
				x: function(d){return year_scale(d.birth) - 10;},
				y: function(d){return root_y_scale(d.total) - 7;},
				"class": 'lifetime-birth title'
			});
			
		lifetime.selectAll('.lifetime-death').data(author).enter().append('text')
			.text(function(d){return d.death;})
			.attr({
				x: function(d){return year_scale(d.death) - 10;},
				y: function(d){return root_y_scale(d.total) - 7;},
				"class": 'lifetime-death title'
			});
			
			
	}; // end build nav
	

var build_interactions = function(){
		var trees = svg.selectAll('.leaf,.branch,.root,.lifetime');
				
		trees.on("mouseover",function(d){
			var author = this.__data__.author;
			trees.transition().duration(50).style('opacity',function () {
	        	return (this.__data__.author == author) ? opacity[d3.select(this).attr('class')] : 0;
			});
			tooltip.html(
				this.__data__.count + ' species<br />' + this.__data__.year
			); 
			tooltip.style("visibility", "visible");			
		});
		
		trees.on("mouseout",function(d){
			var author = this.__data__.author;
			trees.transition().duration(50).style('opacity',function(){
				return (d3.select(this).attr('class') == 'lifetime') ? 0 : opacity[d3.select(this).attr('class')]; 
			});
			tooltip.style("visibility", "hidden");
		});
            
		trees.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");});

        
        
	var tooltip = d3.select("body")
		.append("div")
		.attr('id','tooltip')
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.text("a simple tooltip");
};	
			
			
var build_legend = function(data){

	// push into unique phylums for legend
	for (var i = 0; i < data.length;i++) {
		console.log(data[i].years.length);
		for (var j = 0; i < data[i].years.length; j++){
			console.log(j);
			if (unique_phylums.indexOf(data[i].years[j].phylum) == -1) {
				unique_phylums.push(data[i].years[j].phylum);
			}
		}
	}


	var legend = main_g.append('g').attr('id','legend');
	
	legend.attr('transform','translate(' + (width - padding.right - 60) + ','+padding.top+')');
	
	var space = 12;
	
	
	unique_phylums.sort();
	
	legend.selectAll('.legend-text').data(unique_phylums).enter()
		.append('text').text(function(d){return d;})
			.attr({
				x: 15,
				y: function(d,i){return space * i +8;},
				"class":'legend-text'
			})
			
	legend.selectAll('.legend-circ').data(unique_phylums).enter()
		.append('circle')
		.attr({
				cx: 0,
				cy: function(d,i){ return (space * i) + 4; },
				r: 4,
				"class":'legend-circ'
			}).style('fill',function(d){return colors[d];});
	
	
	var legend_items = svg.selectAll('.legend-text,.legend-rect');
	
	legend_items.on('mouseover',function(d){
		var phylum = this.__data__;		
		var trees = svg.selectAll('.leaf,.branch,.root');
		trees.transition().duration(50).style('opacity',function () {
        	return (this.__data__.phylum == phylum) ? opacity[d3.select(this).attr('class')] : 0;
		});
	});
	
	legend_items.on('mouseout',function(){
		var trees = svg.selectAll('.leaf,.branch,.root');
		trees.transition().duration(50).style('opacity',function(){
				return opacity[d3.select(this).attr('class')]; 
			});
	});
	

};

	

var authorTimeout = function(data,i){
	setTimeout(
		function(){
			build_author(data);
		},i*100
	);
	
	if (i == data.length) {
		setTimeout(
			build_interactions,i*400 + 1000
		);
	}
	
};

// maybe not... 
var animateInAuthors = function(data) {
	var sortData = data.sort(function(a,b){ return d3.ascending(a.birth,b.birth); });
	
	for (var i =0; i<data.length; i++){
		authorTimeout(sortData[i],i);
	}
	
	setTimeout(build_interactions,(data.length) * 100 + 1000);
	
	

};

	
var build_viz = function(){
	d3.json('js/top-25.json',function(data){
	
		build_scales(data);
		build_base(data);
		
		animateInAuthors(data);
	
		/*
for (var i =0; i<data.length; i++){
			authorTimeout(data[i],i);
		}
*/

		//setTimeout(build_interactions,2000);
		
		build_legend(data);
		
	
	});
	
		
};
build_viz();

});