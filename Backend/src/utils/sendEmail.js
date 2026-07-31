//logic for sending email to the user
import nodemailer from "nodemailer";
const sendEmail = async ({to,subject,text,html}) => {
try {
    //transporter is the object that will be used to send the email and knows how to talk to your email provider's SMTP server
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS
        }
    });
    const mailOptions = {
        from: `"AuthHub" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: html
    };

   const info = await transporter.sendMail(mailOptions);
} catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
}
}

export default sendEmail;
