import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage, type Person } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { log } from "./vite";
import { fileURLToPath } from "url";
import path from "path";
import { randomUUID } from "crypto";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Session and Passport Setup ---

const MemStore = MemoryStore(session);
const sessionStore = new MemStore({
  checkPeriod: 86400000, // prune expired entries every 24h
});

// A simple function to check if the user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// A simple function to check if the user is an admin
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const personId = (req.user as any).id;
  const person = await storage.getPerson(personId);

  if (person && person.role === "admin") {
    return next();
  }

  res.status(403).json({ message: "Forbidden: Admin privileges required" });
};

// Passport setup
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      
      const isMatch = await storage.comparePassword(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }

      // Passport expects the user object which will be serialized/deserialized
      // We pass the minimal user object from storage
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


// --- Route Registration ---

export async function registerRoutes(app: Express): Promise<Server> {
  // Use session middleware
  app.use(session({
    secret: "A_VERY_SECRET_KEY_FOR_SESSIONS", // Should be in env var
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    store: sessionStore,
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // --- API Endpoints ---

  // /api/login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info.message || "Invalid credentials" });
      }
      req.logIn(user, async (err) => {
        if (err) return next(err);
        
        // Fetch person data to determine role
        const person = await storage.getPerson(user.id);
        const role = person?.role || 'none';
        const username = user.username;
        
        log(`User logged in: ${username} with role ${role}`, "auth");
        return res.status(200).json({ 
            message: "Login successful", 
            user: { id: user.id, username: user.username, role: role } 
        });
      });
    })(req, res, next);
  });

  // /api/logout
  app.post("/api/logout", (req: Request, res: Response, next: NextFunction) => {
    const username = (req.user as any)?.username;
    req.logout((err) => {
      if (err) return next(err);
      log(`User logged out: ${username}`, "auth");
      req.session.destroy((err) => {
        if (err) {
            log(`Error destroying session: ${err}`, "auth");
            return next(err);
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.status(200).json({ message: "Logout successful" });
      });
    });
  });
  
  // /api/status (A utility endpoint to check login status/role)
  app.get("/api/status", async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user as any;
        const person = await storage.getPerson(user.id);
        
        return res.status(200).json({ 
            isAuthenticated: true,
            user: { id: user.id, username: user.username, role: person?.role || 'none' } 
        });
    }
    res.status(200).json({ isAuthenticated: false });
  });


  // /api/persons - Publicly accessible to get the tree data (excluding sensitive info)
  app.get("/api/persons", async (req, res, next) => {
    try {
      await storage.getPersons(); // Ensure data is loaded/seeded
      const allPersons = await storage.getPersons();
      const isLoggedIn = req.isAuthenticated();
      const currentUserId = (req.user as any)?.id;
      
      const sanitizedPersons = allPersons.map(p => {
          const isCurrentUser = isLoggedIn && p.id === currentUserId;
          // Only expose WhatsApp if logged in AND it's their own record if we decide to be more strict
          // For simplicity, we'll expose WhatsApp to ANY logged in user for now.
          const whatsapp = isLoggedIn ? p.whatsapp : undefined; 
          
          return {
              id: p.id,
              firstName: p.firstName,
              lastName: p.lastName,
              age: p.age,
              residence: p.residence,
              occupation: p.occupation,
              bio: p.bio,
              role: p.role,
              fatherId: p.fatherId,
              motherId: p.motherId,
              spouseId: p.spouseId,
              sideRelations: p.sideRelations,
              whatsapp: whatsapp,
              // Admin needs full data, but we pass unsensitive subset only
          };
      });
      
      return res.status(200).json(sanitizedPersons);
    } catch (e) {
      next(e);
    }
  });

  // /api/persons (Admin-only: Create New Person)
  app.post("/api/persons", isAdmin, async (req, res, next) => {
      try {
          const personData = req.body;
          // Clean up empty strings from form to undefined/null for storage
          Object.keys(personData).forEach(key => {
              if (personData[key] === "") {
                  personData[key] = undefined;
              }
          });
          
          const newPerson = await storage.createPerson(
              personData, 
              personData.newPassword // Password passed separately
          );
          
          res.status(201).json(newPerson);
      } catch (e) {
          next(e);
      }
  });

  // /api/persons/:id (Admin/User-only: Update Person)
  app.patch("/api/persons/:id", isAuthenticated, async (req, res, next) => {
    try {
      const personId = req.params.id;
      const updates = req.body;
      const currentUserId = (req.user as any).id;
      const isAdminUser = (await storage.getPerson(currentUserId))?.role === 'admin';
      
      // Clean up empty strings from form to undefined/null for storage
      Object.keys(updates).forEach(key => {
          if (updates[key] === "") {
              updates[key] = undefined;
          }
      });
      
      // Authorization Check
      if (!isAdminUser && personId !== currentUserId) {
        // Restrict non-admin users to only update certain non-critical fields on their own profile.
        // For simplicity, this mock allows them to update any fields sent by the form.
        // A real implementation would filter updates here (e.g., block role/fatherId updates).
        if (personId !== currentUserId) {
            return res.status(403).json({ message: "Forbidden: Cannot edit other users' data." });
        }
      }
      
      const updatedPerson = await storage.updatePerson(personId, updates);

      if (updatedPerson) {
        log(`${isAdminUser ? "Admin" : "User"} updated person: ${updatedPerson.firstName} ${updatedPerson.lastName}`, "data");
        // Invalidate status query if role/username changed
        if (updates.role || updates.newUsername) {
            // Need to reload the current user session/status
            // Not strictly needed in this simplified mock but good practice.
        }
        return res.status(200).json(updatedPerson);
      }

      res.status(404).json({ message: "Person not found" });
    } catch (e) {
      next(e);
    }
  });
  
  // /api/persons/:id (Admin-only: Delete Person)
  app.delete("/api/persons/:id", isAdmin, async (req, res, next) => {
      try {
          const personId = req.params.id;
          const deleted = await storage.deletePerson(personId);
          
          if (deleted) {
              log(`Admin deleted person: ${personId}`, "admin");
              return res.status(204).end();
          }
          
          res.status(404).json({ message: "Person not found" });
      } catch (e) {
          next(e);
      }
  });
  
  // /api/export (Admin-only)
  app.get("/api/export", isAdmin, async (req, res) => {
    try {
        await storage.saveData(); // Ensure the latest data is in the file
        const filePath = path.join(__dirname, "data.json");
        
        res.download(filePath, "familytree_data.json", (err) => {
            if (err) {
                log(`Error downloading file: ${err}`, "admin");
                res.status(500).send({ message: "Could not export data." });
            }
        });
        log("Admin exported data", "admin");
    } catch (e) {
        log(`Error exporting data: ${e}`, "admin");
        res.status(500).json({ message: "Internal Server Error during export" });
    }
  });

  // /api/import (Admin-only: Placeholder - actual implementation would require multipart form handling)
  app.post("/api/import", isAdmin, async (req, res) => {
    // NOTE: A full implementation requires handling file uploads (multipart/form-data)
    log("Admin tried to import data (placeholder used)", "admin");
    res.status(501).json({ message: "Import functionality requires proper file upload middleware (not implemented in this mock)." });
  });
  
  
  // /api/change-password/:id (Admin-only to change ANY password)
  app.patch("/api/change-password/:id", isAdmin, async (req, res, next) => {
      try {
          const personId = req.params.id;
          const { newPassword } = req.body;
          
          if (!newPassword || newPassword.length < 1) {
              return res.status(400).json({ message: "New password is required." });
          }
          
          const personToUpdate = await storage.getPerson(personId);
          if (!personToUpdate || !personToUpdate.username) {
              return res.status(404).json({ message: "Person or associated user account not found." });
          }
          
          const newPasswordHash = await storage.hashPassword(newPassword);
          const success = await storage.updateUserPassword(personToUpdate.username, newPasswordHash);

          if (success) {
              log(`Admin changed password for: ${personToUpdate.username}`, "admin");
              return res.status(200).json({ message: "Password updated successfully." });
          }
          
          res.status(500).json({ message: "Failed to update password." });
      } catch (e) {
          next(e);
      }
  });


  const httpServer = createServer(app);

  return httpServer;
}
