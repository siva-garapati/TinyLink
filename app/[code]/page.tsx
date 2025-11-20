import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function RedirectPage({ params }: {params : Promise<{code: string}>}) {
    const {code} = await params;

    const link = await prisma.link.findUnique({
        where: { code },
    });

    if (!link) {
        notFound();
    }

    await prisma.link.update({
        where: { code },
        data: {
            clicks: link.clicks + 1,
            lastClicked: new Date(),
        },
    });

    redirect(link.url);
}