import path from "path";
import express from "express";
import colors from "colors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
// import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import logger, { systemLogStream } from "./middleware/loggerMiddleware.js";
// import { requestDecryption, responseEncryption } from './middleware/encryptionMiddleware.js';

const port = process.env.PORT || 5000;


connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logger);
// app.use(requestDecryption);
// app.use(responseEncryption);



app.use("/users", userRoutes);
// app.use('/upload', uploadRoutes);


// const __dirname = path.resolve();
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use(logger,notFound);
app.use(logger,errorHandler);

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
      .bold,
  );
  systemLogStream.write(
    `Server running in ${
      process.env.NODE_ENV
    } mode on port ${port} at ${new Date().toISOString()}\n`,
  );
});

export default app;
