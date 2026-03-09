export default function Popup({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div className="w-full h-fit max-h-4xl max-w-lg bg-primary-foreground/20 border border-primary rounded-2xl p-4 py-6 flex flex-col sm:px-10 sm:py-10 px-6 backdrop-blur-xl">
            <h2 className="text-2xl font-extrabold text-primary mb-4">
                {title}
            </h2>
            {children}
        </div>
    );
}
