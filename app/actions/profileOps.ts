"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import bcrypt from "bcryptjs";
import { hashPassword, verifyPassword } from "./auth";

export async function getUserProfilePageData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedArticles: true,
        readList: true,
        savedProducts: true,
        orders: true,
        addresses: true,
        cart: true,
        newsletterSubscription: true,
      },
    });
    if (!user) {
      return { message: "User not found", data: null };
    } else {
      return { message: "User profile data fetched successfully", data: user };
    }
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    return { message: "Error fetching user profile data", data: null };
  }
}

interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export async function addAddress(addressData: AddressData, userId: string) {
  try {
    const existingAddresses = await prisma.address.count({
      where: { userId: userId },
    });

    const data = await prisma.address.create({
      data: {
        ...addressData,
        userId: userId,
        isShipping: existingAddresses === 0,
        isBilling: existingAddresses === 0,
      },
    });
    revalidatePath("/profile");
    return { success: "Address added successfully.", data: data };
  } catch (error) {
    return { error: "Could not add address.", data: null };
  }
}

export async function deleteAddress(addressId: string, userId: string) {
  try {
    await prisma.address.delete({
      where: { id: addressId, userId: userId },
    });
    revalidatePath("/profile");
    return { success: "Address removed." };
  } catch (error) {
    return { error: "Cannot delete address linked to an existing order." };
  }
}

export async function updateUserProfile(userId: string, name: string) {
  if (!userId) return { error: "Not authenticated." };

  if (!name || name.trim().length < 2) {
    return { error: "Name must be at least 2 characters long." };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedArticles: true,
        readList: true,
        savedProducts: true,
        orders: true,
        addresses: true,
        cart: true,
        newsletterSubscription: true,
      },
    });
    revalidatePath("/profile");
    return { success: "Profile updated successfully.", data: user };
  } catch (error) {
    return { error: "Failed to update profile." };
  }
}

export async function changeUserPassword(userId: string, data: FormData) {
  const currentPassword = data.get("currentPassword") as string;
  const newPassword = data.get("newPassword") as string;
  const confirmPassword = data.get("confirmPassword") as string;

  if (!userId) return { error: "Not authenticated." };
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters long." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found." };

    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return { error: "Incorrect current password." };
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    revalidatePath("/profile");
    return { success: "Password changed successfully." };
  } catch (error) {
    return { error: "An unexpected error occurred." };
  }
}


export async function getAddresses(userId: string) {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: userId },
    });
    return { success: "Addresses fetched successfully.", data: addresses };
  } catch (error) {
    return { error: "Failed to fetch addresses.", data: null };
  }
}
