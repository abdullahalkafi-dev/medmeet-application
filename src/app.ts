import cors from "cors";
import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./routes";
import http from "http";
import cookieParser from "cookie-parser";
import { Morgan } from "./shared/morgen";
import admin from "firebase-admin";
import config from "./config";
const app = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

// Initialize Firebase Admin with environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    type: config.firebase.type,
    project_id: config.firebase.project_id,
    private_key_id: config.firebase.private_key_id,
    private_key: config.firebase.private_key?.replace(/\\n/g, '\n'),
    client_email: config.firebase.client_email,
    client_id: config.firebase.client_id,
    auth_uri: config.firebase.auth_uri,
    token_uri: config.firebase.token_uri,
    auth_provider_x509_cert_url: config.firebase.auth_provider_x509_cert_url,
    client_x509_cert_url: config.firebase.client_x509_cert_url,
    universe_domain: config.firebase.universe_domain,
  } as admin.ServiceAccount),
});
//body parser
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static("uploads"));

//router
app.use("/api/v1", router);

//live response
app.get("/", (req: Request, res: Response) => {
  res.send(
    '<h1 style="text-align:center; color:#A55FEF; font-family:Verdana;">Hey, How can I assist you today!</h1>',
  );
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});
export const server = http.createServer(app);

export default app;
