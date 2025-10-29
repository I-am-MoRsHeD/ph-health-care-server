import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import { uptime } from 'process';
import { timeStamp } from 'console';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import { PaymentController } from './app/modules/payment/payment.controller';

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