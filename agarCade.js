console.log('WELCOME TO THE AGAR-CADE!');

//Inject to talk to Agar dom
function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}

injectScript(chrome.extension.getURL('background.js'), 'body');


// Window Size
var screenX = window.innerWidth;
// var screenY = window.innerHeight;
var gameStarted = false;

// Game Audio
var gameAudio = new Audio();
var soundAudio = new Audio();
function playClip(file, loop) {
  gameAudio.src = chrome.extension.getURL(file);
  gameAudio.loop = loop;
  gameAudio.play();
}

function inGame() {
  return window.getComputedStyle(document.getElementById('setName')).display === 'none';
}

// Add name UI
function buildUI() {
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var wrapper = document.createElement('div');
  wrapper.id = 'setName';
  var letters = alphabet.split('').map(function(v, i) {
    return `<span ${i < 1 ? 'class="agar-selected"' : ''}>${v}</span>`;
  }).join('');
  wrapper.innerHTML = `<div id="chosenName"></div><div id="letters">${letters}<span>DEL</span><span>END</span></div>`;
  return wrapper;
}

function selectLetter(direction) {
  var letters = document.getElementById('letters');
  var selected = document.getElementsByClassName('agar-selected')[0];
  selected.className = '';
  if(direction === 'left') {
    if(selected.previousSibling) {
      selected.previousSibling.className = 'agar-selected';
    } else {
      letters.lastChild.className = 'agar-selected';
    }
  } else if (direction === 'right') {
    if(selected.nextSibling) {
      selected.nextSibling.className = 'agar-selected';
    } else {
      letters.firstChild.className = 'agar-selected';
    }
  }
}

  var startScreen = document.createElement('div');
  startScreen.id = 'startScreen';
  startScreen.innerHTML = `<img src="${chrome.extension.getURL('logo.png')}" id="logo" alt="Agar Logo"/><div id="insertCoin">Insert Coin</div></div>`;
  var nameUI = buildUI();
  var name = '';

  document.body.insertBefore(nameUI, document.body.lastChild.nextSibling);
  document.body.insertBefore(startScreen, document.body.lastChild.nextSibling);

  function mouseMoved(e) {
    if(!inGame()) {
      var x = e.clientX;
      var minX = screenX / 2 - 50;
      var maxX = minX + 100;
      // Move left
      if(x < minX) {
        selectLetter('left');
      }
      // Move right
      if(x > maxX) {
        selectLetter('right');
      }
    }
  }

  function addLetter(e) {
    if(e.keyCode === 32 && !inGame()) {
      var selected = document.getElementsByClassName('agar-selected')[0];
      var text = selected.innerText;
      if(text === 'END') {
        window.postMessage({command: 'updateName', name: name}, location.origin);
      } else if (text === 'DEL') {
        name = name.substr(0, name.length - 1);
        document.getElementById('chosenName').innerText = name;
      } else {
        name += text;
        document.getElementById('chosenName').innerText = name;
      }
    } else if (e.keyCode === 32 && !inGame()) {
      playClip('split.wav', false);
    } else if (e.keyCode === 87 && inGame()) {
      playClip('food.wav', false);
    } else if (e.keyCode === 81) {
      document.getElementById('insertCoin').style.display = 'none';
      document.getElementById('setName').style.display = 'block';
      gameStarted = true;
    }
  }

  var coins = 0;
  function insertCoin() {
    var coinCount = document.getElementById('insertCoin');
    coins++;
    coinCount.innerHTML = `Press Start<br>Credit ${coins}`;
  }

  function flashCoin() {
    if(coins > 0 && !gameStarted) {
      var coinContainer = document.getElementById('insertCoin');
      var visible = coinContainer.style.display;
      coinContainer.style.display = visible === 'none' ? 'block' : 'none';
    }
  }

  document.addEventListener('mousemove', mouseMoved);
  document.addEventListener('keydown', addLetter);
  document.addEventListener('click', insertCoin);

  function checkGame() {
    var overlays = document.getElementById('overlays');
    var visible = window.getComputedStyle(overlays);
    var setName = document.getElementById('setName');
    var startScreen = document.getElementById('startScreen');
    if(visible.display === 'none') {
      if(chrome.extension.getURL('game.mp3') !== gameAudio.src) {
        playClip('game.mp3', true);
      }
    } else {
      if(chrome.extension.getURL('intro.mp3') !== gameAudio.src) {
        playClip('intro.mp3', true);
      }
    }
    if(gameStarted) {
      setName.style.display = visible.display;
    }
    startScreen.style.display = visible.display;
  }

  // Flash insert coin
  window.setInterval(flashCoin, 1000);

  // Game check if playing or not
  window.setInterval(checkGame, 500);
