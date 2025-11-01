import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import { PaymentController } from './app/modules/payment/payment.controller';
import cron from 'node-cron';
import { AppointmentService } from './app/modules/appointment/appointment.service';

const app: Application = express();
// for stripe payment
app.post("/api/webhook",
    express.raw({ type: "application/json" }),
    PaymentController.handleStripeWebhook);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

cron.schedule('* * * * *', () => {
    try {
        console.log("Node Cron called at", new Date());
        AppointmentService.cancelUnpaidAppointments();
    } catch (error) {
        console.error(error);
    }
});

app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Health Care is running..",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});


app.use(globalErrorHandler);

app.use(notFound);

export default app;