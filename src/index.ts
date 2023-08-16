import express from "express";
import http from "http";
// import cors from "cors";
import csrf from "csrf";
import process from "process";
import os from "os";
import cluster from "cluster";
import pino from "pino";
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const app = express();

const _csrf = new csrf();

// app.use((req, res, next) => {
//   if (req.url === "/csrf/token") return next();
//   if (!req.get("token_CSRF")?.toString()) {
//     res.status(400).json({ error: "Error request token CSRF" });
//     return;
//   }
//   const rt = _csrf.verify(
//     "asdasodasdiuybaskjd",
//     req.get("token_CSRF")!.toString()
//   );
//   rt ? next() : res.status(400).json({ error: "Error request token CSRF" });
// });

// app.get("/csrf/token", (req, res) => {
//   const t = _csrf.create("asdasodasdiuybaskjd");
//   res.status(201);
//   res.json({ token: t });
// });

if (cluster.isPrimary) {
  const cpus = os.cpus().length / 2;

  logger.info(`🌿  Starting ${cpus} forks`);

  for (let index = 1; index <= cpus; index++) {
    cluster.fork({ CPUI: index });
  }
} else {
  app.post("/test", (req, res) => {
    // console.log(req.body);
    // console.log(req.headers);
    logger.info(`CPU:${process.env.CPUI}`);
    res.status(200);
    res.send();
  });

  http.createServer(app).listen(3000, () => {
    logger.info(`Running at 3000`);
  });
}
