# Solana Meme Coin Demo Trading Platform
![Preview](https://res.cloudinary.com/djaqusrpx/image/upload/v1733900454/Screenshot_from_2024-12-10_12-38-47_r4xwig.png)

A modern web application for practicing and learning meme coin trading on Solana without risking real money. Built with Next.js, Firebase, and MongoDB, this platform provides a safe environment to experiment with trading strategies using demo tokens.

## Features

- 🎮 Risk-free demo trading with virtual Solana meme coins
- 🔐 Secure user authentication with Firebase
- 👛 Create and manage multiple demo trading wallets
- 💰 Track demo wallet balances and mock transactions
- 📊 Practice trading strategies without real funds
- 🌓 Dark/Light theme support
- 📱 Responsive design for mobile and desktop
- 🔒 Protected routes with authentication guards

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Blockchain**: Solana (simulated transactions)
- **Authentication**: Firebase Auth
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-wallet-manager
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
   - Copy the example environment file to create your local environment file:
     ```bash
     cp .example.env.local .env.local
     ```
   - Fill in the following variables in `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
     NEXT_PUBLIC_FIREBASE_APP_ID=
     MONGODB_URI=
     ```

4. Set up Firebase Admin SDK:
   - Go to Firebase Console: https://console.firebase.google.com/
   - Select your project
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file
   - Rename it to `firebase_private_key.json` and place it in the root directory of your project

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app` - Next.js 13+ app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and configuration
- `/models` - MongoDB/Mongoose models
- `/public` - Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
