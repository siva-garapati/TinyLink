// utils/date.ts
export function formatLastClicked(dateStr: string | null): string {
    if (!dateStr) return "Never";

    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const sec = diffMs / 1000;
    const min = sec / 60;
    const hr = min / 60;
    const day = hr / 24;

    if (min < 1) return "Just now";
    if (min < 60) return `${Math.floor(min)} min ago`;
    if (hr < 24) return `${Math.floor(hr)} hour${Math.floor(hr) > 1 ? "s" : ""} ago`;
    if (day < 2) return "Yesterday";

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}