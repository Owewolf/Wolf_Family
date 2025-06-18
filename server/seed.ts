import { db } from "./db";
import { familyMembers, posts, blocks } from "@shared/schema";

export async function seedDatabase() {
  const timeoutMs = 15000; // 15 second timeout

  try {
    console.log("Attempting to connect to database...");

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), timeoutMs);
    });

    // Check if data already exists with timeout
    const existingMembers = await Promise.race([
      db.select().from(familyMembers),
      timeoutPromise
    ]) as any[];

    if (existingMembers.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // Seed family members
    const familyMemberData = [
      {
        name: "Steven",
        role: "Farm Owner & Head of Operations",
        description: "Steven brings a unique blend of aviation expertise and agricultural innovation to Wolf's Lair Farm. With over 23,500 flight hours as a commercial pilot, he applies systematic thinking and precision to farm management. His transition from cockpit to countryside demonstrates how aviation principles enhance agricultural operations.",
        avatar: "/api/placeholder/400/400",
        color: "bg-blue-500"
      },
      {
        name: "Janet",
        role: "Farm Co-Manager & Penny Coordinator",
        description: "Janet oversees daily farm operations and coordinates community outreach programs. Her organizational skills and passion for sustainable farming make her an invaluable part of the Wolf's Lair team.",
        avatar: "/api/placeholder/400/400", 
        color: "bg-pink-500"
      },
      {
        name: "Tarryn",
        role: "Daughter + Head Lab Technician",
        description: "Tarryn brings scientific expertise to the farm's operations, managing laboratory testing and quality control processes to ensure the highest standards for all farm products.",
        avatar: "/api/placeholder/400/400",
        color: "bg-purple-500"
      },
      {
        name: "Conan",
        role: "Son + Future Farmer",
        description: "Conan represents the next generation of Wolf's Lair Farm, learning sustainable farming practices and preparing to carry on the family legacy.",
        avatar: "/api/placeholder/400/400",
        color: "bg-green-500"
      }
    ];

    const insertedMembers = await db.insert(familyMembers).values(familyMemberData).returning();
    console.log(`Seeded ${insertedMembers.length} family members`);

    // Seed posts - Steven's 20 posts with images
    const postData = [
      {
        title: "Morning Flight to Check the Crops",
        content: "Started the day with a reconnaissance flight over Wolf's Lair Farm. From 2,000 feet, you can see patterns in crop growth that aren't visible from ground level. Spotted some areas that need irrigation attention and identified the perfect sections for next season's rotation. Aviation skills continue to serve farming operations well.",
        excerpt: "Started the day with a reconnaissance flight over Wolf's Lair Farm to assess crop conditions from above.",
        authorId: insertedMembers[0].id, // Steven
        category: "Aviation",
        imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      // Additional posts from other family members
      {
        title: "From Breathing Ton to Deliciousness",
        content: "Processed a massive 'breathing ton' of fresh produce today! It's incredible how much work goes into transforming raw farm output into the delicious, market-ready products our customers love. Every step of the process requires precision, timing, and care. Proud of our team's dedication to quality.",
        excerpt: "Processed a massive 'breathing ton' of fresh produce today! It's incredible how much work goes into transforming raw farm output.",
        authorId: insertedMembers[1].id, // Janet
        category: "Processing",
        imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop",
        createdAt: new Date(Date.now() - 86400000 * 21).toISOString()
      }
    ];

    const insertedPosts = await db.insert(posts).values(postData).returning();
    console.log(`Seeded ${insertedPosts.length} posts`);

    // Seed blocks
    const blockData = [
      {
        type: "hero",
        title: "Welcome to Wolf's Lair",
        content: "Our Family Farm in the Heart of South Africa",
        imageUrl: null,
        data: JSON.stringify({ 
          buttonText: "Discover Our Location",
          buttonAction: "scroll-to-map"
        }),
        order: 1,
        pageId: "home"
      },
      {
        type: "content",
        title: "Our Story",
        content: "Welcome to Wolf's Lair, where our family has been cultivating the land and creating memories for generations. Nestled in the beautiful South African countryside, our farm represents more than just agriculture - it's a testament to family values, hard work, and our deep connection to the earth. Join us as we share our daily adventures, farming insights, and the joys of rural living in this special corner of the world.",
        imageUrl: null,
        data: null,
        order: 2,
        pageId: "home"
      }
    ];

    const insertedBlocks = await db.insert(blocks).values(blockData).returning();
    console.log(`Seeded ${insertedBlocks.length} blocks`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}