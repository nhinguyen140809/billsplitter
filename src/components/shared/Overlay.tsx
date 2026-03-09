export default function Overlay({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-primary-foreground/70 flex items-center justify-center z-50 px-4 sm:px-0 transition-opacity duration-300 backdrop-blur-xl">
            {children}
        </div>
    );
}
