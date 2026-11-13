"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Loader2,
  UserCheck,
  LogIn,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import RelativeTime from "@/components/common/RelativeTime";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface VideoCommentsProps {
  videoId: string | number;
}

export default function VideoComments({ videoId }: VideoCommentsProps) {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAutoSubmit, setPendingAutoSubmit] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Auto-post after login if user was attempting to submit
  React.useEffect(() => {
    if (pendingAutoSubmit && user && content.trim()) {
      setPendingAutoSubmit(false);
      postMutation.mutate({ content: content.trim() });
    }
  }, [pendingAutoSubmit, user, content]);

  // Auto-derived display name from authenticated account
  const userDisplayName =
    (user as any)?.full_name ||
    (user as any)?.name ||
    (user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : "") ||
    user?.username ||
    user?.email ||
    "";

  const { data: commentsResponse, isLoading } = useQuery({
    queryKey: ["video-comments", videoId],
    queryFn: () => newsApi.getVideoCommentsClient(videoId),
  });

  const comments =
    commentsResponse?.results ||
    (Array.isArray(commentsResponse) ? commentsResponse : []);

  const postMutation = useMutation({
    mutationFn: (data: { user_name?: string; content: string }) =>
      newsApi.postVideoCommentClient({
        video: videoId,
        content: data.content,
        ...(data.user_name ? { user_name: data.user_name } : {}),
      }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["video-comments", videoId] });
    },
    onError: (err: any) => {
      if (
        err?.status === 401 ||
        err?.statusCode === 401 ||
        err?.response?.status === 401
      ) {
        setIsAuthModalOpen(true);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!user) {
      setPendingAutoSubmit(true);
      setIsAuthModalOpen(true);
      return;
    }

    postMutation.mutate({
      content: content.trim(),
    });
  };

  const toggleCommentLike = async (id: string | number) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const currentComment = comments.find((c: any) => String(c.id) === String(id));
    const currentLiked =
      likedMap[id] !== undefined ? likedMap[id] : !!currentComment?.has_liked;
    const nextLiked = !currentLiked;

    setLikedMap((prev) => ({ ...prev, [id]: nextLiked }));

    try {
      await newsApi.likeVideoCommentClient(id);
      queryClient.invalidateQueries({ queryKey: ["video-comments", videoId] });
    } catch (err: any) {
      setLikedMap((prev) => ({ ...prev, [id]: currentLiked }));
      if (
        err?.status === 401 ||
        err?.statusCode === 401 ||
        err?.response?.status === 401
      ) {
        setIsAuthModalOpen(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAutoSubmit(false);
        }}
        initialMode="login"
        onSuccess={() => setIsAuthModalOpen(false)}
      />

      <FTSectionDivider
        title={
          locale === "ne"
            ? `प्रतिक्रियाहरू (${comments.length})`
            : `Comments (${comments.length})`
        }
        as="h3"
        className="!my-0 mb-4"
        icon={<MessageSquare size={16} className="text-brand shrink-0" />}
      />

      {/* ── Comment Input / Sign-in CTA ── */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 rounded-xl border border-border bg-surface/50 space-y-3.5"
        >
          {/* Authenticated User Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/60 flex-wrap gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                {(userDisplayName || "U").charAt(0).toUpperCase()}
              </div>
              <div className="text-xs sm:text-[13px] font-bold text-foreground flex items-center gap-2 font-sans truncate">
                <span className="truncate">{userDisplayName}</span>
                <span className="text-[10px] px-2 py-0.5 bg-brand/10 text-brand border border-brand/20 font-semibold font-mono shrink-0 rounded-xs">
                  {locale === "ne" ? "प्रमाणित खाता" : "Verified Account"}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground font-sans hidden sm:inline">
              {locale === "ne" ? "सिधै प्रतिक्रिया पोस्ट हुँदैछ" : "Posting automatically"}
            </span>
          </div>

          <div>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                locale === "ne"
                  ? "यस भिडियो सम्बन्धी आफ्नो विचार व्यक्त गर्नुहोस्..."
                  : "Share your thoughts on this video..."
              }
              className="w-full px-3.5 py-2.5 text-sm border border-border bg-background focus:outline-none focus:border-brand rounded-lg resize-y transition-colors font-sans leading-relaxed"
            />
          </div>

          <div className="flex justify-between items-center gap-3 pt-1">
            <p className="text-[11px] text-muted-foreground font-sans hidden sm:block">
              {locale === "ne"
                ? "मर्यादित र सकारात्मक टिप्पणीलाई प्राथमिकता दिइन्छ।"
                : "Civil and respectful comments are encouraged."}
            </p>
            <button
              type="submit"
              disabled={postMutation.isPending || !content.trim()}
              className="px-5 py-2 bg-brand hover:bg-brand/90 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs rounded-lg active:scale-95 ml-auto"
            >
              {postMutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>{locale === "ne" ? "पठाउँदै..." : "Posting..."}</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>{locale === "ne" ? "प्रतिक्रिया पठाउनुहोस्" : "Post Comment"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Unauthenticated User Callout Card */
        <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0">
              <UserCheck size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground font-sans">
                {locale === "ne"
                  ? "प्रतिक्रिया लेख्नका लागि लगइन गर्नुहोस्"
                  : "Sign In to Leave a Comment"}
              </h4>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                {locale === "ne"
                  ? "प्रमाणित पाठकहरूले मात्र भिडियो रिपोर्टहरूमा आफ्नो विचार व्यक्त गर्न सक्नुहुन्छ। लगइन गरेपछि तपाईंको नाम स्वतः संलग्न हुनेछ।"
                  : "Only verified readers can comment. Your verified profile name will be attached automatically."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2.5 bg-brand hover:bg-brand/90 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 shadow-xs rounded-lg active:scale-95 whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <LogIn size={15} />
            <span>{locale === "ne" ? "अहिले लगइन गर्नुहोस्" : "Sign In / Register"}</span>
          </button>
        </div>
      )}

      {/* ── Comments List ── */}
      {isLoading ? (
        <div className="space-y-3 py-2">
          <div className="h-16 rounded-xl bg-surface skeleton-shimmer" />
          <div className="h-16 rounded-xl bg-surface skeleton-shimmer" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border/80 bg-surface/30">
          <MessageSquare size={26} className="text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-bold text-foreground font-sans">
            {locale === "ne"
              ? "पहिलो प्रतिक्रिया लेखेर छलफल सुरु गर्नुहोस् !"
              : "No comments yet. Be the first to share your thoughts!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {comments.map((comment: any) => {
            const isLiked =
              likedMap[comment.id] !== undefined
                ? likedMap[comment.id]
                : !!comment.has_liked;
            const delta =
              likedMap[comment.id] !== undefined
                ? (likedMap[comment.id] ? (comment.has_liked ? 0 : 1) : (comment.has_liked ? -1 : 0))
                : 0;
            const likeCount = Math.max(0, (comment.likes || 0) + delta);
            const author =
              comment.user_name ||
              comment.authorName ||
              (locale === "ne" ? "प्रमाणित प्रयोगकर्ता" : "Reader");
            const commentDate = comment.created_at || comment.createdAt;

            return (
              <div
                key={comment.id}
                className="p-4 sm:p-5 rounded-xl border border-border bg-surface/30 hover:bg-surface/60 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                      {author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-sm text-foreground font-sans truncate">
                        {author}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-brand/10 text-brand border border-brand/20 font-semibold font-mono shrink-0 rounded-xs">
                        {locale === "ne" ? "प्रमाणित" : "Verified"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono shrink-0">
                    <RelativeTime date={commentDate} locale={locale} />
                  </span>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed font-sans whitespace-pre-wrap pl-10 sm:pl-10.5">
                  {comment.content}
                </p>

                <div className="flex items-center gap-4 text-xs font-sans pl-10 sm:pl-10.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => toggleCommentLike(comment.id)}
                    className={`inline-flex items-center gap-1.5 font-semibold transition-colors cursor-pointer outline-none focus:outline-none focus:ring-0 active:scale-110 ${
                      isLiked
                        ? "text-brand"
                        : "text-muted-foreground hover:text-brand"
                    }`}
                  >
                    <ThumbsUp
                      size={14}
                      className={isLiked ? "fill-brand" : ""}
                    />
                    <span>{likeCount}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
