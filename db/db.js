const MongoClient = require('mongodb');
const axios       = require('axios');
const series      = require('async/series');

module.exports = function (route) {
  MongoClient.connect(
    process.env.URL,
    { 
      useUnifiedTopology: true, 
      useNewUrlParser: true 
    },
    function (dbError, d) {
      if (!dbError) {
        let coll = d.db(process.env.DB).collection(process.env.COLL);
        console.log("Database connection established !");
        route.get(function (req, res) {
          let address = req.connection.remoteAddress;
          let symbols = req.query.stock;
          let like = req.query.like === 'true';
          let tasks;
          
          if (typeof symbols === 'string') // ??????
            symbols = symbols.split(',');

          tasks = symbols.map(symbol => {
            return function(callback) {
                setTimeout(function() {
                  axios.get("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + process.env.SECRET)
                    .then(function (response) {
                      let dataIn = response.data['Global Quote'];
                      let dataOut = like ?                      {
                          $set: { price: dataIn['05. price'] },
                          $addToSet: { likes: address },
                        } : {
                          $set: { price: dataIn['05. price'] }
                        }

                      coll.findOneAndUpdate(
                        { symbol: dataIn['01. symbol']},
                        dataOut,
                        {
                          upsert: true,
                          returnOriginal: false
                        },
                        (error, result) => {
                          if (error) callback(error, null);
                          if (! result.value.likes)
                            result.value.likes = [];
                          callback(null, result.value);
                        }
                      )}
                    )
                    .catch(function (error) {
                      callback(null, error.data);
                    });
                }, 10000);
              }
          });

          series(
            tasks,
            function(err, results) {
              
              if (err) throw err;
              
              let two = results.length === 2;
              let one = results.length === 1;
              let result = {}

              results = results.map((item, i, a) => {
                let ls = 
                  two
                    ? i === 0
                        ? a[1].likes.length - a[0].likes.length
                        : a[0].likes.length - a[1].likes.length
                    : a[i].likes.length;
                return two ?
                {
                  stock: item.symbol,
                  price: item.price,
                  rel_likes : ls
                }:
                {
                  stock: item.symbol,
                  price: item.price,
                  likes : ls
                };
              });
              
              result.stockData = one ? results[0] : results;
              res.send(result)
            }
          );
        })
      } else {
        console.log('Unable to connect db', dbError);
      }
    }
  );  
}