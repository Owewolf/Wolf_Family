import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { insertFamilyMemberSchema, insertPostSchema, insertBlockSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const member = await getStorage().authenticateFamilyMember(username, password);
      if (!member) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Return member data without password
      const { password: _, ...memberData } = member;
      res.json({ success: true, member: memberData });
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    res.json({ success: true, message: "Logged out successfully" });
  });

  // Family member routes
  app.get("/api/family-members", async (req, res) => {
    try {
      const members = await getStorage().getFamilyMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch family members" });
    }
  });

  app.get("/api/family-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const member = await getStorage().getFamilyMember(id);
      if (!member) {
        return res.status(404).json({ message: "Family member not found" });
      }
      
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch family member" });
    }
  });

  app.post("/api/family-members", async (req, res) => {
    try {
      const validatedData = insertFamilyMemberSchema.parse(req.body);
      const member = await getStorage().createFamilyMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create family member" });
      }
    }
  });

  // Post routes
  app.get("/api/posts", async (req, res) => {
    try {
      const { author, category } = req.query;
      
      let posts;
      if (author) {
        const authorId = parseInt(author as string);
        if (isNaN(authorId)) {
          return res.status(400).json({ message: "Invalid author ID" });
        }
        posts = await getStorage().getPostsByAuthor(authorId);
      } else if (category) {
        posts = await getStorage().getPostsByCategory(category as string);
      } else {
        posts = await getStorage().getPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const post = await getStorage().getPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await getStorage().createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create post" });
      }
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const validatedData = insertPostSchema.parse(req.body);
      const post = await getStorage().updatePost(id, validatedData);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update post" });
      }
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const success = await getStorage().deletePost(id);
      
      if (!success) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Block routes
  app.get("/api/blocks", async (req, res) => {
    try {
      const { pageId } = req.query;
      
      if (!pageId) {
        return res.status(400).json({ message: "pageId is required" });
      }
      
      const blocks = await getStorage().getBlocksByPage(pageId as string);
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blocks" });
    }
  });

  app.get("/api/blocks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const block = await getStorage().getBlock(id);
      if (!block) {
        return res.status(404).json({ message: "Block not found" });
      }
      
      res.json(block);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch block" });
    }
  });

  app.post("/api/blocks", async (req, res) => {
    try {
      const validatedData = insertBlockSchema.parse(req.body);
      const block = await getStorage().createBlock(validatedData);
      res.status(201).json(block);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create block" });
      }
    }
  });

  // Flight routes
  app.get("/api/flights", async (req, res) => {
    try {
      const { date, month, year } = req.query;
      
      if (date) {
        const flights = await getStorage().getFlightsByDate(date as string);
        res.json(flights);
      } else if (month && year) {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
        const flights = await getStorage().getFlightsByDateRange(startDate, endDate);
        res.json(flights);
      } else {
        const flights = await getStorage().getFlights();
        res.json(flights);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      res.status(500).json({ error: "Failed to fetch flights" });
    }
  });

  // Airport routes
  app.get("/api/airports", async (req, res) => {
    try {
      const airports = await getStorage().getAirports();
      res.json(airports);
    } catch (error) {
      console.error("Error fetching airports:", error);
      res.status(500).json({ error: "Failed to fetch airports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
