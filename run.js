var request = require('request-promise');
const puppeteer = require('puppeteer');

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

getTradeOAuthURL().then(async (res) => {
  console.log("res = ", res)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(res, {waitUntil: 'networkidle2'});
  console.log("RES1")
  //await page.waitFor('input[id="loginUser.credFields"]');
  console.log("RES2")
  await page.$('#loginUser', el => el.value = 'dummy');
  console.log("RES3")
  await page.$('#loginPwd', el => el.value = 'dummy');
  console.log("RES4")
  const loginForm = await page.$('#LoginForm');
  const res5 = await loginForm.$(loginForm => loginForm.submit());

  await page.evaluate(() => {
        window.addEventListener('offline', () => {
            console.log('offline-flag');
        }, false);
    });


  page.on('onmessage', () => {
     console.log("HEEERE")
  })
  //await page.waitForNavigation();
  //await page.click('Sign In');
  //await page.click('button[type="submit"]');
  console.log("RES5 = ", res5)
  const text = await page.evaluate(() => {
        ///const anchor = document.querySelector('#mw-content-text');
        //return anchor.textContent;
  });
  console.log("text = ", text);

})
