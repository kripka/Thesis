jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};

$(function(){


	var nav_btns = $('#fixed-nav a'),
		loader = $('#loader'),
		$viz = $('#viz-wrapper');
		
	var tooltip = d3.select("body")
		.append("div")
		.attr('id','tooltip')
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.text("a simple tooltip");


function Holder(){
	return null;
}

	var namespace = {};
	
	namespace.states = {
		buildbase : false,
		buildbase2: false,
		trees: false
	};
	
	namespace.$opacityIn = function($el,duration){
		if (typeof duration === 'undefined') { duration = 200; }
		$el.css('opacity',0).show().animate({'opacity':1},duration);
	};
	namespace.$opacityOut = function($el,duration){
		if (typeof duration === 'undefined') { duration = 200; }
		$el.animate({'opacity':0},duration,'linear',function(){$(this).hide();});
	};
	
	namespace.d3opacityIn = function(el,duration) {
		if (typeof duration === 'undefined') { duration = 200; }
		el.style({'display':'block','opacity':0}).transition().duration(duration).style({'opacity':1});	
	};
	namespace.d3opacityOut = function(el,duration) {
		if (typeof duration === 'undefined') { duration = 200; }
		el.style({'opacity':1}).transition().duration(duration).style({'opacity':0}).each(function(){ el.style({'display':'none'}) });	
	};
	
	namespace.wrapper = d3.select('#viz-wrapper');
	
	
	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    x = w.innerWidth || e.clientWidth || g.clientWidth,
	    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	
	// variables for d3
	namespace.settings = {
		padding :{
			top: 50,
			right: 55,
			bottom: 50,
			left: 60	
		},
		width: x,
		height: y,
		root_height:100,
		root_width: 1,
		opacity : .5,
		max_radius : 20,
		min_radius : 1,
		branch_opacity : .15,
		opacity :{
			branch: .15,
			root : 1,
			leaf: 1,
			lifetime: 1
		},
		space: 12
	};
	
	/*
namespace.colors = {
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
		"Porifera":"rgb(255, 128, 128)"
	};
*/

	namespace.colors = {
		"Arthropoda":"#a4aa14",
		"Chordata":"#15b0bd",
		"Mollusca":"#e9700d",
		"Cnidaria":"#1c6fa4",
		"Ctenophora":"#2a9228",
		"Annelida":"#c42428",
		"Echinodermata":"#855ead",
		"Nematoda":"#804e45",
		"Acanthocephala":"#cf6db2",
		"Platyhelminthes":"#cf6db2",
		"Nematomorpha":"#c8c781",
		"Onychophora":"#90c8d1",
		"Sipuncula":"#9fb7d4",
		"Rotifera":"#e9a96e",
		"Gastrotricha":"#8ccc7e",
		"Brachiopoda":"#e98989",
		"Bryozoa":"#b3a1c3",
		"Nemertea":"#b38e87",
		"Porifera":"#e2a6c1",
		"Kinorhyncha":"#b6b6b6",
		"Rhombozoa": "",
		"Orthonectida":"",
		"Loricifera":"",
		"Hemichordata":"",
		"Echiura":"",
		"Xenacoelomorpha":"",
		"Tardigrada":"",
		"Kamptozoa":"",
		"Acanthocephala":"",
		"Cycliophora":"",
		"Myxozoa":"",
		"Micrognathozoa":"",
		"Chaetognatha":"",
		"Gnathostomulida":"",
		"Cephalorhyncha":"",
		"Placozoa":"",
		"Phoronida":""
	};
	


	
	$screen2text = $('#screen2-text');
	$screen2inject = $screen2text.find('#screen2-inject');
	$screen2next = $screen2text.find('#screen2-next');
	$viznav = $('#viz-nav');
	
	function numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	$( "#author-tag" ).draggable();
	
	
function AUTHOR_TREE(){
	return null;
}


	
	
AUTHOR_TREE.prototype.branch = function(x1,y1,x2,y2,count,highYear,year){
	//return function(){
		var path;
			var branch_data = [];
			
			var temp_data;
				
			branch_data.push({x:x1,y:y1});
			
											
			branch_data.push({
				x: x1,
				y: namespace.leaf_y_scale(count)
			});
			
			if (year < highYear) {
				branch_data.push({x:x2 + (namespace.leaf_r_scale(count)),y:y2});
			} else if (year == highYear) {
				branch_data.push({x:x2,y:y2 + (namespace.leaf_r_scale(count))});
			} else {
				branch_data.push({x:x2 - (namespace.leaf_r_scale(count)),y:y2});
			}
		
			var line_function = d3.svg.line()
				.x(function(d){return d.x;})
				.y(function(d){return d.y;})
				.interpolate('basis');
				
								
			return line_function(branch_data);
	//};
};	

AUTHOR_TREE.prototype.branch2 = function(x1,y1,x2,y2,count){
	//return function(){
		var path;
			var branch_data = [];
			
			var temp_data;
				
			branch_data.push({x:x1,y:y1});
			
											
			branch_data.push({
				x: x1,
				y: namespace.leaf_y_scale(count)
			});
			
			branch_data.push({x:x2,y:y2});
					
			var line_function = d3.svg.line()
				.x(function(d){return d.x;})
				.y(function(d){return d.y;})
				.interpolate('basis');
				
								
			return line_function(branch_data);
	//};
};


var tree = new AUTHOR_TREE();

/******************** FULL PAGE *****************************************/	
var waypoint_set = false;
	$('#full-page').fullpage({
		resize: false,
		scrollOverflow: true,
		afterLoad: function(anchorLink, index){
			nav_btns.removeClass('active');
			$(nav_btns[index - 1]).addClass('active');
			
			switch (index){
				case 1:
					
					break;
				case 2:
					$viz.css({
						'position':'fixed',
						'top':0,
						'right':0,
						'bottom':0,
						'left':0
					});
					namespace.$opacityIn($viz,500);
					namespace.main_g2.style('display','none');
					$viznav.css({'display':'none','opacity':0});
					namespace.build_screen2(0);
					break;
					
				case 3:
					$viz.css({
						'display':'block',
						'opacity':1
					});
					
					if (!namespace.states.buildbase2) {
						$viz.css({
							'display':'block',
							'position':'fixed',
							'top':0,
							'right':0,
							'bottom':0,
							'left':0
						}).animate({'opacity':1},500);
						namespace.build_base2();
						namespace.states.buildbase2 = true;
						namespace.states.trees = true;
						build_author(namespace.linnaeus);
						animateInAuthors(namespace.data);
						namespace.d3opacityIn(namespace.legend);
						$viznav.show().animate({'opacity':1},200);
					}
					
					break;
					
				case 4:
					//namespace.$opacityOut($viz);
					/*
$('#top100-header').waypoint({
						context: $('#top100-header').parent(),
						handler: function(direction){
							console.log(direction);
						}	
					});
*/
					break;
					
				default:
					break;
				
				
			} // switch
		},
		onLeave: function(index, nextIndex, direction){
		
			 if (nextIndex == 1 && direction == 'up'){
				$viz.animate({'opacity':0},200,'linear',function(){$(this).hide()});
				
			} else if (index == 2 && direction == 'down') {
				namespace.main_g2.style('display','block');
				$('#howread-div').animate({'opacity':0},200,'linear',function(){ $(this).hide() });
				if (!namespace.states.buildbase2) {
				    namespace.build_base2();
				    namespace.settings.buildbase2 = true;
			    }
			    if (!namespace.states.trees) {
					animateInAuthors(namespace.data);
					namespace.states.trees = true;
				}
				$screen2text.hide();
				$viznav.css('display','block').animate({'opacity':1},200);
			} else if (index == 3 && direction == 'up') {
				namespace.main_g2.style('display','none');
					$viznav.css({'display':'none','opacity':0});
			
				namespace.leaf_wrapper.selectAll('.leaf').remove();
			    namespace.branch_wrapper.selectAll('.branch').remove();
			    namespace.root_wrapper.selectAll('.root').remove();
			    namespace.lifetime_wrapper.selectAll('.lifetime').remove();
			    namespace.states.trees = false;
			} else if (index == 3 && direction == 'down') {
				namespace.$opacityOut($viz);;
			}
		}
	});
	
	
/******************** NAV SLIDE *****************************************/	
	nav_btns.on('mouseenter',function(){
		$(this).stop().animate({right:'180px'},100,'easeInOutQuad');
	});
	
	nav_btns.on('mouseleave',function(){
		$(this).stop().animate({right:'0'},100,'easeInOutQuad');
	});
	
	nav_btns.on('click',function(){
		var link = $(this).index() + 1;
		nav_btns.removeClass('active');
		$(this).addClass('active');
		$.fn.fullpage.moveTo(link);
		
		return false;
	})
	
	
	// d3 stuff
	
/******************** BUILD SCALES *****************************************/	
	namespace.build_scales = function(data) {
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
			
		namespace.min_phylum_count = d3.min(phylum_counts);
		namespace.max_phylum_count = d3.max(phylum_counts);
		
		namespace.max_count = d3.max(total_counts);
		
		namespace.min_year = d3.min(data,function(d){return d.birth;});
		namespace.max_year = d3.max(describe_years);
		
	
		namespace.year_scale = d3.scale.linear().range([namespace.settings.padding.left,namespace.settings.width - namespace.settings.padding.right]).domain([namespace.min_year,namespace.max_year]);	
		namespace.leaf_y_scale = d3.scale.linear().range([namespace.settings.height - namespace.settings.padding.bottom - (namespace.settings.root_height) - 2,namespace.settings.padding.top ]).domain([1,namespace.max_phylum_count]);
		namespace.leaf_r_scale = d3.scale.sqrt().range([namespace.settings.min_radius,namespace.settings.max_radius]).domain([namespace.min_phylum_count,namespace.max_phylum_count]);
		namespace.root_y_scale = d3.scale.linear().range([0,namespace.settings.root_height]).domain([0,namespace.max_count]);
		namespace.root_width_scale = d3.scale.linear().range([1,10]).domain([namespace.min_phylum_count,namespace.max_phylum_count]);
		namespace.branch_width_scale = d3.scale.linear().range([1,4]).domain([namespace.min_phylum_count,namespace.max_phylum_count]);
	};
	
/******************** BUILD BASE *****************************************/
	
	namespace.build_base = function(){
		// create an element not on page?
		namespace.svg = namespace.wrapper.append('svg')
			.attr({
				width: namespace.settings.width,
				height: namespace.settings.height
			});
			
		namespace.main_g = namespace.svg.append('g').attr('id','main_g');
		namespace.main_g2 = namespace.svg.append('g').attr('id','main-g2');
		
		
		var dirt = namespace.main_g.append('rect').attr({
			x: 0,
			y: namespace.settings.height - namespace.settings.root_height - namespace.settings.padding.bottom,
			width: namespace.settings.width,
			height: namespace.settings.root_height + namespace.settings.padding.bottom,
			id : 'dirt'
		});
		
		var year_grid = namespace.main_g.append('g').attr('id',"year_grid");
	
		for (var i =namespace.min_year; i < namespace.max_year; i++) {
			if (i % 5 == 0) {
				year_grid.append('line').attr({
					x1: namespace.year_scale(i),
					y1: namespace.leaf_y_scale(Math.ceil(namespace.max_phylum_count/100)*100),
					x2: namespace.year_scale(i),
					y2: namespace.settings.height - namespace.settings.root_height - namespace.settings.padding.bottom + + namespace.root_y_scale(Math.ceil(namespace.max_count/2000)*2000)
				});
			}
		}
		
		var root_grid = namespace.main_g.append('g').attr('id',"root_grid")
			.attr('transform','translate(0,' + (namespace.settings.height - namespace.settings.root_height -namespace.settings.padding.bottom ) + ')');
	
		for (var i = 0; i < namespace.max_count + 2000; i+=2000) {
			root_grid.append('line').attr({
				x1: namespace.settings.padding.left,
				y1: namespace.root_y_scale(i),
				x2: namespace.settings.width - namespace.settings.padding.right,
				y2: namespace.root_y_scale(i)
			});
		}
		
		var year_axis_titles = namespace.main_g.append('g').attr('id','year-axis-titles');
	
		year_axis_titles.append('text').attr({
				x: namespace.year_scale(namespace.min_year),
				y: namespace.settings.height - 20,
				"class":'year_axis_title'
			}).text(namespace.min_year)
			.style('text-anchor','middle');
			
		year_grid.append('line')
				.attr({
					x1:namespace.year_scale(namespace.min_year),
					y1:namespace.settings.height - 40,
					x2:namespace.year_scale(namespace.min_year),
					y2:namespace.settings.height - 32,
					"class":'year-line-1'
				})
				.style('stroke','black')
				.style('opacity',1);
			
		year_axis_titles.append('text').attr({
			x: namespace.year_scale(namespace.max_year),
			y: namespace.settings.height - 25,
			"class":'year_axis_title'
		}).text(namespace.max_year)
			.style('text-anchor','middle');
		
		year_grid.append('line')
			.attr({
				x1:namespace.year_scale(namespace.max_year),
				y1:namespace.settings.height - 40,
				x2:namespace.year_scale(namespace.max_year),
				y2:namespace.settings.height - 32,
				"class":'year-line-1'
			})
			.style('stroke','black')
			.style('opacity',1);

		
		for (var i = 1750; i < namespace.max_year + 49; i+=50) {
			year_axis_titles.append('text').attr({
				x: namespace.year_scale(i),
				y: namespace.settings.height - 25,
				"class":'year_axis_title'
			}).text(i)
			.style('text-anchor','middle');
			
			year_grid.append('line')
				.attr({
					x1:namespace.year_scale(i),
					y1:namespace.settings.height - 40,
					x2:namespace.year_scale(i),
					y2:namespace.settings.height - 32,
					"class":'year-line-1'
				})
				.style('stroke','black')
				.style('opacity',1);
		}
		
		var year_title = namespace.main_g.append('text').attr({
				x: namespace.settings.width/2,
				y: namespace.settings.height - 10,
				"class":'title'
		}).text('Years')
		.style('font-size','10px');

		// let's build g's for screen 2 and screen 3
		namespace.screen2g = namespace.svg.append('g').attr('id','screen2g');
		namespace.screen3g = namespace.svg.append('g').attr('id','screen3g');
		
		
		d3.select('#viz-nav-inject').style('width',namespace.data.length * 40 + 'px');
		var viz_nav_btns = d3.select('#viz-nav-inject').selectAll('.viz-nav-btn').data(namespace.data).enter()
			.append('a').text(function(d,i){return i+1;})
			.attr('class','viz-nav-btn');
			
			
		viz_nav_btns.on('click',function(d){
			var that = $(this),
				index = that.index(),
				tag = $('#author-tag'),
				inject = tag.find('#author-tag-inject'),
				num = $(this).text(),
				author = d.author;
							
			
			tag.data('author',index);
				
			$(viz_nav_btns[0]).removeClass('active');	
			$(this).addClass('active');
				
			inject.empty();
			inject.html('<span id="author-num">#' + num + '</span><h2>' + d.author +'</h2><h3>' + numberWithCommas(d.total) + ' species</h3><h4>' + d.birth + '&ndash;' + d.death + ' ' + d.country +'</h4><a href="' + d.link + '" target="_blank" class="wikipedia">Wikipedia</a>');
						
			namespace.$opacityIn(tag);
			
			namespace.svg.selectAll('.leaf,.root').style('display',function(d){
				return (d.author == author) ? 'block' : 'none';
			});
			
			
			namespace.svg.selectAll('.branch').style('opacity',function(d){
				return (d.author == author) ? namespace.settings.opacity.branch : 0;
			});
			
			namespace.svg.selectAll('.lifetime').style('display',function(d){
				return (d.author == author) ? 'block' : 'none';
			});
			
			// TODO   move tag close to author tree
			var max = d3.max(d.years,function(d){return d.count;}),
				maxyear,
				tagx,
				tagy;
			
			for(var i =0,l=d.years.length;i<l;i++){
				if (d.years[i].count == max) {
					maxyear = d.years[i].year;
					break;
				}
			}
			
			if (!maxyear) {
				maxyear = d.birth;
			}

			tagx = namespace.leaf_y_scale(max);
			if (tagx < 134 + 150 ) {
				tagx = 134;
			}  else {
				tagx = tagx - 200;
			}
			
			
			tagy = namespace.year_scale(maxyear);
						
			if (tagy < namespace.settings.width/3) {
				tagy = tagy + 200;
			} else {
				tagy = tagy - 500;
			}
			
			tag.css({
				'top': tagx + 'px',
				'left': tagy + 'px'
			});
			
			
		});
		
		$('#author-tag-close').on('click',function(){
			var tag = $('#author-tag');
			namespace.$opacityOut(tag);
			$(viz_nav_btns[0]).removeClass('active');
			
			namespace.svg.selectAll('.leaf,.root').style('display','block');
			namespace.svg.selectAll('.lifetime').style('display','none');
			
			namespace.svg.selectAll('.branch').style('opacity',namespace.settings.opacity.branch);
		});
		
		$('#author-tag-next').on('click',function(){
			var that = $(this),
				parent = that.parent(),
				currentAuthor = parent.data('author'),
				btns = $('.viz-nav-btn');	
				
			if (currentAuthor == namespace.data.length - 1) {
				parent.data('author',0);
				$(btns[0]).d3Click();
			} else {
				parent.data('author',currentAuthor + 1);
				$(btns[currentAuthor + 1]).d3Click();
			}
			
		});
		
		$('#howread').on('click',function(){
			namespace.$opacityIn($('#howread-div'));
		});
		
		$('#close-howread').on('click',function(){
			namespace.$opacityOut($('#howread-div'));
		});


		
	}; // end build_base
	

	
/******************** SCREEN 2 *****************************************/
	
	namespace.screen2 = [
		{
			year: 1753,
			html: '<div class="screen2-1"><p>In 1753, Carl Linnaeus proposed binomial nomenclature, describing an organism with a one-word genus and one-word species, in his book <i>Species Planatarum</i>.</p></div>'
		},
		{
			year: 1757,
			html: '<div class="screen2-1"><p>In 1757, Carl Alexander Clerck became the first to apply binomial nomenclature to the animal kingdom in his book, <i>Svenska Spindlar</i> (<i>Swedish Spiders</i>).</p></div>'
		},
		{
			year: 1758,
			html: '<div class="screen2-1"><p>In 1758, Carl Linnaeus published the 10th Edition of <i>Systema Naturae</i>, describing over 4000 animals using binomial nomenclature and securing binomial nomenclature as the scientific standard for naming animals. </p></div>'
		},
		{
			year: 1737,
			html: '<div class="screen2-1"><p>Carl Linnaeus would describe 5275 animal species during his career, earning him #9 of the top authors to describe animal species since binomial nomenclature became the standard. </p></div>'
		}
	];
	
	
	$screen2next.on('click',function(){
		var that = $(this),
			next_index = that.data('nextindex');
		
		namespace.build_screen2(next_index);
		
		if (next_index == 4) {
			that.data('nextindex',0);
		} else {
			that.data('nextindex',next_index + 1);
		}
				
	});
	
var totalLength;	
	namespace.build_screen2 = function(index){
		var cr = 5;
		
		
		namespace.screen2g.selectAll('circle,path').remove();
		$screen2text.css('opacity',0);
		
		if (index < 3) {
		
		$screen2inject.html(namespace.screen2[index].html);
				    	$screen2text.css({'top':namespace.leaf_y_scale(1400) + 'px','left':(namespace.year_scale(namespace.screen2[index].year + 40)) + 'px'}).show();
				    	$screen2next.show();
					    $screen2text.animate({'opacity':1},200);
			
			
		var path = namespace.screen2g.append('path')
					.style('opacity',namespace.settings.opacity['branch'])
					.style('fill','transparent')
					.style('stroke-width',2)
					.attr({
						d: tree.branch2(namespace.year_scale(namespace.screen2[index].year), namespace.settings.height - namespace.settings.root_height - namespace.settings.padding.bottom ,namespace.year_scale(namespace.screen2[index].year + 30), namespace.leaf_y_scale(1200), 1100),
						'class': 'branch'
					});
			
					
		totalLength = path.node().getTotalLength();
		
		
		
		
var offset = (/Firefox/i.test(navigator.userAgent)) ? totalLength / path.node().strokeWidth : totalLength;
		
		totalLength = offset;

path.attr("stroke-dasharray", totalLength + " " + totalLength)
				  .attr("stroke-dashoffset", -totalLength)
				  .transition()
				    .duration(500)
				    .ease("linear")
				    .attr("stroke-dashoffset", 0)

				    
					.each('end',function(){
				    	
					    
					    namespace.screen2g.append('circle')
							.attr({
								cx: namespace.year_scale(namespace.screen2[index].year),
								cy: namespace.settings.height - namespace.settings.padding.bottom - namespace.settings.root_height,
								r: cr
							});
					    
				    });

				    
		} else if (index == 3) {  // end if index < 3
			
			$screen2inject.html(namespace.screen2[index].html);
	    	$screen2text.css({'top':namespace.leaf_y_scale(1400) + 'px','left':(namespace.year_scale(namespace.screen2[index].year + 40)) + 'px'}).show();
	    	$screen2next.show();
		    $screen2text.animate({'opacity':1},200);
		    
		    if (!namespace.states.buildbase2) {
			    namespace.build_base2();
			    namespace.states.buildbase2 = true;
		    }
		    		    
			build_author(namespace.linnaeus);
			
			namespace.d3opacityIn(namespace.legend,500);
			namespace.d3opacityIn(namespace.main_g2,500);
			namespace.$opacityIn($('#howread-div'),500);
		    		    
		    
		} else if (index == 4) {
			$.fn.fullpage.moveTo(3);
		} // end else
	
	}; // build screen 2
	
/****************** LEGEND ***************************************/
var build_legend = function(data){
	var unique_phylums = [];
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].years.length; j++){
			if (unique_phylums.indexOf(data[i].years[j].phylum) == -1) {
				unique_phylums.push(data[i].years[j].phylum);
			}
		}
	}
	unique_phylums.sort();
	
	var space = 12;
	
	namespace.legend = d3.select('#legend');
	
	var div;
	for (var i =0; i< unique_phylums.length; i++) {
		// create div, append last
		div = namespace.legend.select('#leg-labels').append('div').attr('class','legend-text');
		div.append('span').attr('class','legend-circ ' + unique_phylums[i]).style('background-color',namespace.colors[unique_phylums[i]]);
		div.append('span').attr('class','legend-label').text(unique_phylums[i]);
	}	
	
	div = namespace.legend.select('#leg-circles #lg2');
	
	div.append('div').attr('class','leg-circ2')
		.style('width', namespace.leaf_r_scale(1500) * 2 + 'px')
		.style('height', namespace.leaf_r_scale(1500) * 2 + 'px')
		.style('margin-left', -namespace.leaf_r_scale(1500) + 'px');
		
	div.append('div').attr('class','leg-circ2')
		.style('width', namespace.leaf_r_scale(500) * 2 + 'px')
		.style('height', namespace.leaf_r_scale(500) * 2 + 'px')
		.style('margin-left', -namespace.leaf_r_scale(500) + 'px');
		
	div.append('div').attr('class','leg-circ2')
		.style('width', namespace.leaf_r_scale(50) * 2 + 'px')
		.style('height', namespace.leaf_r_scale(50) * 2 + 'px')
		.style('margin-left', -namespace.leaf_r_scale(50) + 'px');
		
	
	// TODO  attach data to legend items so i can mouse over and just see that phylum
				
/*
	var legend_items = d3.select('#legend').selectAll('.legend-text');
	
	
	legend_items.on('mouseover',function(d){
		console.log(this.__data__);
		var phylum = this.__data__.phylum;	
		console.log(phylum);	
		var trees = namespace.svg.selectAll('.leaf,.branch,.root');
		trees.transition().duration(50).style('opacity',function () {
        	return (this.__data__.phylum == phylum) ? opacity[d3.select(this).attr('class')] : 0;
		});
	});
	
	legend_items.on('mouseout',function(){
		var trees = namespace.svg.selectAll('.leaf,.branch,.root');
		trees.transition().duration(50).style('opacity',function(){
				return opacity[d3.select(this).attr('class')]; 
			});
	});
	
*/
	

};

/***** BUILD AUTHOR ******************************************/	
var build_author = function(data){
	
	var newObject = jQuery.extend(true, {}, data);

	var author = [newObject];
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
	var branch_g = namespace.branch_wrapper.append('g');
	

	//leafs
	var build_leaf = function(leaf_d){
	
		var leaf_g = namespace.leaf_wrapper.append('g');
			
		var leaf = leaf_g.selectAll('.leaf').data([leaf_d]).enter().append('circle');
		
		
		leaf.style('fill',namespace.colors[leaf_d.phylum])
			.style('stroke',namespace.colors[leaf_d.phylum])
			.style('fill-opacity',.5)
			.attr({
				cx: function(){ return namespace.year_scale(leaf_d.year);},
				cy: function(){ return namespace.leaf_y_scale(leaf_d.count);},
				r: 0,
				'class': 'leaf',
				"data-count": leaf_d.count,
				"data-year": leaf_d.year,
				"data-author": leaf_d.author
			}).transition().duration(500)
			.attr('r', function(){ return namespace.leaf_r_scale(leaf_d.count);});
			
			
			
	};
	
	
	var leaf_functions = [];
	
	var create_leaf_func = function(data,i){
		return function(){
			if (i == leaf_functions.length - 1){
				branch_g.selectAll('.branch').style('stroke-dasharray',function(d){ return (d.birth == d.year) ? "2 2" : 0;   });
			}
			build_leaf(data);
		}	
	};
	
	branch_g.selectAll('.branch')
		.data(author).enter()
		.append('g')
		.attr('class','branch_g')
		.each(function(d,i){
			var leaf_data;
			for (var x = 0; x < d.years.length-1; x++){	
				leaf_data = {
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
					return namespace.colors[d.years[x].phylum]})
					.style('opacity',namespace.settings.opacity['branch'])
					.style('fill','transparent')
					.style('stroke-width',function(d){return namespace.branch_width_scale(d.years[x].count)})
					.attr({
						d: tree.branch(namespace.year_scale(d.highYear),namespace.settings.height - namespace.settings.root_height - namespace.settings.padding.bottom ,namespace.year_scale(d.years[x].year),namespace.leaf_y_scale(d.years[x].count),d.years[x].count,d.highYear,d.years[x].year),
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
		
	var root_g = namespace.root_wrapper.append('g')
		.attr('transform','translate(0,' + (namespace.settings.height - namespace.settings.root_height -namespace.settings.padding.bottom ) + ')');
	
	
		var aut;
		root_g.selectAll('.root')
			.data(author).enter()
			.append('rect')
			.attr({
				x: function(d){ aut = d.author; return namespace.year_scale(d.highYear) - 1;},
				y: 0,
				width: 2,
				height: function(d){return namespace.root_y_scale(d.total);},
				"class": 'root'
			});
			
		var lifetime = namespace.lifetime_wrapper .append('g').attr('class','lifetime')
			.attr('transform','translate(0,' + (namespace.settings.height - namespace.settings.root_height -namespace.settings.padding.bottom ) + ')');

		lifetime.data([{author:aut}]);
		
		lifetime.selectAll('.lifetime-line')
			.data(author).enter()
			.append('line')
			.attr({
				x1: function(d){return namespace.year_scale(d.birth);},
				y1: function(d){return namespace.root_y_scale(d.total);},
				x2: function(d){return namespace.year_scale(d.death);},
				y2: function(d){return namespace.root_y_scale(d.total);},
				"class":'lifetime-line'
			});
			
		lifetime.selectAll('.lifetime-birth-tick')
			.data(author).enter()
			.append('line')
			.attr({
				x1: function(d){return namespace.year_scale(d.birth);},
				y1: function(d){return namespace.root_y_scale(d.total) - 5;},
				x2: function(d){return namespace.year_scale(d.birth);},
				y2: function(d){return namespace.root_y_scale(d.total) + 5;},
				"class":'lifetime-birth-tick'
			});
			
		lifetime.selectAll('.lifetime-death-tick')
			.data(author).enter()
			.append('line')
			.attr({
				x1: function(d){return namespace.year_scale(d.death);},
				y1: function(d){return namespace.root_y_scale(d.total) - 5;},
				x2: function(d){return namespace.year_scale(d.death);},
				y2: function(d){return namespace.root_y_scale(d.total) + 5;},
				"class":'lifetime-birth-tick'
			});
			
		lifetime.selectAll('.lifetime-birth').data(author).enter().append('text')
			.text(function(d){return d.birth;})
			.attr({
				x: function(d){return namespace.year_scale(d.birth) - 10;},
				y: function(d){return namespace.root_y_scale(d.total) - 7;},
				"class": 'lifetime-birth title'
			});
			
		lifetime.selectAll('.lifetime-death').data(author).enter().append('text')
			.text(function(d){return d.death;})
			.attr({
				x: function(d){return namespace.year_scale(d.death) - 10;},
				y: function(d){return namespace.root_y_scale(d.total) - 7;},
				"class": 'lifetime-death title'
			});
			
			
	}; // end build nav
	
/************** BUILD INTERACTIONS *****************/
var build_interactions = function(){
		//var trees = namespace.svg.selectAll('.leaf,.branch,.root,.lifetime');
		
		var leaves = namespace.svg.selectAll('.leaf');
				
		leaves.on("mouseover",function(d){
			var author = this.__data__.author;
			tooltip.html(
				this.__data__.phylum + '<br />' + this.__data__.count + ' species<br />' + this.__data__.year
			); 
			tooltip.style("visibility", "visible");			
		});
		
		leaves.on("mouseout",function(d){
			var author = this.__data__.author;

			tooltip.style("visibility", "hidden");
		});
            
		leaves.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");});

	
		leaves.on('click',function(d){
			var author = this.__data__.author;
			var viz_nav_btns = $('.viz-nav-btn');
			
			for (var i = 0; i< viz_nav_btns.length; i++){
				if (viz_nav_btns[i].__data__.author == author) {
					$(viz_nav_btns[i]).d3Click();
				}
			}
			
		});
		
		
		
};	
	
/************* ANIMATE IN AUTHORS **************/
var authorTimeout = function(data,i){
	setTimeout(
		function(){
			build_author(data);
		},i*100
	);
	
};

// maybe not... 
var animateInAuthors = function(data) {
	var sortData = data.sort(function(a,b){ return d3.ascending(a.birth,b.birth); });
	
	for (var i =0; i<data.length; i++){
		if (data[i].author != 'Carl Linnaeus') {
			authorTimeout(sortData[i],i);
			if (i == data.length - 1) {
				setTimeout(
					build_interactions,i*120 + 1000
				);
			}
		}
		
	}
	
	//setTimeout(build_interactions,(data.length) * 100 + 1000);
	
	

};

	
/******************** MAIN VIZ *****************************************/

	namespace.build_base2 = function(){
		
		var leaf_grid = namespace.main_g2.append('g').attr('id',"leaf_grid");
	
		for (var i = 0; i < namespace.max_phylum_count + 100; i+=100) {
			leaf_grid.append('line').attr({
				x1: namespace.settings.padding.left,
				y1: namespace.leaf_y_scale(i),
				x2: namespace.settings.width - namespace.settings.padding.right,
				y2: namespace.leaf_y_scale(i)
			});
		}
		
		var leaf_numbers = namespace.main_g2.append('g').attr('class','numbers');
	
		for (var i = 0; i < namespace.max_phylum_count + 100; i+=100) {
			leaf_numbers.append('text').attr({
				x: namespace.settings.padding.left - 10,
				y: namespace.leaf_y_scale(i) + 5,
			}).text(i)
			.style('text-anchor','end');
		}
		
		var root_numbers = namespace.main_g2.append('g').attr('class','numbers')
			.attr('transform','translate(0,' + (namespace.settings.height - namespace.settings.root_height -namespace.settings.padding.bottom ) + ')');
		
		for (var i = 4000; i < namespace.max_count + 2000; i+=4000) {
			root_numbers.append('text').attr({
				x: namespace.settings.padding.left - 10,
				y: namespace.root_y_scale(i) + 5,
			}).text(i)
			.style('text-anchor','end');
		}
		
		leaf_numbers.append('text').text('Species Described By Phylum')
			.attr('transform','rotate(-90),translate(-'+namespace.settings.width/4+',15)')
			.attr('class','title');
	
			
		var root_title = root_numbers.append('text').text('Total Species Described')
			.attr({
				x:0,
				y:0,
				"class":'title'
			});
		var rt_length = root_title.node().getComputedTextLength();
			root_title.attr('transform','rotate(-90),translate(-'+(rt_length + (rt_length/4))+',15)');
		
		
		namespace.branch_wrapper = namespace.screen3g .append('g').attr('id','branch-wrapper');
		namespace.leaf_wrapper = namespace.screen3g .append('g').attr('id','leaf-wrapper');
		namespace.root_wrapper = namespace.screen3g .append('g').attr('id','root-wrapper');
		namespace.lifetime_wrapper = namespace.screen3g .append('g').attr('id','lifetime-wrapper');
		
		
		
		
	}; // build base 2

/**************** NAV CAROUSEL *********************/
$('.carousel-btn').on('click',function(){
	var that = $(this),
		direction = that.data('direction'),
		min_left = 26,
		//max_left = -574,
		//max_left = -1574,
		max_left = -((namespace.data.length - 10) * 40) + 26
		btn_width = 40,
		$wrapper = $('#viz-nav-inject'),
		margin = parseInt($wrapper.css('marginLeft')),
		is_disabled = that.hasClass('disabled');
	
	
	if (!is_disabled) {
	
		$('.carousel-btn').removeClass('disabled');
				
		if (direction == 'left') {
			if (margin >= min_left) {
				
			} else {
				$wrapper.animate({'marginLeft': (margin + btn_width) + 'px'},100,'easeInOutQuad',function(){
					var newmargin = parseInt($wrapper.css('marginLeft'));
					if (newmargin >= min_left) {
						$('#carousel-left').addClass('disabled');
					}
				});
				
			}
		
		} else if (direction == 'right') {
			if (margin <= max_left) {
				
			} else {
				$wrapper.animate({'marginLeft': (margin - btn_width) + 'px'},100,'easeInOutQuad',function(){
					var newmargin = parseInt($wrapper.css('marginLeft'));
					if (newmargin <= max_left) {
						$('#carousel-right').addClass('disabled');
					}
				});
				
			}
		}
	
	}
		
	
});
		
	
/******************** JSON IN DATA *****************************************/		
	
	d3.json('js/top-50-trees.json',function(data){
		namespace.data = data;
		loader.hide();
		$('.shim').animate({'opacity':1},500);
		
		namespace.build_scales(data);
		namespace.build_base();
		build_legend(namespace.data);
		
		namespace.linnaeus = data[8];
		
	});
	
	
/********************* BARS **********************/
namespace.bars = {};

namespace.bars.build = function(data){
	var bars = d3.select('#bars'),
		bar_wrapper,
		total,
		$axis = $('#axis'),
		ax_width = $axis.width(),
		tick,
		tickSpacing = ax_width/30;
		
	
	// lazy, Meyrick's count
	namespace.bars.max = 14812;
	
	for (var i = 0,l=data.length; i<l; i++) {
		total = 0;
		
		data[i].phylums.sort(function(obj1, obj2) {
			return (obj1.count > obj2.count) ? -1 : 1;
		});
		
		bar_wrapper = bars.append('div').attr('class','bar-wrapper');
		
		bar_wrapper.append('span').attr('class','bar-author').text( (i+1) + '. ' + data[i].author);
		
		bar_wrapper.append('div').attr('class','bar-phylums')
			.selectAll('span')
			.data(data[i].phylums).enter()
			.append('span')
			.style({
				width: function(d){ 
					total = total + d.count;
					return (d.count/namespace.bars.max) * 100 + '%'; },
				'background-color': function(d){return namespace.colors[d.phylum];}
			});
			
		bar_wrapper.select('.bar-phylums').append('div').text(numberWithCommas(total)).attr('class','bar-total');	
	}
	
	for (var i = 0,j=0; i<=15000; i+=500,j++){
		tick = $('<div class="tick" />').css('left',tickSpacing*j  + 'px');
		$axis.append(tick);
	}
	
	for (var i = 0,j=0,k=0; i<=15000; i+=1000,j+=2,k++){
		tick = $('<div class="tick-label" />').css('left',(tickSpacing*j - 20)  + 'px').text(k*1000);
		$axis.append(tick);
		tick = $('<div class="tick tick-top" />').css('left',tickSpacing*j  + 'px');
		$axis.append(tick);
	}
	
	
/*
	(function(data){
	var unique_phylums = [];
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].phylums.length; j++){
			if (unique_phylums.indexOf(data[i].phylums[j].phylum) == -1) {
				unique_phylums.push(data[i].phylums[j].phylum);
			}
		}
	}
	unique_phylums.sort();
		
	var space = 12;
	
	var legend = d3.select('#legend2');
	
	
	var div;
	for (var i =0; i< unique_phylums.length; i++) {
		
		div = legend.select('#leg-labels2').append('div').attr('class','legend-text');
		div.append('span').attr('class','legend-circ ' + unique_phylums[i]).style('background-color',namespace.colors[unique_phylums[i]]);
		div.append('span').attr('class','legend-label').text(unique_phylums[i]);
	}	
	

	
	})(data);
*/
	
		
	$.fn.fullpage.reBuild();
	
	
	
	
	
};


$.ajax(
	'js/top100bars.json',
	{
		error: function(a,b,c){
			console.log(c);
		},
		success: function(data) {
			namespace.bars.build(data);
		}
	}
);


/******* BLOCKS **************/
namespace.buildBlocks = function(){
	var $block1 = $('#block1'),
		$block2 = $('#block2'),
		block;
	
	for (var i =1; i <= 100;i++){
		block = $('<span class="block" />');
		$block1.append(block);
		if (i <= 95) {
			block.addClass('filled');
		}
		
		if (i%10 == 1){
			block.css('clear','left');
		}
	}
	
	for (var i =1; i <= 100;i++){
		block = $('<span class="block" />');
		$block2.append(block);
		if (i <= 98) {
			block.addClass('filled');
		}
		
		if (i%10 == 1){
			block.css('clear','left');
		}
	}

};

namespace.buildBlocks();


/***** TREEMAP *******/
			
			var treemap_data = {
				name: 'composition',
				children: [{"phylum":"Mollusca","count":42578},{"phylum":"Arthropoda","count":971918},{"phylum":"Cnidaria","count":9734},{"phylum":"Kinorhyncha","count":157},{"phylum":"Rhombozoa","count":89},{"phylum":"Orthonectida","count":24},{"phylum":"Ctenophora","count":165},{"phylum":"Loricifera","count":22},{"phylum":"Annelida","count":12993},{"phylum":"Hemichordata","count":101},{"phylum":"Echiura","count":178},{"phylum":"Chordata","count":95819},{"phylum":"Xenacoelomorpha","count":390},{"phylum":"Tardigrada","count":1085},{"phylum":"Kamptozoa","count":171},{"phylum":"Echinodermata","count":7213},{"phylum":"Nematoda","count":2720},{"phylum":"Acanthocephala","count":941},{"phylum":"Platyhelminthes","count":8072},{"phylum":"Cycliophora","count":2},{"phylum":"Nematomorpha","count":361},{"phylum":"Onychophora","count":178},{"phylum":"Myxozoa","count":240},{"phylum":"Sipuncula","count":241},{"phylum":"Micrognathozoa","count":1},{"phylum":"Rotifera","count":2257},{"phylum":"Chaetognatha","count":133},{"phylum":"Gnathostomulida","count":97},{"phylum":"Cephalorhyncha","count":19},{"phylum":"Placozoa","count":1},{"phylum":"Gastrotricha","count":854},{"phylum":"Brachiopoda","count":391},{"phylum":"Bryozoa","count":5836},{"phylum":"Nemertea","count":1213},{"phylum":"Porifera","count":8761},{"phylum":"Phoronida","count":16}]
			};
			
			/*
var treemap_position = function() {
			  this.style("left", function(d) { return d.x + "px"; })
			      .style("top", function(d) { return d.y + "px"; })
			      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
			      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
			}
*/
			
			var treemap_position = function() {
			  this.attr("x", function(d) { return d.x; })
			      .attr("y", function(d) { return d.y; })
			      .attr("width", function(d) { return Math.max(0, d.dx - 1); })
			      .attr("height", function(d) { return Math.max(0, d.dy - 1); });
			}
			
			var treemap_width = $('#treemap-wrapper').width(),
				treemap_height= 210;
			
			var treemap = d3.layout.treemap()
			    .size([treemap_width, treemap_height])
			    .sticky(true)
			    .sort(function(a,b) {
				    return a.count - b.count;
				})
			    .value(function(d) { return d.count; });
			    
			var treemap_div = d3.select('#treemap')
				.append('svg')
				.attr({
					width: treemap_width + 'px',
					height: treemap_height + 'px'
				})
				.style('fill','transparent');
				
			var node = treemap_div.datum(treemap_data).selectAll(".treemap__node")
			      .data(treemap.nodes)
				  .enter().append("rect")
				  .style('fill',function(d){
					  if (d.phylum == 'Arthropoda'){
						  return namespace.colors[d.phylum];
					
						} else {
						  return '#a5a5a5';
					  }

					  })
				 .style('stroke','#efe7d9')
				 .style('stroke-width',0.5)
			      .attr("class", function(d){return 'treemap__node ymg__bgcolor--'+d.phylum })
			      .call(treemap_position)
			      .on('mouseenter',function(d){
				    	tooltip.html(
							d.phylum + '<br />' + numberWithCommas(d.count)
						); 
						tooltip.style("visibility", "visible");  
				   })
				   .on('mouseleave',function(d){
					   tooltip.style("visibility", "hidden");
				   })
				   .on('mousemove',function(d){
					   return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
				   });


	



/*********** MAP **********************/

/*
var countries = [
	{"country":"England","count":22,"id":826}, 
	{"country":"Germany","count":18,"id":276}, 
	{"country":"USA","count":16,"id":840}, 
	{"country":"France","count":12,"id":250}, 
	{"country":"Austria","count":6,"id":40}, 
	{"country":"Sweden","count":6,"id":752}, 
	{"country":"Switzerland","count":4,"id":756}, 
	{"country":"Italy","count":3,"id":380}, 
	{"country":"Russia","count":2,"id":643}, 
	{"country":"Belgium","count":2,"id":56}, 
	{"country":"Hungary","count":1,"id":348}, 
	{"country":"Spain","count":1,"id":724}, 
	{"country":"Canada","count":1,"id":124}, 
	{"country":"South Africa","count":1,"id":710}, 
	{"country":"Australia","count":1,"id":36}, 
	{"country":"Denmark","count":1,"id":208}, 
	{"country":"Norway","count":1,"id":578}, 
	{"country":"Japan","count":1,"id":392}, 
	{"country":"China","count":1,"id":156}
];
*/

var countries = {
	"id826":{"country":"England","count":22,"id":826}, 
	"id276":{"country":"Germany","count":18,"id":276}, 
	"id840":{"country":"USA","count":16,"id":840}, 
	"id250":{"country":"France","count":12,"id":250}, 
	"id40":{"country":"Austria","count":6,"id":40}, 
	"id752":{"country":"Sweden","count":6,"id":752}, 
	"id756":{"country":"Switzerland","count":4,"id":756}, 
	"id380":{"country":"Italy","count":3,"id":380}, 
	"id643":{"country":"Russia","count":2,"id":643}, 
	"id56":{"country":"Belgium","count":2,"id":56}, 
	"id348":{"country":"Hungary","count":1,"id":348}, 
	"id724":{"country":"Spain","count":1,"id":724}, 
	"id124":{"country":"Canada","count":1,"id":124}, 
	"id710":{"country":"South Africa","count":1,"id":710}, 
	"id36":{"country":"Australia","count":1,"id":36}, 
	"id208":{"country":"Denmark","count":1,"id":208}, 
	"id578":{"country":"Norway","count":1,"id":578}, 
	"id392":{"country":"Japan","count":1,"id":392}, 
	"id156":{"country":"China","count":1,"id":156}
};



	var width = function(){
		return parseInt(d3.select('#map').style('width'));
	}
	
	var height = function(width){
		return width * .5;
	}
	
	/*
var scale = function(width){
		return width / 8;
	}
*/
	var scale = function(width){
		return width / 7;
	}

	var translate = function(width) {
		return width * .05;
	};

	// set your height of final map
	var mapWidth = width(),
	    mapHeight = height(width());
	    
	// create the svg in the appropriate holder
	var svgmap = d3.select("#map").append("svg")
	    .attr("width", mapWidth)
	    .attr("height", mapHeight);
	    
	var main_g = svgmap.append("g")
		.attr('transform','translate(-'+ translate(mapWidth)/2 +',0)');
	    
	var projection = d3.geo.equirectangular()
	    .scale(scale(mapWidth))
	    .translate([mapWidth/2,mapHeight/2]);
	    

	var path = d3.geo.path()
   	 	.projection(projection);
   	 	
   	var choropleth = d3.scale.linear().range(['rgb(203, 212, 229)','rgb(58, 76, 108)']).domain([1,22]);
			//.range(['#B9D1FC','#788FB8']).domain([1,22]);
			var returnColor = function(id){
				var count;
				      switch (id) {
					      case 826:
					      	count = 22;
					      	break;
					      case 276:
					      	count = 18;
					      	break;
					      case 840:
					      	count=16;
					      	break;
					      case 250:
					      	count=12;
					      	break;
					      case 40:
					      	count=6;
					      	break;
					      case 752:
					      	count=6;
					      	break;
					      case 756:
					      	count=4;
					      	break;
					      case 380:
					      	count=3;
					      	break;
					      case 643:
					      	count=2;
					      	break;
					      case 56:
					      	count=2;
					      	break;
					      case 348:
					      case 724:
					      case 124:
					      case 710:
					      case 36:
					      case 208:
					      case 578:
					      case 392:
					      case 156:
					      	count=1;
					      	break;
					      default:
					      	count = null;
					      	break;
				      }
				      if (!count) {
					      return;
				      } else {
					      return choropleth(count);
				      }

			};
			
			
	var createMapLegend = function(){
		var legend = d3.select('#maplegend');
		var arr = [1,5,10,15,20,22],
			div;
			
		arr.reverse();
		for (var i =0;i<arr.length;i++){
			div = legend.append('div');
			div.append('span').attr('class','block').style('background-color',choropleth(arr[i]));
			div.append('span').attr('class','word').text(arr[i] + ' authors');
		}
		
	};
	
	createMapLegend();

	
		
	var createBaseMap = function(){
	
		d3.json("js/world-50m.json", function(error, world) {
			
						
			
			 var couns = main_g.append("g")
			      .attr("class", "countries")
				  .selectAll("path")
			      .data(topojson.feature(world, world.objects.countries).features)
				  .enter().append("path")
			      .attr("class", function(d) { return 'country country-' + d.id })
			      .attr("d", path)
			      .style({
				      'fill':function(d){return returnColor(d.id)},
				      'stroke':	function(d){return returnColor(d.id)}		     
				   });
				   
			couns.on('mouseenter',function(d){
				var arr = [826,276,840,250,40,752,756,380,643,56,348,724,124,710,36,208,578,392,156];
				if ($.inArray(d.id,arr) >= 0){
					d3.select(this).style({
						'stroke':'rgb(98, 117, 150)',
						'stroke-opacity':1
						
					});
					tooltip.html(
						countries['id'+d.id].country + '<br />' + countries['id'+d.id].count
					); 
					tooltip.style("visibility", "visible");	
				}
			});
			
			couns.on('mouseleave',function(d){
				d3.select(this).style({
					'stroke': returnColor(d.id),
					'stroke-opacity':.2
					
				});
				tooltip.style("visibility", "hidden");
			});
			
			
		
		couns.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");});
			
			
			
			//couns.on('click',function(d){console.log(d.id);});
				   

			    
			    /*
 main_g.insert("path")
			      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
			      .attr("class", "boundary ")
			      .attr("d", path);
*/
			      

		});
		
				

	
	}; // end createBaseMaps 
	

	createBaseMap();
	
});//jquery