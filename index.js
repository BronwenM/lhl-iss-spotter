const { fetchMyIP, fetchCoordsByIP } = require('./iss');
let IP = 0;

fetchMyIP((err, ip) => {
  if (err) {
    console.log("It didn't work!", err);
    return;
  }

  IP = ip;
  console.log("It worked!", ip);
});

/* fetchCoordsByIP(IP, (error, data) => {
  console.log(error, data);
}) */