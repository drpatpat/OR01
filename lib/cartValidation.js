/**
* Created with OR01.
* User: drpatpat
* Date: 2015-03-04
* Time: 07:09 AM
* To change this template use Tools | Templates.
*/
module.exports = {
	checkWaivers: function(req, res, next){
		var cart = req.session.cart;
		if(!cart) return next();
		if(cart.some(function(item){ return item.product.requiresWaiver; })){
			if(!cart.warnings) cart.warnings = [];
			cart.warnings.push('One or more of your selected tours requires a waiver.');
		}
		next();
	},

	checkGuestCounts: function(req, res, next){
		var cart = req.session.cart;
		if(!cart) return next();
		if(cart.some(function(item){ return item.guests > item.product.maximumGuests; })){
			if(!cart.errors) cart.errors = [];
			cart.errors.push('One or more of your selected tours cannot accmodate the ' +
				'number of guests you have selected.');
		}
		next();
	}
}