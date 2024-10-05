let conePositions = [];
let acceleration = { x: 0, y: 0, z: 0 };
let velocity = { x: 0, y: 0, z: 0 };

// Function to update acceleration and velocity
function updateIMUData(event) {
    acceleration.x = event.acceleration.x || 0;
    acceleration.y = event.acceleration.y || 0;
    acceleration.z = event.acceleration.z || 0;

    velocity.x += acceleration.x;
    velocity.y += acceleration.y;
    velocity.z += acceleration.z;
}

// Log cone position when the button is pressed
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

// Listen for motion events
window.addEventListener('devicemotion', updateIMUData);
