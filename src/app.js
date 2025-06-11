import express from "express";
import cors from "cors";
import routes from "./routes.js";
import morgan from "morgan";
import * as uuid from "uuid";
import swaggerUi from "swagger-ui-express";
import { handleError } from "./models/error.models.js";
import dotenv from "dotenv";

import document from "../docs/swagger-ui.json" with { type: "json" };
dotenv.config();

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
if (process.env.NODE_ENV === "development") {
    app.use(assignId);
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
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(document, {
        explorer: true,
        customSiteTitle: "GoRent API Documentation"
    })
);
app.use("/api", routes);
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to GoRent API",
        version: "1.0.0",
    });
});

app.use(handleError);

export default app;
