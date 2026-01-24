import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: '必須項目（お名前、メールアドレス、内容）が入力されていません。' });
    }

    // Transporter configuration (from .env)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Email content
    const mailOptions = {
        from: `"${name}" <${email}>`, // Note: Many SMTP providers override this to the authenticated user
        to: process.env.EMAIL_TO, // Where to send the contact form submissions
        replyTo: email,
        subject: `【お問い合わせ】${subject || '件名なし'}`,
        text: `
名前: ${name}
メールアドレス: ${email}
件名: ${subject}

お問い合わせ内容:
${message}
        `,
        html: `
<h3>お問い合わせがありました</h3>
<p><strong>名前:</strong> ${name}</p>
<p><strong>メールアドレス:</strong> ${email}</p>
<p><strong>件名:</strong> ${subject}</p>
<hr>
<p><strong>お問い合わせ内容:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'お問い合わせを受け付けました。' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: '送信に失敗しました。サーバーの設定をご確認ください。' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
