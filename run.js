var request = require('request-promise');
var opn = require('opn');
const window = require('window');

function runTradeApi() {
  var postData = {};

  var options = {
      method: 'post',
      body: postData,
      json: true,
      url: 'https://ems.qa.tradingticket.com/api/v1/preference/getStocksOrEtfsBrokerList'
  };

  postData.apiKey = 'tradeit-test-api-key';

  request(options)
    .then(res => {
       var options = {
            method: 'post',
            body: {"apiKey": "tradeit-test-api-key","broker":"Dummy"},
            json: true,
            url: 'https://ems.qa.tradingticket.com/api/v1/user/getOAuthLoginPopupUrlForWebApp'
        };
      return request(options);
  })
    .then(result => {
      if(result.status == 'ERROR'){
            console.error('Error getting oAuthURL'); //TODO: error handling
        }
        else if(result.status == 'SUCCESS'){
            var oAuthURL = result.oAuthURL;
            //window.document.open(oAuthURL, "oAuth Login", "height=435,width=962");
            opn(oAuthURL).then(res => {
              console.log("Result of opening = ", res)
            });
        }
      //console.log("RES2 = ", res);
    })
}

runTradeApi();
