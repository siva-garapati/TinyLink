import Dashboard from "@/components/dashboard/DashBoard";
import prisma from "@/lib/prisma";

export interface Link {
  id: string;
  code: string;
  url: string;
  clicks: number;
  createdAt: string;
  lastClicked: string | null;
}

export default async function DashboardPage() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });

  const typedLinks: Link[] = links.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    lastClicked: l.lastClicked ? l.lastClicked.toISOString() : null
  }));

  return <Dashboard initialLinks={typedLinks} />;
}