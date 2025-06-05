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
  return <div style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }} className="relative bg-black h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden my-0 py-0 mx-0 px-[240px]">
      <div className="container text-center text-white z-10 py-0 px-0 mx-0 my-0">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 mx-px py-[10px] px-[133px] my-[48px]">{title}</h1>
        {subtitle && <p className="text-lg max-w-3xl md:text-xl font-normal text-center mx-[37px] px-0 my-[3px] py-[4px]">{subtitle}</p>}
        {children}
      </div>
    </div>;
};
export default PageHeader;