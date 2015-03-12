/**
* Created with OR01.
* User: drpatpat
* Date: 2015-02-26
* Time: 11:21 AM
* To change this template use Tools | Templates.
*/
var express = require('express');
var fortune = require('./lib/fortune.js');
var credentials = require('./credentials.js');

var app = express();

app.set('port', process.env.PORT||3000);

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections={};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

app.use(function(req, res, next){
    // if there's a flash message, transfer it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});


function getWeatherData(){
    return {
        locations: [
            {
                name:'Portland',
                forecastUrl:'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl:'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather:'Overcast',
                temp:'51.4 F (12.3 C)',
            },
            {
                name:'Bend',
                forecastUrl:'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl:'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather:'Partly Cloudy',
                temp:'55.0 F (12.8 C)',
            },
            {
                name:'Manzanita',
                forecastUrl:'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl:'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather:'Light Rain',
                temp:'55.0 F (12.8 C)',
            },
        ],
    };
}

app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});

app.get('/', function(req, res) {
    res.render('home');
});

var fortunes = [
    "The only way to do great work is to love what you do.",
    "If you know you are going to fail, then fail gloriously.",
    "You may have to fight a battle more than once to win it.",
    "If you love life, don't waste time, for time is what life is made up of.",
    "Happiness is not something readymade. It comes from your own actions.",
    "Try not to become a person of success, but rather try to become a person of value.",
    "You become what you believe.",
    "It's never to late - never to late to change your life, never to late to be happy.",
    "Life is what happens to you while you’re busy making other plans.",
    "Find out who you are and be that person. That's what your soul was put on this Earth to be. Find that truth, live that truth and everything else will come.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "Nothing is impossible, the word itself says, 'I’m possible!'",
    "The most difficult thing is the decision to act, the rest is merely tenacity.",
    "Life is very interesting...in the end, some of your greatest pains, become your greatest strengths.",
    "The minute that you’re not learning I believe you’re dead.",
    "We all keep dreaming, and luckily, dreams really do come true.",
    "I believe there’s an inner power that makes winners or losers. And the winners are the ones who really listen to the truth of their hearts.",
    "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'!",
    "There are no regrets in life. Just lessons.",
    "If you accept the expectations of others, especially negative ones, then you never will change the outcome.",
    "Focusing your life solely on making a buck shows a certain poverty of ambition. It asks too little of yourself. Because it’s only when you hitch your wagon to something larger than yourself that you realize your true potential.",
    "When you have a dream, you've got to grab it and never let go.",
    "Learning how to be still, to really be still and let life happen - that stillness becomes a radiance.",
    "It always seems impossible until it is done.",
    "Winning isn’t everything, but wanting to win is.",
];

app.get('/about', function(req, res) {
    res.render('about',{
        fortune:fortune.getFortune(),
        pageTestScript:'/qa/tests-about.js'
    });
});

app.get('/tours/request-group-rate', function(req,res){
    res.render('tours/request-group-rate');
});

app.get('/jquery-test', function(req,res){
    res.render('jquery-test');
});

app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function(req, res){
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});

app.get('/thank-you', function(req, res){
    res.render('thank-you');
});

app.get('/newsletter', function(req, res){
    res.render('newsletter');
});

// for now, we're mocking NewsletterSignup:
function NewsletterSignup(){
    
}
NewsletterSignup.prototype.save = function(cb){
    cb();
}

// mocking product database
function Product(){
}
Product.find = function(conditions, fields, options, cb){
	if(typeof conditions==='function') {
		cb = conditions;
		conditions = {};
		fields = null;
		options = {};
	} else if(typeof fields==='function') {
		cb = fields;
		fields = null;
		options = {};
	} else if(typeof options==='function') {
		cb = options;
		options = {};
	}
	var products = [
		{
			name: 'Hood River Tour',
			slug: 'hood-river',
			category: 'tour',
			maximumGuests: 15,
			sku: 723,
		},
		{
			name: 'Oregon Coast Tour',
			slug: 'oregon-coast',
			category: 'tour',
			maximumGuests: 10,
			sku: 446,
		},
		{
			name: 'Rock Climbing in Bend',
			slug: 'rock-climbing/bend',
			category: 'adventure',
			requiresWaiver: true,
			maximumGuests: 4,
			sku: 944,
		}
	];
	cb(null, products.filter(function(p) {
		if(conditions.category && p.category!==conditions.category) return false;
		if(conditions.slug && p.slug!==conditions.slug) return false;
		if(isFinite(conditions.sku) && p.sku!==Number(conditions.sku)) return false;
		return true;
	}));
};
Product.findOne = function(conditions, fields, options, cb){
	if(typeof conditions==='function') {
		cb = conditions;
		conditions = {};
		fields = null;
		options = {};
	} else if(typeof fields==='function') {
		cb = fields;
		fields = null;
		options = {};
	} else if(typeof options==='function') {
		cb = options;
		options = {};
	}
	Product.find(conditions, fields, options, function(err, products){
		cb(err, products && products.length ? products[0] : null);
	});
};

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

app.post('/newsletter', function(req, res){
    var name = req.body.name || '', email = req.body.email || '';
    
    // input validation
    if(!email.match(VALID_EMAIL_REGEX)) {
		if(req.xhr) return res.json({ error: 'Invalid email address.' });
		req.session.flash = {
			type: 'danger',
			intro: 'Validation error!',
			message: 'The email address you entered was  not valid.',
		};
		return res.redirect(303, '/newsletter/archive');
	}
    
    new NewsletterSignup({ name: name, email: email }).save(function(err){
		if(err) {
			if(req.xhr) return res.json({ error: 'Database error.' });
			req.session.flash = {
				type: 'danger',
				intro: 'Database error!',
				message: 'There was a database error; please try again later.',
			}
			return res.redirect(303, '/newsletter/archive');
		}
		if(req.xhr) return res.json({ success: true });
		req.session.flash = {
			type: 'success',
			intro: 'Thank you!',
			message: 'You have now been signed up for the newsletter.',
		};
		return res.redirect(303, '/newsletter/archive');
	});
});

app.get('/newsletter/archive', function(req, res){
    res.render('newsletter/archive');
});

app.get('/tours/:tour', function(req, res, next){
	Product.findOne({ category: 'tour', slug: req.params.tour }, function(err, tour){
		if(err) return next(err);
		if(!tour) return next();
		res.render('tour', { tour: tour });
	});
});

app.get('/adventures/:subcat/:name', function(req, res, next){
	Product.findOne({ category: 'adventure', slug: req.params.subcat + '/' + req.params.name  }, function(err, adventure){
		if(err) return next(err);
		if(!adventure) return next();
		res.render('adventure', { adventure: adventure });
	});
});

var cartValidation = require('./lib/cartValidation.js');

app.use(cartValidation.checkWaivers);
app.use(cartValidation.checkGuestCounts);

app.post('/cart/add', function(req, res, next){
	var cart = req.session.cart || (req.session.cart = []);
	Product.findOne({ sku: req.body.sku }, function(err, product){
		if(err) return next(err);
		if(!product) return next(new Error('Unknown product SKU: ' + req.body.sku));
		cart.push({
			product: product,
			guests: req.body.guests || 0,
		})
		res.redirect(303, '/cart');
	});
});

app.get('/cart', function(req, res){
	var cart = req.session.cart || (req.session.cart = []);
	res.render('cart', { cart: cart });
});

// 404 catch-all handler (middleware)
app.use(function(req,res,next) {
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err,req,res,next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});

module.exports = app;