"use server";

import { revalidatePath, unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getActiveUserFromCookie } from "./auth";
import { notFound } from "next/navigation";
import { connect } from "http2";


export async function getCart() {
  const session = await getActiveUserFromCookie();
  if (!session?.id) {
    throw new Error("User not authenticated.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      cart: { include: { items: { include: { product: true } }, } },
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user.cart;
}

// --- Add to Cart ---
export async function addToCart(
  productId: string,
  quantity: number,
  userId: string
) {
  try {
    let cart = await getCart();
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.log("Product does not exist")
      return { success: false, error: "Product not found." };
    }

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          id: `modemen-cart-${Date.now().toLocaleString()}-user-${userId}`,
          userId,
        },
        include: { items: { include: { product: true } } },
      });
      console.log("Created new cart for user:", userId);
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
      });
      console.log("Updated quantity for product in cart:", productId);
    } else {
      await prisma.cartItem.create({
        data: {
          id: `modemen-cartItem-${Date.now().toLocaleString()}-user-${userId}`,
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
      });
      console.log("Added new product to cart:", productId);
    }

    revalidatePath("/cart");
    return { success: true, cart };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateCartItemQuantity(
  itemId: string,
  newQuantity: number
) {
  try {
    const cart = await getCart();
    if (!cart) {
      return { success: false, error: "Cart not found." };
    }

    if (newQuantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: itemId, cartId: cart.id },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId, cartId: cart.id },
        data: { quantity: newQuantity },
      });
    }

    revalidatePath("/cart");
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true
          },
        },
      },
    });

    return { success: true, cart: updatedCart };
  } catch (error) {
    return { success: false, error: "Failed to update quantity." };
  }
}

export async function removeFromCart(itemId: string) {
  try {
    const cart = await getCart();
    if (!cart) {
      return { success: false, error: "Cart not found." };
    }

    await prisma.cartItem.delete({
      where: { id: itemId, cartId: cart.id },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return { success: true, cart: updatedCart };
  } catch (error) {
    return { success: false, error: "Failed to remove item." };
  }
}

export async function getCouponDetails(couponCode: string) {
  try {
    const coupon = await prisma.discount.findFirst({
      where: {
        code: couponCode.toUpperCase(), isActive: true,
        validTill: { gte: new Date() },
      },
    });
    return { success: true, coupon };
  } catch (error) {
    return { success: false, error: "Failed to get coupon details." };
  }
}

export async function initiateOrder(addrId: string, final: number, coupon: string | null) {
  try {
    const cart = await getCart();
    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Your cart is empty." };
    }

    const shippingAddress = await prisma.address.findFirst({
      where: { id: addrId },
    });

    if (!shippingAddress) {
      return {
        success: false,
        error: "Please set a default shipping address.",
      };
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    const subTotal = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        id: `modemen-order-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
        userId: cart.userId,
        subTotal,
        total: Math.min(subTotal, final),
        shippingAddressId: shippingAddress.id,
        billingAddressId: shippingAddress.id,
        discountId: coupon ? coupon : null,
        items: {
          create: cartItems.map((item) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            priceAtPurchase: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        discount: true,
        user: {
          select: { email: true, name: true },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    revalidatePath("/orders");
    return { success: true, order };
  } catch (error) {
    return { success: false, error: "Could not create order." };
  }
}


// --- Mock Order Completion ---
export async function completeOrder(orderId: string, cartId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { discount: true },
    });
    if (!order) {
      return { success: false, message: "Order not found." };
    }

    console.log(
      `Processing payment of $${order.total} for order ${order.orderId}...`
    );

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    if (order.discount) {
      await prisma.discount.update({
        where: { id: order.discount.id },
        data: { isActive: false },
      });
    }

    // clear the cart
    await prisma.cartItem.deleteMany({ where: { cartId } });

    revalidatePath(`/orders/${orderId}`);
    return {
      success: true,
      message: `Order ${order.orderId} completed successfully.`,
    };
  } catch (error) {
    return { success: false, message: "Mock completion failed." };
  }
}


export async function fetchShopItemsFromDb() {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true
      }
    });
    return { success: true, products };
  } catch (error) {
    return { success: false, products: null };
  }
}


// Fetch a single product by its ID
export async function getProductById(productId: string) {
  console.log(`[DB DEBUG] Querying Prisma findUnique for ID: "${productId}"`);
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      categories: true,
    },
  });

  if (!product) {
    console.warn(`[DB DEBUG] Product not found in database for ID: "${productId}"`);
    return null;
  }

  console.log(`[DB DEBUG] Product found: "${product.name}"`);
  return product;
}

export async function getRelatedProducts(productId: string, categoryId?: string) {
  if (!categoryId) {
    return [];
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      // Find products that have the same category
      categories: {
        some: {
          id: categoryId,
        },
      },
      // Exclude the current product from the list
      NOT: {
        id: productId,
      },
    },
    include: {
      categories: true
    },
    take: 3, // Limit to 3 related products
  });

  return relatedProducts;
}
