"use strict";
const fs = require("fs");
const path = require("path");
const lockfile = require("proper-lockfile");

module.exports = {
  /**
   * Create data store
   * @param {string} path (optional)
   */
  createDS: function(dsPath) {
    let destinationPath = dsPath ? dsPath : path.join(__dirname);
    if (
      destinationPath &&
      (~destinationPath.indexOf(".") || !fs.existsSync(destinationPath))
    ) {
      console.log("Please provide a valid data store path");
      console.log("Example : ");
      console.log("(Mac) /Users/username/Documents");
      console.log("(Windows) C:/Users/Documents");
      process.exit();
    }
    destinationPath += "/datastore.json";
    lockfile.check(destinationPath).then(isLocked => {
      if (isLocked) {
        console.log(destinationPath);
        console.log("Data Store already in use");
        process.exit();
        return;
      } else {
        lockfile.lock(destinationPath).then(() => {});
      }
    });

    let keyMapList = [];
    writeFile(destinationPath, "{}");
    setInterval(() => {
      for (var i in keyMapList) {
        let timeDifference =
          (new Date().getTime() - keyMapList[i].timestamp) / 1000;
        if (timeDifference > keyMapList[i].ttl) {
          readFile(destinationPath).then(data => {
            if (!~Object.keys(data).indexOf(keyMapList[i].key)) {
              keyMapList.splice(i, 1);
            } else {
              delete data[keyMapList[i].key];
              writeFile(destinationPath, JSON.stringify(data)).then(result => {
                keyMapList.splice(i, 1);
              });
            }
          });
        }
      }
    }, 500);
    return {
      /**
       * Add Entry to Data Store
       * @param {string} key
       * @param {object} value
       * @param {string} value (optional)
       */
      store: function(key, value, ttl) {
        return new Promise((resolve, reject) => {
          if (key && key.length > 32) {
            reject("Key allowed only up to maximum of 32 characters");
            return;
          }
          if (!key) {
            reject("Invalid key");
            return;
          }
          if (typeof value != "object") {
            reject("Value should always be type object {}");
            return;
          }
          if (
            value &&
            typeof value == "object" &&
            JSON.stringify(value).length > 16384
          ) {
            reject("Value not allowed more that 16 KB");
            return;
          }
          readFile(destinationPath).then(data => {
            if (data[key]) {
              reject("Key already exists");
            } else {
              data[key] = value;
              if (ttl && ttl > 0) {
                keyMapList.push({
                  key: key,
                  ttl: ttl,
                  timestamp: new Date().getTime()
                });
              }
              if (JSON.stringify(data).length > 1074000000) {
                reject(
                  "Data not saved! Since the data store is exceeding the limit of 1 GB!"
                );
                return;
              }
              writeFile(destinationPath, JSON.stringify(data)).then(result => {
                resolve(result);
              });
            }
          });
        });
      },
      /**
       * Read data from data store by providing key
       * @param {string} key
       */
      read: function(key) {
        return new Promise((resolve, reject) => {
          readFile(destinationPath).then(data => {
            if (!~Object.keys(data).indexOf(key)) {
              resolve("Key does not exists");
            } else {
              resolve(data[key]);
            }
          });
        });
      },
      /**
       * Delete data from data store by providing key
       * @param {string} key
       */
      delete: function(key) {
        return new Promise((resolve, reject) => {
          readFile(destinationPath).then(data => {
            if (!~Object.keys(data).indexOf(key)) {
              resolve("Key does not exists");
            } else {
              delete data[key];
              writeFile(destinationPath, JSON.stringify(data)).then(result => {
                resolve(result);
              });
            }
          });
        });
      }
    };
  }
};

function writeFile(destinationPath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(destinationPath, data, "utf8", function(err) {
      if (err) return reject(err);
      resolve("OK");
    });
  });
}

function readFile(destinationPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(destinationPath, "utf8", function(err, data) {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
}
