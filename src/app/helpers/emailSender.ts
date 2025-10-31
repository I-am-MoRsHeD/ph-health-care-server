import nodemailer from 'nodemailer'
import config from '../../config';


const emailSender = async (
    email: string,
    html: string
) => {
    const transporter = nodemailer.createTransport({
        secure: true,
        auth: {
            user: config.EMAIL_SENDER.SMTP_USER,
            pass: config.EMAIL_SENDER.SMTP_PASS
        },
        host: config.EMAIL_SENDER.SMTP_HOST,
        port: Number(config.EMAIL_SENDER.SMTP_PORT),
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"PH Health Care" <mdmorshed0187@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Password Link", // Subject line
        //text: "Hello world?", // plain text body
        html, // html body
    });

}

export default emailSender;