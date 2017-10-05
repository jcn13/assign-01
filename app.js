const http = require("http")
const fs = require('fs')
const path = require('path')

fs.readdir('./posts', function(err, files){
  if(err){throw err}
  let fn = './build/index.html'     
  fs.readFile('./templates/index_h.html', "UTF-8", function(err, indexH){
    let html = indexH
    html += "<ul>\n"
    files.forEach(function(fileName){
      let name = fileName.toString().split(".txt")
      let n = name[0].toString().split("_") 
      html += "<li><a href=\"/"+ name[0] + '.html' +"\">"+ capFirstLetter(n[0]) +" "+ capFirstLetter(n[1]) +"</a></li>\n"
    })
    fs.readFile('./templates/index_f.html', "UTF-8", function(err, indexF){
      html += "</ul>\n"
      html += indexF        
      fs.writeFile(fn, html.trim(), function(err){
        console.log("File created")
      })
    })
  })
})

function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
fs.readdir('./posts', function(err, files){
  if(err){throw err}
  files.forEach(function(fileName){
    let file = path.join(__dirname, 'posts', fileName)
    fs.readFile(file, "UTF-8", function(err, content){
      let name = fileName.toString().split(".txt")
      let fn = './build/'+ name[0] + '.html'
      fs.readFile('./templates/post_h.html', "UTF-8", function(err, postH){
        let html = postH + content
        fs.readFile('./templates/post_f.html', "UTF-8", function(err, postF){
          html += postF
          fs.stat(fn, function(err, stat) {
            if(err == null) {
                console.log('File exists')
            } else {
              fs.writeFile(fn, html.trim(), function(err){
                console.log("File created")
              })
            } 
          })               
        }) 
      })
    })
  })
})

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