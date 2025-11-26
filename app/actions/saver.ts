"use server";
import prisma from "@/lib/prisma";

export async function saveArticle(userId: string, articleId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        savedArticles: {
          connect: { id: articleId },
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Error saving article:", error);
    return false;
  }
}

export async function saveIssue(userId: string, issueId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        readList: {
          connect: { id: issueId },
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Error saving issue:", error);
    return false;
  }
}

export async function saveProduct(userId: string, productId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        savedProducts: {
          connect: { id: productId },
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Error saving product:", error);
    return false;
  }
}

export async function unsaveArticle(userId: string, articleId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        savedArticles: {
          disconnect: { id: articleId },
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function unsaveProduct(userId: string, productId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        savedProducts: {
          disconnect: { id: productId },
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function unsaveIssue(userId: string, issueId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        readList: {
          disconnect: { id: issueId },
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function isContentSavedByUser(
  userId: string,
  contentId: string,
  contentType: "article" | "issue" | "product"
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      savedArticles: contentType === "article",
      readList: contentType === "issue",
      savedProducts: contentType === "product",
    },
  });
  if (!user) {
    return false;
  }

  switch (contentType) {
    case "article":
      return user.savedArticles.some((article) => article.id === contentId);
    case "issue":
      return user.readList.some((issue) => issue.id === contentId);
    case "product":
      return user.savedProducts.some((product) => product.id === contentId);
    default:
      return false;
  }
}
