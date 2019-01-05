var request = require('request-promise');
var opn = require('opn');
const window = require('window');

function getTradeOAuthURL() {
  return new Promise(function(resolve, reject) {
    let options = {
        method: 'post',
        body: {'apiKey': 'tradeit-test-api-key'},
        json: true,
        url: 'https://ems.qa.tradingticket.com/api/v1/preference/getStocksOrEtfsBrokerList'
    };

    request(options)
      .then(res => {
        if (res.status == 'ERROR'){
          reject();
        } else if (res.status == 'SUCCESS'){
          var options = {
              method: 'post',
              body: {'apiKey': 'tradeit-test-api-key',"broker":"Dummy"},
              json: true,
              url: 'https://ems.qa.tradingticket.com/api/v1/user/getOAuthLoginPopupUrlForWebApp'
          };
          return request(options);
        }
    })
     .then(res => {
        if(res.status == 'ERROR'){
              return reject('Error getting oAuthURL');
          }
          else if(res.status == 'SUCCESS'){
              return resolve(res.oAuthURL);
          }
      })
   });
}

var getTradeItTokens = function(oAuthVerifier) {
  let options = {
      method: 'post',
      body: {'apiKey': 'tradeit-test-api-key', 'oAuthVerifier': oAuthVerifier},
      json: true,
      url: 'https://ems.qa.tradingticket.com/api/v1/user/getOAuthAccessToken'
    };
    request(options);
    
};

getTradeOAuthURL().then(res => {
  console.log("res = ", res)
})
