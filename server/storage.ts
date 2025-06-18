import { 
  users, 
  familyMembers, 
  posts, 
  blocks,
  flights,
  airports,
  type User, 
  type InsertUser,
  type FamilyMember,
  type InsertFamilyMember,
  type Post,
  type InsertPost,
  type Block,
  type InsertBlock,
  type Flight,
  type InsertFlight,
  type Airport,
  type InsertAirport
} from "@shared/schema";
import { db } from "./db";
import { eq, gte, lte, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Family member methods
  getFamilyMembers(): Promise<FamilyMember[]>;
  getFamilyMember(id: number): Promise<FamilyMember | undefined>;
  getFamilyMemberByUsername(username: string): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  authenticateFamilyMember(username: string, password: string): Promise<FamilyMember | null>;

  // Post methods
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  getPostsByAuthor(authorId: number): Promise<Post[]>;
  getPostsByCategory(category: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | null>;
  deletePost(id: number): Promise<boolean>;

  // Block methods
  getBlocksByPage(pageId: string): Promise<Block[]>;
  getBlock(id: number): Promise<Block | undefined>;
  createBlock(block: InsertBlock): Promise<Block>;

  // Flight methods
  getFlights(): Promise<Flight[]>;
  getFlightsByDateRange(startDate: string, endDate: string): Promise<Flight[]>;
  getFlightsByDate(date: string): Promise<Flight[]>;
  createFlight(flight: InsertFlight): Promise<Flight>;

  // Airport methods
  getAirports(): Promise<Airport[]>;
  getAirport(code: string): Promise<Airport | undefined>;
  createAirport(airport: InsertAirport): Promise<Airport>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private familyMembers: Map<number, FamilyMember>;
  private posts: Map<number, Post>;
  private blocks: Map<number, Block>;
  private currentUserId: number;
  private currentFamilyMemberId: number;
  private currentPostId: number;
  private currentBlockId: number;

  constructor() {
    this.users = new Map();
    this.familyMembers = new Map();
    this.posts = new Map();
    this.blocks = new Map();
    this.currentUserId = 1;
    this.currentFamilyMemberId = 1;
    this.currentPostId = 1;
    this.currentBlockId = 1;

    // Initialize with sample family members
    this.initializeFamilyMembers();
    this.initializePosts();
    this.initializeBlocks();
  }

  private initializeFamilyMembers() {
    const members = [
      {
        name: "Steven",
        role: "Farm Owner & Head of Operations",
        description: "Head of the farm operations with years of experience in sustainable agriculture.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        color: "hsl(140, 40%, 30%)",
        username: "steven",
        password: "123",
        isAdmin: true
      },
      {
        name: "Liesel",
        role: "Wife & Family Coordinator",
        description: "Manages the family activities and coordinates farm operations.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        color: "hsl(340, 60%, 50%)",
        username: "liesel",
        password: "123",
        isAdmin: false
      },
      {
        name: "Farrah",
        role: "Daughter & Animal Care Enthusiast",
        description: "Our daughter who loves taking care of the farm animals and learning about agriculture.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        color: "hsl(320, 70%, 60%)",
        username: "farrah",
        password: "123",
        isAdmin: false
      },
      {
        name: "Carter",
        role: "Son & Future Farmer",
        description: "Our son who is eager to learn about farming and help with daily operations.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        color: "hsl(200, 70%, 50%)",
        username: "carter",
        password: "123",
        isAdmin: false
      }
    ];

    members.forEach(member => {
      const id = this.currentFamilyMemberId++;
      this.familyMembers.set(id, { ...member, id });
    });
  }

  private initializePosts() {
    const samplePosts = [
      {
        title: "Perfect Steak and Potatoes Night",
        content: "What a wonderful evening! I decided to treat the family to a hearty steak and potatoes dinner tonight. There's something so satisfying about cooking a meal from scratch using ingredients from our own farm.",
        excerpt: "What a wonderful evening! I decided to treat the family to a hearty steak and potatoes dinner tonight...",
        authorId: 2,
        category: "family",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date().toISOString()
      },
      {
        title: "First Hunting Trip to Grahamstown",
        content: "Dad took me on my first real hunting trip to Grahamstown today and it was AMAZING! We left super early in the morning when it was still dark, and I felt like a real hunter with all the gear and everything.",
        excerpt: "Dad took me on my first real hunting trip to Grahamstown today and it was AMAZING!...",
        authorId: 4,
        category: "adventure",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];

    samplePosts.forEach(post => {
      const id = this.currentPostId++;
      this.posts.set(id, { ...post, id, imageUrl: post.imageUrl || null });
    });
  }

  private initializeBlocks() {
    const blocks = [
      {
        pageId: "home",
        type: "hero",
        title: "Welcome to Wolf Family Farm",
        content: "Our family farm brings together technology, tradition, and love for the land.",
        order: 1,
        data: null,
        imageUrl: null
      }
    ];

    blocks.forEach(block => {
      const id = this.currentBlockId++;
      this.blocks.set(id, { ...block, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Family member methods
  async getFamilyMembers(): Promise<FamilyMember[]> {
    return Array.from(this.familyMembers.values());
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    return this.familyMembers.get(id);
  }

  async createFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const id = this.currentFamilyMemberId++;
    const member: FamilyMember = { ...insertMember, id, isAdmin: insertMember.isAdmin || false };
    this.familyMembers.set(id, member);
    return member;
  }

  async getFamilyMemberByUsername(username: string): Promise<FamilyMember | undefined> {
    return Array.from(this.familyMembers.values()).find(member => member.username === username);
  }

  async authenticateFamilyMember(username: string, password: string): Promise<FamilyMember | null> {
    const member = await this.getFamilyMemberByUsername(username);
    if (member && member.password === password) {
      return member;
    }
    return null;
  }

  // Post methods
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostsByAuthor(authorId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = { ...insertPost, id, imageUrl: insertPost.imageUrl || null };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updateData: Partial<InsertPost>): Promise<Post | null> {
    const existingPost = this.posts.get(id);
    if (!existingPost) {
      return null;
    }
    
    const updatedPost: Post = {
      ...existingPost,
      ...updateData,
      id, // Ensure ID doesn't change
      imageUrl: updateData.imageUrl || existingPost.imageUrl
    };
    
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Block methods
  async getBlocksByPage(pageId: string): Promise<Block[]> {
    return Array.from(this.blocks.values())
      .filter(block => block.pageId === pageId)
      .sort((a, b) => a.order - b.order);
  }

  async getBlock(id: number): Promise<Block | undefined> {
    return this.blocks.get(id);
  }

  async createBlock(insertBlock: InsertBlock): Promise<Block> {
    const id = this.currentBlockId++;
    const block: Block = { 
      ...insertBlock, 
      id,
      data: insertBlock.data || null,
      title: insertBlock.title || null,
      content: insertBlock.content || null,
      imageUrl: insertBlock.imageUrl || null,
      order: insertBlock.order || 0
    };
    this.blocks.set(id, block);
    return block;
  }

  // Flight methods (stub implementations for MemStorage)
  async getFlights(): Promise<Flight[]> {
    return [];
  }

  async getFlightsByDateRange(startDate: string, endDate: string): Promise<Flight[]> {
    return [];
  }

  async getFlightsByDate(date: string): Promise<Flight[]> {
    return [];
  }

  async createFlight(flight: InsertFlight): Promise<Flight> {
    throw new Error("Flight operations not supported in MemStorage");
  }

  // Airport methods (stub implementations for MemStorage)
  async getAirports(): Promise<Airport[]> {
    return [];
  }

  async getAirport(code: string): Promise<Airport | undefined> {
    return undefined;
  }

  async createAirport(airport: InsertAirport): Promise<Airport> {
    throw new Error("Airport operations not supported in MemStorage");
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getFamilyMembers(): Promise<FamilyMember[]> {
    return db.select().from(familyMembers);
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    const result = await db.select().from(familyMembers).where(eq(familyMembers.id, id));
    return result[0];
  }

  async createFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const result = await db.insert(familyMembers).values(insertMember).returning();
    return result[0];
  }

  async getFamilyMemberByUsername(username: string): Promise<FamilyMember | undefined> {
    const result = await db.select().from(familyMembers).where(eq(familyMembers.username, username));
    return result[0];
  }

  async authenticateFamilyMember(username: string, password: string): Promise<FamilyMember | null> {
    const member = await this.getFamilyMemberByUsername(username);
    if (member && member.password === password) {
      return member;
    }
    return null;
  }

  async getPosts(): Promise<Post[]> {
    return db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPost(id: number): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0];
  }

  async getPostsByAuthor(authorId: number): Promise<Post[]> {
    return db.select().from(posts).where(eq(posts.authorId, authorId)).orderBy(desc(posts.createdAt));
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return db.select().from(posts).where(eq(posts.category, category)).orderBy(desc(posts.createdAt));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(insertPost).returning();
    return result[0];
  }

  async updatePost(id: number, updateData: Partial<InsertPost>): Promise<Post | null> {
    const result = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();
    return result[0] || null;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getBlocksByPage(pageId: string): Promise<Block[]> {
    return db.select().from(blocks).where(eq(blocks.pageId, pageId));
  }

  async getBlock(id: number): Promise<Block | undefined> {
    const result = await db.select().from(blocks).where(eq(blocks.id, id));
    return result[0];
  }

  async createBlock(insertBlock: InsertBlock): Promise<Block> {
    const result = await db.insert(blocks).values(insertBlock).returning();
    return result[0];
  }

  async getFlights(): Promise<Flight[]> {
    return db.select().from(flights);
  }

  async getFlightsByDateRange(startDate: string, endDate: string): Promise<Flight[]> {
    return db.select().from(flights).where(
      and(
        gte(flights.date, startDate),
        lte(flights.date, endDate)
      )
    );
  }

  async getFlightsByDate(date: string): Promise<Flight[]> {
    return db.select().from(flights).where(eq(flights.date, date));
  }

  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const result = await db.insert(flights).values(insertFlight).returning();
    return result[0];
  }

  async getAirports(): Promise<Airport[]> {
    return db.select().from(airports);
  }

  async getAirport(code: string): Promise<Airport | undefined> {
    const result = await db.select().from(airports).where(eq(airports.code, code));
    return result[0];
  }

  async createAirport(insertAirport: InsertAirport): Promise<Airport> {
    const result = await db.insert(airports).values(insertAirport).returning();
    return result[0];
  }
}

let storageInstance: IStorage = new MemStorage();

async function initializeStorage(): Promise<IStorage> {
  try {
    console.log("Using database storage");
    console.log("Attempting to connect to database...");
    
    const dbStorage = new DatabaseStorage();
    await dbStorage.getFamilyMembers();
    
    storageInstance = dbStorage;
    console.log("Database storage initialized successfully");
    return storageInstance;
  } catch (error) {
    console.warn("Database connection failed, falling back to memory storage:", error);
    storageInstance = new MemStorage();
    return storageInstance;
  }
}

export function getStorage(): IStorage {
  return storageInstance;
}

export { initializeStorage };