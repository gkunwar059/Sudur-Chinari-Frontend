import Link from "@/components/i18n/LocalizedLink";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center group shrink-0 select-none ${className}`}
    >
      <div className="relative transition-all duration-300 group-hover:scale-105">
        <Image
          src="/images/sudur-logo.png"
          alt="सुदूर चिनारी — हाम्रो इतिहास • हाम्रो पहिचान"
          width={240}
          height={60}
          preload
          className="object-contain h-10 sm:h-[46px] w-auto"
        />
      </div>
    </Link>
  );
}
