const http = require("http")
const fs = require('fs')
const path = require('path')

let templates = {
  name: "",
  content: ""
}

let posts = {
  name: "",
  content: ""
}

function getContent(type, folder){

  fs.readdir('./'+ folder, function(err, folderFiles){
    if(err){throw err}
    folderFiles.forEach(function(fileName){
      let file = path.join(__dirname, folder, fileName)    
      fs.readFile(file, "UTF-8", function(err, contents){
        type.name = (fileName)
        type.content = (contents)
        console.log(type)
      })
    })
  })
}

getContent(templates, 'templates')
getContent(posts, 'posts')



http.createServer(function(req,res) {
  console.log(`${req.method} request for ${req.url}`)
  if(req.url === '/'){
    fs.readFile("./build/index.html", "UTF-8", function(err, html){
      res.writeHead(200, {"Content-Type": "text/html" })
      res.end(html)
    })
  } else if (req.url.match(/.css$/)){
    let cssPath = path.join(__dirname, "build", req.url)
    let fileStream = fs.createReadStream(cssPath, "UTF-8")
    res.writeHead(200, {"Content-Type": "text/css"})
    fileStream.pipe(res)
  } else if (req.url.match(/.jpg$/)){
    let imgPath = path.join(__dirname, "build", req.url)
    let imgStream = fs.createReadStream(imgPath)
    res.writeHead(200, {"Content-Type": "image/jpeg"})
    imgStream.pipe(res)
  } else if (req.url.match(/.html$/)){
    let htmlPath = path.join(__dirname, "build", req.url)
    let htmlStream = fs.createReadStream(htmlPath)
    res.writeHead(200, {"Content-Type": "text/html"})
    htmlStream.pipe(res)
  } else {
    res.writeHead(404, {"Content-Type": "text/plain"})
    res.end("404 File not found")
  }
}).listen(3000)

console.log("File server running on port 3000")