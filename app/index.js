const http = require("http");
const fs = require("fs");
const path = require('path');

const port = 8080;
const hostname = "localhost";
const MIMETypes = {
  "default": "application/octet-stream",
  "html": "text/html",
  "css": "text/css",
  "js": "text/javascript",
  "txt": "text/plain",
  "ico": "application/vnd.microsoft.icon",
  "gif": "image/gif",
  "png": "image/png",
  "jpg": "image/jpg",
  "jpeg": "image/jpg",
};
const frontPath = "/front";
const indexPath = "/index.html";

http.createServer((req, res) => {
  // console.log(req.url);

  switch (true) {
    case req.url.includes('/assets/'): {
      if (req.method === 'GET') {
        const localFilePath = frontPath + req.url;
        if(!fs.existsSync(path.join(__dirname, localFilePath))) {
          errorNotFound(res);
          break;
        }
        const fileExtension = localFilePath.split('.').pop();
        const mimeType = fileExtension in MIMETypes ? MIMETypes[fileExtension] : MIMETypes["default"];
        methodGET(res, localFilePath, mimeType)
        break
      }
      errorNotFound(res);
      break;
    }
    case '' === req.url:
    case '/' === req.url: {
      if (req.method === 'GET') {
        methodGET(res, `${frontPath}${indexPath}`, 'text/html')
        break
      }
      errorNotFound(res);
      break;
    }
    default: {
      errorNotFound(res);
      break;
    }
  }

}).listen(port, () => {
  console.log(`Listening on ${port}`)
})

function errorNotFound(res) {
  res.writeHead(404, {"Content-Type": "text/plain"})
  res.write("Error: Not found")
  res.end()
}

function methodGET(res, localFilePath, mimeType) {
  const filePath = path.join(__dirname, localFilePath);
  console.log(filePath, mimeType)
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': mimeType,
    'Content-Length': stat.size
  });
  fs.createReadStream(filePath).pipe(res);
}
