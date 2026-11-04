import Link from "@/components/i18n/LocalizedLink";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  isScrolled?: boolean;
}

export default function Logo({
  className = "",
  imageClassName = "",
  isScrolled = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center group shrink-0 select-none ${className}`}
    >
      <div className="relative transition-all duration-300 ease-in-out group-hover:scale-105">
        <Image
          src="/images/sudur-logo.png"
          alt="सुदूर चिनारी — हाम्रो इतिहास • हाम्रो पहिचान"
          width={364}
          height={171}
          priority
          className={cn(
            "object-contain w-auto transition-all duration-300 ease-in-out",
            isScrolled
              ? "h-9 sm:h-10 md:h-11 lg:h-12"
              : "h-12 sm:h-16 md:h-[72px] lg:h-[80px]",
            imageClassName
          )}
        />
      </div>
    </Link>
  );
}
