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
  return <div className="relative bg-black h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden" style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}>
      <div className="container text-center text-white z-10 mx-0 py-[5px] my-0 px-0">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 my-[140px]">{title}</h1>
        {subtitle && <p className="text-lg max-w-3xl md:text-xl font-normal text-center px-0 py-[14px] mx-[205px] my-0">{subtitle}</p>}
        {children}
      </div>
    </div>;
};
export default PageHeader;