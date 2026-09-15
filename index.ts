import express, { type Express, type Request, type Response } from "express";
import cors from "cors";

import userRouter from "./routes/user.routes";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "API is running successfully",
  });
});

app.use("/users", userRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
