define(function (require){

	var $ = require('jquery');

	function modalPopup (title, innerHTML, buttonLabels, callback, data, type){
		//console.log('New modal popup: ' + title + ' ' + innerHTML + ' ' + buttonLabels + ' ' + callback + ' ' + data + ' ' + type);

		//Create the popup and overlay elements
		$('<div></div>').addClass('modalOverlay').appendTo('body');
		$('<div></div>').addClass('modalWindow').appendTo('body');

		//Fill the modalWindowElement
		$('.modalWindow').append('<div class="modalWindowHeader">'+title+'</div>');
		$('.modalWindow').append('<div class="modalWindowContent">'+innerHTML+'</div>');

		if(buttonLabels.length == 1)
			$('.modalWindow').append(	'<div class="modalWindowFooter">' + 
											'<button class="okButton">'+buttonLabels[0]+'</button>'+
										'</div>');

		else if(buttonLabels.length == 2)
			$('.modalWindow').append(	'<div class="modalWindowFooter">' + 
											'<button class="cancelButton">'+buttonLabels[0]+'</button>' +
											'<button class="okButton">'+buttonLabels[1]+'</button>'+
										'</div>');

		//Button events listeners
		if(type != 'info')
			$('.cancelButton').on('click', this.hide);

		if(type == 'delete-cl')
			$('.okButton').on('click', {id: data.id}, callback);
		else if(type == 'new-cl')
			$('.okButton').on('click', {callback: callback}, this.retrieveInput);
		else if(type == 'delete-cat')
			$('.okButton').on('click', {id: data.id}, callback);
		else if(type == 'delete-item')
			$('.okButton').on('click', {id: data.id}, callback);
		else if(type == 'info')
			$('.okButton').on('click', this.hide);
		else
			$('.okButton').on('click', callback);

		//Style the modalWindowElement
		//$('.modalWindow').css('width', (window.innerWidth) / 2 + 'px');
		$('.modalWindow').css('left', (window.innerWidth - 200) / 2 + 'px');
		$('.modalWindow').css('top', (window.innerHeight - 300) / 2 + 'px');

		$('.modalWindow').css('max-height', parseInt((window.innerHeight + 200) / 2) + 'px'); 

		
		//Save a reference to the overlay and the modal elements
		this.overlayElement = $('.modalOverlay');
		this.modalWindowElement = $('.modalWindow');

		//Resize event handler
		window.addEventListener('resize', this.resize, false);

		return this;
	}

	modalPopup.prototype.show = function (){

		var self = this;

		setTimeout(function() {
			$('.modalWindow').css('opacity', 1);
			$('.modalOverlay').css('opacity', 0.4);

			$('.modalOverlay').on('click', self.hide);
		  }, 300);
	};

	modalPopup.prototype.hide = function () {

		$('.modalWindow').css('opacity', 0);
		$('.modalOverlay').css('opacity', 0);

  		$('.modalOverlay').off('click');
  		$('.cancelButton').off('click');
		$('.okButton').off('click');

		setTimeout(function() {
			$('.modalOverlay').remove();
			$('.modalWindow').remove();
		}, 400);
	};

	modalPopup.prototype.resize = function () {
		$('.modalWindow').css('left', parseInt((window.innerWidth - 200) / 2) + 'px');
		$('.modalWindow').css('top', parseInt((window.innerHeight - 300) / 2) + 'px');

		$('.modalWindow').css('max-height', parseInt((window.innerHeight + 200) / 2) + 'px'); 
	};

	modalPopup.prototype.retrieveInput = function (e) {
		/*console.log(e.data.callback);

		console.log($('#name-cl').val());
		console.log($('#model-cl').val());*/

		var testArray = [];
		var uniqueName = true;

		var clName = $('.cl-name');

		for(var i=0; i<clName.length; i++)
			testArray.push(clName[i].innerText);

		testArray.some(function (element) {
			if($('#name-cl').val() == element){
				$('.hint').css('visibility', 'visible');
				uniqueName = false;
				return true;
			}
		});

		if(uniqueName)
			e.data.callback ($('#name-cl').val(), $('#model-cl').val());
	};

	return modalPopup;
});