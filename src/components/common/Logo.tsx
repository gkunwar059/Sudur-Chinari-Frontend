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
      <div className="relative transition-transform duration-150 ease-out group-hover:scale-[1.03]">
        <Image
          src="/images/sudur-logo.png"
          alt="सुदूर चिनारी — हाम्रो इतिहास • हाम्रो पहिचान"
          width={364}
          height={171}
          priority
          className={cn(
            "object-contain w-auto h-10 sm:h-12 lg:h-14 origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isScrolled ? "scale-80" : "scale-100",
            imageClassName
          )}
        />
      </div>
    </Link>
  );
}
