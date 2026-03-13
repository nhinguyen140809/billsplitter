import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

const AppRoutesWrapper = () => {
    const routes = useRoutes(AppRoutes);
    return routes;
};

function App() {
    return (
        <div className="min-h-screen flex justify-center bg-background bg-gradient-to-bl dark:from-background/95 to-accent/30 bg-[length:200%_200%] animated-gradient">
            <div className="w-full max-w-4xl px-3 py-8 sm:py-8 lg:px-0 gap-4 flex flex-col sm:gap-8">
                <ThemeProvider>
                    <BrowserRouter>
                        <AppRoutesWrapper />
                    </BrowserRouter>
                </ThemeProvider>
            </div>
        </div>
    );
}

export default App;
