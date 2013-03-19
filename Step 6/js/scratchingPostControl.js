function scratchingPostControl(scratchingPostContainerId){
	var self = this;
	
	this.$postContainer = $('#' + scratchingPostContainerId);
	
	// create a model to store a post in
	var postModel = Backbone.Model.extend({});

	// we'll have a collection of these
	var postsCollection = Backbone.Collection.extend({
		model: postModel
	});
	
	// let's define a child view for each item
	var childView = Backbone.View.extend({
		className: "post span6",
		
		events: {
			"click" : "deleteMe"
		},
		
		deleteMe: function(){
			this.remove(); // removes this rendered view
		},
		
		render: function() {
			this.$el.html("<header>" + this.model.get('title')  + "</header><section><img src=\"" + this.model.get('src') + "\"></section>");
		}
	});
	
	// define a really basic view to represent the scratching post
	var postsView = Backbone.View.extend({
		className: "posts-container span6",
		childViews: [], // a place to stash references to our children
	
		render: function() {
		
			// purge any existing views to prevent zombies
			for(var i = 0; i < this.childViews.length; i++) {
				childViews[i].remove();
			}

			this.$el.html('');
			
			for(var i = 0; i < this.collection.length; i++) {
				item = this.collection.models[i];
				
				var child = new childView({model: item});
				child.render()
				
				this.$el.append(child.el);
				
			}
		}
	});
	
	// let's initialize a view
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