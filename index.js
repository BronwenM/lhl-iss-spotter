const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');
let IP = 0;
let coordinates;

/* fetchMyIP((err, ip) => {
  if (err) {
    console.log("It didn't work!", err);
    return;
  }

  IP = ip;
  console.log("It worked!", ip);
});

fetchCoordsByIP(IP, (error, data) => {
  console.log(error, data);
  coordinates = data; 
  console.log("coordinates are:", coordinates);
})
 */
const exampleCoords = { latitude: '49.27670', longitude: '-123.13000' };

fetchISSFlyOverTimes(exampleCoords, (error, data) => {
  console.log(error, data)
})