import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

const Header = () => {
    return (
        <header className="border-b border-[hsl(0,0%,90%)] bg-card">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <LinkIcon className="h-6 w-6" />
                        <span className="text-xl font-semibold">TinyLink</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <div
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Dashboard
                        </div>
                        <Link
                            href="/healthz"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Status
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;