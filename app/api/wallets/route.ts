import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet";
import mongoose from "mongoose";
import { adminAuth } from "@/lib/firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";

const MONGODB_URI = process.env.MONGO_DB_URL;


export async function POST(request: Request) {
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
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    const { coins, name } = await request.json();
    console.log(decodedToken.uid, coins, name)

    if (!decodedToken.uid || !coins) {
      return NextResponse.json(
        { error: "User ID and coins are required" },
        { status: 400 }
      );
    }

    // Find the user first
    const user = await User.findOne({ user_id: decodedToken.uid });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create new wallet
    const wallet = await Wallet.create({
      owner: decodedToken.uid,
      name,
      coins,
    });

    // Add wallet ID to user's wallets array
    user.wallets.push(wallet._id);
    await user.save();

    return NextResponse.json({ wallet }, { status: 201 });
  } catch (error) {
    console.error("Error in wallet creation:", error);
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}
