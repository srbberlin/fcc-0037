/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      this.timeout(50000);
      
      test('1 stock', function(done) {
         let stck = {stock: 'GOOG'}
         chai.request(server)
          .get('/api/stock-prices')
          .query(stck)
          .end(function(err, res){
            assert.equal(res.status, 200, 'Status must be 200');
            assert.equal(res.header['content-type'], 'application/json; charset=utf-8', 'Wrong type/charset !');
            assert.isObject(res.body, 'Body nust be an object !');

            assert.property(res.body, 'stockData', 'StockData is not defined');
            assert.property(res.body.stockData, 'stock', 'StockData.name is not defined');
            assert.property(res.body.stockData, 'price', 'StockData.price is not defined');
            assert.property(res.body.stockData, 'likes', 'StockData.likes is not defined');
            assert.include([0,1], res.body.stockData.likes, 'StockData.likes_rel is not 1 or 0');
            assert.equal(res.body.stockData.stock, stck.stock);
            done();
          });
      });
      
      test('1 stock with like', function(done) {
         let stck = {stock: 'GOOG', like: true}
         chai.request(server)
          .get('/api/stock-prices')
          .query(stck)
          .end(function(err, res){
            assert.equal(res.status, 200, 'Status must be 200');
            assert.equal(res.header['content-type'], 'application/json; charset=utf-8', 'Wrong type/charset !');
            assert.isObject(res.body, 'Body nust be an object !');

            assert.property(res.body, 'stockData', 'StockData is not defined');
            assert.property(res.body.stockData, 'stock', 'StockData.name is not defined');
            assert.property(res.body.stockData, 'price', 'StockData.price is not defined');
            assert.property(res.body.stockData, 'likes', 'StockData.likes is not defined');
            assert.include([0,1], res.body.stockData.likes, 'StockData.likes_rel is not 1 or 0');
            assert.equal(res.body.stockData.stock, stck.stock);
            done();
          });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        let stck = {stock: 'GOOG', like: true}
         chai.request(server)
          .get('/api/stock-prices')
          .query(stck)
          .end(function(err, res){
            assert.equal(res.status, 200, 'Status must be 200');
            assert.equal(res.header['content-type'], 'application/json; charset=utf-8', 'Wrong type/charset !');
            assert.isObject(res.body, 'Body nust be an object !');

            assert.property(res.body, 'stockData', 'StockData is not defined');
            assert.property(res.body.stockData, 'stock', 'StockData.name is not defined');
            assert.property(res.body.stockData, 'price', 'StockData.price is not defined');
            assert.property(res.body.stockData, 'likes', 'StockData.likes is not defined');
            assert.include([0,1], res.body.stockData.likes, 'StockData.likes_rel is not 1 or 0');
            assert.equal(res.body.stockData.stock, stck.stock, 'Stock symbol sent and received should be the same');
            done();
          });
      });
      
      test('2 stocks', function(done) {
         let stck = {stock: ['GOOG','MSFT']};
         chai.request(server)
          .get('/api/stock-prices')
          .query(stck)
          .end(function(err, res){
            assert.equal(res.status, 200, 'Status must be 200');
            assert.equal(res.header['content-type'], 'application/json; charset=utf-8', 'Wrong type/charset !');
            assert.isObject(res.body, 'Body nust be an object !');
            assert.property(res.body, 'stockData', '"stockData" is not defined !')
            assert.isArray(res.body.stockData, '"stockData" must be an array !')
            assert.equal(res.body.stockData.length, 2, 'We need two objects !')

            assert.isObject(res.body.stockData[0], 'This is not an object !');
            assert.property(res.body.stockData[0], 'stock', 'StockData.name is not defined');
            assert.property(res.body.stockData[0], 'price', 'StockData.price is not defined');
            assert.property(res.body.stockData[0], 'rel_likes', 'StockData.likes_rel is not defined');
            assert.include([0,1], res.body.stockData[0].rel_likes, 'StockData.likes_rel is not 1 or 0');
            assert.equal(res.body.stockData[0].stock, stck.stock[0], 'Stock symbol sent and received should be the same')

            assert.isObject(res.body.stockData[1], 'This is not an object !');
            assert.property(res.body.stockData[1], 'stock', 'StockData.name is not defined');
            assert.property(res.body.stockData[1], 'price', 'StockData.price is not defined');
            assert.property(res.body.stockData[1], 'rel_likes', 'StockData.likes_rel is not defined');
            assert.include([0,1], res.body.stockData[1].rel_likes, 'StockData.likes_rel is not 1 or 0');
            assert.equal(res.body.stockData[1].stock, stck.stock[1], 'Stock symbol sent and received should be the same')

            done();
          });
      });
      
      test('2 stocks with like', function(done) {
         let stck = {stock: ['GOOG','MSFT'], like: true};
         chai.request(server)
          .get('/api/stock-prices')
          .query(stck)
          .end(function(err, res){
            assert.equal(res.status, 200, 'Status must be 200');
            assert.equal(res.header['content-type'], 'application/json; charset=utf-8', 'Wrong type/charset !');
            assert.isObject(res.body, 'Body nust be an object !');
            assert.property(res.body, 'stockData', '"stockData" is not defined !')
            assert.isArray(res.body.stockData, '"stockData" must be an array !')
            assert.equal(res.body.stockData.length, 2, 'We need two objects !')

            assert.isObject(res.body.stockData[0], 'This is not an object !');
            assert.property(res.body.stockData[0], 'stock', 'StockData.name is not defined');
            assert.property(res.body.stockData[0], 'price', 'StockData.price is not defined');
            assert.property(res.body.stockData[0], 'rel_likes', 'StockData.likes_rel is not defined');
            assert.include([0,1], res.body.stockData[0].rel_likes, 'StockData.likes_rel is not 1 or 0');
            assert.equal(res.body.stockData[0].stock, stck.stock[0], 'Stock symbol sent and received should be the same')

            assert.isObject(res.body.stockData[1], 'This is not an object !');
            assert.property(res.body.stockData[1], 'stock', 'StockData.name is not defined');
            assert.property(res.body.stockData[1], 'price', 'StockData.price is not defined');
            assert.property(res.body.stockData[1], 'rel_likes', 'StockData.likes_rel is not defined');
            assert.include([0,1], res.body.stockData[1].rel_likes, 'StockData.likes_rel is not 1 or 0');
            assert.equal(res.body.stockData[1].stock, stck.stock[1], 'Stock symbol sent and received should be the same')

            done();
          });
      });
      
    });

});
