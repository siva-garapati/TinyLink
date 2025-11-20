"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
    text: string;
    label?: string;
}

const CopyButton = ({ text, label = "Copy" }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy text: ", error);
            toast("Failed to copy. Please try again.");
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-3"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    <span className="text-xs">Copied</span>
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    <span className="text-xs">{label}</span>
                </>
            )}
        </button>
    );
};

export default CopyButton;