let currentPos = { x: 0, y: 0, z: 0 }; // Current position in meters
let velocity = { x: 0, y: 0, z: 0 };   // Velocity in m/s
let acceleration = { x: 0, y: 0, z: 0 }; // Acceleration in m/s²
let filteredPos = { x: 0, y: 0, z: 0 }; // Kalman filtered position
let lastTimestamp = null;

// Kalman Filter parameters
let processNoise = 1e-5; // Q: process noise covariance (tuning parameter)
let measurementNoise = 1e-3; // R: measurement noise covariance (tuning parameter)
let uncertainty = { x: 1, y: 1, z: 1 }; // P: estimation uncertainty

function kalmanFilter(measurement, filtered, uncertainty, axis) {
    // Prediction step (we don't need an explicit velocity prediction since it's integrated directly)
    uncertainty[axis] += processNoise;

    // Kalman Gain
    let K = uncertainty[axis] / (uncertainty[axis] + measurementNoise);

    // Update position based on measurement
    filtered[axis] += K * (measurement - filtered[axis]);

    // Update uncertainty
    uncertainty[axis] *= (1 - K);

    return filtered[axis];
}

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

    let currentTimestamp = event.timeStamp; // Current time in milliseconds
    if (lastTimestamp === null) {
        lastTimestamp = currentTimestamp;
        return;
    }

    let deltaTime = (currentTimestamp - lastTimestamp) / 1000; // Time difference in seconds
    lastTimestamp = currentTimestamp;

    // Get acceleration data in m/s² (without gravity)
    acceleration.x = event.acceleration.x || 0;
    acceleration.y = event.acceleration.y || 0;
    acceleration.z = event.acceleration.z || 0;

    // Integrate acceleration to get velocity
    velocity.x += acceleration.x * deltaTime;
    velocity.y += acceleration.y * deltaTime;
    velocity.z += acceleration.z * deltaTime;

    // Integrate velocity to get position
    currentPos.x += velocity.x * deltaTime;
    currentPos.y += velocity.y * deltaTime;
    currentPos.z += velocity.z * deltaTime;

    // Apply Kalman filter to smooth the position
    filteredPos.x = kalmanFilter(currentPos.x, filteredPos.x, uncertainty, 'x');
    filteredPos.y = kalmanFilter(currentPos.y, filteredPos.y, uncertainty, 'y');
    filteredPos.z = kalmanFilter(currentPos.z, filteredPos.z, uncertainty, 'z');

    // Log the Kalman-filtered position for debugging
    console.log(`Filtered Position: X = ${filteredPos.x.toFixed(2)} m, Y = ${filteredPos.y.toFixed(2)} m, Z = ${filteredPos.z.toFixed(2)} m`);
}

function logPosition() {
    // Log the Kalman-filtered position
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += `Filtered Position: X = ${filteredPos.x.toFixed(2)} m, Y = ${filteredPos.y.toFixed(2)} m, Z = ${filteredPos.z.toFixed(2)} m<br>`;
}

// Event listeners for buttons
document.getElementById('requestPermission').addEventListener('click', requestPermission);
document.getElementById('logPosition').addEventListener('click', logPosition);

