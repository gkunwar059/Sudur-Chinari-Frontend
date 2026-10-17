"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  ThumbsUp,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { ArticleComment } from "@/types";
import {
  fetchCommentsAction,
  createCommentAction,
  likeCommentAction,
} from "@/app/actions/comments";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import RelativeTime from "@/components/common/RelativeTime";

interface ArticleCommentsProps {
  articleId: string;
}

interface PendingCommentData {
  authorName: string;
  authorLocation?: string;
  content: string;
  parentId?: string | number;
}

export default function ArticleComments({ articleId }: ArticleCommentsProps) {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Top-level comment form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [commentText, setCommentText] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "top">("newest");

  // Inline reply states
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");

  // Reply collapse/expand states (by default replies are visible)
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});

  // Auth modal & auto-submit states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingComment, setPendingComment] = useState<PendingCommentData | null>(null);
  const [pendingAutoSubmit, setPendingAutoSubmit] = useState(false);

  // Session-level liked tracker
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  // ── TanStack Query: Fetch comments from backend ──
  const {
    data: rawComments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      const res = await fetchCommentsAction(articleId);
      if (res.success && Array.isArray(res.comments)) {
        return res.comments;
      }
      return [];
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  // ── TanStack Mutation: Post Comment / Reply ──
  const postCommentMutation = useMutation({
    mutationFn: async (payload: PendingCommentData) => {
      const res = await createCommentAction({
        articleId,
        authorName: payload.authorName,
        authorLocation: payload.authorLocation,
        content: payload.content,
        parentId: payload.parentId,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to post comment");
      }
      return res.comment;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      toast.success(
        locale === "ne"
          ? "तपाईंको प्रतिक्रिया सफलतापूर्वक प्रकाशित भयो।"
          : "Your comment has been successfully posted."
      );

      // Reset form states
      if (variables.parentId) {
        // Auto-expand thread when reply is posted
        setExpandedThreads((prev) => ({
          ...prev,
          [String(variables.parentId)]: true,
        }));
        setReplyingToId(null);
        setReplyText("");
        setReplyName("");
      } else {
        setCommentText("");
        setLocation("");
        setName("");
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to post comment");
    },
  });

  // ── TanStack Mutation: Like Comment ──
  const likeMutation = useMutation({
    mutationFn: async (commentId: string | number) => {
      return await likeCommentAction(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
    },
  });

  // Auto-post after successful authentication
  useEffect(() => {
    if (pendingAutoSubmit && user && pendingComment) {
      setPendingAutoSubmit(false);
      const authorName = user.first_name || user.username;
      postCommentMutation.mutate({
        ...pendingComment,
        authorName,
      });
      setPendingComment(null);
    }
  }, [pendingAutoSubmit, user, pendingComment, postCommentMutation]);

  // Build threaded comment tree
  const commentTree = useMemo(() => {
    const map = new Map<string, ArticleComment>();
    const roots: ArticleComment[] = [];

    // 1. Initialize nodes
    rawComments.forEach((c: any) => {
      const id = String(c.id);
      const parentId = c.parent ? String(c.parent) : null;
      map.set(id, {
        id,
        articleId: String(c.article || articleId),
        authorName: c.authorName || "Anonymous",
        authorLocation: c.authorLocation || "",
        content: c.content || "",
        createdAt: c.createdAt || new Date().toISOString(),
        likes: c.likes || 0,
        isLiked: !!likedIds[id],
        parentId,
        replies: [],
      });
    });

    // 2. Attach children to parents
    map.forEach((node) => {
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId)!.replies!.push(node);
      } else {
        roots.push(node);
      }
    });

    // 3. Sort roots
    roots.sort((a, b) => {
      if (sortBy === "top") {
        return (b.likes || 0) - (a.likes || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // 4. Sort replies chronologically (earliest first)
    roots.forEach((root) => {
      if (root.replies && root.replies.length > 0) {
        root.replies.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

    return roots;
  }, [rawComments, likedIds, sortBy, articleId]);

  // Handle top-level comment submission
  const handleSubmitMainComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setPendingComment({
        authorName: name.trim(),
        authorLocation: location.trim(),
        content: commentText.trim(),
        parentId: undefined,
      });
      setIsAuthModalOpen(true);
      return;
    }

    if (!commentText.trim()) {
      toast.error(
        locale === "ne"
          ? "कृपया आफ्नो प्रतिक्रिया लेख्नुहोस्।"
          : "Please write your comment."
      );
      return;
    }

    const authorName = user.first_name || user.username;
    postCommentMutation.mutate({
      authorName,
      authorLocation: location.trim(),
      content: commentText.trim(),
      parentId: undefined,
    });
  };

  // Handle inline reply submission
  const handleSubmitReply = (e: React.FormEvent, parentCommentId: string) => {
    e.preventDefault();

    if (!user) {
      setPendingComment({
        authorName: replyName.trim(),
        authorLocation: "",
        content: replyText.trim(),
        parentId: parentCommentId,
      });
      setIsAuthModalOpen(true);
      return;
    }

    if (!replyText.trim()) {
      toast.error(
        locale === "ne"
          ? "कृपया आफ्नो जवाफ लेख्नुहोस्।"
          : "Please write your reply."
      );
      return;
    }

    const authorName = user.first_name || user.username;
    postCommentMutation.mutate({
      authorName,
      content: replyText.trim(),
      parentId: parentCommentId,
    });
  };

  const handleLike = (commentId: string) => {
    setLikedIds((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    likeMutation.mutate(commentId);
  };

  const toggleThread = (commentId: string) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [commentId]: prev[commentId] === false ? true : false,
    }));
  };

  const totalCommentsCount = rawComments.length;

  return (
    <section id="comments-section" className="mt-12 pt-8 border-t border-border">
      {/* ── Header with Comments Count & Sort ── */}
      <FTSectionDivider
        title={
          locale === "ne"
            ? `प्रतिक्रियाहरू (${totalCommentsCount})`
            : `Comments (${totalCommentsCount})`
        }
        icon={<MessageSquare size={18} className="text-brand" />}
        as="h3"
        className="!my-0 mb-6"
        rightNode={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
            <span className="text-muted-foreground">{locale === "ne" ? "क्रम:" : "Sort:"}</span>
            <button
              type="button"
              onClick={() => setSortBy("newest")}
              className={cn(
                "px-2.5 py-1 rounded-none font-semibold transition-colors cursor-pointer border",
                sortBy === "newest"
                  ? "bg-brand text-white border-brand"
                  : "bg-background text-muted-foreground border-border hover:bg-surface"
              )}
            >
              {locale === "ne" ? "ताजा" : "Latest"}
            </button>
            <button
              type="button"
              onClick={() => setSortBy("top")}
              className={cn(
                "px-2.5 py-1 rounded-none font-semibold transition-colors cursor-pointer border",
                sortBy === "top"
                  ? "bg-brand text-white border-brand"
                  : "bg-background text-muted-foreground border-border hover:bg-surface"
              )}
            >
              {locale === "ne" ? "धेरै मन पराइएको" : "Most Liked"}
            </button>
          </div>
        }
      />

      {/* ── Main Comment Submission Form ── */}
      <div className="bg-surface rounded-none border border-border p-5 sm:p-6 mb-8 shadow-xs">
        <h4 className="text-base sm:text-lg font-bold font-headline text-foreground mb-3">
          {locale === "ne" ? "आफ्नो प्रतिक्रिया लेख्नुहोस्" : "Leave a Comment"}
        </h4>

        {/* Guest Information Banner */}
        {!user && (
          <div className="mb-4 p-3 bg-muted/40 border border-border text-xs sm:text-[13px] text-muted-foreground font-sans flex items-center justify-between gap-3 flex-wrap">
            <span className="flex items-center gap-2">
              <span className="text-brand font-bold text-sm">ℹ️</span>
              <span>
                {locale === "ne"
                  ? "प्रतिक्रिया पोस्ट गर्नका लागि खाता आवश्यक पर्दछ। नाम भरेर सिधै पठाउन सक्नुहुन्छ वा लगइन गर्नुहोस्।"
                  : "An account is required to post a comment. Enter your name or sign in directly."}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setPendingComment(null);
                setIsAuthModalOpen(true);
              }}
              className="text-brand font-bold hover:underline cursor-pointer ml-auto inline-flex items-center gap-1 group"
            >
              <span>{locale === "ne" ? "अहिले लगइन / दर्ता गर्नुहोस्" : "Sign in / Register"}</span>
              <ArrowRight size={13} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmitMainComment} noValidate className="space-y-3.5">
          {user ? (
            /* ── LOGGED IN USER: Show User Badge and Location section only ── */
            <>
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-border/70 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {(user.first_name || user.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs sm:text-[13px] font-bold text-foreground flex items-center gap-2">
                      <span>{user.first_name || user.username}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-brand border border-emerald-200 dark:border-emerald-800 font-semibold font-sans">
                        {locale === "ne" ? "प्रमाणित खाता" : "Verified Account"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1.5 font-sans">
                  {locale === "ne" ? "ठेगाना / जिल्ला (ऐच्छिक)" : "Location (Optional)"}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={locale === "ne" ? "जस्तै: धनगढी, कैलाली" : "e.g. Dhangadhi, Kailali"}
                  className="w-full px-3.5 py-2.5 text-sm sm:text-[15px] bg-background border border-border rounded-none focus:outline-none focus:border-brand transition-colors font-sans"
                />
              </div>
            </>
          ) : (
            /* ── GUEST USER: Show Full Name and Location fields ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1.5 font-sans">
                  {locale === "ne" ? "तपाईंको पूरा नाम *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={locale === "ne" ? "जस्तै: रमेश साउद" : "e.g. Ramesh Saud"}
                  className="w-full px-3.5 py-2.5 text-sm sm:text-[15px] bg-background border border-border rounded-none focus:outline-none focus:border-brand transition-colors font-sans"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1.5 font-sans">
                  {locale === "ne" ? "ठेगाना / जिल्ला (ऐच्छिक)" : "Location (Optional)"}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={locale === "ne" ? "जस्तै: धनगढी, कैलाली" : "e.g. Dhangadhi, Kailali"}
                  className="w-full px-3.5 py-2.5 text-sm sm:text-[15px] bg-background border border-border rounded-none focus:outline-none focus:border-brand transition-colors font-sans"
                />
              </div>
            </div>
          )}

          {/* Comment textarea */}
          <div className="mt-3.5">
            <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1.5 font-sans">
              {locale === "ne" ? "प्रतिक्रिया *" : "Comment *"}
            </label>
            <textarea
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                locale === "ne"
                  ? "यस समाचारबारे आफ्नो विचार वा सुझाव यहाँ लेख्नुहोस्..."
                  : "Share your thoughts or feedback on this article..."
              }
              className="w-full px-3.5 py-2.5 text-sm sm:text-[15px] bg-background border border-border rounded-none focus:outline-none focus:border-brand transition-colors resize-y leading-relaxed font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-xs sm:text-[13px] text-muted-foreground font-sans">
              {locale === "ne"
                ? "मर्यादित र सकारात्मक टिप्पणीलाई प्राथमिकता दिइन्छ।"
                : "Civil and respectful comments are encouraged."}
            </p>
            <button
              type="submit"
              disabled={postCommentMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-none bg-brand hover:bg-brand-dark text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-50 shadow-2xs font-sans"
            >
              {postCommentMutation.isPending && (
                <Loader2 size={16} className="animate-spin" />
              )}
              <span>
                {postCommentMutation.isPending
                  ? locale === "ne" ? "पठाउँदै..." : "Posting..."
                  : locale === "ne" ? "प्रतिक्रिया पठाउनुहोस्" : "Post Comment"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* ── Comments Loading Skeleton ── */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 border border-border bg-surface/50 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-border" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-32 h-3.5 bg-border rounded" />
                  <div className="w-20 h-2.5 bg-border rounded" />
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <div className="w-full h-3 bg-border rounded" />
                <div className="w-3/4 h-3 bg-border rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && commentTree.length === 0 && (
        <div className="text-center py-12 px-4 border border-dashed border-border bg-surface/30">
          <MessageSquare size={32} className="mx-auto text-muted-foreground mb-3 opacity-60" />
          <h4 className="text-base font-bold text-foreground font-headline mb-1">
            {locale === "ne" ? "कुनै प्रतिक्रिया छैन" : "No comments yet"}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            {locale === "ne"
              ? "यस समाचारमा पहिलो प्रतिक्रिया दिने व्यक्ति बन्नुहोस्।"
              : "Be the first to share your thoughts on this story."}
          </p>
        </div>
      )}

      {/* ── Social Media Threaded Comments List ── */}
      {!isLoading && commentTree.length > 0 && (
        <div className="space-y-4">
          {commentTree.map((comment) => {
            const isLiked = !!likedIds[comment.id];
            const initialLetter = comment.authorName ? comment.authorName.charAt(0) : "U";
            const replies = comment.replies || [];
            const hasReplies = replies.length > 0;
            const isExpanded = expandedThreads[comment.id] !== false; // Default expanded
            const isReplying = replyingToId === comment.id;

            return (
              <div
                key={comment.id}
                className="bg-background rounded-none border border-border p-4 sm:p-5 transition-shadow"
              >
                {/* ── Parent Comment ── */}
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-2xs">
                    {initialLetter.toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-[15px] font-bold text-foreground">
                          {comment.authorName}
                        </span>
                        {comment.authorLocation && (
                          <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-surface-hover text-muted-foreground font-medium border border-border/60">
                            {comment.authorLocation}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 font-sans">
                        <RelativeTime date={comment.createdAt} locale={locale} />
                      </span>
                    </div>

                    <p className="text-sm sm:text-[15px] text-foreground leading-relaxed mb-3 font-sans whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {/* Actions: Like & Reply */}
                    <div className="flex items-center gap-4 text-xs font-sans">
                      <button
                        type="button"
                        onClick={() => handleLike(comment.id)}
                        className={cn(
                          "inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer",
                          isLiked ? "text-brand" : "text-muted-foreground hover:text-brand"
                        )}
                      >
                        <ThumbsUp
                          size={13}
                          className={cn("transition-transform active:scale-125", isLiked && "fill-brand")}
                        />
                        <span>{comment.likes || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (isReplying) {
                            setReplyingToId(null);
                          } else {
                            setReplyingToId(comment.id);
                            setReplyText(`@${comment.authorName} `);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-gray-500 hover:text-foreground font-semibold transition-colors cursor-pointer"
                      >
                        <CornerDownRight size={13} />
                        <span>{locale === "ne" ? "जवाफ दिनुहोस्" : "Reply"}</span>
                      </button>
                    </div>

                    {/* ── Inline Reply Form (Directly below parent) ── */}
                    {isReplying && (
                      <div className="mt-4 p-3.5 bg-surface border border-border/80 rounded-none animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60 text-xs font-bold text-brand">
                          <span className="flex items-center gap-1">
                            <CornerDownRight size={12} />
                            <span>
                              {locale === "ne"
                                ? `${comment.authorName} लाई जवाफ लेख्दै`
                                : `Replying to ${comment.authorName}`}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setReplyingToId(null)}
                            className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <form
                          onSubmit={(e) => handleSubmitReply(e, comment.id)}
                          noValidate
                          className="space-y-2.5"
                        >
                          {!user && (
                            <div>
                              <input
                                type="text"
                                value={replyName}
                                onChange={(e) => setReplyName(e.target.value)}
                                placeholder={
                                  locale === "ne" ? "तपाईंको पूरा नाम *" : "Your Full Name *"
                                }
                                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-background border border-border rounded-none focus:outline-none focus:border-brand font-sans"
                              />
                            </div>
                          )}

                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={
                              locale === "ne"
                                ? "आफ्नो जवाफ यहाँ लेख्नुहोस्..."
                                : "Write your reply here..."
                            }
                            className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-none focus:outline-none focus:border-brand font-sans resize-y"
                            autoFocus
                          />

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setReplyingToId(null)}
                              className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer font-sans"
                            >
                              {locale === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
                            </button>
                            <button
                              type="submit"
                              disabled={postCommentMutation.isPending}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand hover:bg-brand-dark text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 font-sans shadow-2xs"
                            >
                              {postCommentMutation.isPending ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Send size={12} />
                              )}
                              <span>
                                {postCommentMutation.isPending
                                  ? locale === "ne" ? "पठाउँदै..." : "Sending..."
                                  : locale === "ne" ? "जवाफ पठाउनुहोस्" : "Reply"}
                              </span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* ── View / Hide Replies Toggle Button ── */}
                    {hasReplies && (
                      <div className="mt-3.5 pt-2 border-t border-border/40">
                        <button
                          type="button"
                          onClick={() => toggleThread(comment.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline cursor-pointer font-sans py-0.5"
                        >
                          <div className="w-5 h-[1.5px] bg-brand shrink-0" />
                          {isExpanded ? (
                            <>
                              <ChevronUp size={14} />
                              <span>
                                {locale === "ne"
                                  ? `जवाफ लुकाउनुहोस् (${replies.length})`
                                  : `Hide replies (${replies.length})`}
                              </span>
                            </>
                          ) : (
                            <>
                              <ChevronDown size={14} />
                              <span>
                                {locale === "ne"
                                  ? `जवाफहरू हेर्नुहोस् (${replies.length})`
                                  : `View replies (${replies.length})`}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Nested Replies Thread (Social Media Platform Style) ── */}
                {hasReplies && isExpanded && (
                  <div className="mt-3 pt-2 pl-4 sm:pl-7 ml-4 sm:ml-5 border-l-2 border-brand/20 dark:border-brand/30 space-y-3.5">
                    {replies.map((reply) => {
                      const isReplyLiked = !!likedIds[reply.id];
                      const replyInitial = reply.authorName ? reply.authorName.charAt(0) : "U";

                      return (
                        <div
                          key={reply.id}
                          className="relative flex items-start gap-3 pt-1 group"
                        >
                          {/* Thread connector dot */}
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface-hover text-brand border border-brand/30 flex items-center justify-center text-xs font-bold shrink-0">
                            {replyInitial.toUpperCase()}
                          </div>

                          <div className="flex-1 min-w-0 bg-surface/40 p-3 border border-border/60">
                            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs sm:text-sm font-bold text-foreground">
                                  {reply.authorName}
                                </span>
                                {reply.authorLocation && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-[2px] bg-surface text-muted-foreground border border-border/50">
                                    {reply.authorLocation}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-gray-400 font-sans">
                                <RelativeTime date={reply.createdAt} locale={locale} />
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-foreground leading-relaxed mb-2 font-sans whitespace-pre-wrap">
                              {reply.content}
                            </p>

                            {/* Reply Actions */}
                            <div className="flex items-center gap-3 text-[11px] font-sans">
                              <button
                                type="button"
                                onClick={() => handleLike(reply.id)}
                                className={cn(
                                  "inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer",
                                  isReplyLiked
                                    ? "text-brand"
                                    : "text-muted-foreground hover:text-brand"
                                )}
                              >
                                <ThumbsUp
                                  size={11}
                                  className={cn("transition-transform active:scale-125", isReplyLiked && "fill-brand")}
                                />
                                <span>{reply.likes || 0}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingToId(comment.id);
                                  setReplyText(`@${reply.authorName} `);
                                }}
                                className="inline-flex items-center gap-1 text-gray-500 hover:text-foreground font-semibold transition-colors cursor-pointer"
                              >
                                <CornerDownRight size={11} />
                                <span>{locale === "ne" ? "जवाफ दिनुहोस्" : "Reply"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Auth Modal Integration ── */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultName={pendingComment?.authorName || name.trim()}
        initialMode={(pendingComment?.authorName || name.trim()) ? "register" : "login"}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setPendingAutoSubmit(true);
        }}
      />
    </section>
  );
}
