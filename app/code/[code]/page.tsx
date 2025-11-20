import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Header from "@/components/layout/Header";
import CopyButton from "@/components/shared/CopyButton";

export default async function StatsPage({
    params,
}: {
    params: { code: string };
}) {
    const {code} = await params;
    const link = await prisma.link.findUnique({
        where: { code: code },
    });

    if (!link) return notFound();

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Back Button */}
                    <Link href="/">
                        <button className="inline-flex mb-2 items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-[hsl(0,0%,15%)] h-10 px-4 py-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </button>
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Link Statistics</h1>
                        <p className="text-muted-foreground">
                            Viewing analytics for{" "}
                            <span className="font-mono font-medium">{link.code}</span>
                        </p>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-md p-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Short Link</p>
                                <div className="flex items-center gap-2">
                                    <code className="text-lg font-mono font-semibold">
                                        tinylink.app/{link.code}
                                    </code>
                                    <CopyButton text={`${process.env.NEXT_PUBLIC_APP_URL}/${link.code}`} />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Destination URL
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm break-all">{link.url}</p>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Total Clicks
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {link.clicks.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Last Clicked
                                    </p>
                                    <p className="text-lg font-medium">
                                        {link.lastClicked
                                            ? new Date(link.lastClicked).toLocaleString()
                                            : "Never"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Created</p>
                                    <p className="text-lg font-medium">
                                        {new Date(link.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}