import express from "express";
import cors from "cors";
import routes from "./routes.js";
import morgan from "morgan";
import * as uuid from "uuid";
import { handleError } from "./models/error.models.js";

const app = express();

morgan.token("id", (req, res) => req.id || "-");

const assignId = (req, res, next) => {
    // generate 16-byte UUID
    if (!req.id) {
        req.id = uuid.v4().slice(0, 32);
    }
    res.setHeader("X-Request-Id", req.id);
    next();
};

app.use(cors());
app.use(assignId);
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
    app.use(
        morgan(
            ":id :method :url :status :response-time ms - :res[content-length] - :res[content-type] - " +
                ":req[user-agent] - :req[accept] - :req[host] - :req[origin] - :req[referer] - :req[content-length] - " +
                ":req[content-type]"
        )
    );
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to GoRent API",
        version: "1.0.0",
    });
});

app.use(handleError);

export default app;
