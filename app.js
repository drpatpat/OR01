/**
* Created with OR01.
* User: drpatpat
* Date: 2015-02-26
* Time: 11:21 AM
* To change this template use Tools | Templates.
*/
var express = require('express');

var app = express();

// set up handlebars view engine
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

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
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about',{fortune:randomFortune});
});

// 404 catch-all handler (middleware)
app.use(function(req,res) {
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