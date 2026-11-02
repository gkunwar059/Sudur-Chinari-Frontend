"use client";

import { useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { YatayatService } from "@/data/yatayatData";
import VehicleDetailModal from "./VehicleDetailModal";
import OperatorRegistrationModal from "./OperatorRegistrationModal";
import QuickActionsModal, { type ModalType } from "./QuickActionsModal";

export type YatayatQuickAction = Exclude<ModalType, null>;

interface TriggerProps {
  locale: Locale;
  className?: string;
  children: ReactNode;
}

interface YatayatDetailsButtonProps extends TriggerProps {
  service: YatayatService;
}

export function YatayatDetailsButton({
  service,
  locale,
  className,
  children,
}: YatayatDetailsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>
      {isOpen && (
        <VehicleDetailModal
          service={service}
          onClose={() => setIsOpen(false)}
          locale={locale}
        />
      )}
    </>
  );
}

interface YatayatQuickActionTriggerProps extends TriggerProps {
  type: YatayatQuickAction;
}

export function YatayatQuickActionTrigger({
  type,
  locale,
  className,
  children,
}: YatayatQuickActionTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>
      {isOpen && (
        <QuickActionsModal type={type} onClose={() => setIsOpen(false)} locale={locale} />
      )}
    </>
  );
}

import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export function YatayatRegisterTrigger({ locale, className, children }: TriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleOpen = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <button type="button" onClick={handleOpen} className={className}>
        {children}
      </button>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            setIsOpen(true);
          }}
        />
      )}

      {isOpen && (
        <OperatorRegistrationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          locale={locale}
        />
      )}
    </>
  );
}
