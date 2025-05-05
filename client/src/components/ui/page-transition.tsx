import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: ReactNode;
  location: string;
  className?: string;
}

export const PageTransition = ({
  children,
  location,
  className = "",
}: PageTransitionProps) => {
  // Варианты анимации
  const variants = {
    initial: { opacity: 0, x: 0 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, x: 0, transition: { duration: 0.2, ease: "easeInOut" } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Обёртка для использования с компонентами страниц
export const withPageTransition = <P extends object>(
  Component: React.ComponentType<P>,
  className?: string
) => {
  return (props: P) => {
    const [location] = useLocation();
    
    return (
      <PageTransition location={location} className={className}>
        <Component {...props} />
      </PageTransition>
    );
  };
};