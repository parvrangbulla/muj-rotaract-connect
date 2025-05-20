
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  backgroundImage?: string;
}

const PageHeader = ({ 
  title, 
  subtitle, 
  children,
  backgroundImage = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=3540&auto=format&fit=crop" 
}: PageHeaderProps) => {
  return (
    <div 
      className="relative bg-black h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 text-center text-white z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
