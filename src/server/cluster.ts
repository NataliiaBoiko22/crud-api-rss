// import cluster from "cluster";
// import { cpus } from "os";
import { InMemoryDB } from "../database/inMemoryDatabase";
import { runServer } from "./app";
import cluster from "cluster";
import { cpus } from "os";

if (cluster.isPrimary) {
  console.log(`Master start ${process.pid}`);

  const numCPUs = cpus().length;
  let portCounter = 4001;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ PORT: portCounter });
    portCounter++;
  }

  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork({ PORT: portCounter });
    portCounter++;
  });
} else {
  console.log(`Worker run ${process.pid}`);
  const userDB = new InMemoryDB();
  runServer(userDB);
}
