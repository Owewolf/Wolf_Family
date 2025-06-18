import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { initializeStorage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  let server;
  
  // Initialize storage first
  try {
    await initializeStorage();
  } catch (error) {
    console.warn("Storage initialization failed, using memory fallback:", error);
  }
  
  try {
    server = await registerRoutes(app);
  } catch (error) {
    console.error("Failed to register routes:", error);
    process.exit(1);
  }

  // Attempt to seed the database with initial data (non-blocking)
  seedDatabase().catch(error => {
    console.error("Failed to seed database:", error);
    console.log("Continuing without seeding - database may be inaccessible");
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Try to serve on port 5000, fallback to available port
  // this serves both the API and the client.
  const preferredPort = 5000;
  
  // Function to find an available port
  const findAvailablePort = (startPort: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      const testServer = server.listen(startPort, "0.0.0.0", () => {
        const actualPort = (testServer.address() as any)?.port || startPort;
        testServer.close(() => resolve(actualPort));
      });
      
      testServer.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          // Try next port
          findAvailablePort(startPort + 1).then(resolve).catch(reject);
        } else {
          reject(err);
        }
      });
    });
  };

  try {
    const availablePort = await findAvailablePort(preferredPort);
    server.listen(availablePort, "0.0.0.0", () => {
      log(`serving on port ${availablePort}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
