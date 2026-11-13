"use server";

import { serverFetch } from "@/lib/api";
import { getValidAccessToken } from "@/lib/auth-session";

export async function createCommentAction(data: {
  articleId: string | number;
  authorName: string;
  authorLocation?: string;
  content: string;
  parentId?: string | number;
}) {
  try {
    const token = await getValidAccessToken();

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
    const token = await getValidAccessToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await serverFetch(`/comments/${commentId}/like/`, {
      method: "POST",
      headers,
    });
    return { success: true, likes: res?.likes, has_liked: res?.has_liked };
  } catch (error: any) {
    console.error("likeCommentAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function likeVideoCommentAction(commentId: string | number) {
  try {
    const token = await getValidAccessToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await serverFetch(`/video-comments/${commentId}/like/`, {
      method: "POST",
      headers,
    });
    return { success: true, likes: res?.likes, has_liked: res?.has_liked };
  } catch (error: any) {
    console.error("likeVideoCommentAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function likeVideoAction(videoId: string | number) {
  try {
    const token = await getValidAccessToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await serverFetch(`/videos/${videoId}/like/`, {
      method: "POST",
      headers,
    });
    return { success: true, likes: res?.likes, has_liked: res?.has_liked };
  } catch (error: any) {
    console.error("likeVideoAction error:", error);
    return { success: false, error: error.message };
  }
}
