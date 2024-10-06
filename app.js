let origin = { x: 0, y: 0, z: 0 }; // Initial position set as the origin
let currentPos = { x: 0, y: 0, z: 0 }; // Current position
let hasLoggedInitial = false; // To track the first log
let isTracking = false;

function requestPermission() {
    DeviceMotionEvent.requestPermission()
        .then(response => {
            if (response === 'granted') {
                document.getElementById('logPosition').disabled = false; // Enable log button
                window.addEventListener('devicemotion', handleMotionEvent);
                console.log("Permission granted, tracking enabled.");
            } else {
                console.log("Permission denied.");
            }
        })
        .catch(console.error);
}

function handleMotionEvent(event) {
    if (!event.acceleration) return;

    // Update the current position based on acceleration
    currentPos.x += event.acceleration.x || 0;
    currentPos.y += event.acceleration.y || 0;
    currentPos.z += event.acceleration.z || 0;
}

function logPosition() {
    if (!hasLoggedInitial) {
        // The first log is the origin
        origin.x = currentPos.x;
        origin.y = currentPos.y;
        origin.z = currentPos.z;
        hasLoggedInitial = true;
        console.log("Origin logged:", origin);
    }

    // Log the position relative to the origin
    let relativePos = {
        x: currentPos.x - origin.x,
        y: currentPos.y - origin.y,
        z: currentPos.z - origin.z,
    };

    // Display the log
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += `Position relative to origin: X = ${relativePos.x.toFixed(2)}, Y = ${relativePos.y.toFixed(2)}, Z = ${relativePos.z.toFixed(2)}<br>`;
}

// Add event listeners for buttons
document.getElementById('requestPermission').addEventListener('click', requestPermission);
document.getElementById('logPosition').addEventListener('click', logPosition);
