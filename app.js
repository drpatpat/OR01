/**
* Created with OR01.
* User: drpatpat
* Date: 2015-02-26
* Time: 11:21 AM
* To change this template use Tools | Templates.
*/
var express = require('express');
var fortune = require('./lib/fortune.js');

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

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

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

app.get('/tours/hood-river', function(req,res){
    res.render('tours/hood-river');
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
    // we will learn about CSRF later ... for now, we just provide a dummy value
    res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', function(req, res){
    console.log(req.xhr);
    console.log(req.accepts('json,html'));
    if(req.xhr || req.accepts('json,html')==='json'){
        res.send({success:true});
    } else {
        res.redirect(303, '/thank-you');
    }
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