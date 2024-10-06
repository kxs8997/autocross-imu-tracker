let conePositions = [];
let acceleration = { x: 0, y: 0, z: 0 };
let velocity = { x: 0, y: 0, z: 0 };

// Function to request motion permission and start logging IMU data
function getAccel() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        console.log("Requesting permission for motion sensors...");
        // For iOS 13+ devices, request permission for motion data
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === 'granted') {
                console.log("Accelerometer permission granted.");
                startIMUTracking();
            } else {
                alert('Permission denied. Please enable motion access in settings.');
            }
        }).catch(error => {
            console.error("Error requesting motion permission: ", error);
            alert("An error occurred while requesting motion sensor access.");
        });
    } else if (typeof DeviceMotionEvent !== 'undefined') {
        console.log("Permission not required, starting IMU tracking directly.");
        // For devices that don't require permission (non-iOS or older versions)
        startIMUTracking();
    } else {
        alert("Your device does not support motion sensors or the browser does not allow access.");
        console.log("DeviceMotionEvent is not supported by this device or browser.");
    }
}

// Start tracking accelerometer data
function startIMUTracking() {
    window.addEventListener('devicemotion', event => {
        if (event.acceleration) {
            console.log("Acceleration Data: X=" + event.acceleration.x + ", Y=" + event.acceleration.y + ", Z=" + event.acceleration.z);

            // Update acceleration data
            acceleration.x = event.acceleration.x || 0;
            acceleration.y = event.acceleration.y || 0;
            acceleration.z = event.acceleration.z || 0;

            // Update velocity (simple integration for demonstration purposes)
            velocity.x += acceleration.x;
            velocity.y += acceleration.y;
            velocity.z += acceleration.z;

            console.log("Updated Velocity: X=" + velocity.x.toFixed(2) + ", Y=" + velocity.y.toFixed(2) + ", Z=" + velocity.z.toFixed(2));
        } else {
            console.log("No acceleration data available.");
        }
    });
}

// Function to log cone positions
function logConePosition() {
    let position = { x: velocity.x, y: velocity.y, z: velocity.z };
    conePositions.push(position);

    // Display the logged positions
    let logDiv = document.getElementById('log');
    logDiv.innerHTML = `Logged ${conePositions.length} cone(s): <br>`;
    conePositions.forEach((pos, index) => {
        logDiv.innerHTML += `Cone ${index + 1}: X: ${pos.x.toFixed(2)}, Y: ${pos.y.toFixed(2)}, Z: ${pos.z.toFixed(2)}<br>`;
    });
}

// Event listeners for buttons
document.getElementById('startTracking').addEventListener('click', getAccel);
document.getElementById('logCone').addEventListener('click', logConePosition);
