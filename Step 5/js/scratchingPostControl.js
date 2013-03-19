function scratchingPostControl(scratchingPostContainerId){
	var self = this;
	
	this.$postContainer = $('#' + scratchingPostContainerId);
	
	// create a model to store a post in
	var postModel = Backbone.Model.extend({});

	// we'll have a collection of these
	var postsCollection = Backbone.Collection.extend({
		model: postModel
	});
	
	// define a really basic view to represent the scratching post
	var postsView = Backbone.View.extend({
		className: "posts-container span6",
	
		render: function() {
		
			html = [];
			for(var i = 0; i < this.collection.length; i++) {
				item = this.collection.models[i];
				html.push("<div class=\"post span6\">");
				html.push("<header>" + item.get('title')  + "</header>");
				html.push("<section><img src=\"" + item.get('src') + "\"></section></div>");
			}
		
			this.$el.html(html.join(''));
		}
	});
	
	// lets initialize a view
	var collection = new postsCollection([]);
	var view = new postsView({
		collection: collection
	});
	this.$postContainer.html(view.el); // and actually put it in our document
	view.render();

	// setup a channel to listen to
	this.newPostChannel = postal.channel("posts", "newPost");
	this.newPostChannel.subscribe(function(data){
		// add something to the collection
		collection.add({
			title: data.title,
			src: data.src
		});
		
		// and then tell the view to re-render
		view.render();
	});
}