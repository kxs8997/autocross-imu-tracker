function requestPermission() {
    console.log('Requesting motion permission...');
    DeviceMotionEvent.requestPermission()
        .then(response => {
            if (response === 'granted') {
                console.log('Permission granted.');
                document.getElementById('logPosition').disabled = false;
            } else {
                console.log('Permission denied.');
            }
        })
        .catch(error => {
            console.error('Permission request failed: ', error);
        });
}

function logPosition() {
    console.log('Log Position button clicked.');
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += '<p>Logging position: (not yet implemented)</p>';
}

document.getElementById('requestPermission').addEventListener('click', requestPermission);
document.getElementById('logPosition').addEventListener('click', logPosition);
