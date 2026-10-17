"use server";

import { cookies } from "next/headers";
import { serverFetch } from "@/lib/api";

export async function fetchCommentsAction(articleId: string | number) {
  try {
    const res = await serverFetch(`/comments/?articleId=${encodeURIComponent(String(articleId))}`);
    return { success: true, comments: res?.results || [] };

  } catch (error: any) {
    console.error("fetchCommentsAction error:", error);
    return { success: false, comments: [], error: error.message };
  }
}

export async function createCommentAction(data: {
  articleId: string | number;
  authorName: string;
  authorLocation?: string;
  content: string;
  parentId?: string | number;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const payload: Record<string, any> = {
      article: data.articleId,
      authorName: data.authorName,
      authorLocation: data.authorLocation || "",
      content: data.content,
    };

    if (data.parentId) {
      payload.parent = data.parentId;
    }

    const res = await serverFetch("/comments/", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    return { success: true, comment: res };
  } catch (error: any) {
    console.error("createCommentAction error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to post comment",
      errorData: error.response?.data 
    };
  }
}

export async function likeCommentAction(commentId: string | number) {
  try {
    const res = await serverFetch(`/comments/${commentId}/like/`, {
      method: "POST",
    });
    return { success: true, likes: res?.likes };
  } catch (error: any) {
    console.error("likeCommentAction error:", error);
    return { success: false, error: error.message };
  }
}
