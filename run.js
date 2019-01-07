var request = require('request-promise');
const puppeteer = require('puppeteer');

function getTradeOAuthURL() {
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
var browser;

function getTradeOAuthVerifier(tradeOAuthURL) {
   return new Promise(async(resolve, reject) => {
     //const browser = await puppeteer.launch({headless: true});
     browser = await puppeteer.launch({
       args: ['--disable-features=site-per-process'],
       headless: false
     });
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
         return resolve(data.oAuthVerifier);
       }, false);
     });
   })
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

getTradeOAuthURL()
  .then(tradeOAuthURL => {
    console.log("tradeOauthURL = ", tradeOAuthURL);
    return getTradeOAuthVerifier(tradeOAuthURL);
  })
  .then(tradeOAuthVerifier => console.log("VERIFIER = ", tradeOAuthVerifier));
