// Load environment variables from server/.env
import "dotenv/config";

// Reuse the Prisma client already configured in the project
import prisma from "../src/config/prisma.js";

// Sample support service data
const supportServices = [
  {
    name: "Colombo General Hospital",
    type: "HOSPITAL",
    description:
      "Hospital providing emergency and general medical services.",
    address: "Colombo 10, Sri Lanka",

    // Location coordinates
    latitude: 6.9147,
    longitude: 79.8683,

    phone: "0112691111",
    openingHours: "24 Hours",
    isAvailable: true,
  },

  {
    name: "Colombo Fort Police Station",
    type: "POLICE",
    description:
      "Police station providing public safety and emergency assistance.",
    address: "Fort, Colombo, Sri Lanka",

    latitude: 6.9344,
    longitude: 79.8428,

    phone: "0112421052",
    openingHours: "24 Hours",
    isAvailable: true,
  },

  {
    name: "SafeHer Women's Support Centre",
    type: "WOMEN_SUPPORT",
    description:
      "Support centre providing guidance and assistance for women who need help.",
    address: "Colombo, Sri Lanka",

    latitude: 6.9271,
    longitude: 79.8612,

    // Test data for development
    phone: "0112000001",
    openingHours: "8:00 AM - 6:00 PM",
    isAvailable: true,
  },

  {
    name: "SafeHer Community Help Centre",
    type: "SAFE_PLACE",
    description:
      "A community support location where users can seek immediate assistance.",
    address: "Nugegoda, Sri Lanka",

    latitude: 6.8649,
    longitude: 79.8997,

    // Test data for development
    phone: "0112000002",
    openingHours: "8:00 AM - 8:00 PM",
    isAvailable: true,
  },
];

// Function to insert sample support service data
async function seedSupportServices() {
  try {
    console.log("Starting Support Service seed...");

    // Delete only old SupportService data
    // This will NOT delete Incident or other tables
    await prisma.supportService.deleteMany();

    // Insert sample support services
    await prisma.supportService.createMany({
      data: supportServices,
    });

    console.log("Support Services added successfully!");
  } catch (error) {
    // Print database errors if something fails
    console.error("Failed to seed Support Services:");
    console.error(error);
  } finally {
    // Close Prisma database connection
    await prisma.$disconnect();
  }
}

// Run the seed function
seedSupportServices();