console.log('WELCOME TO THE AGAR-CADE!');

// Window Size
var screenX = window.innerWidth;
var screenY = window.innerHeight;

// Remove agar info
// document.getElementById('helloContainer').style.display = 'none';

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

  var nameUI = buildUI();
  var name = '';
  document.body.insertBefore(nameUI, document.body.lastChild.nextSibling);

  function mouseMoved(e) {
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

  function addLetter(e) {
console.log('Adding Letter', e.keyCode);
    if(e.keyCode === 32 && window.getComputedStyle(document.getElementById('setName')).display !== 'none') {
      var selected = document.getElementsByClassName('agar-selected')[0];
      var text = selected.innerText;
      if(text === 'END') {
        var nick = document.getElementById('nick');
        var submit = document.getElementsByClassName('btn-play-guest')[0];
        nick.value = name;
        submit.click();
      } else if (text === 'DEL') {
        name = name.substr(0, name.length - 1);
        document.getElementById('chosenName').innerText = name;
      } else {
        name += text;
        document.getElementById('chosenName').innerText = name;
      }
    }
  }
  
  document.addEventListener('mousemove', mouseMoved);
  document.addEventListener('keydown', addLetter);
  
  function checkGame() {
    var overlays = document.getElementById('overlays');
    var visible = window.getComputedStyle(overlays);
    var setName = document.getElementById('setName');
    setName.style.display = visible.display;
  }

  // Game check if playing or not
  window.setInterval(checkGame, 500);
