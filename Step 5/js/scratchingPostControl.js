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
		render: function() {
		
			html = [];
			for(var i = 0; i < this.collection.length; i++) {
				html.push("<h1>HI</h1>");
			}
		
			this.$el.html(html);
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
		collection.add({
			title: data.title,
			src: data.src
		});
		
		view.render();
	});
}