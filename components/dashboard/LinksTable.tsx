"use client";

import { Trash2, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import CopyButton from "../shared/CopyButton";
import { LinkData } from "@/types/link";
import { formatLastClicked } from "@/utils/date";

export type SortField = "code" | "clicks" | "lastClicked";
export type SortDirection = "asc" | "desc";

interface LinksTableProps {
    links: LinkData[];
    onDelete: (code: string) => void;
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
}

export default function LinksTable({
    links,
    onDelete,
    sortField,
    sortDirection,
    onSort,
}: LinksTableProps) {
    const [deletingCode, setDeletingCode] = useState<string | null>(null);

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;

        return sortDirection === "asc"
            ? <ArrowUp className="h-3 w-3 ml-1" />
            : <ArrowDown className="h-3 w-3 ml-1" />;
    };

    const handleDelete = (code: string) => {
        setDeletingCode(code);
        setTimeout(() => {
            onDelete(code);
            setDeletingCode(null);
        }, 500);
    };

    const truncateUrl = (url: string, maxLength = 50) =>
        url.length > maxLength ? url.slice(0, maxLength) + "..." : url;

    return (
        <div className="rounded-lg border border-[#00000030] bg-[hsl(0,0%,100%)] text-[hsl(0,0%,9%)] shadow-md overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b border-[#00000030] transition-colors hover:bg-transparent">
                            <th className="h-12 px-4 text-left align-middle font-semibold text-[hsl(var(--muted-foreground))]">
                                <button
                                    onClick={() => onSort("code")}
                                    className="flex items-center hover:text-[hsl(var(--foreground))] transition-colors"
                                >
                                    Short Code
                                    {getSortIcon("code")}
                                </button>
                            </th>

                            <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">
                                Target URL
                            </th>

                            <th className="h-12 px-4 text-center align-middle font-semibold text-muted-foreground">
                                <button
                                    onClick={() => onSort("clicks")}
                                    className="flex items-center mx-auto hover:text-foreground transition-colors"
                                >
                                    Total clicks
                                    {getSortIcon("clicks")}
                                </button>
                            </th>

                            <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">
                                <button
                                    onClick={() => onSort("lastClicked")}
                                    className="flex items-center hover:text-foreground transition-colors"
                                >
                                    Last Clicked
                                    {getSortIcon("lastClicked")}
                                </button>
                            </th>

                            <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="[&_tr:last-child]:border-0">
                        {links.map((link) => (
                            <tr key={link.code} className="border-b border-[#00000030] hover:bg-muted/50 transition-colors">
                                <td className="p-4 align-middle font-mono font-medium">
                                    <div className="flex items-center gap-2">
                                        <Link href={`/code/${link.code}`} className="hover:text-accent transition-colors">
                                            {link.code}
                                        </Link>
                                        <CopyButton text={`localhost:3000/${link.code}`} />
                                    </div>
                                </td>

                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-2 max-w-xs">
                                        <span className="text-sm text-muted-foreground truncate">
                                            {truncateUrl(link.url)}
                                        </span>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </td>

                                <td className="p-4 align-middle text-center">
                                    <span className="font-semibold">{link.clicks.toLocaleString()}</span>
                                </td>

                                <td className="p-4 align-middle">
                                    <span className="text-sm text-muted-foreground">
                                        {formatLastClicked(link.lastClicked) || "Never"}
                                    </span>
                                </td>

                                <td className="p-4 align-middle text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleDelete(link.code)}
                                            disabled={deletingCode === link.code}
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md cursor-pointer text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-[hsl(0,84%,60%)] h-9 w-9"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}