import mongoose from 'mongoose';

// Interface for coin structure
interface ICoin {
  address: string;
  amount: number;
}

// Define the interface for Wallet document
export interface IWallet extends mongoose.Document {
  owner: string;
  createdAt: Date;
  coins: ICoin[];
}

// Create the schema
const walletSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    ref: 'User' // Reference to User model
  },
  name: {
    type: String,
    required: true
  },
  coins: [{
    address: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    }
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the model
export const Wallet = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', walletSchema);
