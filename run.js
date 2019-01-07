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
  //const browser = await puppeteer.launch({headless: true});
  const browser = await puppeteer.launch({
  args: ['--disable-features=site-per-process'],
  headless: false
}) ;
  const page = await browser.newPage();
  await page.goto(res, { waitUntil: 'networkidle2'});
  const frame = await page.frames().find(f => f.name() === 'LoginForm');
  const loginUser = await frame.$('#loginUser');
  const loginPwd = await frame.$('#loginPwd');
  await loginUser.click();
  await page.keyboard.type('dummy');
  await loginPwd.click();
  await page.keyboard.type('dummy');
  const loginBtn = await frame.$('button');
  await loginBtn.click();


  await page.evaluate(() => {
    window.addEventListener('message', async (e) => {
      var data = JSON.parse(e.data);
      var oAuthVerifier = data.oAuthVerifier;
      console.log("oauth verifier = ", oAuthVerifier);
      browser.close();
      }, false);
    //browser.close();
  });
})
