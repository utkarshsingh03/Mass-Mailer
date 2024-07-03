const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');


const app = express();
const port = 4000;
app.use(cors());
// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Function to send emails using the API
async function sendEmail(recipientEmail, recipientName) {
    const api_url = "http://4.240.64.132:3000/send-email";
    const message = `Dear ${recipientName},\n\nThis is a customized email message for you.`;

    const payload = {
        recipientEmail,
        subject: "Customized Email",
        message
    };

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log(`Email sent successfully to ${recipientEmail}`);
        } else {
            console.error(`Failed to send email to ${recipientEmail}: ${await response.text()}`);
        }
    } catch (error) {
        console.error(`Error sending email to ${recipientEmail}:`, error);
    }
}

// Endpoint to handle CSV file uploads and send emails
app.post('/send-emails', upload.single('csvFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filename = req.file.path;
    const emails = [];

    fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (row) => {
            
            const { email, name } = row;
            emails.push({ email, name });
        })
        .on('end', () => {
            fs.unlinkSync(filename); // Delete the uploaded file
            emails.forEach(({ email, name }) => {
                sendEmail(email, name);
            });

            res.status(200).send('Emails sent successfully.');
        })
        .on('error', (error) => {
            console.error('Error processing CSV file:', error);
            res.status(500).send('Error processing CSV file.');
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
