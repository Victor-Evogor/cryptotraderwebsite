const MONGODB_URI = process.env.MONGO_DB_URL;
import { adminAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Wallet } from "@/models/Wallet";
import { DecodedIdToken } from "firebase-admin/auth";

export async function GET(request: Request) {
  console.log("GEtting wallet")
  if (!MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB URI is not defined" },
      { status: 500 }
    );
  }

  try {
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

    // Connect to MongoDB if not already connected
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(MONGODB_URI);
    }

    // Get the wallet ID from the URL params
    const walletId = request.url.split('/').pop();

    if (!walletId) {
      return NextResponse.json(
        { error: "Wallet ID is required" },
        { status: 400 }
      );
    }

    // Find the wallet
    console.log("Getting wallet with wallet ID: ", walletId)
    const wallet = await Wallet.findById(walletId);
    console.log("Wallet retrieved == ", wallet)
    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    // Verify that the wallet belongs to the authenticated user
    if (wallet.owner !== decodedToken.uid) {
      return NextResponse.json(
        { error: "Unauthorized access to wallet" },
        { status: 403 }
      );
    }

    return NextResponse.json({ wallet }, { status: 200 });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}
