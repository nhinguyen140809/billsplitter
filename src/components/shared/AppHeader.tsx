import { Github } from "lucide-react";
import { Section } from "./Section";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { Alert } from "../ui/alert";

function GithubButton() {
    return (
        <a
            href="https://github.com/nhinguyen140809/billsplitter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/80 font-medium hover:text-muted-foreground/90 flex items-center active:text-primary transition"
        >
            <Github size={20} strokeWidth={2} className="inline mr-2" />
            View on GitHub
        </a>
    );
}

function AppHeader() {
    return (
        <Section className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
                Bill Splitter
            </h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                <GithubButton />
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                <ModeToggle />
                {/* Navigation to saved settlement */}
            </div>
        </Section>
    );
}

export default AppHeader;
