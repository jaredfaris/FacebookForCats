function newPostControl(formContainerId){
	var self = this;

	this.$formContainer = $('#' + formContainerId);

	// setup a view model that contains the images to display and the text
	this.viewModel = {
		images: ko.observableArray([
			{text: "Out of food", src: "./img/emptybowl.jpg"},
			{text: "Ack", src: "./img/hairball.gif"},
			{text: "Human toy object", src: "./img/hairtie.jpg"},
			{text: "Center of attention", src: "./img/laptop.jpg"},
			{text: "Lame inanimate toy", src: "./img/mouse.jpg"},
		]),
		title: ko.observable(""),
		selectedImage: ko.observable(null)
	}
	
	// put some events on our images for when they are clicked
	for(im in this.viewModel.images()){
		var viewModel = this.viewModel;
		var image = this.viewModel.images()[im];
		
		// sets the collection's 'selectedImage' property to this image when clicked
		image.selectImage = function() {
			viewModel.selectedImage(this);
		}
		
		// returns if this is the selected item
		image.selected = function() {
			return viewModel.selectedImage() == this;
		}
		
		// returns a CSS class based on the selected state
		image.selectedClass = function() {
			if (this.selected())
				return "selected";
			else
				return "";
		}
	}
	
	// return which image should be displayed
	this.viewModel.imageSrcToDisplay = function() {
		if (this.selectedImage()) 
			return this.selectedImage().src;
		else // or return a default image
			return "./img/question.gif";
	}
	
	// return the title that should be displayed
	this.viewModel.titleToDisplay = function() {
		if (this.title() && this.title().length > 0 ){
			return this.title();
		} else {
			return "Mrow?";
		}
	}
	
	// setup the form post
	this.viewModel.postUpdate = function() {
		// capture the selected values
		var imageSrc = this.imageSrcToDisplay();
		var title = this.titleToDisplay();
		
		// tell the scratching post there is a new message
		window.scratchingPostControl.AddNewPost({
			src: imageSrc,
			title: title
		});
		
		// reset the form
		this.title("");
		this.selectedImage(null);
		
		// hide the form
		self.$formContainer.hide();
	}
	

	ko.applyBindings(this.viewModel, this.$formContainer[0]);	
	
	return this;
}