import * as nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, text: string) {
    console.log(to, subject, text);
    
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mirxonjon2003@gmail.com', // o'z gmail manzilingiz
        pass: 'swdxsmklwocwwean', // Gmail uchun "App Password" (quyida tushuntiraman)
      },
    });

    const mailOptions = {
      from: 'mirxonjon2003@gmail.com',
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email yuborildi: ', info.response);
    return info;
  } catch (error) {
    console.error('Email yuborishda xatolik: ', error);
    throw error;
  }
}
