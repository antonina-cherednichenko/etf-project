const contractsService = require("./contracts");


function buyTokens() {
  console.log("heeere")
  return new Promise((resolve, reject) => {
    contractsService.getData()
      .then(contracts => {
        console.log("Contracts = HELLO");
        resolve(contracts);
      })
  })



}

buyTokens().then(res => {
   //console.log("contracts = ", res)
})
