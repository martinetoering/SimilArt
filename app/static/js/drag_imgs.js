function appendDraggableImage(url, position, i_list, artwork_name, artist_full_name,
		similarity, creation_year, general_type, artwork_type, dominant_color, plot_id, transition=true) {
	// Check if still allowed to plot, or if other plot_dissimilar_images() has been called
	if (plot_id != exploration_plotter_id) return
	var img = new Image();
	img.onload = function () {
		appendImageHelper(url, position, i_list, img, artwork_name, artist_full_name,
			similarity, creation_year, general_type, artwork_type, dominant_color, transition);
	}
	img.src = url;
	img.i_list = i_list;
}

function appendImageHelper(url, position, i_list, img, artwork_name, artist_full_name,
		similarity, creation_year, general_type, artwork_type, dominant_color, transition=true) {
	if (!transition) {
		d3.select("#imrect"+i_list.toString())
			.on("mouseover", function(d){
				timer_tooltip = setTimeout(function () {

				// If artist name consists of too many parts (> 5), probably string is full of spaces -> remove spaces
				length_artist_name = artist_full_name.split(' ').length;
				if (length_artist_name > 5)
					artist_full_name = artist_full_name.replace(/\s/g,'');

				tooltip.html(artwork_name.replace(/^\w/, c => c.toUpperCase()).replace(/\.$/, "").replace(/_/g, ' ') + ". <b>" +
					artist_full_name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') +
					"</b> (" + creation_year + "). " +
					// "<br><br>" + "<em>General Type:</em> &nbsp <br>" + general_type +
					// "<br>" + "<em>Artwork Type:</em> &nbsp <br>" + artwork_type +
					// "<br>" + "<em>Dominant Color:</em> &nbsp <br>" + '<svg width="15" height="15"><rect width="15" height="15" style="fill:' + dominant_color + '; opacity: 1;" /></svg>' + dominant_color + "<br><br>" +
					"<em>Similarity:</em>&nbsp" + similarity + "%");
				return tooltip.style("visibility", "visible");
				}, time_till_tooltip_appearance);
			});
		var rgb = colourGradientor(similarity / 100, stroke_color_images_high_similarity, stroke_color_images_low_similarity);
		var hexColor =  "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
		d3.select("#outline"+i_list.toString())
			.transition()
			.duration(500)
			.style("stroke", hexColor);
	} else {
	img_width = img.width;
	img_height = img.height;
	var ratio = img_width / img_height;
	// If image width > height
	if (ratio > 1) {
		img_width = dissimilar_image_size;
		img_height = dissimilar_image_size / ratio;
	// If image height > width
	} else {
		img_width = dissimilar_image_size * ratio;
		img_height = dissimilar_image_size;
	};

	var imageGroup = svg.append("g")
		.datum({position: position, height: img_height, width: img_width, i_list: i_list})
		.attr('id', 'outside_image')
		.attr("transform", d => "translate(" + d.position + ")");

	var imageElem = imageGroup.append("image")
		.attr("href", url)
		.attr("height", img_height)
		.attr("width", img_width)
		.attr("clip-path", "url(#clip)");

	var rectFill = imageGroup.append("rect")
		.attr("id", "imrect"+i_list.toString())
		.attr("width", img_width)
		.attr("height", img_height)
		.attr("filter", "url(#glow)")
		.on('click', function() {

			const modalImg = document.getElementById("img01");
			const old_src = modalImg.src;
			const old_innerHtml = document.getElementById('popup_information').innerHTML;
			modalImg.src = data[imageElem.attr('href').replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.')]['image_url'];

			if (d3.event.ctrlKey) {

				document.getElementById('popup_information').innerHTML = "<span style='color:darkgrey;'>" + artwork_name + ".<br /><br />" + artist_full_name + " (" + creation_year + ").</span><br><br><br /><span style='color:darkgrey; font-size:0.7em'>" + "<em>General Type:&nbsp" + general_type + "<br>" + "<em>Artwork Type:&nbsp " + artwork_type + "<br>" + "<em>Dominant Color:&nbsp" + '<svg width="15" height="15"><rect width="15" height="15" style="fill:' + dominant_color + '; stroke: silver; stroke-width: 1px;" /></svg>' + "&nbsp(" + dominant_color + ")</em></span>";

				var modal = document.getElementById("myModal");
				modalImg.src = data[imageElem.attr('href').replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.')]['image_url'];
				modalImg.onerror = function() {
					modalImg.src = url;
				}
				modal.style.display = "block";

				// Get the <span> element that closes the modal
				var span = document.getElementsByClassName("close")[0];
				// When the user clicks on <span> (x), close the modal
				span.onclick = function() {
					modal.style.display = "none";
					modalImg.src = old_src;
					document.getElementById('popup_information').innerHTML = old_innerHtml;
				}
				// When the user clicks anywhere outside of the modal, close it
				window.onclick = function(event) {
					if (event.target == modal) {
						modal.style.display = "none";
						modalImg.src = old_src;
						document.getElementById('popup_information').innerHTML = old_innerHtml;
					}
				}
			}
			else{

			handle_stacks();

				// change middle_image variable and call function, both from test.html;
				middle_image = img.src.replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.')
				d3.select('image#center').transition()
					.duration(removal_transition_speed_middle_image)
					.style('opacity', 0)
					.remove();
				d3.select('rect#center').remove();
				d3.select('rect#border').remove();
				set_center(center, middle_image);

				change_similar_images();
				// change_dissimilar_images();
			}
		})
		.on("mouseover", function(d){
			timer_tooltip = setTimeout(function () {

		    // If artist name consists of too many parts (> 5), probably string is full of spaces -> remove spaces
		    length_artist_name = artist_full_name.split(' ').length;
		    if (length_artist_name > 5)
		    	artist_full_name = artist_full_name.replace(/\s/g,'');

        	tooltip.html(artwork_name.replace(/^\w/, c => c.toUpperCase()).replace(/\.$/, "").replace(/_/g, ' ') + ". <b>" +
        		artist_full_name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') +
				"</b> (" + creation_year + "). " +
				// "<br><br>" + "<em>General Type:</em> &nbsp <br>" + general_type +
				// "<br>" + "<em>Artwork Type:</em> &nbsp <br>" + artwork_type +
				// "<br>" + "<em>Dominant Color:</em> &nbsp <br>" + '<svg width="15" height="15"><rect width="15" height="15" style="fill:' + dominant_color + '; opacity: 1;" /></svg>' + dominant_color + "<br><br>" +
				"<em>Similarity:</em>&nbsp" + similarity + "%");
			return tooltip.style("visibility", "visible");
			}, time_till_tooltip_appearance);
		})
		.on("mousemove", function(d){
			var tX = event.pageX
			var tY = event.pageY
			var bBox = svg.node().getBBox();
			var theight = parseFloat(tooltip.style("height"))
			var twidth = parseFloat(tooltip.style("width"))
            tooltip.style("top", function() {
            	if (tY+10+theight > bBox.height) {
            		return bBox.height-theight+"px";
            	} else if (tY-10 < 0) {
            		return tY;
            	} else {
            		return tY-10+"px"
            	}
            })
            tooltip.style("left", function(){
            	if (tX+20+twidth > bBox.width) {
            		return bBox.width-twidth+"px";
            	} else {
            		return tX+20+"px"
            	}
            })
        })
		.on("mouseout", function(d){
			clearTimeout(timer_tooltip);
			return tooltip.style("visibility", "hidden");});

	var rgb = colourGradientor(similarity / 100, stroke_color_images_high_similarity, stroke_color_images_low_similarity);
	var hexColor =  "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
	var rectOutline = imageGroup.append("rect")
		.attr("id", "outline"+i_list.toString())
		.attr("class", "image-outline")
		.attr("width", img_width)
		.attr("height", img_height)
		.style("stroke", hexColor);

	imageGroup.call(
		d3.drag()
		.on("drag", dragged)
	);
	if (transition) {
		imageElem
			.attr("height", img_height * 1.5)
			.attr("width", img_width * 1.5)
			.attr('x', -img_width * 0.25)
			.attr('y', -img_height * 0.25)
			.transition()
			.delay(function(d,i){ return 100*i; })
			.duration(appearance_transition_speed)
			.attr('x', 0)
			.attr('y', 0)
			.attr("height", img_height)
			.attr("width", img_width)
			.ease(d3.easeBounce);
		rectOutline
			.attr("height", img_height * 1.5)
			.attr("width", img_width * 1.5)
			.attr('x', -img_width * 0.25)
			.attr('y', -img_height * 0.25)
			.transition()
			.delay(function(d,i){ return 100*i; })
			.duration(appearance_transition_speed)
			.attr('x', 0)
			.attr('y', 0)
			.attr("height", img_height)
			.attr("width", img_width)
			.ease(d3.easeBounce);
    }
}
}

function dragged(d) {
	d3.select(this).raise();
	var height = d.height;
	var width = d.width;
	var newX = d3.event.x - width * 0.5,
		newY = d3.event.y - height * 0.5;

	xborder = d3.event.x
	if (xborder + width*0.5  > svgwidth ){
		newX = svgwidth - width
	} else if (xborder - width*0.5  < 0){
		newX = 0
	}

	yborder = d3.event.y
	if (yborder + height*0.5  > svgheight) {
		newY = svgheight - height
	} else if (yborder - height*0.5  < 0){
		newY = 0
	}

	// Middle area
	middle_w = +middle.attr("width")
	middle_x = +middle.attr("x")
	middle_y = +middle.attr("y")
	middle_h = +middle.attr("height")

	// Left border
	if ((xborder + width*0.5  > middle_x) && (xborder - width*0.5  < (middle_x-5))) {
		if ((yborder - height*0.5 < (365)) && (yborder + height*0.5 > middle_y)) {
			newX = middle_x - width
		}
	}
	// Right border
	else if ((xborder - width*0.5 < (middle_w+middle_x)) && (xborder + width*0.5  > middle_x+middle_w+5)) {
		if ((yborder - height*0.5 < (middle_y+middle_h)) && (yborder + height*0.5 > middle_y)) {
			newX = middle_x+middle_w
		}
	}
	// Top border
	else if ((yborder + height*0.5  > middle_y) && (yborder - height*0.5 < (svgheight/2))) {
		if ((xborder + width*0.5 > middle.attr("x") && (xborder - width*0.5 < middle_x+middle_w))) {
			newY = middle_y - height
		}
	}
	// Bottom border
	else if ((yborder - height*0.5  < (middle_y+middle_h)) && (yborder + height*0.5 > (svgheight/2)))  {
		if ((xborder + width*0.5 > middle_x) && (xborder - width*0.5 < (middle_x+middle_w))) {
			newY = (middle_y+middle_h)
		}
	}

	d3.select(this)
		.attr("transform", "translate(" + (d.position = [newX, newY]) + ")");

	d3.select("#tooltip")
		.style("visibility", "hidden");

	dissimilar_locs[d.i_list] = [newX, newY];
}
