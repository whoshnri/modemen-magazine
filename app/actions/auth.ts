"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { Role } from "@/lib/generated/prisma/enums";

// --- helper function to hash passwords ---
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// --- helper function to verify hashed passwords ---
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// --- helper function to validate email format ---
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// --- helper funtion to store a session in the cookie store ---
export async function storeSessionInCookie(sessionToken: string) {
  const cookieStore = await cookies();
  try {
    cookieStore.set({
      name: "sessionToken",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return true;
  } catch (err) {
    console.error("Error setting cookie:", err);
    return false;
  }
}

export type SafeUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  subscriptionPlan: string;
  updatedAt: Date;
  savedArticles: {
    id: string;
    title: string;
    slug: string;
    body: string;
    bannerImage: string | null;
    featured: boolean;
    writtenBy: string;
    publicationDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }[];
  savedProducts: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
  }[];
  cart: {
    id: string;
    userId: string;
    items: {
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
        image: string;
      };
    }[];
  };
  role: Role; // Added Role
};

export const getSafeUser = async (user: any) =>
  user ? { ...user, password: undefined } : null;

// helper function to get active user from cookie store
export async function getActiveUserFromCookie() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  // No session token → no user
  if (!sessionToken) return null;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: sessionToken,
      },
      include: {
        savedArticles: true,
        savedProducts: true,
        cart: { include: { items: { include: { product: true } } } },
      },
    });

    const safeUser = await getSafeUser(user)
    return safeUser
  } catch (error) {
    console.error("Error fetching user from session token:", error);
    return null;
  }
}

// --- create user ---
export async function createUser(
  fullName: string,
  email: string,
  password: string
) {
  if (!isValidEmail(email)) {
    return { status: "invalid_email" };
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { status: "exists" };
  }
  const hashedPassword = await hashPassword(password);
  try {
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
      },
    });
    return { status: "success" };
  } catch (err) {
    return { status: "error" };
  }
}

// --- login user ---
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return false;
  }
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return false;
  } else {
    const isCookieStored = await storeSessionInCookie(user.id);
    if (!isCookieStored) {
      return false;
    } else {
      return true;
    }
  }
}
  // --- logout user ---
export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("sessionToken");
    return { success: true };
}
