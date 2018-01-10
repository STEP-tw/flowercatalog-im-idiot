const http = require('http');
const WebApp = require('./webapp.js');
const getFileData = require('./lib/utils.js').getFileData;
const fs = require('fs');
const timeStamp = require('./lib/time.js').timeStamp;
const parseData = require('./lib/utils.js').parseData;
const getMIMEType = require('./lib/utils.js').getMIMEType;
const getDateAndTimeInArray = require('./lib/utils.js').getDateAndTimeInArray;
const getDateAndTime = require('./lib/utils.js').getDateAndTime;
const registered_users = [
  {
    userName: 'salmans',
    name: 'Salman Shaik'
  },
  {
    userName: 'srijayanths',
    name: 'Sri Jayanth Sridhar'
  },
  {
    userName: 'vivekh',
    name: 'Vivek Haridas'
  }
];
let toS = o=>JSON.stringify(o,null,2);
let jsonData = JSON.parse(fs.readFileSync('./data/comments.json', 'utf-8'));
let PORT = 8000;
let HOST = '127.0.0.1';

const getType = (requestedContent) => {
  return requestedContent.slice(requestedContent.lastIndexOf('.') + 1);
};

const getJsonValuesInTable = (element) => {
  let cols = "";
  cols += `<td class='comments'>${element.date}</td>`;
  cols += `<td class='comments'>${parseData(element.name)}</td>`;
  cols += `<td class='comments'>${parseData(element.comment)}</td>`;
  return cols;
};

const getDataInTable = () => {
  let tableWithData = "<table><tr><th>DATE&TIME</th><th>NAME</th><th>COMMENT</th></tr>";
  if (jsonData.length == 0) return tableWithData;
  jsonData.forEach((element) => {
    tableWithData += `<tr>${getJsonValuesInTable(element)}</tr>`;
  });
  tableWithData += "</table>"
  return tableWithData;
};
const displayLoginMessage=function(req){
  let filename = `./public/${req.url}`;
  let filedata = fs.readFileSync(filename, 'utf-8');
  if (req.cookies.logInFailed){
    filedata = filedata.replace('LOGIN MESSAGE', 'LOGIN FAILED');
    return filedata;
  }
  filedata = filedata.replace('LOGIN MESSAGE', '');
  return filedata;
};

const displayGuestComments = (res, req) => {
  let filename = `./public/${req.url}`,fileData;
  if(req.url=='/login.html') fileData= displayLoginMessage(req);
  else {
    fileData=getFileData(fs,filename).toString();
    fileData = fileData.replace('USER', `${req.user.name}`);
  }
  fileData = fileData.replace('REPLACE ME', getDataInTable());
  res.setHeader('Content-Type', getMIMEType('html'));
  res.write(fileData);
  res.end();
  return;
};

const getGETRequests = (url) => `${HOST} : ${PORT}  ${getDateAndTimeInArray()} GET ${url}`;
const getPOSTRequests = (url) => `${HOST} : ${PORT}  ${getDateAndTimeInArray()} POST ${url}`;

const parseComments = (element) => {
  element.date = getDateAndTimeInArray().replace('[', '').replace(']', '');
  element.name = parseData(element.name);
  element.comment = parseData(element.comment);
  return element;
};

const RequestedFileHandler = (url, res) => {
  console.log(getGETRequests(url));
  let requestedUrl = `./public/${url}`;
  res.setHeader('Content-type', getMIMEType(requestedUrl));
  try {
    res.write(getFileData(fs, requestedUrl));
  } catch (e) {
    handleFileNotFound(requestedUrl);
  }
  res.end();
  return;
};
let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};
let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('./data/request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.get('/', (req, res) => RequestedFileHandler('index.html', res));
app.get('/guestBook.html', (req, res) => {
  if(req.user)   displayGuestComments(res, req);
  else res.redirect('/login.html');
});
app.get('/index.html', (req, res) => RequestedFileHandler(req.url, res));
app.get('/abeliophyllum.html', (req, res) => RequestedFileHandler(req.url, res));
app.get('/ageratum.html', (req, res) => RequestedFileHandler(req.url, res));
app.get('/js/index.js', (req, res) => RequestedFileHandler(req.url, res));
app.get('/js/guestBook.js', (req, res) => RequestedFileHandler(req.url, res));
app.get('/images/jar.gif', (req, res) => RequestedFileHandler(req.url, res));
app.get('/images/favicon.ico', (req, res) => RequestedFileHandler(req.url, res));
app.get('/images/freshorigins.jpg', (req, res) => RequestedFileHandler(req.url, res));
app.get('/images/pbase-Abeliophyllum.jpg', (req, res) => RequestedFileHandler(req.url, res));
app.get('/images/pbase-agerantum.jpg', (req, res) => RequestedFileHandler(req.url, res));
app.get('/pdf/Abeliophyllum.pdf', (req, res) => RequestedFileHandler(req.url, res));
app.get('/pdf/Ageratum.pdf', (req, res) => RequestedFileHandler(req.url, res));
app.get('/css/master.css', (req, res) => RequestedFileHandler(req.url, res));
app.get('/login.html', (req, res) => {
  console.log(getGETRequests(req.url));
  displayGuestComments(res, req);
});
app.get('/logout', (req, res) => {
  console.log(getGETRequests(req.url));
  res.setHeader('Set-Cookie', [`logInFailed=false;Expires=${new Date(1).toUTCString()}`, `sessionid=0;Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login.html');
});

app.post('/comment', (req, res) => {
  console.log(getPOSTRequests(req.url));
  req.body = parseComments(req.body);
  jsonData.push(req.body);
  fs.writeFileSync('./data/comments.json', JSON.stringify(jsonData));
  res.redirect('./guestBook.html');
});

app.post('/login.html', (req, res) => {
  console.log(getPOSTRequests(req.url));
  let user = registered_users.find(u => u.userName == req.body.userName);
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestBook.html');
});

const server = http.createServer();
server.on('request', app);
server.listen(PORT, HOST);
console.log(`Serving HTTP on ${HOST} port ${PORT}`);
