// Called sometime after postMessage is called
function receiveMessage(event)
{
  // Do we trust the sender of this message?
  if (event.origin !== location.origin) {
    return;
  }

  switch (event.data.command) {
    case 'updateName':
      console.log('[UPDATING NAME]');
      setNick(event.data.name);
      break;
    default:

  }
}

window.addEventListener("message", receiveMessage, false);
