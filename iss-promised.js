const needle = require("needle");

const fetchMyPromisedIP = () => {
    return needle('get', 'https://api.ipify.org?format=json')
        .then(response => {
            const body = response.body;
            return body.ip;
        })
};

/* 
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 * Input: IP address as a string
 * Returns: Promise of request for lat/lon
 */
const fetchPromisedCoordsByIP = (ip) => {
    return needle('get', `https://ipwho.is/${ip}`)
        .then(response => {
            return {
                latitude: response.body.latitude,
                longitude: response.body.longitude
            }
        })
};

const fetchPromisedISSFlyOverTimes = (coords) => {
    return needle('get', `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`)
        .then(response => {
            return response.body.response;
        })
}

const formatPassTimes = (passes) => {
    passes.forEach(pass => {
        // pass.risetime = new Date(0).setUTCSeconds(pass.risetime);
        const datetime = new Date(0);
        datetime.setUTCSeconds(pass.risetime);
        pass.risetime = datetime;
    });

    const formattedPasses = [];
    for (pass of passes) {
        formattedPasses.push(`Next pass at ${pass.risetime} for ${pass.duration} seconds!`);
    }
    return formattedPasses;
}

const nextPromisedISSTimes = () => {
    return fetchMyPromisedIP()
        .then((ip) => fetchPromisedCoordsByIP(ip))
        .then((coordinates) => fetchPromisedISSFlyOverTimes(coordinates))
        .then(flyTimes => {
            return formatPassTimes(flyTimes);
        })
        .catch(error => {
            console.log("Something went wrong :( ", error.message);
        })
}

module.exports = { nextPromisedISSTimes, fetchMyPromisedIP };