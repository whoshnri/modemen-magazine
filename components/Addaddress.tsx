"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";
import { addAddress } from "@/app/actions/profileOps";
import { Address } from "@/lib/generated/prisma/client";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onAddressAdded: (newAddress: Address) => void;
}

export const AddAddressModal = ({
  isOpen,
  onClose,
  userId,
  onAddressAdded,
}: AddAddressModalProps) => {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      country: formData.get("country") as string,
    };

    startTransition(async () => {
      const result = await addAddress(data, userId);
      if (result.error) {
        showToast(result.error || "Failed to add address.", "error");
      } else {
        showToast(result.success!, "success");
        onAddressAdded(result.data!);
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-black-secondary border border-border w-[90vw] max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold tracking-widest mb-6">
          ADD NEW ADDRESS
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="street"
            placeholder="Street Address"
            required
            className="w-full bg-black-primary border border-border p-3"
          />
          <input
            name="city"
            placeholder="City"
            required
            className="w-full bg-black-primary border border-border p-3"
          />
          <div className="flex gap-4">
            <input
              name="state"
              placeholder="State / Province"
              required
              className="w-full bg-black-primary border border-border p-3"
            />
            <input
              name="zipCode"
              placeholder="ZIP / Postal Code"
              required
              className="w-full bg-black-primary border border-border p-3"
            />
          </div>
          <input
            name="country"
            placeholder="Country"
            required
            className="w-full bg-black-primary border border-border p-3"
          />
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-border py-3 font-bold tracking-widest text-sm hover:bg-black-primary"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gold-primary text-black-primary font-bold py-3 tracking-widest text-sm hover:bg-gold-secondary disabled:bg-gray-500"
            >
              {isPending ? "SAVING..." : "SAVE ADDRESS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
