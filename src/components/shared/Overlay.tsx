export default function Overlay({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`fixed top-0 left-0 w-screen h-screen bg-card/70 flex items-center justify-center z-50 px-4 sm:px-0 transition-opacity duration-300 backdrop-blur-xl ${className || ''}`}>
            {children}
        </div>
    );
}
