import {createTransport} from 'nodemailer'

const sendMail = async(email, subject, data) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.Gmail,
            pass: process.env.Password,
        },
    });

    let html;
    
    // Check if this is a contact form submission
    if (data.phone && data.studentClass !== undefined) {
        // Contact form submission template
        html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #2c5aa0;
            margin-bottom: 20px;
            text-align: center;
        }
        .field {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        .field strong {
            color: #333;
            display: block;
            margin-bottom: 5px;
        }
        .field p {
            margin: 0;
            color: #666;
        }
        .message-box {
            background-color: #e3f2fd;
            border-left: 4px solid #2c5aa0;
            padding: 15px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Contact Form Submission</h1>
        <div class="field">
            <strong>Name:</strong>
            <p>${data.name}</p>
        </div>
        <div class="field">
            <strong>Phone:</strong>
            <p>${data.phone}</p>
        </div>
        <div class="field">
            <strong>Email:</strong>
            <p>${data.email}</p>
        </div>
        <div class="field">
            <strong>Student's Class:</strong>
            <p>${data.studentClass}</p>
        </div>
        <div class="message-box">
            <strong>Message:</strong>
            <p>${data.message}</p>
        </div>
        <p style="text-align: center; margin-top: 30px; color: #666;">
            This message was submitted through the Educare Institute contact form.
        </p>
    </div>
</body>
</html>`;
    } else {
        // OTP verification template (existing)
        html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: red;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .otp {
            font-size: 36px;
            color: #7b68ee; /* Purple text */
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name} your (One-Time Password) for your account verification is.</p>
        <p class="otp">${data.otp}</p> 
    </div>
</body>
</html>`;
    }

    await transport.sendMail({
        from: 'educareinstitutee@gmail.com',
        to: email,
        subject,
        html,
    });
};

export default sendMail;