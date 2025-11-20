"use client";

import { useMemo, useState } from "react";
import { Search, LinkIcon, Filter } from "lucide-react";
import LinksTable from "@/components/dashboard/LinksTable";
import EmptyState from "@/components/shared/EmptyState";
import CreateLinkForm from "@/components/dashboard/CreateLinkForm";
import Header from "../layout/Header";
import { LinkData } from "@/types/link";

interface DashboardClientProps {
    initialLinks: LinkData[];
}

export default function DashboardClient({ initialLinks }: DashboardClientProps) {
    const [links, setLinks] = useState<LinkData[]>(initialLinks);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "high" | "medium" | "low" | "recent" | "never">("all");

    const [sortField, setSortField] = useState<"code" | "clicks" | "lastClicked">("clicks");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const handleSort = (field: typeof sortField) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection(field === "clicks" ? "desc" : "asc");
        }
    };

    const handleDelete = async (code: string) => {
        await fetch(`/api/links/${code}`, { method: "DELETE" });
        setLinks((prev) => prev.filter((l) => l.code !== code));
    };

    const addLink = (data: LinkData) => {
        setLinks((prev) => [data, ...prev]);
    };

    const filteredAndSortedLinks = useMemo(() => {
        return links
            .filter((l) => {
                const s = search.toLowerCase();
                return l.code.toLowerCase().includes(s) || l.url.toLowerCase().includes(s);
            })
            .filter((l) => {
                if (filter === "all") return true;
                if (filter === "high") return l.clicks >= 1000;
                if (filter === "medium") return l.clicks >= 100 && l.clicks < 1000;
                if (filter === "low") return l.clicks < 100;
                if (filter === "never") return !l.lastClicked;
                if (filter === "recent") {
                    return !!l.lastClicked;
                }
                return true;
            })
            .sort((a, b) => {
                let compare = 0;

                if (sortField === "code") compare = a.code.localeCompare(b.code);
                if (sortField === "clicks") compare = a.clicks - b.clicks;
                if (sortField === "lastClicked") {
                    const aT = a.lastClicked ? new Date(a.lastClicked).getTime() : 0;
                    const bT = b.lastClicked ? new Date(b.lastClicked).getTime() : 0;
                    compare = aT - bT;
                }

                return sortDirection === "asc" ? compare : -compare;
            });
    }, [links, search, filter, sortField, sortDirection]);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center space-y-4 py-8">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Shorten Your Links
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Create short, memorable links in seconds. Track clicks and manage all your links in one place.
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <CreateLinkForm onSuccess={addLink} />
                    </div>

                    {links.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">Your Links</h2>
                            <span className="text-sm text-muted-foreground">
                                {filteredAndSortedLinks.length} of {links.length} links
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search links..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                        className="h-10 w-full rounded-md border border-[#00000030] bg-[hsl(0,0%,100%)] pl-9 pr-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value as "all" | "high" | "medium" | "low" | "recent" | "never")}
                                        className="h-10 w-full sm:w-[180px] appearance-none rounded-md border border-[#00000030] bg-background pl-9 pr-8 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="all">All Links</option>
                                        <option value="high">High Traffic (&gt;1K)</option>
                                        <option value="medium">Medium Traffic</option>
                                        <option value="low">Low Traffic</option>
                                        <option value="recent">Recently Clicked</option>
                                        <option value="never">Never Clicked</option>
                                    </select>
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                        </div>

                        {filteredAndSortedLinks.length > 0 ? (
                            <LinksTable
                                links={filteredAndSortedLinks}
                                onDelete={handleDelete}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                            />
                        ) : (
                            <EmptyState
                                icon={LinkIcon}
                                title="No links found"
                                description="Try adjusting search or filters"
                            />
                        )}

                        
                    </div>
                    )}
                    {links.length === 0 && (
                        <div className="rounded-lg bg-card">
                            <EmptyState
                                icon={LinkIcon}
                                title="No links yet"
                                description="Create your first short link to get started"
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
