var quotes = [
    "Do or do not. There is no try.",
    "You must unlearn what you have learned...",
    "Excitement. Heh. A Jedi craves not these things. You are reckless.",
    "Named must be your fear before banish it you can.",
    "Fear is the path to the dark side.",
    "The greatest teacher, failure is.",
    "Pass on what you have learned.",
    "A Jedi uses the Force for knowledge and defense, never for attack.",
    "Already know you that which you need.",
    "Luminous beings we are, not this crude matter.",
    "Once you start down the dark path, consume you it will.",
    "In a dark place we find ourselves & a little more knowledge lights our way.",
    "Patience you must have, my young padawan.",
    "When nine hundred years old you reach, look as good you will not.",
    "Adventure. Excitement. A Jedi craves not these things.",
    "Truly wonderful, the mind of a child is.",
    "If no mistake have you made, yet losing you are. A different game you should play.",
    "Judge me by my size, do you?",
    "Control, control, you must learn control!",
    "To be Jedi is to face the truth, and choose.",
    "Feel the Force!",
    "The dark side clouds everything. Impossible to see, the future is.",
    "Train yourself to let go of everything you fear to lose.",
    "Careful you must be for the dark side looks back.",
    "You will find only what you bring in.",
    "Difficult to see. Always in motion is the future…",
    "Smaller in number are we, but larger in mind.",
    "Wars not make one great.",
    "Mudhole? Slimy? My home this is!",
    "Save them we must. They are our last hope.",
    "Unlearn what you have learned.",
    "Fought I did consumed by fear, I was, though see it I did not.",
    "Clear your mind must be, if you are to find the villains behind this plot.",
    "There..is...another..Sky-walk-er... \(Yoda dies)\.",
    "Luke: I cannot believe it. Yoda: That is why you fail.",
    "Yes a Jedi's strength flows from the Force. But beware of the dark side.",
    "Fear of loss is a path to the dark side.",
    "Anger, fear, aggression, the dark side of the Force are they.",
    "Powerful you have become. The dark side I sense in you.",
    "You will know \(the good from the bad)\ when you are calm, at peace...",
    "What know you of ready? For 8 hundred years have I trained Jedi.",
    "Your weapons. You will not need them.",
    "Stay for some soup you must.",
    "You will find only what you bring in.",
    "Pass on what you have learned.",
];
const {BrowserWindow} = require('electron').remote;
var fs = require('fs');
var theWindow = BrowserWindow.getFocusedWindow();
const DecibelMeter = require('decibel-meter')
const opena = require('open');
const meter = new DecibelMeter('unique-id');
meter.connectTo('default')
var isSpeaking = false;
var loady = false;
var speaky = false;
var isloading = false;
var timeoutReached = false;
var answered = false;
var enabled = true;
var interval;
var hotShell;
const audio = require('win-audio').speaker;
var release = false;
var pyth = release?"\\resources\\app":"";
audio.polling(200);
setInterval(function(){
  var global = require('electron').remote.getGlobal('MyGlobalObject').toTalk;
  if(global == "1"){
    startListening();
    require('electron').remote.getGlobal('MyGlobalObject').toTalk = "0"
  }
},100)
var exec = require('child_process').execFile;
meter.on('sample', (dB, percent, value) => drawVolume((dB+100)/2)) // display current dB level
meter.listen() // "sample" callback set above will now receive data
var waves = false;
let {PythonShell} = require('python-shell')
function startListening(){
  if(enabled){
    //hotShell.childProcess.kill('SIGINT');
    enabled = false;

    document.querySelector(".liveText").innerHTML = "Please Wait..."
    if(!isSpeaking){
      isSpeaking = true;
      document.querySelector(".bottomButtons").className = "disabled bottomButtons";
      let options = {
        pythonOptions: ['-u']// get print results in real-time
      };
      loady = false;
      let shell = new PythonShell(__dirname + '/python.py', {
        mode: 'text',
        pythonPath: __dirname + "\\python\\python.exe",
        pythonOptions: ['-u']});
      shell.on('message', function (message) {
        console.log(message);
        if(message == "ruts"){
          document.querySelector(".liveText").innerHTML = "Processing...";
          loady = true;
          showLoader()
        }else if(message == "fin"){
          waves = true;
          document.querySelector(".liveText").innerHTML = "Speak, you may";
        }else{
          hideLoader()
          document.querySelector(".liveText").innerHTML = message;
          createMessage(message)
          yodaMessagey(message);
        }
      });
      shell.on('stderr', function (stderr) {
        hideLoader()
        createYodaMessage("An error, there was!")
      });
    }
  }
}
//function isPyInstalled(){

//}
function minimize(){
  theWindow.minimize();
}
function exitApp(){
  theWindow.close();
}
function playSound(){

}
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var l = 0;
var xCenter = canvas.width/2;
var yCenter = canvas.height/2;
var radius = 20;
function showLoader(){
  ctx.save();
  ctx.translate(xCenter,yCenter);
  interval = setInterval(function() {
    ctx.strokeStyle = "#ffffff"
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.rotate(10 * Math.PI / 180);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 1.2 * Math.PI);
    ctx.stroke();
  }, 10);
}
function hideLoader(){
  clearInterval(interval);
  loady = false;
  isloading = true;
  ctx.restore();
  drawVolume(0)
}
function drawVolume(vol){
  if(!loady){
    ctx.clearRect(0,0,canvas.width,canvas.height)

    ctx.stroke();
    ctx.beginPath()
    ctx.strokeStyle = "#ffffff"
    var counter = 0, x=0,y=canvas.height/2;

    var increase = 90/180*Math.PI / 10;
    for(i=0; i<=360*2; i+=2){
      ctx.moveTo(x,y);
      x = i+l;
      if(isloading){
          y =  canvas.height/2 - Math.sin(counter) * 0;
      }else if(isSpeaking && waves){
          y =  canvas.height/2 - Math.sin(counter) * vol;
      }
      if(isSpeaking){
      }else{
      }
      counter += increase;
      ctx.lineTo(x,y);
    }
    l--;
    if(l == -400){
      l = 0;
    }
    //console.log(l);
     ctx.closePath()
   }
}
function sendMsg(){
  console.log("ran");
  if(enabled){
    enabled = false;
    var mess = document.querySelector(".textBox").value;
    if(mess.trim() != ""){
      document.querySelector(".textBox").value = "";
      createMessage(mess)
      yodaMessagey(mess);
    }
  }

}
document.querySelector(".textBox").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMsg();
    document.querySelector(".bottomButtons").className = "disabled bottomButtons";
  }
});
drawVolume(-50)
function createMessage(text){
  document.querySelector(".liveText").innerHTML = "";
  var parentDiv = document.createElement("div");
  parentDiv.className = "myMessage message";
  var paragraph = document.createElement("p");
  paragraph.innerHTML = text;
  parentDiv.append(paragraph)
  document.querySelector(".emptyState").style.display = "none";
  document.querySelector(".messagesDisplay").append(parentDiv)
  var messagesDiv = document.querySelector(".messagesDisplay");
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
var openWords = "openlaunch"
var searchWords = "searchfind"
function yodaMessagey(ms){
  if(openWords.includes(ms.split(" ")[0])){
    showLoad();
    open(ms.split(" ")[1]);
  }else if(searchWords.includes(ms.split(" ")[0])){
    showLoad();//falcon 9
    var message = ms.split(" ")
    message.shift();
    var final = message.join(" ");
    console.log(final);
    opena("https://www.google.com/search?q="+encodeURI(final)+"&ie=UTF-8");
    createYodaMessage("searching " + final)
  }else if(ms.includes("volume") && ms.includes("increase")){
    showLoad();
    audio.increase(10);
    // audio.set(40);
    createYodaMessage("increasing volume to " + audio.get() + " percent")
  }else if(ms.includes("volume") && ms.includes("decrease")){
    showLoad();
    audio.decrease(10);
    createYodaMessage("decreasing volume to " + audio.get() + " percent")
  }else if(ms.includes("set volume to")){
    var vol = ms.split(" ")[3].replace(/\d+% ?/g, "");
    if(!isNaN(vol) && vol <= 100 && vol >= 0){
      showLoad();
      audio.set(parseInt(ms.split(" ")[3]));
      createYodaMessage("setting volume to " + ms.split(" ")[3].replace(/\d+% ?/g, "") + " percent")
    }else{
      chat(ms)
    }
  }else if(ms.includes("quote") && ms.includes("yoda") || ms.includes("quote") && ms.includes("random")){
    showLoad();
    createYodaMessage("I once said: " + quotes[Math.floor(Math.random() * quotes.length)])
  }else if(ms.includes("time") && ms.includes("what")){
    showLoad();
    var d = new Date();
    var suffix = d.getHours() > 12?"PM":"AM";
    createYodaMessage("The time is " + (d.getHours()<12?d.getHours():d.getHours()-12) + " and " + d.getMinutes() + " minutes" + suffix);
  }else if(ms.includes("date") && ms.includes("what")){
    showLoad();
    var date = new Date().toLocaleString();
    createYodaMessage("The date is " + date.substring(0,date.indexOf(",")));
  }else if(ms.toLowerCase().includes("how much is")){
    showLoad()
    try{
      var thingy = formatMath(ms);
      console.log(thingy);
      createYodaMessage("The answer is " + eval(thingy))
    }catch(e){
      createYodaMessage("An error, there was")
    }

  }else if(ms.includes("shutdown") && ms.includes("computer") || ms.includes("shut down") && ms.includes("computer")){
    showLoad();
    createYodaMessage("Shut down the computer, I will")
    const { exec } = require('child_process');
    exec('shutdown -s', (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err)
      } else {
       // the *entire* stdout and stderr (buffered)
       console.log(`stdout: ${stdout}`);
       console.log(`stderr: ${stderr}`);
      }
    });
  }else if(ms.includes("restart") && ms.includes("computer")){
    showLoad();
    createYodaMessage("Shut down the computer, I will")
    const { exec } = require('child_process');
    exec('shutdown -r', (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err)
      } else {
       // the *entire* stdout and stderr (buffered)
       console.log(`stdout: ${stdout}`);
       console.log(`stderr: ${stderr}`);
      }
    });
  }else if(ms.toLowerCase().includes("tell me")){
    timeoutReached = false;
    answered = false;
    console.log("hey");
    showLoad()
    var qu = ms.toLowerCase().replace("tell me","");
    console.log("https://question-api-yoda.herokuapp.com/?sc=" + qu);
    request("https://question-api-yoda.herokuapp.com/?sc=" + qu, { json: true }, (err, res, body) => {
      if (err) {
        createYodaMessage("an error, there was");
        hideLoad();
        return console.log(err);
      }
      answered = true;
      console.log(body + " " + res);
      if(!timeoutReached){
        if(body != "nopea"){
          createYodaMessage(body);
        }else{
          opena("https://www.google.com/search?q="+encodeURI(qu)+"&ie=UTF-8");
          createYodaMessage("Find an answer, I couldn't, searching on the web");
        }
      }
    });
    setTimeout(function(){
      if(!answered){
        opena("https://www.google.com/search?q="+encodeURI(qu)+"&ie=UTF-8");
        createYodaMessage("Automatic timeout reached, searching on the web");
        timeoutReached = true;
      }
    },10000)
    //getAnswer());
  }else{
    chat(ms)
  }
}
const https = require("https");
const http = require("http");
const request = require('request');
function getAnswer(question){
  request("https://question-api-yoda.herokuapp.com/?sc=" + question, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    createYodaMessage(body.explanation);
  });
}
function formatMath(math){
  var regExp = /[a-zA-Z]/g;
  var words = math.split(" ");
  var mathy = [];
  console.log(words);
  for(var i = 0; i < words.length; i++){
    console.log(words[i] + " " + !regExp.test(words[i]));
    if(!regExp.test(words[i])){
      mathy.push(words[i])
    }
  }
  return mathy.join("");
}
function chat(mes){
  showLoad();
  let shell = new PythonShell(__dirname + '/chatBot.py', { mode: 'text',
  pythonOptions: ['-u'],//Timathon 1.21\env\Scripts\python.exe
  pythonPath: __dirname + "\\python\\python.exe",
  args:[mes]});
  shell.on('message', function (message) {
    console.log(message + " | " + yodafy(message) + " <-----");
    createYodaMessage(yodafy(message))
  });
  shell.on('stderr', function (stderr) {
    createYodaMessage("An error, there was!")
  });
}
function showLoad(){
  var loadDiv = document.createElement("div");
  loadDiv.className = "yodaMessage message loadBox";
  var image = document.createElement("img");
  image.setAttribute("src","animationload.gif");
  image.className = "loadGif";
  loadDiv.append(image);
  var messagesDiv = document.querySelector(".messagesDisplay");
  messagesDiv.append(loadDiv)
  //document.querySelector(".loadBox").style.display = "flex";
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
function removeElement(classa) {
  //try{

      var elem = document.querySelector("." + classa);
      elem.parentNode.removeChild(elem);
  // }catch(e){
  //
  // }
}
function hideLoad(){
  removeElement("loadBox")
  //document.querySelector(".loadBox").style.display = "none";
}

const installedPaths = require ('installed-win-apps');
var nameArr = [];
var pathArr = [];
function initFiles(){
  var file = fs.readFileSync(__dirname + "/firstTime.txt","utf-8")
  if(file.trim() == "false"){
    console.log("searching");
    installedPaths.getAllPaths().then (paths=>{
        console.log(paths)
        fs.writeFile(__dirname + "/exes.txt",paths.join("\n"),function(err){
          if(err){
            console.log(err);
          }
        })
        pathArr = paths;
        for(var i = 0; i < paths.length; i++){
          var name = paths[i].substring(paths[i].lastIndexOf("\\")+1,paths[i].lastIndexOf("exe")-1);
          nameArr.push(name)
        }
        console.log(nameArr);
        let shell = new PythonShell(__dirname + '/train.py', { mode: 'text',
        pythonOptions: ['-u'],//Timathon 1.21\env\Scripts\python.exe
        pythonPath: __dirname + "\\python\\python.exe",
        args:['']});
        shell.on('message', function (message) {
          console.log(message + " <-----");
          if(message == "finished"){
            fs.writeFile(__dirname+ "/firstTime.txt","true",function(err){
              if(err){
                console.log(err);
              }else{
                document.querySelector(".load").style.display = "none";
                document.querySelector(".noPython").style.display = "none";
              }
            });
          }
        });
        shell.on('stderr', function (stderr) {
          console.log(stderr);
        });
    })
  }else{
    var file = fs.readFileSync(__dirname + "/exes.txt","utf-8")
    pathArr = file.split("\n");
    var paths = pathArr;
    for(var i = 0; i < paths.length; i++){
      var name = paths[i].substring(paths[i].lastIndexOf("\\")+1,paths[i].lastIndexOf("exe")-1);
      nameArr.push(name)
      document.querySelector(".load").style.display = "none";
      document.querySelector(".noPython").style.display = "none";
    }
    console.log(file);
  }


}
function microsoftPython(){
  opena("https://www.microsoft.com/store/productId/9P7QFQMJRFP7");
}
function webInstallPython(){
  opena("https://www.python.org/downloads/")
}
function nextPython(){
  verifyPython();
}
function showPyErr(){
  document.querySelector(".noPython").style.display = "flex";
}
const alertOnlineStatus = () => { window.alert(navigator.onLine ? 'online' : 'offline') }
// window.addEventListener('online', () => document.querySelector(".noInternet").style.display = "block");
// window.addEventListener('offline', () => document.querySelector(".noInternet").style.display = "none");
window.addEventListener('online', alertOnlineStatus)
window.addEventListener('offline', alertOnlineStatus)

setTimeout(initFiles,2500);
function open(app){
  var isFound = false;
  var vApp = app;
  if(app.toLowerCase() == "google"){
    vApp = "chrome";
  }else if(app.toLowerCase() == "xoom"){
    vApp = "zoom"
  }
  for(var i = 0; i < nameArr.length; i++){
    //console.log(nameArr[i].toLowerCase());
    if(nameArr[i].toLowerCase().includes(vApp.toLowerCase())){
      if(pathArr[i].includes("exe")){
        console.log(nameArr[i]);
        console.log(pathArr[i]);
        exec(pathArr[i], function(err, data) {
        });
        createYodaMessage("opening " + app);
        isFound = true;
        //console.log(data.toString());
        break;
      }
    }
    if(i == nameArr.length-1){
      console.log(isFound);
      if(!isFound){
        createYodaMessage("find " + app + " I could not!");
      }
    }
  }

}
function createYodaMessage(text){
  voices = window.speechSynthesis.getVoices()
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[6];
  window.speechSynthesis.speak(utterance);
  document.querySelector(".liveText").innerHTML = "";
  var parentDiv = document.createElement("div");
  parentDiv.className = "yodaMessage message";
  var paragraph = document.createElement("p");
  paragraph.innerHTML = text;
  parentDiv.append(paragraph)
  document.querySelector(".messagesDisplay").append(parentDiv)
  var messagesDiv = document.querySelector(".messagesDisplay");
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  hideLoad();
  isSpeaking = false;
  waves = false;
  document.querySelector(".bottomButtons").className = "bottomButtons";
  isloading = false;
  enabled = true;
  document.querySelector(".liveText").innerHTML = "Help you I can, yes, hmmmmmm"
}
function yodafy(n){var e=new Array,t=new Array,r=new Array,o=new Array,s=new Array,k=new Array,b=new Array,v=new Array,g=new Array,a=new Array,l=new Array,d=new Array,h=new Array,w=new Array,p=new Array,u=new Array;var f="����}�";function c(n,e,t){for(var r=new Array(" ",",",".","'","!",":","?",'"',";","/","<",">",")","(","%","$"),o=(e=N(e),0);o<e.length;o++)e[o]=L(e[o]);for(o=0;o<n.length;o++)for(var s=0;s<r.length;s++)t=""!==e[o]?t.split(" "+n[o].toLowerCase()+r[s]).join(" "+e[o]+r[s]):t.split(" "+n[o].toLowerCase()+r[s]).join(" ");return t}function m(n,e,t){var r=new Array(" ",",",".","'","!",":","?",'"',";","/","<",">",")","(","%","$");t=t.replace(/(\b\S+\b)\s+\b\1\b/i,"$1  $1");e=N(e);for(var o=0;o<e.length;o++)e[o]=L(e[o]);var s=[];for(o=0;o<n.length;o++)if(n[o]instanceof Array){s[o]=[];for(var k=0;k<n[o].length;k++)s[o][k]=n[o][k].replace(/\{\{.*\}\}/g,"")}else s[o]=n[o].replace(/\{\{.*\}\}/g,"");for(o=0;o<s.length;o++){if(e[o]instanceof Array){e[o].length;var b=e[o][Math.floor(Math.random()*e[o].length)]}else b=e[o];for(k=0;k<r.length;k++)if(s[o]instanceof Array)for(var v=0;v<s[o].length;v++)t=b.length>0?t.split(" "+s[o][v].toLowerCase()+r[k]).join(" "+b+r[k]):t.split(" "+s[o][v].toLowerCase()+r[k]).join(" ");else t=s[o][0]+s[o].slice(-1)=="''"||s[o][0]+s[o].slice(-1)=='""'?t.split(s[o].toLowerCase()+r[k]).join(b+r[k]):b.length>0?t.split(" "+s[o].toLowerCase()+r[k]).join(" "+b+r[k]):t.split(" "+n[o].toLowerCase()+r[k]).join(" ")}return t}function y(n,e,t){for(var r=0,o="",s="",k=0;k<t.length+1;k++){o=t.substring(r,k);for(var b=0;b<n.length;b++)if(-1!==o.indexOf(n[b])){s+=o.replace(n[b],e[b]),r=k;break}}return s+=t.substring(r,k),t=s}function $(n){return n.replace(/([()[{*+.$^\\|?])/g,"\\$1")}function A(n,e,t){e=N(e);for(var r=0;r<e.length;r++)e[r]=L(e[r]);for(r=0;r<n.length;r++)t=t.replace(new RegExp("\\s"+$(n[r])+"([^\\s])","g")," "+e[r]+"$1");return t}function x(n,e,t){e=N(e);for(var r=0;r<e.length;r++)e[r]=L(e[r]);for(r=0;r<n.length;r++)t=t.replace(new RegExp("([^\\s])"+$(n[r])+"\\s","g"),"$1"+e[r]+" ");return t}function j(n,e,t){for(var r=0;r<n.length;r++)if("string"==typeof e[0]||e[0]instanceof String){var o=n[r].match(new RegExp("^/(.*?)/([gimy]*)$"));if(o){var s=new RegExp(o[1],o[2]);t=t.replace(s,e[r])}}return t}function E(n,e,t){for(var r=0;r<n.length;r++){var o=new RegExp("([^\\s]+){{"+n[r].trim().replace(/[\s]+/g," ").split(" ").join("}}[\\s]+([^\\s]+){{")+"}}","g"),s=C(n[r].replace(/[\s]+/g," ").split(" "),e[r].replace(/[\s]+/g," ").split(" "));t=t.replace(o,"$"+s.split(",").join(" $"))}var k=[];for(r=0;r<n.length;r++)for(var b=n[r].trim().replace(/[\s]+/g," ").split(" "),v=0;v<b.length;v++)-1===k.indexOf(b[v])&&(t=t.replace("{{"+b[v]+"}}",""),k.push(b[v]));return t}function C(n,e){for(var t=[],r=0;r<e.length;r++)-1!==n.indexOf(e[r])&&t.push(n.indexOf(e[r])+1);return t.join(",")}function z(n){return n=n.split(f).join("")}function L(n){if("[object Array]"===Object.prototype.toString.call(n)){for(var e=0;e<n.length;e++)n[e]=f+n[e].toString().split("").join(f)+f;return n}return f+n.toString().split("").join(f)+f}function N(n){var e=n instanceof Array?[]:{};for(i in n)"clone"!=i&&(n[i]&&"object"==typeof n[i]?e[i]=N(n[i]):e[i]=n[i]);return e}function q(n){null===n.slice(-1).match(/[.!?]+/g)&&(n+=".");var e=[" Yrsssss."," Hrmmm."," Hmm."," Yes, hrrmmm."," Yes, hrrrm.","","","","","","",""],t=["Hrrmmm. ","","","","","","","","","","","",""],r=e[Math.floor(e.length*Math.random())];return t[Math.floor(t.length*Math.random())]+n.replace(/\.[ ]+/gi,". ").replace(/^[ ]+/gi,"").replace(/[ ]+\./gi,".").replace(/.+?[\.\?\!](\s|$)/g,function(n){return null!==n.charAt(0).match(/[a-z]/g)?n.charAt(0).toUpperCase()+n.substr(1):n})+r}function O(n){console.log(n)}try{var S={phrases1:"",phrases2:"",words1:"call\ncalls\ncalled\ncalled\ncalling\nclean\ncleans\ncleaned\ncleaned\ncleaning\nlook\nlooks\nlooked\nlooked\nlooking\ntalk\ntalks\ntalked\ntalked\ntalking\nend\nends\nended\nended\nending\nwait\nwaits\nwaited\nwaited\nwaiting\nkiss\nkisses\nkissed\nkissed\nkissing\nwash\nwashes\nwashed\nwashed\nwashing\nlive\nlives\nlived\nlived\nliving\nlove\nloves\nloved\nloved\nloving\nbeg\nbegs\nbegged\nbegged\nbegging\nsin\nsins\nsinned\nsinned\nsinning\nplay\nplays\nplayed\nplayed\nplaying\nstay\nstays\nstayed\nstayed\nstaying\ncry\ncries\ncried\ncried\ncrying\nstudies\nstudied\nstudied\nstudying\ndie\ndies\ndied\ndied\ndying\ntie\nties\ntied\ntied\ntying\ncut\ncuts\ncut\ncut\ncutting\nfit\nfits\nfit\nfit\nfitting\nhit\nhits\nhit\nhit\nhitting\nlet\nlets\nlet\nlet\nletting\nput\nputs\nput\nput\nputting\nquit\nquits\nquit\nquit\nquitting\nset\nsets\nset\nset\nsetting\nshut\nshuts\nshut\nshut\nshutting\nsplit\nsplits\nsplit\nsplit\nsplitting\nupset\nupsets\nupset\nupset\nupsetting\nburst\nbursts\nburst\nburst\nbursting\ncast\ncasts\ncast\ncast\ncasting\ncost\ncosts\ncost\ncost\ncosting\nhurt\nhurts\nhurt\nhurt\nhurting\nspread\nspreads\nspread\nspread\nspreading\nknit\nknits\nknit\nknitted\nknit\nknitted\nknitting\nsit\nsits\nsat\nsat\nsitting\nspit\nspits\nspat\nspit\nspat\nspit\nspitting\nbegin\nbegins\nbegan\nbegun\nbeginning\nswim\nswims\nswam\nswum\nswimming\nring\nrings\nrang\nrung\nringing\nsing\nsings\nsang\nsung\nsinging\nspring\nsprings\nsprang\nsprung\nspringing\ncling\nclings\nclung\nclung\nclinging\nfling\nflings\nflung\nflung\nflinging\nsling\nslings\nslung\nslung\nslinging\nsting\nstings\nstung\nstung\nstinging\nswing\nswings\nswung\nswung\nswinging\nwring\nwrings\nwrung\nwrung\nwringing\nhang\nhangs\nhung\nhanged**\nhung\nhanged\nhanging\ndrink\ndrinks\ndrank\ndrunk\nsinking\nshrink\nshrinks\nshrank\nshrunk\nshrinking\nstink\nstinks\nstank\nstunk\nstunk\nstinking\nthink\nthinks\nthought\nthought\nthinking\nbring\nbrings\nbrought\nbrought\nbringing\nbuy\nbuys\nbought\nbought\nbuying\nseek\nseeks\nsought\nsought\nseeking\nfight\nfights\nfought\nfought\nfighting\ncatch\ncatches\ncaught\ncaught\ncatching\nteach\nteaches\ntaught\ntaught\nteaching\ncreep\ncreeps\ncrept\ncrept\ncreeping\nkeep\nkeeps\nkept\nkept\nkeeping\nsleep\nsleeps\nslept\nslept\nsleeping\nsweep\nsweeps\nswept\nswept\nsweeping\nweep\nweeps\nwept\nwept\nweeping\nbleed\nbleeds\nbled\nbled\nbleeding\nbreed\nbreeds\nbred\nbred\nbreeding\nfeed\nfeeds\nfed\nfed\nfeeding\nflee\nflees\nfled\nfled\nfleeing\nlead\nleads\nled\nled\nleading\nspeed\nspeeds\nsped\nspeeded\nsped\nspeeded\nspeeding\nmeet\nmeets\nmet\nmet\nmeeting\nbend\nbends\nbent\nbent\nbending\nlend\nlends\nlent\nlent\nlending\nsend\nsends\nsent\nsent\nsending\nspend\nspends\nspent\nspent\nspending\ndeal\ndeals\ndealt\ndealt\ndealing\nfeel\nfeels\nfelt\nfelt\nfeeling\nkneel\nkneels\nknelt\nknelt\nkneeling\ndream\ndreams\ndreamt\ndreamed\ndreamt\ndreamed\ndreaming\nmean\nmeans\nmeant\nmeant\nmeaning\nspill\nspills\nspilt\nspilled\nspilt\nspilled\nspilling\nbuild\nbuilds\nbuilt\nbuilt\nbuilding\nburn\nburns\nburnt\nburned\nburnt\nburned\nburning\nhold\nholds\nheld\nheld\nholding\nsell\nsells\nsold\nsold\nselling\ntell\ntells\ntold\ntold\ntelling\nfind\nfinds\nfound\nfound\nfinding\ngrind\ngrinds\nground\nground\ngrinding\nwind\nwinds\nwound\nwound\nwinding\nbreak\nbreaks\nbroke\nbroken\nbreaking\nchoose\nchooses\nchose\nchosen\nchoosing\nfreeze\nfreezes\nfroze\nfrozen\nfreezing\nspeak\nspeaks\nspoke\nspoken\nspeaking\nsteal\nsteals\nstole\nstolen\nstealing\nwake\nwakes\nwoke\nwoken\nwaking\nweave\nweaves\nwove\nwoven\nweaving\narise\narises\narose\narisen\narising\ndrive\ndrives\ndrove\ndriven\ndriving\nride\nrides\nrode\nridden\nriding\nrise\nrises\nrose\nrisen\nrising\nwrite\nwrites\nwrote\nwritten\nwriting\nbite\nbites\nbit\nbitten\nbiting\nhide\nhides\nhid\nhidden\nhiding\nslide\nslides\nslid\nslidden\nslid\nsliding\nget\ngets\ngot\ngotten\ngetting\nforget\nforgets\nforgot\nforgotten\nforgetting\ngive\ngives\ngave\ngiven\ngiving\nforgive\nforgives\nforgave\nforgiven\nforgiving\nforbid\nforbids\nforbade\nforbad\nforbidden\nforbidding\nfall\nfalls\nfell\nfallen\nfalling\nswell\nswells\nswole\nswelled\nswollen\nswelling\ndive\ndives\ndove\ndived\ndived\ndiving\nblow\nblows\nblew\nblown\nblowing\nfly\nflies\nflew\nflown\nflying\ngrow\ngrows\ngrew\ngrown\ngrowing\nknow\nknows\nknew\nknown\nknowing\nthrow\nthrows\nthrew\nthrown\nthrowing\ndraw\ndraws\ndrew\ndrawn\ndrawing\nwithdraw\nwithdraws\nwithdrew\nwithdrawn\nwithdrawing\nshow\nshows\nshowed\nshown\nshowing\neat\neats\nate\neaten\neating\nbeat\nbeats\nbeat\nbeaten\nbeating\ntake\ntakes\ntook\ntaken\ntaking\nforsake\nforsakes\nforsook\nforsaken\nforsaking\nmistake\nmistakes\nmistook\nmistaken\nmistaking\nshake\nshakes\nshook\nshaken\nshaking\nmake\nmakes\nmade\nmade\nmaking\nswear\nswears\nswore\nsworn\nswearing\nwear\nwears\nwore\nworn\nwearing\ntear\ntears\ntore\ntorn\ntearing\nbear\nbears\nbore\nborn\nbearing\nstand\nstands\nstood\nstood\nstanding\nunderstand\nunderstands\nunderstood\nunderstood\nunderstanding\nbecome\nbecomes\nbecame\nbecome\nbecoming\ncome\ncomes\ncame\ncome\ncoming\nrun\nruns\nran\nrun\nrunning\ndig\ndigs\ndug\ndug\ndigging\nspin\nspins\nspun\nspun\nspinning\nstick\nsticks\nstuck\nstuck\nsticking\nstrike\nstrikes\nstruck\nstruck\nstricken\nstriking\ndo\ndoes\ndid\ndone\ndoing\ndon't\ngo\ngoes\nwent\ngone\ngoing\nhave\nhavn't\nhas\nhasn't\nhad\nhadn't\nhaving\nhear\nhears\nheard\nheard\nhearing\nlay\nlays\nlaid\nlaid\nlaying\npay\npays\npaid\npaid\npaying\nsay\nsays\nsaid\nsaid\nsaying\nlie\nlies\nlay\nlain\nlying\nlight\nlights\nlit\nlighted\nlit\nlighted\nlighting\nlose\nloses\nlost\nlost\nlosing\nleave\nleaves\nleft\nleft\nleaving\nprove\nproves\nproved\nproven\nproved\nproving\nread\nreads\nread\nread\nreading\nsee\nsees\nsaw\nseen\nseeing\nsew\nsews\nsewed\nsewn\nsewed\nsewing\nshave\nshaves\nshaved\nshaven\nshaved\nshaving\nshine\nshines\nshined\nshone\nshining\nshoot\nshoots\nshot\nshot\nshooting\nwind\nwins\nwon\nwon\nwinning\nbe\nis\nisn't\nare\naren't\nam\nwas\nwasn't\nwere\nweren't\nbeen\nbeing\nmust\nmustn't\nuse\nuses\nsense\nsenses\nsensed\nlike\nliked\nliking",words2:"callverb9387562057token\ncallsverb9387562057token\ncalledverb9387562057token\ncalledverb9387562057token\ncallingverb9387562057token\ncleanverb9387562057token\ncleansverb9387562057token\ncleanedverb9387562057token\ncleanedverb9387562057token\ncleaningverb9387562057token\nlookverb9387562057token\nlooksverb9387562057token\nlookedverb9387562057token\nlookedverb9387562057token\nlookingverb9387562057token\ntalkverb9387562057token\ntalksverb9387562057token\ntalkedverb9387562057token\ntalkedverb9387562057token\ntalkingverb9387562057token\nendverb9387562057token\nendsverb9387562057token\nendedverb9387562057token\nendedverb9387562057token\nendingverb9387562057token\nwaitverb9387562057token\nwaitsverb9387562057token\nwaitedverb9387562057token\nwaitedverb9387562057token\nwaitingverb9387562057token\nkissverb9387562057token\nkissesverb9387562057token\nkissedverb9387562057token\nkissedverb9387562057token\nkissingverb9387562057token\nwashverb9387562057token\nwashesverb9387562057token\nwashedverb9387562057token\nwashedverb9387562057token\nwashingverb9387562057token\nliveverb9387562057token\nlivesverb9387562057token\nlivedverb9387562057token\nlivedverb9387562057token\nlivingverb9387562057token\nloveverb9387562057token\nlovesverb9387562057token\nlovedverb9387562057token\nlovedverb9387562057token\nlovingverb9387562057token\nbegverb9387562057token\nbegsverb9387562057token\nbeggedverb9387562057token\nbeggedverb9387562057token\nbeggingverb9387562057token\nsinverb9387562057token\nsinsverb9387562057token\nsinnedverb9387562057token\nsinnedverb9387562057token\nsinningverb9387562057token\nplayverb9387562057token\nplaysverb9387562057token\nplayedverb9387562057token\nplayedverb9387562057token\nplayingverb9387562057token\nstayverb9387562057token\nstaysverb9387562057token\nstayedverb9387562057token\nstayedverb9387562057token\nstayingverb9387562057token\ncryverb9387562057token\ncriesverb9387562057token\ncriedverb9387562057token\ncriedverb9387562057token\ncryingverb9387562057token\nstudiesverb9387562057token\nstudiedverb9387562057token\nstudiedverb9387562057token\nstudyingverb9387562057token\ndieverb9387562057token\ndiesverb9387562057token\ndiedverb9387562057token\ndiedverb9387562057token\ndyingverb9387562057token\ntieverb9387562057token\ntiesverb9387562057token\ntiedverb9387562057token\ntiedverb9387562057token\ntyingverb9387562057token\ncutverb9387562057token\ncutsverb9387562057token\ncutverb9387562057token\ncutverb9387562057token\ncuttingverb9387562057token\nfitverb9387562057token\nfitsverb9387562057token\nfitverb9387562057token\nfitverb9387562057token\nfittingverb9387562057token\nhitverb9387562057token\nhitsverb9387562057token\nhitverb9387562057token\nhitverb9387562057token\nhittingverb9387562057token\nletverb9387562057token\nletsverb9387562057token\nletverb9387562057token\nletverb9387562057token\nlettingverb9387562057token\nputverb9387562057token\nputsverb9387562057token\nputverb9387562057token\nputverb9387562057token\nputtingverb9387562057token\nquitverb9387562057token\nquitsverb9387562057token\nquitverb9387562057token\nquitverb9387562057token\nquittingverb9387562057token\nsetverb9387562057token\nsetsverb9387562057token\nsetverb9387562057token\nsetverb9387562057token\nsettingverb9387562057token\nshutverb9387562057token\nshutsverb9387562057token\nshutverb9387562057token\nshutverb9387562057token\nshuttingverb9387562057token\nsplitverb9387562057token\nsplitsverb9387562057token\nsplitverb9387562057token\nsplitverb9387562057token\nsplittingverb9387562057token\nupsetverb9387562057token\nupsetsverb9387562057token\nupsetverb9387562057token\nupsetverb9387562057token\nupsettingverb9387562057token\nburstverb9387562057token\nburstsverb9387562057token\nburstverb9387562057token\nburstverb9387562057token\nburstingverb9387562057token\ncastverb9387562057token\ncastsverb9387562057token\ncastverb9387562057token\ncastverb9387562057token\ncastingverb9387562057token\ncostverb9387562057token\ncostsverb9387562057token\ncostverb9387562057token\ncostverb9387562057token\ncostingverb9387562057token\nhurtverb9387562057token\nhurtsverb9387562057token\nhurtverb9387562057token\nhurtverb9387562057token\nhurtingverb9387562057token\nspreadverb9387562057token\nspreadsverb9387562057token\nspreadverb9387562057token\nspreadverb9387562057token\nspreadingverb9387562057token\nknitverb9387562057token\nknitsverb9387562057token\nknitverb9387562057token\nknittedverb9387562057token\nknitverb9387562057token\nknittedverb9387562057token\nknittingverb9387562057token\nsitverb9387562057token\nsitsverb9387562057token\nsatverb9387562057token\nsatverb9387562057token\nsittingverb9387562057token\nspitverb9387562057token\nspitsverb9387562057token\nspatverb9387562057token\nspitverb9387562057token\nspatverb9387562057token\nspitverb9387562057token\nspittingverb9387562057token\nbeginverb9387562057token\nbeginsverb9387562057token\nbeganverb9387562057token\nbegunverb9387562057token\nbeginningverb9387562057token\nswimverb9387562057token\nswimsverb9387562057token\nswamverb9387562057token\nswumverb9387562057token\nswimmingverb9387562057token\nringverb9387562057token\nringsverb9387562057token\nrangverb9387562057token\nrungverb9387562057token\nringingverb9387562057token\nsingverb9387562057token\nsingsverb9387562057token\nsangverb9387562057token\nsungverb9387562057token\nsingingverb9387562057token\nspringverb9387562057token\nspringsverb9387562057token\nsprangverb9387562057token\nsprungverb9387562057token\nspringingverb9387562057token\nclingverb9387562057token\nclingsverb9387562057token\nclungverb9387562057token\nclungverb9387562057token\nclingingverb9387562057token\nflingverb9387562057token\nflingsverb9387562057token\nflungverb9387562057token\nflungverb9387562057token\nflingingverb9387562057token\nslingverb9387562057token\nslingsverb9387562057token\nslungverb9387562057token\nslungverb9387562057token\nslingingverb9387562057token\nstingverb9387562057token\nstingsverb9387562057token\nstungverb9387562057token\nstungverb9387562057token\nstingingverb9387562057token\nswingverb9387562057token\nswingsverb9387562057token\nswungverb9387562057token\nswungverb9387562057token\nswingingverb9387562057token\nwringverb9387562057token\nwringsverb9387562057token\nwrungverb9387562057token\nwrungverb9387562057token\nwringingverb9387562057token\nhangverb9387562057token\nhangsverb9387562057token\nhungverb9387562057token\nhanged**verb9387562057token\nhungverb9387562057token\nhangedverb9387562057token\nhangingverb9387562057token\ndrinkverb9387562057token\ndrinksverb9387562057token\ndrankverb9387562057token\ndrunkverb9387562057token\nsinkingverb9387562057token\nshrinkverb9387562057token\nshrinksverb9387562057token\nshrankverb9387562057token\nshrunkverb9387562057token\nshrinkingverb9387562057token\nstinkverb9387562057token\nstinksverb9387562057token\nstankverb9387562057token\nstunkverb9387562057token\nstunkverb9387562057token\nstinkingverb9387562057token\nthinkverb9387562057token\nthinksverb9387562057token\nthoughtverb9387562057token\nthoughtverb9387562057token\nthinkingverb9387562057token\nbringverb9387562057token\nbringsverb9387562057token\nbroughtverb9387562057token\nbroughtverb9387562057token\nbringingverb9387562057token\nbuyverb9387562057token\nbuysverb9387562057token\nboughtverb9387562057token\nboughtverb9387562057token\nbuyingverb9387562057token\nseekverb9387562057token\nseeksverb9387562057token\nsoughtverb9387562057token\nsoughtverb9387562057token\nseekingverb9387562057token\nfightverb9387562057token\nfightsverb9387562057token\nfoughtverb9387562057token\nfoughtverb9387562057token\nfightingverb9387562057token\ncatchverb9387562057token\ncatchesverb9387562057token\ncaughtverb9387562057token\ncaughtverb9387562057token\ncatchingverb9387562057token\nteachverb9387562057token\nteachesverb9387562057token\ntaughtverb9387562057token\ntaughtverb9387562057token\nteachingverb9387562057token\ncreepverb9387562057token\ncreepsverb9387562057token\ncreptverb9387562057token\ncreptverb9387562057token\ncreepingverb9387562057token\nkeepverb9387562057token\nkeepsverb9387562057token\nkeptverb9387562057token\nkeptverb9387562057token\nkeepingverb9387562057token\nsleepverb9387562057token\nsleepsverb9387562057token\nsleptverb9387562057token\nsleptverb9387562057token\nsleepingverb9387562057token\nsweepverb9387562057token\nsweepsverb9387562057token\nsweptverb9387562057token\nsweptverb9387562057token\nsweepingverb9387562057token\nweepverb9387562057token\nweepsverb9387562057token\nweptverb9387562057token\nweptverb9387562057token\nweepingverb9387562057token\nbleedverb9387562057token\nbleedsverb9387562057token\nbledverb9387562057token\nbledverb9387562057token\nbleedingverb9387562057token\nbreedverb9387562057token\nbreedsverb9387562057token\nbredverb9387562057token\nbredverb9387562057token\nbreedingverb9387562057token\nfeedverb9387562057token\nfeedsverb9387562057token\nfedverb9387562057token\nfedverb9387562057token\nfeedingverb9387562057token\nfleeverb9387562057token\nfleesverb9387562057token\nfledverb9387562057token\nfledverb9387562057token\nfleeingverb9387562057token\nleadverb9387562057token\nleadsverb9387562057token\nledverb9387562057token\nledverb9387562057token\nleadingverb9387562057token\nspeedverb9387562057token\nspeedsverb9387562057token\nspedverb9387562057token\nspeededverb9387562057token\nspedverb9387562057token\nspeededverb9387562057token\nspeedingverb9387562057token\nmeetverb9387562057token\nmeetsverb9387562057token\nmetverb9387562057token\nmetverb9387562057token\nmeetingverb9387562057token\nbendverb9387562057token\nbendsverb9387562057token\nbentverb9387562057token\nbentverb9387562057token\nbendingverb9387562057token\nlendverb9387562057token\nlendsverb9387562057token\nlentverb9387562057token\nlentverb9387562057token\nlendingverb9387562057token\nsendverb9387562057token\nsendsverb9387562057token\nsentverb9387562057token\nsentverb9387562057token\nsendingverb9387562057token\nspendverb9387562057token\nspendsverb9387562057token\nspentverb9387562057token\nspentverb9387562057token\nspendingverb9387562057token\ndealverb9387562057token\ndealsverb9387562057token\ndealtverb9387562057token\ndealtverb9387562057token\ndealingverb9387562057token\nfeelverb9387562057token\nfeelsverb9387562057token\nfeltverb9387562057token\nfeltverb9387562057token\nfeelingverb9387562057token\nkneelverb9387562057token\nkneelsverb9387562057token\nkneltverb9387562057token\nkneltverb9387562057token\nkneelingverb9387562057token\ndreamverb9387562057token\ndreamsverb9387562057token\ndreamtverb9387562057token\ndreamedverb9387562057token\ndreamtverb9387562057token\ndreamedverb9387562057token\ndreamingverb9387562057token\nmeanverb9387562057token\nmeansverb9387562057token\nmeantverb9387562057token\nmeantverb9387562057token\nmeaningverb9387562057token\nspillverb9387562057token\nspillsverb9387562057token\nspiltverb9387562057token\nspilledverb9387562057token\nspiltverb9387562057token\nspilledverb9387562057token\nspillingverb9387562057token\nbuildverb9387562057token\nbuildsverb9387562057token\nbuiltverb9387562057token\nbuiltverb9387562057token\nbuildingverb9387562057token\nburnverb9387562057token\nburnsverb9387562057token\nburntverb9387562057token\nburnedverb9387562057token\nburntverb9387562057token\nburnedverb9387562057token\nburningverb9387562057token\nholdverb9387562057token\nholdsverb9387562057token\nheldverb9387562057token\nheldverb9387562057token\nholdingverb9387562057token\nsellverb9387562057token\nsellsverb9387562057token\nsoldverb9387562057token\nsoldverb9387562057token\nsellingverb9387562057token\ntellverb9387562057token\ntellsverb9387562057token\ntoldverb9387562057token\ntoldverb9387562057token\ntellingverb9387562057token\nfindverb9387562057token\nfindsverb9387562057token\nfoundverb9387562057token\nfoundverb9387562057token\nfindingverb9387562057token\ngrindverb9387562057token\ngrindsverb9387562057token\ngroundverb9387562057token\ngroundverb9387562057token\ngrindingverb9387562057token\nwindverb9387562057token\nwindsverb9387562057token\nwoundverb9387562057token\nwoundverb9387562057token\nwindingverb9387562057token\nbreakverb9387562057token\nbreaksverb9387562057token\nbrokeverb9387562057token\nbrokenverb9387562057token\nbreakingverb9387562057token\nchooseverb9387562057token\nchoosesverb9387562057token\nchoseverb9387562057token\nchosenverb9387562057token\nchoosingverb9387562057token\nfreezeverb9387562057token\nfreezesverb9387562057token\nfrozeverb9387562057token\nfrozenverb9387562057token\nfreezingverb9387562057token\nspeakverb9387562057token\nspeaksverb9387562057token\nspokeverb9387562057token\nspokenverb9387562057token\nspeakingverb9387562057token\nstealverb9387562057token\nstealsverb9387562057token\nstoleverb9387562057token\nstolenverb9387562057token\nstealingverb9387562057token\nwakeverb9387562057token\nwakesverb9387562057token\nwokeverb9387562057token\nwokenverb9387562057token\nwakingverb9387562057token\nweaveverb9387562057token\nweavesverb9387562057token\nwoveverb9387562057token\nwovenverb9387562057token\nweavingverb9387562057token\nariseverb9387562057token\narisesverb9387562057token\naroseverb9387562057token\narisenverb9387562057token\narisingverb9387562057token\ndriveverb9387562057token\ndrivesverb9387562057token\ndroveverb9387562057token\ndrivenverb9387562057token\ndrivingverb9387562057token\nrideverb9387562057token\nridesverb9387562057token\nrodeverb9387562057token\nriddenverb9387562057token\nridingverb9387562057token\nriseverb9387562057token\nrisesverb9387562057token\nroseverb9387562057token\nrisenverb9387562057token\nrisingverb9387562057token\nwriteverb9387562057token\nwritesverb9387562057token\nwroteverb9387562057token\nwrittenverb9387562057token\nwritingverb9387562057token\nbiteverb9387562057token\nbitesverb9387562057token\nbitverb9387562057token\nbittenverb9387562057token\nbitingverb9387562057token\nhideverb9387562057token\nhidesverb9387562057token\nhidverb9387562057token\nhiddenverb9387562057token\nhidingverb9387562057token\nslideverb9387562057token\nslidesverb9387562057token\nslidverb9387562057token\nsliddenverb9387562057token\nslidverb9387562057token\nslidingverb9387562057token\ngetverb9387562057token\ngetsverb9387562057token\ngotverb9387562057token\ngottenverb9387562057token\ngettingverb9387562057token\nforgetverb9387562057token\nforgetsverb9387562057token\nforgotverb9387562057token\nforgottenverb9387562057token\nforgettingverb9387562057token\ngiveverb9387562057token\ngivesverb9387562057token\ngaveverb9387562057token\ngivenverb9387562057token\ngivingverb9387562057token\nforgiveverb9387562057token\nforgivesverb9387562057token\nforgaveverb9387562057token\nforgivenverb9387562057token\nforgivingverb9387562057token\nforbidverb9387562057token\nforbidsverb9387562057token\nforbadeverb9387562057token\nforbadverb9387562057token\nforbiddenverb9387562057token\nforbiddingverb9387562057token\nfallverb9387562057token\nfallsverb9387562057token\nfellverb9387562057token\nfallenverb9387562057token\nfallingverb9387562057token\nswellverb9387562057token\nswellsverb9387562057token\nswoleverb9387562057token\nswelledverb9387562057token\nswollenverb9387562057token\nswellingverb9387562057token\ndiveverb9387562057token\ndivesverb9387562057token\ndoveverb9387562057token\ndivedverb9387562057token\ndivedverb9387562057token\ndivingverb9387562057token\nblowverb9387562057token\nblowsverb9387562057token\nblewverb9387562057token\nblownverb9387562057token\nblowingverb9387562057token\nflyverb9387562057token\nfliesverb9387562057token\nflewverb9387562057token\nflownverb9387562057token\nflyingverb9387562057token\ngrowverb9387562057token\ngrowsverb9387562057token\ngrewverb9387562057token\ngrownverb9387562057token\ngrowingverb9387562057token\nknowverb9387562057token\nknowsverb9387562057token\nknewverb9387562057token\nknownverb9387562057token\nknowingverb9387562057token\nthrowverb9387562057token\nthrowsverb9387562057token\nthrewverb9387562057token\nthrownverb9387562057token\nthrowingverb9387562057token\ndrawverb9387562057token\ndrawsverb9387562057token\ndrewverb9387562057token\ndrawnverb9387562057token\ndrawingverb9387562057token\nwithdrawverb9387562057token\nwithdrawsverb9387562057token\nwithdrewverb9387562057token\nwithdrawnverb9387562057token\nwithdrawingverb9387562057token\nshowverb9387562057token\nshowsverb9387562057token\nshowedverb9387562057token\nshownverb9387562057token\nshowingverb9387562057token\neatverb9387562057token\neatsverb9387562057token\nateverb9387562057token\neatenverb9387562057token\neatingverb9387562057token\nbeatverb9387562057token\nbeatsverb9387562057token\nbeatverb9387562057token\nbeatenverb9387562057token\nbeatingverb9387562057token\ntakeverb9387562057token\ntakesverb9387562057token\ntookverb9387562057token\ntakenverb9387562057token\ntakingverb9387562057token\nforsakeverb9387562057token\nforsakesverb9387562057token\nforsookverb9387562057token\nforsakenverb9387562057token\nforsakingverb9387562057token\nmistakeverb9387562057token\nmistakesverb9387562057token\nmistookverb9387562057token\nmistakenverb9387562057token\nmistakingverb9387562057token\nshakeverb9387562057token\nshakesverb9387562057token\nshookverb9387562057token\nshakenverb9387562057token\nshakingverb9387562057token\nmakeverb9387562057token\nmakesverb9387562057token\nmadeverb9387562057token\nmadeverb9387562057token\nmakingverb9387562057token\nswearverb9387562057token\nswearsverb9387562057token\nsworeverb9387562057token\nswornverb9387562057token\nswearingverb9387562057token\nwearverb9387562057token\nwearsverb9387562057token\nworeverb9387562057token\nwornverb9387562057token\nwearingverb9387562057token\ntearverb9387562057token\ntearsverb9387562057token\ntoreverb9387562057token\ntornverb9387562057token\ntearingverb9387562057token\nbearverb9387562057token\nbearsverb9387562057token\nboreverb9387562057token\nbornverb9387562057token\nbearingverb9387562057token\nstandverb9387562057token\nstandsverb9387562057token\nstoodverb9387562057token\nstoodverb9387562057token\nstandingverb9387562057token\nunderstandverb9387562057token\nunderstandsverb9387562057token\nunderstoodverb9387562057token\nunderstoodverb9387562057token\nunderstandingverb9387562057token\nbecomeverb9387562057token\nbecomesverb9387562057token\nbecameverb9387562057token\nbecomeverb9387562057token\nbecomingverb9387562057token\ncomeverb9387562057token\ncomesverb9387562057token\ncameverb9387562057token\ncomeverb9387562057token\ncomingverb9387562057token\nrunverb9387562057token\nrunsverb9387562057token\nranverb9387562057token\nrunverb9387562057token\nrunningverb9387562057token\ndigverb9387562057token\ndigsverb9387562057token\ndugverb9387562057token\ndugverb9387562057token\ndiggingverb9387562057token\nspinverb9387562057token\nspinsverb9387562057token\nspunverb9387562057token\nspunverb9387562057token\nspinningverb9387562057token\nstickverb9387562057token\nsticksverb9387562057token\nstuckverb9387562057token\nstuckverb9387562057token\nstickingverb9387562057token\nstrikeverb9387562057token\nstrikesverb9387562057token\nstruckverb9387562057token\nstruckverb9387562057token\nstrickenverb9387562057token\nstrikingverb9387562057token\ndoverb9387562057token\ndoesverb9387562057token\ndidverb9387562057token\ndoneverb9387562057token\ndoingverb9387562057token\ndoverb9387562057token not\ngoverb9387562057token\ngoesverb9387562057token\nwentverb9387562057token\ngoneverb9387562057token\ngoingverb9387562057token\nhaveverb9387562057token\nhaveverb9387562057token not\nhasverb9387562057token\nhasverb9387562057token not\nhadverb9387562057token\nhadverb9387562057token not\nhavingverb9387562057token\nhearverb9387562057token\nhearsverb9387562057token\nheardverb9387562057token\nheardverb9387562057token\nhearingverb9387562057token\nlayverb9387562057token\nlaysverb9387562057token\nlaidverb9387562057token\nlaidverb9387562057token\nlayingverb9387562057token\npayverb9387562057token\npaysverb9387562057token\npaidverb9387562057token\npaidverb9387562057token\npayingverb9387562057token\nsayverb9387562057token\nsaysverb9387562057token\nsaidverb9387562057token\nsaidverb9387562057token\nsayingverb9387562057token\nlieverb9387562057token\nliesverb9387562057token\nlayverb9387562057token\nlainverb9387562057token\nlyingverb9387562057token\nlightverb9387562057token\nlightsverb9387562057token\nlitverb9387562057token\nlightedverb9387562057token\nlitverb9387562057token\nlightedverb9387562057token\nlightingverb9387562057token\nloseverb9387562057token\nlosesverb9387562057token\nlostverb9387562057token\nlostverb9387562057token\nlosingverb9387562057token\nleaveverb9387562057token\nleavesverb9387562057token\nleftverb9387562057token\nleftverb9387562057token\nleavingverb9387562057token\nproveverb9387562057token\nprovesverb9387562057token\nprovedverb9387562057token\nprovenverb9387562057token\nprovedverb9387562057token\nprovingverb9387562057token\nreadverb9387562057token\nreadsverb9387562057token\nreadverb9387562057token\nreadverb9387562057token\nreadingverb9387562057token\nseeverb9387562057token\nseesverb9387562057token\nsawverb9387562057token\nseenverb9387562057token\nseeingverb9387562057token\nsewverb9387562057token\nsewsverb9387562057token\nsewedverb9387562057token\nsewnverb9387562057token\nsewedverb9387562057token\nsewingverb9387562057token\nshaveverb9387562057token\nshavesverb9387562057token\nshavedverb9387562057token\nshavenverb9387562057token\nshavedverb9387562057token\nshavingverb9387562057token\nshineverb9387562057token\nshinesverb9387562057token\nshinedverb9387562057token\nshoneverb9387562057token\nshiningverb9387562057token\nshootverb9387562057token\nshootsverb9387562057token\nshotverb9387562057token\nshotverb9387562057token\nshootingverb9387562057token\nwindverb9387562057token\nwinsverb9387562057token\nwonverb9387562057token\nwonverb9387562057token\nwinningverb9387562057token\nbeverb9387562057token\nisverb9387562057token\nisverb9387562057token not\nareverb9387562057token\nareverb9387562057token note\namverb9387562057token\nwasverb9387562057token\nwasverb9387562057token not\nwereverb9387562057token\nwereverb9387562057token not\nbeenverb9387562057token\nbeingverb9387562057token\nmustverb9387562057token\nmustn'tverb9387562057token\nuseverb9387562057token\nusesverb9387562057token\nsenseverb9387562057token\nsensesverb9387562057token\nsensedverb9387562057token\nlikeverb9387562057token\nlikedverb9387562057token\nlikingverb9387562057token",intraword1:"",intraword2:"",prefixes1:"",prefixes2:"",suffixes1:"",suffixes2:"",regex1:"/^(.+)$/\n/(starttoken8975928376|[.,!?]+)([^.,!?]+?verb9387562057token(?: not)?)([^.,!?]+)/g\n/verb9387562057token/g\n/\\s\\s/g\n/[ ]+/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))a/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))b/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))c/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))d/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))e/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))f/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))g/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))h/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))i/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))j/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))k/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))l/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))m/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))n/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))o/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))p/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))q/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))r/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))s/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))t/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))u/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))v/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))w/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))x/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))y/g\n/(starttoken8975928376|(?:[!.?]+[\\s]+))z/g\n/starttoken8975928376/g\n/yoda/g\n/ i[.!? ]/g",regex2:"starttoken8975928376$1\n$1 $3 $2\n\n \n \n$1A\n$1B\n$1C\n$1D\n$1E\n$1F\n$1G\n$1H\n$1I\n$1J\n$1K\n$1L\n$1M\n$1N\n$1O\n$1P\n$1Q\n$1R\n$1S\n$1T\n$1U\n$1V\n$1W\n$1X\n$1Y\n$1Z\n \nYoda\n I \n",rev_regex1:"",rev_regex2:"",ordering1:"",ordering2:""};e=S.phrases1.split("\n"),t=S.phrases2.split("\n"),r=S.words1.split("\n"),o=S.words2.split("\n"),s=S.intraword1.split("\n"),k=S.intraword2.split("\n"),b=S.prefixes1.split("\n"),v=S.prefixes2.split("\n"),g=S.suffixes1.split("\n"),a=S.suffixes2.split("\n"),l=S.regex1.split("\n"),d=S.regex2.split("\n"),h=S.rev_regex1.split("\n"),w=S.rev_regex2.split("\n"),p=S.ordering1.split("\n"),u=S.ordering2.split("\n")}catch(n){}return function(n,i){if(""==n)return"";var $,C="";if(0!==[].concat(e,t,r,o,s,k,b,v,g,a,l,d,h,w,p,u).join("").length){0,sentenceArray=n.split(/(\.)/g),sentenceArray=sentenceArray.filter(function(n){return""!==n});for(var L=0;L<sentenceArray.length;L++)if("."!==(n=sentenceArray[L]))if(""!==n.trim()){var N=!1;" "===n[0]&&(N=!0);var S=!1;n.trim()[0]===n.trim()[0].toUpperCase()&&(S=!0),n=E(p,u,j(l,d,z(x(g,a,A(b,v,m(r,o,c(e,t,(" "+y(s,k,n)+" ").toLowerCase().split("\n").join(" 985865568NEWLINETOKEN98758659 ")))))).split(f).join("").trim())).split(" 985865568NEWLINETOKEN98758659 ").join("\n").split(" 985865568NEWLINETOKEN98758659").join("\n").split("985865568NEWLINETOKEN98758659").join("\n").replace(/(\b\S+\b)[ ]+\b\1\b/gi,"$1 $1"),S&&(n=n[0].toUpperCase()+n.substr(1)),N&&(n=" "+n),C+=n,0}else C+=n;else C+=".";C=C.split("{{*DUPLICATE MARKER*}}").join(""),"undefined"!=typeof doApplySentenceCase&&!1!==doApplySentenceCase&&(C=C.replace(/.+?[\.\?\!](\s|$)/g,function(n){return null!==n.charAt(0).match(/[a-z]/g)?n.charAt(0).toUpperCase()+n.substr(1):n}),C=null!==($=C).charAt(0).match(/[a-z]/g)?$.charAt(0).toUpperCase()+$.slice(1):$)}else C=n;return C="backward"==i?O(C):q(C)}(n)}
