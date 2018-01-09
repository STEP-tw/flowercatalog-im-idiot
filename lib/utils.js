const getFileData = (fs,file) => {
  return fs.readFileSync(file);
};
const parseData = (data) => {
  data = data.replace(/\+/g," ");
  return decodeURIComponent(data);
};
const getFileType=(url)=>{
  return url.slice(url.lastIndexOf('.')+1);
}
const getMIMEType = (url) => {
  let fileType=getFileType(url);
  let MIMEs = {
    'gif': 'image/gif',
    'jpg': 'image/jpg',
    'ico': 'image/ico',
    'html': 'text/html',
    '/public/': 'text/html',
    'css': 'text/css',
    'pdf': 'application/pdf',
    'js': 'text/javascript'
  };
  return MIMEs[fileType];
};
const getDateAndTime = () => {
  let date = new Date();
  date = date.toString().split(' ');
  return date;
};

const getDateAndTimeInArray=() => {
  let dateAndTime=getDateAndTime();
  let time = dateAndTime[4];
  let day = dateAndTime[2];
  let month = dateAndTime[1];
  let year = dateAndTime[3];
  return `[ ${day}/${month}/${year} ${time} ]`;
};

exports.getFileData=getFileData;
exports.getDateAndTime=getDateAndTime;
exports.getDateAndTimeInArray=getDateAndTimeInArray;
exports.getMIMEType=getMIMEType;
exports.parseData=parseData;
