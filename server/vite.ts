import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // سنضيف هذا الـ import للضرورة
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

// تعريف __dirname بشكل صحيح لبيئة ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}


export function serveStatic(app: Express) {
  // استخدام path.join مع المسار المطلق لنقطة الدخول (التي تكون عادةً في dist/index.js)
  // ونعود خطوة للخلف للوصول إلى public.
  // في Vercel، كل شيء يكون مدمجًا، لذا يجب أن يكون المسار من نقطة البناء.
  
  // path.join(__dirname, "public") تشير إلى: (dist/) + public
  const distPath = path.join(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    // يجب أن يكون هذا الخطأ فقط إذا لم يتم البناء بشكل صحيح
    throw new Error(
      `Could not find the build directory at expected path: ${distPath}, make sure to build the client first (check if dist/public exists locally).`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html")); // استخدام path.join لـ index.html أيضًا
  });
}
