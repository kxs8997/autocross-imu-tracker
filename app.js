let px = 50; // Position x in percentage (centered initially)
let py = 50; // Position y in percentage
let vx = 0.0; // Velocity x
let vy = 0.0; // Velocity y
let ax = 0.0; // Acceleration x
let ay = 0.0; // Acceleration y
const updateRate = 1/60; // Update rate for sensor in seconds

let isTracking = false;
let lastTimestamp = null;

// Function to request motion sensor access and start tracking
function getAccel() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        console.log("Requesting permission for motion sensors...");
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === 'granted') {
                console.log("Permission granted, starting tracking...");
                startTracking();
            } else {
                alert("Permission denied. Please enable motion access in your device settings.");
            }
        }).catch(error => {
            console.error("Error requesting permission: ", error);
        });
    } else {
        console.log("Permission not required, starting tracking...");
        startTracking();
    }
}

// Function to start tracking the phone's movement using the accelerometer
function startTracking() {
    isTracking = true;

    // Add a listener for device motion (accelerometer data)
    window.addEventListener('devicemotion', (event) => {
        if (!isTracking) return;

        let currentTimestamp = event.timeStamp; // Get the current timestamp
        if (lastTimestamp === null) {
            lastTimestamp = currentTimestamp;
            return;
        }

        let deltaTime = (currentTimestamp - lastTimestamp) / 1000; // Time in seconds since the last update
        lastTimestamp = currentTimestamp;

        // Get the acceleration data
        if (event.acceleration) {
            ax = event.acceleration.x || 0;
            ay = event.acceleration.y || 0;

            // Integrate acceleration to get velocity
            vx += ax * deltaTime;
            vy += ay * deltaTime;

            // Integrate velocity to get position
            px = px + vx * deltaTime * 50; // Adjust x position based on velocity
            py = py + vy * deltaTime * 50; // Adjust y position based on velocity

            // Clip positions within 0% to 100% bounds (stay within the visible area)
            px = Math.max(0, Math.min(100, px));
            py = Math.max(0, Math.min(100, py));

            // Log the movement for debugging
            let logDiv = document.getElementById('log');
            logDiv.innerHTML = `
                Position: X = ${px.toFixed(2)}%, Y = ${py.toFixed(2)}%<br>
                Velocity: X = ${vx.toFixed(2)}, Y = ${vy.toFixed(2)}<br>
                Acceleration: X = ${ax.toFixed(2)}, Y = ${ay.toFixed(2)}
            `;
        }
    });
}

// Function to log the current position as an orange dot
function logPosition() {
    if (!isTracking) return;

    // Create a new dot at the current position
    let dot = document.createElement('div');
    dot.className = 'logDot';
    dot.style.left = px + "%";
    dot.style.top = py + "%";

    // Add the dot to the tracking area
    let trackingArea = document.getElementById('trackingArea');
    trackingArea.appendChild(dot);
}

// Start tracking when the "Start Tracking" button is clicked
document.getElementById('startTracking').addEventListener('click', getAccel);

// Log position when the "Log Position" button is clicked
document.getElementById('logPosition').addEventListener('click', logPosition);
