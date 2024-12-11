"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Input } from "./Input";
import { Button } from "./Button";
import { SOL, USDC} from "../constants"
import { getAuthToken } from "@/lib/auth-helpers"

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; initialAmount: number }) => void;
}

export function AddWalletModal({ isOpen, onClose, onSubmit }: AddWalletModalProps) {
  const [name, setName] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authToken = await getAuthToken()
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          owner: auth.currentUser?.uid,
          name: name,
          coins: [{
            amount: parseFloat(initialAmount),
            address: USDC
          },
        {
          amount: 0.0,
          address: SOL
        }
        ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }

      const data = await response.json();
      toast.success('Wallet created successfully!');
      onSubmit({
        name,
        initialAmount: parseFloat(initialAmount),
      });
      setName("");
      setInitialAmount("");
      onClose();
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error('Failed to create wallet. Please try again.');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md data-[state=open]:animate-scaleIn">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Wallet
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <XMarkIcon className="w-6 h-6" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wallet Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Trading Wallet"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Initial USDC Amount
              </label>
              <Input
                type="text"
                value={displayAmount}
                onChange={(e) => {
                  // Remove any non-digit characters except decimal point
                  const rawValue = e.target.value.replace(/[^\d.]/g, '');
                  
                  // Ensure only one decimal point
                  const parts = rawValue.split('.');
                  const wholeNum = parts[0];
                  const decimal = parts.length > 1 ? '.' + parts[1] : '';
                  
                  // Format whole number with commas
                  const formatted = wholeNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + decimal;
                  
                  setDisplayAmount(formatted);
                  setInitialAmount(rawValue); // Store raw value for form submission
                }}
                placeholder="1,000"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full transform active:scale-95 transition-transform duration-75"
            >
              Add Wallet
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

