import mongoose from 'mongoose';

// Define the interface for User document
export interface IUser extends mongoose.Document {
  user_id: string;
  wallets: string[];
}

// Create the schema
const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  wallets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }]
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create index for user_id
userSchema.index({ user_id: 1 }, { unique: true });

// Create and export the model
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
