#!/usr/bin/env node

/**
 * Firebase Initialization Script
 * This script helps set up your Firebase project with initial data
 *
 * Run: node init-firebase.js
 */

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n═══════════════════════════════════════════════════");
console.log("   🔥 Firebase Initialization Script");
console.log("═══════════════════════════════════════════════════\n");

console.log("This script will guide you through setting up Firebase.\n");

const steps = [
  {
    title: "1️⃣  Deploy Firestore Security Rules",
    description: "Deploy the security rules to Firebase",
    command: "firebase deploy --only firestore:rules",
    instructions: [
      "This will upload your firestore.rules file to Firebase",
      "The rules now allow admin access by email",
      "Authorized emails: 11sciirfans@gmail.com, piyushthawale7@gmail.com, yummyfi.official@gmail.com",
    ],
  },
  {
    title: "2️⃣  Create Admin User in Firebase Console",
    description: "Manually create admin document in Firestore",
    instructions: [
      "Go to Firebase Console → Firestore Database",
      'Click "Start collection"',
      "Collection ID: admins",
      "Document ID: (use the UID of your admin user)",
      "Add fields:",
      "  - email: (string) your admin email",
      "  - role: (string) super_admin",
      "  - createdAt: (timestamp) now",
      "  - displayName: (string) Your Name",
      "",
      "Alternative: Login to admin dashboard first, it will auto-create the admin doc",
    ],
  },
  {
    title: "3️⃣  Deploy Firestore Indexes (Optional)",
    description: "Deploy database indexes for better query performance",
    command: "firebase deploy --only firestore:indexes",
    instructions: [
      "This uploads firestore.indexes.json",
      "Improves query performance for orders, products, etc.",
    ],
  },
  {
    title: "4️⃣  Initialize Sample Data (Optional)",
    description: "Add sample products and categories",
    instructions: [
      "Login to admin dashboard at http://localhost:5174",
      "Use one of the authorized admin emails",
      "Navigate to Products page",
      'Click "Add Product" to create sample items',
      "",
      "OR use the Firestore Console to import data directly",
    ],
  },
];

console.log("📋 Setup Steps:\n");
steps.forEach((step, index) => {
  console.log(`${step.title}`);
  console.log(`   ${step.description}\n`);
  if (step.command) {
    console.log(`   Command: \x1b[36m${step.command}\x1b[0m\n`);
  }
  step.instructions.forEach((instruction) => {
    console.log(`   ${instruction}`);
  });
  console.log("\n");
});

console.log("═══════════════════════════════════════════════════\n");

rl.question(
  "Would you like to deploy Firestore rules now? (y/n): ",
  (answer) => {
    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      console.log("\n🚀 Running: firebase deploy --only firestore:rules\n");

      const { spawn } = require("child_process");
      const deploy = spawn(
        "firebase",
        ["deploy", "--only", "firestore:rules"],
        {
          stdio: "inherit",
          shell: true,
        },
      );

      deploy.on("close", (code) => {
        if (code === 0) {
          console.log("\n✅ Firestore rules deployed successfully!\n");
          console.log("Next steps:");
          console.log("  1. Login to admin dashboard with an authorized email");
          console.log("  2. The system will auto-create your admin document");
          console.log("  3. Start adding products and categories\n");
        } else {
          console.log("\n❌ Deployment failed. Make sure you have:");
          console.log(
            "  - Installed Firebase CLI: npm install -g firebase-tools",
          );
          console.log("  - Logged in: firebase login");
          console.log("  - Initialized project: firebase init\n");
        }
        rl.close();
      });
    } else {
      console.log("\n✅ Manual setup mode");
      console.log("   Run this command when ready:");
      console.log("   \x1b[36mfirebase deploy --only firestore:rules\x1b[0m\n");
      console.log(
        "   Then login to the admin dashboard to auto-create your admin account.\n",
      );
      rl.close();
    }
  },
);
