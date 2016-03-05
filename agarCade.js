console.log('WELCOME TO THE AGAR-CADE!');

// Window Size
var screenX = window.innerWidth;
var screenY = window.innerHeight;

// Remove agar info
document.getElementById('helloContainer').style.display = 'none';

// Add name UI
function buildUI() {
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var wrapper = document.createElement('div');
  wrapper.id = 'setName';
  var letters = alphabet.split('').map(function(v, i) {
    return `<span ${i < 1 ? 'class="agar-selected"' : ''}>${v}</span>`;
  }).join('');
  wrapper.innerHTML = `<div id="letters">${letters}<span>DEL</span><span>END</span></div><div id="chosenName"></div>`;
  return wrapper;
}

function selectLetter(direction) {
  var selected = document.getElementsByClassName('agar-selected')[0];
  if(direction === 'left') {
    if(selected.previousSibling) {
      selected.className = '';
      selected.previousSibling.className = 'agar-selected';
    }
  } else if (direction === 'right') {
    if(selected.nextSibling) {
      selected.className = '';
      selected.nextSibling.className = 'agar-selected';
    }
  }
}

window.onload = function() {
  var nameUI = buildUI();
  var name = '';
  document.body.insertBefore(nameUI, document.body.firstChild);

  function mouseMoved(e) {
    var x = e.clientX;
    var y = e.clientY;
    // Move left
    if(x < (screenX / 2)) {
      selectLetter('left');
    }
    // Move right
    if(x > (screenX / 2)) {
      selectLetter('right');
    }
  }

  function addLetter() {
    var selected = document.getElementsByClassName('agar-selected')[0];
    var text = selected.innerText;
    if(text === 'END') {
      var nick = document.getElementById('nick');
      var submit = document.getElementsByClassName('btn-play-guest')[0];
      nick.value = name;
      submit.click();
      document.getElementById('setName').style.display = 'none';
      document.removeEventListener('mousemove', mouseMoved);
      document.removeEventListener('click', addLetter);
      return false;
    } else if (text === 'DEL') {
      console.log('Delete a letter');
    } else {
      name += text;
      document.getElementById('chosenName').innerText = name;
    }
  }
  // Letter selection
  document.addEventListener('mousemove', mouseMoved);
  document.addEventListener('click', addLetter);
}
