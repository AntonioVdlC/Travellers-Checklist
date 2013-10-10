define(function (require){

	var $ = require('jquery');

	function modalPopup (title, innerHTML, buttonLabels, callback, data, type){
		console.log('New modal popup: ' + title + ' ' + innerHTML + ' ' + buttonLabels + ' ' + callback + ' ' + data + ' ' + type);

		//Create the popup and overlay elements
		$('<div></div>').addClass('modalOverlay').appendTo('body');
		$('<div></div>').addClass('modalWindow').appendTo('body');

		//Fill the modalWindowElement
		$('.modalWindow').append('<div class="modalTitle">'+title+'</div>');
		$('.modalWindow').append(innerHTML);
		$('.modalWindow').append(	'<div class="modalFooter">' + 
										'<button class="cancelButton">'+buttonLabels[0]+'</button>' +
										'<button class="okButton">'+buttonLabels[1]+'</button>'+
									'</div>');

		//Button events listeners
		$('.cancelButton').on('click', this.hide);
		
		if(type == 'delete-cl')
			$('.okButton').on('click', {id: data.id}, callback);
		else
			$('.okButton').on('click', callback);

		//Style the modalWindowElement
		$('.modalWindow').css('left', (window.innerWidth - 200) / 2 + 'px');
		
		//Save a reference to the overlay and the modal elements
		this.overlayElement = $('.modalOverlay');
		this.modalWindowElement = $('.modalWindow');

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

	return modalPopup;
});