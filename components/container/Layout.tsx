import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}
/**
 *
 * @param children elements passed inside <Layout></Layout>
 */
function Layout({ children, className = "" }: Props) {
  return (
    <div
      className={`sm:flex sm:flex-row  bg-inner-light dark:bg-inner-dark h-screen w-screen sm:overflow-hidden transition-colors duration-300  ${className}`}
    >
      {children}
    </div>
  );
}

export default Layout;
