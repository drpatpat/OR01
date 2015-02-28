/**
* Created with OR01.
* User: drpatpat
* Date: 2015-02-28
* Time: 02:14 AM
* To change this template use Tools | Templates.
*/
var Browser = require('zombie');
var assert = require('chai').assert;

var browser;

suite('Cross-Page Tests', function(){
    
    setup(function(){
        browser = new Browser();
    });
    
    test('requesting a group rate quote from the hood river tour page should populate the referrer field', 
            function(done){
                var referrer = 'https://plastic-toronto.codio.io:9500/tours/hood-river';
                browser.visit(referrer, function(){
                    browser.clickLink("Request Group Rate", function(){
                        assert(browser.field('referrer').value===referrer);
                        done();
                    });
                });
    });
    
    test('requesting a group rate quote from the oregon coast tour page should populate the referrer field', 
            function(done){
                var referrer = 'https://plastic-toronto.codio.io:9500/tours/oregon-coast';
                browser.visit(referrer, function(){
                    browser.clickLink('.requestGroupRate', function(){
                        assert(browser.field('referrer').value===referrer);
                        done();
                    });
                });
    });
    
    test('visiting the "request group rate" page directly should result in an empty referrer field', 
            function(done){
                var referrer = 'https://plastic-toronto.codio.io:9500/tours/request-group-rate';
                browser.visit(referrer, function(){
                    
                        assert(browser.field('referrer').value==='');
                        done();
                    
                });
    });
    
});