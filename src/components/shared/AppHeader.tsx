import { Github } from "lucide-react";
import Section from "./Section";
import { ModeToggle } from "../mode-toggle";
import { Separator } from "@/components/ui/separator";

function GithubButton() {
    return (
        <a
            href="https://github.com/nhinguyen140809/billsplitter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/80 font-medium hover:text-muted-foreground/90 flex items-center active:text-primary transition text-sm md:text-base"
        >
            <Github className="inline mr-2 size-5" />
            View on GitHub
        </a>
    );
}

function AppHeader({ children }: { children?: React.ReactNode }) {
    return (
        <Section className="text-center pb-3 sm:pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mt-2 sm:mt-0">
                Bill Splitter
            </h1>
            <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-4 mt-4 sm:mt-6">
                <ModeToggle />
                <GithubButton />
            </div>
            <Separator className="mb-3 mt-4 sm:my-5"/>
            {children}
        </Section>
    );
}

export default AppHeader;
