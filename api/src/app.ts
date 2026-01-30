import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import { generalRateLimiter } from "./middlewares/rateLimiter";
import morganLogger from "./core/logger/morgan.logger";
import errorHandler from "./middlewares/errorHandler.middleware";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());
// app.use(generalRateLimiter);
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
// app.use("/qr", express.static(path.join(__dirname, "public", "qr")))
app.use(cookieParser());
app.use(
  express.json()
);
app.use(express.urlencoded({ extended: true }));
app.use(morganLogger);

// /api/v1/{endpoint}
app.use("/api/v1/auth", require("./modules/auth/auth.route").default);
app.use("/api/v1/visitation", require("./modules/visitation/visitaion.route").default);
app.use("/api/v1/admin", require("./modules/admin/admin.route").default);
app.use("/api/v1/role", require("./modules/roles/role.route").default);
app.use("/api/v1/department", require("./modules/department/department.route").default);
app.use("/api/v1/menu", require("./modules/menu/menu.route").default);

app.get("/", (req, res) => {
  res.send("hey from VMS");
});
app.use("*name", (req, res) => {
  res.send("NO ENDPOINS IS THERE ");
});
app.use(errorHandler);

export default app;
