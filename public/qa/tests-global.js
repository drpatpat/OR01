/**
* Created with OR01.
* User: drpatpat
* Date: 2015-02-27
* Time: 03:29 AM
* To change this template use Tools | Templates.
*/
suite('Global Tests', function() {
    test('page has a valid title', function(){
       assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO'); 
    });
});