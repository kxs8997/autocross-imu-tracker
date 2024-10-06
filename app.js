let currentPos = { x: 0, y: 0, z: 0 }; // Current position in meters
let velocity = { x: 0, y: 0, z: 0 };   // Velocity in m/s
let acceleration = { x: 0, y: 0, z: 0 }; // Acceleration in m/s²
const updateRate = 1 / 60; // Assume update rate of 60 Hz, can be calculated dynamically

let hasLoggedInitial = false;
let lastTimestamp = null;

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
    if (!event.acceleration || !event.acceleration.x) return;

    let currentTimestamp = event.timeStamp; // Current time in milliseconds
    if (lastTimestamp === null) {
        lastTimestamp = currentTimestamp;
        return;
    }

    let deltaTime = (currentTimestamp - lastTimestamp) / 1000; // Time difference in seconds
    lastTimestamp = currentTimestamp;

    // Get the acceleration values in m/s² (without gravity)
    acceleration.x = event.acceleration.x;
    acceleration.y = event.acceleration.y;
    acceleration.z = event.acceleration.z;

    // Integrate acceleration to get velocity (v = v0 + a * dt)
    velocity.x += acceleration.x * deltaTime;
    velocity.y += acceleration.y * deltaTime;
    velocity.z += acceleration.z * deltaTime;

    // Integrate velocity to get position (x = x0 + v * dt)
    currentPos.x += velocity.x * deltaTime;
    currentPos.y += velocity.y * deltaTime;
    currentPos.z += velocity.z * deltaTime;

    // Log the current state
    console.log(`Position: X = ${currentPos.x.toFixed(2)} m, Y = ${currentPos.y.toFixed(2)} m, Z = ${currentPos.z.toFixed(2)} m`);
}

function logPosition() {
    if (!hasLoggedInitial) {
        hasLoggedInitial = true;
    }

    // Log the current position in meters
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += `Position: X = ${currentPos.x.toFixed(2)} m, Y = ${currentPos.y.toFixed(2)} m, Z = ${currentPos.z.toFixed(2)} m<br>`;
}

// Event listeners for buttons
document.getElementById('requestPermission').addEventListener('click', requestPermission);
document.getElementById('logPosition').addEventListener('click', logPosition);
