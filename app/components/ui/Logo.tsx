interface LogoProps {
  size?: "sm" | "md" | "lg";
  color?: "orange" | "white";
  showText?: boolean;
  className?: string;
}

export default function Logo({ 
  size = "md", 
  color = "orange", 
  showText = false,
  className = ""
}: LogoProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const textColor = color === "white" ? "text-white" : "text-[#1B263B]";
  const iconColor = color === "white" ? "text-white" : "text-[#F86F4D]";

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      <svg 
        className={`${sizeClasses[size]} ${iconColor}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        {/* Icône de cheval stylisée - profil vers la droite */}
        <path d="M4 12c2-3 6-5 9-5l5 2 2 3"/>
        <path d="M8 18h5m-9-3c2 0 3 1 4 3M18 12l-3 2-2-2"/>
        <circle cx="17" cy="9.5" r="0.8" fill="currentColor"/>
        {/* Ligne de contour principale */}
        <path d="M4 12c2-3 6-5 9-5l5 2 2 3" stroke="currentColor" strokeWidth="2" fill="none"/>
        {/* Crinière et cou */}
        <path d="M8 18h5m-9-3c2 0 3 1 4 3M18 12l-3 2-2-2" stroke="currentColor" strokeWidth="2" fill="none"/>
        {/* Œil */}
        <circle cx="17" cy="9.5" r="0.8" fill="currentColor"/>
      </svg>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold ${textColor}`}>
          Ekicare
        </span>
      )}
    </div>
  );
}
