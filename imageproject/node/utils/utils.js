const fs = require('fs')
  , request = require('request')

const utils = module.exports = {
  download_image: async (url, filename, callback) => {
    request.head(url, function (err, res, body) {
      if (err) console.log(err)
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  }
}