"use client"

import { useState, useEffect } from "react"
import { AddWalletModal } from "@/components/AddWalletModal"
import AuthGuard from "@/components/AuthGuard"
import * as Tabs from "@radix-ui/react-tabs"
import ThemeToggle from "@/components/ThemeToggle"
import { updateProfile } from "firebase/auth"
import { WalletIcon, UserCircleIcon, CpuChipIcon, ArrowRightOnRectangleIcon, PlusIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/Button"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/auth-helpers"
import AirdropBanner from "@/components/AirdropBanner"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("wallets")
  const [userData, setUserData] = useState<{ wallets: {
    _id: string;
    name: string;
    coins: {
      address: string;
      amount: number;
    }[]
  }[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          router.push('/login');
          return;
        }

        const authToken = await getAuthToken() as string

        const response = await fetch(`/api/users?userId=${currentUser.uid}`, {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const { user } = await response.json();
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <AirdropBanner pnl={0.00}/>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <button
            onClick={async () => {
              await auth.signOut();
              router.push('/signup');
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Log out
          </button>
        </div>

        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <Tabs.List className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
            <Tabs.Trigger
              value="wallets"
              className={`flex items-center px-4 py-2 text-sm font-medium transition-colors
                ${
                  activeTab === "wallets"
                    ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <WalletIcon className="w-5 h-5 mr-2" />
              Wallets
            </Tabs.Trigger>

            <Tabs.Trigger
              value="profile"
              className={`flex items-center px-4 py-2 text-sm font-medium transition-colors
                ${
                  activeTab === "profile"
                    ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <UserCircleIcon className="w-5 h-5 mr-2" />
              Profile
            </Tabs.Trigger>

            <Tabs.Trigger
              value="bots"
              className={`flex items-center px-4 py-2 text-sm font-medium transition-colors
                ${
                  activeTab === "bots"
                    ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <CpuChipIcon className="w-5 h-5 mr-2" />
              Trading Bots
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="wallets" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsAddWalletOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Wallet
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData?.wallets && userData.wallets.length > 0 ? (
                  userData.wallets.map(({_id, name, coins}, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-purple-500/20 hover:border-purple-500/50 border-2 border-transparent cursor-pointer"
                      onClick={() => router.push(`/wallets/${_id}`)}
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 break-all">
                        {coins.find(coin => coin.address == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")?.amount}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center p-4">
                    <p className="text-gray-500 dark:text-gray-400">No wallets found</p>
                  </div>
                )}
                </div>
              </div>
            )}
          </Tabs.Content>

          <AddWalletModal
            isOpen={isAddWalletOpen}
            onClose={() => setIsAddWalletOpen(false)}
            onSubmit={async (data) => {
              try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;
                const authToken = await getAuthToken() as string
                const response = await fetch(`/api/users?userId=${currentUser.uid}`, {
                  headers: {
                    "Authorization": `Bearer ${authToken}`
                  }
                });
                if (!response.ok) {
                  throw new Error('Failed to fetch updated user data');
                }
                
                const updatedData = await response.json();
                setUserData(updatedData);
              } catch (error) {
                console.error('Error refreshing wallet data:', error);
              }
            }}
          />

          <Tabs.Content value="profile" className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {auth.currentUser?.photoURL ? (
                      <img 
                        src={auth.currentUser.photoURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-full h-full text-gray-400 dark:text-gray-600" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="profile-photo"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && auth.currentUser) {
                        try {
                          // Here you would typically:
                          // 1. Upload the file to your storage
                          // 2. Get the URL
                          // 3. Update the user's profile
                          // For now, we'll just show an alert
                          alert('File upload functionality to be implemented');
                        } catch (error) {
                          console.error('Error updating profile photo:', error);
                        }
                      }
                    }}
                  />
                  <label 
                    htmlFor="profile-photo" 
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                  >
                    Change Photo
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Your display name"
                    defaultValue={auth.currentUser?.displayName || ''}
                    onChange={(e) => {
                      // You might want to debounce this in a real application
                      if (auth.currentUser) {
                        updateProfile(auth.currentUser, {
                          displayName: e.target.value
                        }).catch((error) => {
                          console.error('Error updating display name:', error);
                        });
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={auth.currentUser?.email || ''}
                    disabled
                  />
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="bots" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Bot cards would go here */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  DCA Bot
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Status: Active
                </p>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
              {/* Add more bot cards as needed */}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
      </div>
    </AuthGuard>
  )
}
