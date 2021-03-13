import { bootstrapWorker } from "@vendure/core";
import { config } from "./vendure-config";

bootstrapWorker(config)
  .then((worker) => worker.startJobQueue())
  .catch((err: any) => {
    console.log(err);
    process.exit(1);
  });
