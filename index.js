const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if(error){
    return console.log("It didn't work!", error);
  }
  console.log(passTimes);
})