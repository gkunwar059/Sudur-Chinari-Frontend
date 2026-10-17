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

export function YatayatRegisterTrigger({ locale, className, children }: TriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>
      <OperatorRegistrationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        locale={locale}
      />
    </>
  );
}
