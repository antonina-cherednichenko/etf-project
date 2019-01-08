var request = require('request-promise');
const puppeteer = require('puppeteer');


function getBrokerList() {
  let options = {
      method: 'post',
      body: {'apiKey': 'tradeit-test-api-key'},
      json: true,
      url: 'https://ems.qa.tradingticket.com/api/v1/preference/getStocksOrEtfsBrokerList'
  };

  return request(options)
}

function getTradeOAuthURL(brokerName) {
  return new Promise((resolve, reject) => {
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
              body: {'apiKey': 'tradeit-test-api-key','broker': brokerName},
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

function getTradeOAuthVerifier(tradeOAuthURL) {
   return new Promise(async(resolve, reject) => {
     const browser = await puppeteer.launch({headless: true});
     // const browser = await puppeteer.launch({
     //   args: ['--disable-features=site-per-process'],
     //   headless: false
     // });
     const page = await browser.newPage();
     await page.goto(tradeOAuthURL, { waitUntil: 'networkidle2'});

     //Fill form fields and submit
     const frame = await page.frames().find(f => f.name() === 'LoginForm');
     const loginUser = await frame.$('#loginUser');
     const loginPwd = await frame.$('#loginPwd');
     await loginUser.click({ clickCount: 3 });
     await page.keyboard.type('dummy');
     await loginPwd.click({ clickCount: 3 });
     await page.keyboard.type('dummy');
     const loginBtn = await frame.$('button');
     await loginBtn.click();

     await page.exposeFunction('resolve', resolve);

     await page.evaluate(() => {
       window.addEventListener('message', (e) => {
         let data = JSON.parse(e.data);
         //TODO add browser.close here
         return resolve(data.oAuthVerifier);
       }, false);
     });

     //browser.close();
   })
}


function getTradeItTokens(oAuthVerifier){
  let options = {
      method: 'post',
      body: {'apiKey': 'tradeit-test-api-key', 'oAuthVerifier': oAuthVerifier},
      json: true,
      url: 'https://ems.qa.tradingticket.com/api/v1/user/getOAuthAccessToken'
    };
    return request(options);
};

function authenticate(userToken, userId){
  let options = {
      method: 'post',
      body: {'apiKey': 'tradeit-test-api-key', 'userId': userId, 'userToken': userToken},
      json: true,
      url: 'https://ems.qa.tradingticket.com/api/v1/user/authenticate?srv='
    };
    return request(options);
}

function getPreviewOrder(sessionToken, accountNumber, orderInfo) {
  var postData = {}
  postData.token = sessionToken;
  postData.accountNumber = accountNumber;

  postData.orderSymbol = orderInfo.symbol;
  postData.orderQuantity = orderInfo.quantity;
  postData.orderAction = orderInfo.action;
  postData.orderPriceType = orderInfo.priceType;
  postData.orderExpiration = orderInfo.expiration;
  let options = {
      method: 'post',
      body: postData,
      json: true,
      url: 'https://ems.qa.tradingticket.com/api/v1/order/previewStockOrEtfOrder'
    };
    return request(options);
}

function placeOrder(sessionToken, orderId) {
  let options = {
      method: 'post',
      body: {'token': sessionToken, 'orderId': orderId},
      json: true,
      url: 'https://ems.qa.tradingticket.com/api/v1/order/placeStockOrEtfOrder'
    };
    return request(options);
}

function runTradeWorkflow() {
  getBrokerList()
    .then(res => {
      console.log("Broker list = ", res);
      let brokerName = res.brokerList[0].shortName;
      return getTradeOAuthURL(brokerName);
    })
    .then(tradeOAuthURL => {
      console.log("tradeOauthURL = ", tradeOAuthURL);
      return getTradeOAuthVerifier(tradeOAuthURL);
    })
    .then(tradeOAuthVerifier => {
      console.log("VERIFIER = ", tradeOAuthVerifier);
      return getTradeItTokens(tradeOAuthVerifier);
    })
    .then(userInfo => {
      console.log("user information = ", userInfo);
      return authenticate(userInfo.userToken, userInfo.userId);
    })
    .then(authRes => {
      console.log("auth res = ", authRes)
      let orderInfo = {symbol: 'GE', quantity:'10', action: 'sell', expiration: 'day', priceType: 'market'};
      sessionToken = authRes.token;
      let account = authRes.accounts[0];
      return getPreviewOrder(authRes.token, account.accountNumber, orderInfo);
    })
    .then(orderPreview => {
      console.log("order preview = ", orderPreview);
      return placeOrder(sessionToken, orderPreview.orderId);
    })
    .then(orderRes => {
      console.log("orderRes = ", orderRes);
      //TODO remove this line when you add browser.close
      process.exit();
    });
}

runTradeWorkflow();
