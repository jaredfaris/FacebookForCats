function scratchingPostControl(scratchingPostContainerId){
	var self = this;
	
	this.$postContainer = $('#' + scratchingPostContainerId);
	
	// create a model to store a post in
	var postModel = Backbone.Model.extend({});

	// we'll have a collection of these
	var postsCollection = Backbone.Collection.extend({
		model: postModel,
		
		initialize: function() {
			var self = this;
			
			// if something tells us to remove a model from this collection do so
			this.listenTo(this, "posts:removePost", function(model){
				self.remove(model);
			});
		}
	});
	
	// let's define a child view for each item
	var childView = Backbone.View.extend({
		className: "post span6",
		
		events: {
			"click" : "deleteMe"
		},
		
		deleteMe: function(){
			// trigger a remove event on the collection saying you want this post removed
			this.model.collection.trigger("posts:removePost", this.model);

			// remove this view
			this.remove();
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

	// add a new post to the view (called by an outside control)
	this.AddNewPost = function(newPost) {
		view.collection.add(newPost);
		view.render();
	}

	this.$postContainer.html(view.el); // and actually put it in our document
	view.render();
}