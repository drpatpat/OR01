/**
* Created with OR01.
* User: drpatpat
* Date: 2015-02-28
* Time: 03:13 AM
* To change this template use Tools | Templates.
*/
var fortune = require('../lib/fortune.js');
var expect = require('chai').expect;

suite('Fotune Cookie Tests', function(){
    
    test('getFortune() should return a fortune', function(){
        expect(typeof fortune.getFortune()==='string');
    });
    
});