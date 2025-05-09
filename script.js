document.addEventListener("DOMContentLoaded", function () {
    // Get the canvas element and its context for drawing
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
  
    // Array to store circle objects
    let circles = [];
    // Index of the selected circle (if any)
    let selectedCircleIndex = null;
    // Flag for drag-and-drop functionality
    let isDragging = false;
    // Offsets for moving the circle (used during dragging)
    let offsetX, offsetY;
  
    // Function to draw all circles on the canvas
    function drawCircles() {
      // Clear the canvas before drawing new circles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach((circle, index) => {
        ctx.beginPath();
        // Draw a circle with center (x, y) and radius
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        // Set the color: sky blue for selected circle, yellow for others
        ctx.fillStyle = index === selectedCircleIndex ? "skyblue" : "yellow";
        ctx.fill();
      });
    }
  
    // Function to check if a point (x, y) is inside any circle
    function getCircleAt(x, y) {
      return circles.findIndex(circle => {
        const dx = x - circle.x;
        const dy = y - circle.y;
        // Return the index if the point is within the circle's radius
        return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
      });
    }
  
    // Event listener for mouse click: Add or select a circle
    canvas.addEventListener("mousedown", function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      const index = getCircleAt(x, y); // Check if click is inside a circle
      if (index !== -1) {
        // If a circle is clicked, select it and prepare for dragging
        selectedCircleIndex = index;
        const circle = circles[selectedCircleIndex];
        offsetX = x - circle.x;
        offsetY = y - circle.y;
        isDragging = true;
      } else {
        // If no circle is clicked, create a new one
        circles.push({ x, y, radius: 20 });
        selectedCircleIndex = circles.length - 1;
      }
      drawCircles(); // Redraw the circles after action
    });
  
    // Event listener for mouse movement: Move the selected circle if dragging
    canvas.addEventListener("mousemove", function (e) {
      if (isDragging && selectedCircleIndex !== null) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Update circle position based on mouse movement
        circles[selectedCircleIndex].x = x - offsetX;
        circles[selectedCircleIndex].y = y - offsetY;
        drawCircles(); // Redraw the circles
      }
    });
  
    // Event listener for mouse release: Stop dragging
    canvas.addEventListener("mouseup", function () {
      isDragging = false;
    });
  
    // Event listener for mouse wheel: Resize the selected circle
    canvas.addEventListener("wheel", function (e) {
      if (selectedCircleIndex !== null) {
        e.preventDefault(); // Prevent default scrolling behavior
        let circle = circles[selectedCircleIndex];
        // Increase or decrease the radius based on scroll direction
        let newRadius = circle.radius + (e.deltaY < 0 ? 2 : -2);
        // Ensure the radius doesn't go below a minimum size
        circle.radius = Math.max(5, newRadius);
        drawCircles(); // Redraw the circles
      }
    });
  
    // Event listener for keyboard input: Delete the selected circle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Delete" && selectedCircleIndex !== null) {
        // Remove the selected circle from the array
        circles.splice(selectedCircleIndex, 1);
        selectedCircleIndex = null; // Deselect circle
        drawCircles(); // Redraw the circles
      }
    });
  });
  