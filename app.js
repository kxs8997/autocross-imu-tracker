let conePositions = [];
let acceleration = { x: 0, y: 0, z: 0 };
let velocity = { x: 0, y: 0, z: 0 };

// Function to request motion permission and start logging IMU data
function startIMUTracking() {
    console.log("Checking if motion permission is required...");
    
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        console.log("Requesting permission for motion sensors...");
        // For iOS 13+ devices, request permission for motion data
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    console.log("Permission granted, starting IMU tracking.");
                    window.addEventListener('devicemotion', updateIMUData);
                } else {
                    alert('Permission to access motion data was denied. Please enable motion data in your browser settings.');
                }
            })
            .catch(error => {
                console.error("Error requesting motion permission: ", error);
            });
    } else if (typeof DeviceMotionEvent !== 'undefined') {
        console.log("No need to request permission, starting IMU tracking directly.");
        // For devices or browsers that do not require permission (non-iOS or older versions)
        window.addEventListener('devicemotion', updateIMUData);
    } else {
        alert("Your device does not support motion sensors or the browser does not allow access.");
        console.log("DeviceMotionEvent is not supported by this device or browser.");
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
        console.log("No acceleration data available.");
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
