"use client";

import React, { useState, useEffect } from "react";
import FTModal from "@/components/common/FTModal";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { GoogleIcon } from "@/components/common/SocialIcons";
import toast from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  defaultName?: string;
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  defaultName = "",
  onSuccess,
}: AuthModalProps) {
  const { locale } = useLanguage();
  const { login, register } = useAuth();

  const [authMode, setAuthMode] = useState<"login" | "register">(
    defaultName ? "register" : initialMode
  );
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState(defaultName);
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Sync mode and prefilled name when props change or modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthError("");
      if (defaultName && defaultName.trim()) {
        setRegisterName(defaultName.trim());
        setAuthMode("register");
      } else {
        setRegisterName("");
        if (initialMode) {
          setAuthMode(initialMode);
        }
      }
    }
  }, [defaultName, initialMode, isOpen]);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        await login({ username: loginEmailOrPhone, password: loginPassword });
      } else {
        await register({
          phone: registerPhone,
          password: registerPassword,
          first_name: registerName,
          email: registerEmail.trim() || undefined,
        });
      }
      onClose();
      setLoginPassword("");
      setRegisterPassword("");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      let errorMsg =
        locale === "ne"
          ? "विवरण मिलेन। कृपया पुन: प्रयास गर्नुहोस्।"
          : "Authentication failed. Please check your credentials.";
      if (err.response?.data) {
        if (err.response.data.detail) errorMsg = err.response.data.detail;
        else if (err.response.data.phone)
          errorMsg = `${locale === "ne" ? "फोन" : "Phone"}: ${err.response.data.phone[0]}`;
        else if (err.response.data.username)
          errorMsg = `${locale === "ne" ? "प्रयोगकर्ता नाम" : "Username"}: ${err.response.data.username[0]}`;
        else if (err.response.data.password)
          errorMsg = `${locale === "ne" ? "पासवर्ड" : "Password"}: ${err.response.data.password[0]}`;
        else if (err.response.data.email)
          errorMsg = `${locale === "ne" ? "ईमेल" : "Email"}: ${err.response.data.email[0]}`;
        else if (err.response.data.non_field_errors)
          errorMsg = err.response.data.non_field_errors[0];
      }
      setAuthError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast(
      locale === "ne"
        ? `${provider} मार्फत लगइन चाँडै सुरु हुँदैछ।`
        : `${provider} login will be available soon.`,
      {
        icon: "ℹ️",
        style: {
          borderRadius: "0px",
          background: "var(--foreground)",
          color: "var(--background)",
          fontSize: "13px",
        },
      }
    );
  };

  return (
    <FTModal
      onClose={onClose}
      ariaLabel="Authentication"
      maxWidth="max-w-md md:max-w-3xl lg:max-w-4xl"
      maxHeight="max-h-none"
      zClassName="z-[100]"
      paddingClassName="p-3 sm:p-4 md:p-6"
      backdropClassName="bg-black/60 backdrop-blur-sm"
      overlayClassName="overflow-y-auto"
      panelClassName="my-auto"
    >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-4 text-muted-foreground hover:text-foreground font-bold cursor-pointer text-2xl leading-none z-20 transition-colors p-1"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Form & Social Auth */}
          <div className="p-5 sm:p-7 md:p-8 md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="mb-3 sm:mb-4">
                <h3 className="text-xl sm:text-2xl font-bold font-headline text-foreground">
                  {authMode === "login"
                    ? locale === "ne"
                      ? "लगइन गर्नुहोस्"
                      : "Sign In"
                    : locale === "ne"
                    ? "नयाँ खाता खोल्नुहोस्"
                    : "Create Account"}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 font-sans leading-relaxed">
                {authMode === "login"
                  ? locale === "ne"
                    ? "आफ्नो खातामा प्रवेश गर्न कृपया विवरण भर्नुहोस्।"
                    : "Please enter your details to sign in to your account."
                  : locale === "ne"
                    ? "सुदूर चिनारीमा नयाँ खाता खोल्न कृपया आफ्नो विवरण भर्नुहोस्।"
                    : "Please enter your details to create a new account."}
              </p>

              {authError && (
                <div className="mb-4 p-3 bg-brand-secondary/10 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-brand-secondary text-xs sm:text-sm font-sans">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-3.5">
                {authMode === "register" ? (
                  <>
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1 font-sans">
                        {locale === "ne" ? "पूरा नाम *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder={
                          locale === "ne" ? "जस्तै: रमेश साउद" : "e.g. Ramesh Saud"
                        }
                        className="w-full px-3.5 py-2 text-sm sm:text-[15px] bg-surface border border-border rounded-none focus:outline-none focus:border-brand focus:bg-background transition-colors font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1 font-sans">
                        {locale === "ne" ? "फोन नम्बर *" : "Phone Number *"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        placeholder={
                          locale === "ne" ? "९८४१२३४५६७" : "e.g. 9841234567"
                        }
                        className="w-full px-3.5 py-2 text-sm sm:text-[15px] bg-surface border border-border rounded-none focus:outline-none focus:border-brand focus:bg-background transition-colors font-sans"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1 font-sans">
                        {locale === "ne"
                          ? "प्रयोगकर्ता नाम (Username) यसै फोन नम्बरबाट स्वतः सिर्जना हुनेछ।"
                          : "Username will be auto-generated from your phone number."}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1 font-sans">
                        {locale === "ne" ? "ईमेल (वैकल्पिक)" : "Email (Optional)"}
                      </label>
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder={
                          locale === "ne"
                            ? "example@email.com"
                            : "e.g. example@email.com"
                        }
                        className="w-full px-3.5 py-2 text-sm sm:text-[15px] bg-surface border border-border rounded-none focus:outline-none focus:border-brand focus:bg-background transition-colors font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1 font-sans">
                        {locale === "ne" ? "पासवर्ड *" : "Password *"}
                      </label>
                      <input
                        type="password"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 text-sm sm:text-[15px] bg-surface border border-border rounded-none focus:outline-none focus:border-brand focus:bg-background transition-colors font-sans"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1.5 font-sans">
                        {locale === "ne"
                          ? "फोन नम्बर वा ईमेल *"
                          : "Phone or Email *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={loginEmailOrPhone}
                        onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                        placeholder={
                          locale === "ne"
                            ? "९८४...... वा example@email.com"
                            : "e.g. 9841234567 or example@email.com"
                        }
                        className="w-full px-3.5 py-2.5 text-sm sm:text-[15px] bg-surface border border-border rounded-none focus:outline-none focus:border-brand focus:bg-background transition-colors font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-foreground tracking-normal mb-1.5 font-sans">
                        {locale === "ne" ? "पासवर्ड *" : "Password *"}
                      </label>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 text-sm sm:text-[15px] bg-surface border border-border rounded-none focus:outline-none focus:border-brand focus:bg-background transition-colors font-sans"
                      />
                    </div>
                  </>
                )}

                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 sm:py-3 bg-brand hover:bg-brand-dark text-white text-sm sm:text-base font-bold transition-all cursor-pointer shadow-sm disabled:opacity-70 flex justify-center items-center font-sans"
                  >
                    {authLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : authMode === "login" ? (
                      locale === "ne" ? "लगइन गर्नुहोस्" : "Sign In"
                    ) : locale === "ne" ? (
                      "दर्ता गर्नुहोस्"
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>
              </form>

              {/* ── Social Login Section at Bottom ── */}
              <div className="relative my-4 sm:my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/80" />
                </div>
                <div className="relative flex justify-center text-[11px] sm:text-xs uppercase tracking-wider">
                  <span className="bg-background px-3 text-muted-foreground font-sans">
                    {locale === "ne"
                      ? "वा सामाजिक सञ्जालबाट"
                      : "Or continue with"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 border border-border bg-surface hover:bg-muted/50 hover:border-foreground/30 text-xs sm:text-sm font-bold text-foreground transition-all cursor-pointer shadow-2xs font-sans group"
                >
                  <GoogleIcon size={18} className="transition-transform group-hover:scale-105" />
                  <span>Google</span>
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 border border-border bg-surface hover:bg-muted/50 hover:border-brand/40 text-xs sm:text-sm font-bold text-foreground transition-all cursor-pointer shadow-2xs font-sans group"
                >
                  <svg
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-foreground hover:text-brand-secondary fill-current transition-transform group-hover:scale-105"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Toggle Link */}
            <div className="mt-5 pt-3.5 border-t border-border/60 text-center text-xs sm:text-sm font-sans">
              <span className="text-muted-foreground">
                {authMode === "login"
                  ? locale === "ne"
                    ? "खाता छैन? "
                    : "Don't have an account? "
                  : locale === "ne"
                  ? "खाता छ? "
                  : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setAuthError("");
                }}
                className="font-bold text-brand hover:underline cursor-pointer ml-1"
              >
                {authMode === "login"
                  ? locale === "ne"
                    ? "नयाँ खाता खोल्नुहोस्"
                    : "Sign up"
                  : locale === "ne"
                  ? "लगइन गर्नुहोस्"
                  : "Sign in"}
              </button>
            </div>
          </div>

          {/* Right Column: Information Section */}
          <div className="p-5 sm:p-7 md:p-8 md:col-span-5 bg-surface-tint border-t md:border-t-0 md:border-l border-border flex flex-col justify-between">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-brand font-headline mb-4 sm:mb-5 flex items-center gap-2">
                {locale === "ne" ? "कृपया ध्यान दिनुहोस्:" : "Please Note:"}
              </h4>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm">
                    1
                  </span>
                  <p className="text-xs sm:text-[13px] text-foreground/85 font-sans leading-relaxed pt-0.5">
                    {locale === "ne"
                      ? "सुदूर चिनारीमा प्रकाशित समाचार, विचार र लेखहरूमा मर्यादित बहस तथा टिप्पणी (Comment) गर्नका लागि खाता आवश्यक पर्दछ।"
                      : "An account is required to participate in respectful community discussions and post comments on articles and opinion pieces."}
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm">
                    2
                  </span>
                  <p className="text-xs sm:text-[13px] text-foreground/85 font-sans leading-relaxed pt-0.5">
                    {locale === "ne"
                      ? "आफ्नो मोबाइल नम्बर वा ईमेल प्रयोग गरी सहजै लगइन गर्न सकिन्छ; प्रयोगकर्ता नाम (Username) प्रणालीले स्वतः सुरक्षित रूपमा तयार गर्छ।"
                      : "Log in conveniently using your mobile phone number or email address; a secure username is automatically generated for you."}
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm">
                    3
                  </span>
                  <p className="text-xs sm:text-[13px] text-foreground/85 font-sans leading-relaxed pt-0.5">
                    {locale === "ne"
                      ? "सुदूरपश्चिमका ९ वटै जिल्लाका प्राथमिकता अनुसारका समाचार तथा सूचनाहरू आफ्नै व्यक्तिगत रुचिका आधारमा हेर्न पाउनुहुनेछ।"
                      : "Personalize your news feed to stay updated with stories and events tailored to your favorite districts across Sudurpaschim."}
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm">
                    4
                  </span>
                  <p className="text-xs sm:text-[13px] text-foreground/85 font-sans leading-relaxed pt-0.5">
                    {locale === "ne"
                      ? "तपाईंको फोन नम्बर तथा व्यक्तिगत विवरण पूर्णतः सुरक्षित र गोपनीय राखिन्छ। कुनै पनि अनधिकृत प्रयोग हुँदैन।"
                      : "Your phone number and personal information are strictly encrypted, private, and never shared with third parties."}
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3.5 border-t border-blue-200/50 dark:border-blue-900/40 text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5 font-sans">
              <span>🔒</span>
              <span>
                {locale === "ne"
                  ? "सुरक्षित तथा भरपर्दो समाचार सेवा — सुदूर चिनारी"
                  : "Secure & trusted news service — Sudur Chinari"}
              </span>
            </div>
          </div>
        </div>
    </FTModal>
  );
}
