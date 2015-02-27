/**
* Created with OR01.
* User: drpatpat
* Date: 2015-02-27
* Time: 03:29 AM
* To change this template use Tools | Templates.
*/
suite('"About" Page Tests', function() {
    test('page should contain link to contact page', function(){
       assert($('a[href="/contact"]').length); 
    });
});