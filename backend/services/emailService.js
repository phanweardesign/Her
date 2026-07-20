function createTransporter() {
    const nodemailer = require("nodemailer");
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        throw new Error("Email service is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS to .env.");
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
    });
}

async function sendPasswordResetCode({ to, code }) {
    const transporter = createTransporter();
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from,
        to,
        subject: "Your Her password reset code",
        text: `Your Her password reset code is ${code}. It expires in 15 minutes. If you did not request this, you can ignore this email.`,
        html: `
            <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222">
                <h2 style="color:#5B3FD6">Her Password Reset</h2>
                <p>Use this code to reset your password:</p>
                <p style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:20px 0">${code}</p>
                <p>This code expires in <strong>15 minutes</strong>.</p>
                <p>If you did not request this, you can ignore this email.</p>
            </div>
        `
    });
}

module.exports = { sendPasswordResetCode };
