const form = document.getElementById('uploadForm');
const status = document.getElementById('status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending emails...';

    const formData = new FormData(form);
    try {
        const response = await fetch('http://localhost:4000/send-emails', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            status.textContent = 'Emails sent successfully.';
        } else {
            throw new Error('Failed to send emails.');
        }
    } catch (error) {
        status.textContent = `Error: ${error.message}`;
    }
});


const progressBar = document.querySelector('.formbold-progress');
const fileInput = document.getElementById('file');
const form2 = document.querySelector('uploadForm');

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  
  // Display progress bar animation
  progressBar.style.width = '100%';

  // Simulate file upload (remove this in your actual code and replace it with your file upload logic)
  setTimeout(() => {
    // Reset progress bar width after upload is complete
    progressBar.style.width = '0';
    
    // Show popup/notification when upload is complete
    alert('File uploaded successfully. You can now proceed with sending emails.');
  }, 2000); // Simulate 2 seconds of upload time
});


