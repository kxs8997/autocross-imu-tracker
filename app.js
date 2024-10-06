let px = 50; // Position x
let py = 50; // Position y
let vx = 0.0; // Velocity x
let vy = 0.0; // Velocity y
const updateRate = 1/60; // Sensor refresh rate

function getAccel() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        console.log("Requesting permission for motion sensors...");
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === 'granted') {
                console.log("Permission granted, starting tracking...");
                trackOrientation();
            } else {
                console.log("Permission denied.");
                alert("Permission denied. Please enable motion access in your device settings.");
            }
        }).catch(error => {
            console.error("Error requesting permission: ", error);
        });
    } else {
        console.log("Permission not required, starting tracking...");
        trackOrientation();
    }
}

function trackOrientation() {
    // Add a listener to track smartphone orientation
    window.addEventListener('deviceorientation', (event) => {
        // Get rotation angles
        let rotation_degrees = event.alpha; // Rotation around z-axis
        let frontToBack_degrees = event.beta; // Rotation around x-axis
        let leftToRight_degrees = event.gamma; // Rotation around y-axis
        
        // Update velocity according to phone tilt
        vx = vx + leftToRight_degrees * updateRate * 2; // Double the tilt velocity for x-axis
        vy = vy + frontToBack_degrees * updateRate; // Tilt velocity for y-axis
        
        // Update position and clip within bounds
        px = px + vx * 0.5; // Adjust x position based on velocity
        if (px > 98 || px < 0) { 
            px = Math.max(0, Math.min(98, px)); // Clip between 0-98%
            vx = 0; // Stop movement when hitting the boundary
        }

        py = py + vy * 0.5; // Adjust y position based on velocity
        if (py > 98 || py < 0) { 
            py = Math.max(0, Math.min(98, py)); // Clip between 0-98%
            vy = 0; // Stop movement when hitting the boundary
        }
        
        // Update the position of the indicator dot
        let dot = document.getElementsByClassName("indicatorDot")[0];
        dot.style.left = px + "%";
        dot.style.top = py + "%";

        // Log position and velocity data
        let logDiv = document.getElementById('log');
        logDiv.innerHTML = `
            Position: X = ${px.toFixed(2)}%, Y = ${py.toFixed(2)}%<br>
            Velocity: X = ${vx.toFixed(2)}, Y = ${vy.toFixed(2)}<br>
            Orientation: Alpha = ${rotation_degrees.toFixed(2)}, Beta = ${frontToBack_degrees.toFixed(2)}, Gamma = ${leftToRight_degrees.toFixed(2)}
        `;
    });
}

// Start tracking when the button is clicked
document.getElementById('startTracking').addEventListener('click', getAccel);
