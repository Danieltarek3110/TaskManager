const nodemailer = require("nodemailer");

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "18P1185@gmail.com",
        pass: "nnrj ijct gyah ciec", 
    },
    tls: {
        rejectUnauthorized: false 
    }
});

async function send(email , name) {
    const info = await transporter.sendMail({
        from: '"Daniel Tarek" <DanielTarek@gmail.com>',
        to: email,
        subject: "Account Created Successfully",
        text: `Hello ${name} , Welcome to my task manager app`,
        html: `<b>Hello ${name} , Welcome to my task manager app</b>`,
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = send
