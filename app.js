let currentPos = { x: 0, y: 0, z: 0 }; // Current position in meters
let velocity = { x: 0, y: 0, z: 0 };   // Velocity in m/s
let acceleration = { x: 0, y: 0, z: 0 }; // Acceleration in m/s²
let filteredPos = { x: 0, y: 0, z: 0 }; // Kalman filtered position
let rotationRate = { alpha: 0, beta: 0, gamma: 0 }; // Gyroscope data
let lastTimestamp = null;

// Kalman Filter parameters
let processNoise = 1e-6; // Q: process noise covariance
let measurementNoise = 1e-1; // R: measurement noise covariance (adjusted for less sensitivity)
let uncertainty = { x: 1, y: 1, z: 1 }; // P: estimation uncertainty
const velocityThreshold = 0.01; // Threshold for detecting when the phone is stationary

function kalmanFilter(measurement, filtered, uncertainty, axis) {
    // Prediction step
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
                window.addEventListener('deviceorientation', handleOrientationEvent); // Add gyroscope listener
                console.log("Permission granted, tracking enabled.");
            } else {
                console.log("Permission denied.");
            }
        })
        .catch(console.error);
}

function handleMotionEvent(event) {
    if (!event.acceleration) return;

    let currentTimestamp = event.timeStamp;
    if (lastTimestamp === null) {
        lastTimestamp = currentTimestamp;
        return;
    }

    let deltaTime = (currentTimestamp - lastTimestamp) / 1000; // Time in seconds
    lastTimestamp = currentTimestamp;

    // Get acceleration data (without gravity)
    acceleration.x = event.acceleration.x || 0;
    acceleration.y = event.acceleration.y || 0;
    acceleration.z = event.acceleration.z || 0;

    // Integrate acceleration to get velocity
    velocity.x += acceleration.x * deltaTime;
    velocity.y += acceleration.y * deltaTime;
    velocity.z += acceleration.z * deltaTime;

    // Zero-velocity assumption: Reset velocity when it drops below a small threshold
    if (Math.abs(velocity.x) < velocityThreshold) velocity.x = 0;
    if (Math.abs(velocity.y) < velocityThreshold) velocity.y = 0;
    if (Math.abs(velocity.z) < velocityThreshold) velocity.z = 0;

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

function handleOrientationEvent(event) {
    // Gyroscope data (rotation rate around axes)
    rotationRate.alpha = event.alpha || 0;
    rotationRate.beta = event.beta || 0;
    rotationRate.gamma = event.gamma || 0;

    // Log gyroscope data
    console.log(`Gyroscope: Alpha = ${rotationRate.alpha.toFixed(2)}°, Beta = ${rotationRate.beta.toFixed(2)}°, Gamma = ${rotationRate.gamma.toFixed(2)}°`);
}

function logPosition() {
    // Log the Kalman-filtered position
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += `Filtered Position: X = ${filteredPos.x.toFixed(2)} m, Y = ${filteredPos.y.toFixed(2)} m, Z = ${filteredPos.z.toFixed(2)} m<br>`;
}

// Event listeners for buttons
document.getElementById('requestPermission').addEventListener('click', requestPermission);
document.getElementById('logPosition').addEventListener('click', logPosition);
