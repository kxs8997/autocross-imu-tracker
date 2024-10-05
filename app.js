let conePositions = [];
let acceleration = { x: 0, y: 0, z: 0 };
let velocity = { x: 0, y: 0, z: 0 };

// Function to request motion permission and start logging IMU data
function startIMUTracking() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // For iOS 13+ devices, request permission for motion data
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    window.addEventListener('devicemotion', updateIMUData);
                    console.log('Permission granted, IMU tracking started');
                } else {
                    console.log('Permission to access motion data denied.');
                }
            })
            .catch(console.error);
    } else {
        // For non-iOS devices or older versions
        window.addEventListener('devicemotion', updateIMUData);
        console.log('IMU tracking started');
    }
}

// Function to update acceleration and velocity
function updateIMUData(event) {
    if (event.acceleration) {
        console.log("Acceleration Data: ", event.acceleration);

        acceleration.x = event.acceleration.x || 0;
        acceleration.y = event.acceleration.y || 0;
        acceleration.z = event.acceleration.z || 0;

        // Update velocity (just a simple integration here, could be improved)
        velocity.x += acceleration.x;
        velocity.y += acceleration.y;
        velocity.z += acceleration.z;

        console.log("Updated Velocity: ", velocity);
    } else {
        console.log("No acceleration data available");
    }
}

// Function to log cone positions when button is pressed
document.getElementById('logCone').addEventListener('click', () => {
    let position = { x: velocity.x, y: velocity.y, z: velocity.z };
    conePositions.push(position);

    // Display the logged positions
    let logDiv = document.getElementById('log');
    logDiv.innerHTML = `Logged ${conePositions.length} cone(s): <br>`;
    conePositions.forEach((pos, index) => {
        logDiv.innerHTML += `Cone ${index + 1}: X: ${pos.x.toFixed(2)}, Y: ${pos.y.toFixed(2)}, Z: ${pos.z.toFixed(2)}<br>`;
    });
});

// Start IMU tracking when the page loads
window.onload = startIMUTracking;
