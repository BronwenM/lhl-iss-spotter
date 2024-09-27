/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const needle = require("needle");

const fetchMyIP = function (callback) {
  needle.get('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, body.ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  needle.get(`https://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response ${body}`;
      callback(Error(msg), null);
      return;
    }

    if (!body.success) {
      callback(Error(`${body.message}. IP address set to ${ip}`));
      return;
    }

    callback(null, {
      latitude: body.latitude,
      longitude: body.longitude
    });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coords, callback) => {
  console.log("coordinates inside fetchISS:", coords)
  needle.get(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response ${body}`;
      callback(Error(msg), null);
      return;
    }

    callback(null, body.response);
  })
}


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((err, ip) => {
    if (err) {
      return callback(error, null)
    }
  
    fetchCoordsByIP(ip, (error, coords) => {
      if(error){
        return callback(error, null)
      }

      fetchISSFlyOverTimes(coords, (error, passes) => {
        if(error){
          return callback(error, null)
        }

        passes.forEach(pass => {
          // pass.risetime = new Date(0).setUTCSeconds(pass.risetime);
          const datetime = new Date(0);
          datetime.setUTCSeconds(pass.risetime);
          pass.risetime = datetime;
        });

        const formattedPasses = [];
        for(pass of passes){
          formattedPasses.push(`Next pass at ${pass.risetime} for ${pass.duration} seconds!`);
        }

        callback(null, formattedPasses)
      })      
    })
  })
}


module.exports = { nextISSTimesForMyLocation };
