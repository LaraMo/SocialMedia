/**
 * Config file
 */

// native packages
import path from "path";
import { fileURLToPath } from 'url';


import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv";
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import { PUBLIC_ASSETS } from "./middleware/constant.js";

/**
 * Config
 */
const filename = fileURLToPath(import.meta.url); // In Node.js, this is the file path (including the file:// protocol).
const dirname = path.dirname(filename);
const bodyParserParams = { limit: "30mb", extended: true };

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet()); // sets certain useful HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); // HTTP request logger middleware for node.js
app.use(bodyParser.json(bodyParserParams));
app.use(bodyParser.urlencoded(bodyParserParams));
app.use(cors());
app.use("/assets", express.static(path.join(dirname, PUBLIC_ASSETS)));


/**
 * Storage
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, PUBLIC_ASSETS)
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({ storage });

/**
 * Mongoose setup
 */
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(x => {
    app.listen(PORT, () => {
        console.log(`Server ${PORT} - has been connected`)
    })
}).catch(x => {
    console.log(`Connection wasnt established - ${x}}`)
})