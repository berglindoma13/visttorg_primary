import express, { Request, Response } from "express";
import next from "next";
import fileUpload from 'express-fileupload';

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    const Routes = require("./routes/index.tsx");

    server.use(express.json())

    // enable files upload
    server.use(fileUpload({
      createParentPath: true
    }));

    server.use("/", Routes(server));

    server.get("*", (req : Request, res : Response) => {
      return handle(req, res);
    });

    server.listen(PORT, () => {
      console.log(`> Ready on ${PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
