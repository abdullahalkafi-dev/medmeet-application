import colors from "colors";
import mongoose from "mongoose";

import { server } from "./app";
import config from "./config";
import seedSuperAdmin from "./DB";

import { errorLogger, logger } from "./shared/logger";
import { setupSocket } from "./app/socket/socket";
import redisClient from "./util/redisClient";
import { connectDB, gracefulShutdown } from "./util/dbConnection";

//uncaught exception
process.on("uncaughtException", error => {
  errorLogger.error("UnhandledException Detected", error, error);
  process.exit(1);
});

async function main() {
  try {
    // Connect to MongoDB with retry logic
    await connectDB();
    
    // Seed super admin after successful connection
    await seedSuperAdmin();

    const port =
      typeof config.port === "number" ? config.port : Number(config.port);
    await redisClient.connect();
    server.listen(port, config.ip_address as string, () => {
      logger.info(
        colors.yellow(`♻️  Application listening on port:${config.port}`),
      );
    });
    //socket
    setupSocket(server);
  } catch (error) {
    console.log(error);
    errorLogger.error(colors.red("🤢 Failed to connect Database"));
  }

  //handle unhandledRejection
  process.on("unhandledRejection", async (error) => {
    if (server) {
      server.close(async () => {
        errorLogger.error("UnhandledRejection Detected", error, error);
        await gracefulShutdown();
        process.exit(1);
      });
    } else {
      await gracefulShutdown();
      process.exit(1);
    }
  });

  // Graceful shutdown on SIGTERM and SIGINT
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(async () => {
      await gracefulShutdown();
      await redisClient.disconnect();
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(async () => {
      await gracefulShutdown();
      await redisClient.disconnect();
      process.exit(0);
    });
  });
}

main();

//SIGTERM
process.on("SIGTERM", () => {
  logger.info("SIGTERM IS RECEIVE");
  if (server) {
    server.close();
  }
});
