import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet"
import mongoose from "mongoose";
import { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebase-admin";


const MONGODB_URI = process.env.MONGO_DB_URL;

export async function GET(request: Request) {

  // Get the authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "No authentication token provided" },
      { status: 401 }
    );
  }

  // Extract and verify the Firebase token
  const idToken = authHeader.split("Bearer ")[1];
  let decodedToken: DecodedIdToken;
  try {
    console.log(`Verifyng id token: ${idToken}`)
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid authentication token" },
      { status: 401 }
    );
  }

  if (!MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB URI is not defined" },
      { status: 500 }
    );
  }

  try {

    if (!decodedToken.uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    const user = await User.findOne({ user_id: decodedToken.uid }).populate('wallets', undefined, Wallet).exec()
      


    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB URI is not defined" },
      { status: 500 }
    );
  }

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    console.log("Creating user with user id", user_id)
    // Check if user already exists
    let user = await User.findOne({ user_id });

    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    }

    // Create new user if doesn't exist
    user = await User.create({
      user_id,
      wallets: [],
    });

    console.log("Created user: ", user)

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error in user creation:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
