import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const {code} = await params;

    const link = await prisma.link.findUnique({
        where: { code },
    });

    if (!link) {
        return NextResponse.json(
            { error: "Not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(link);
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const {code} = await params;

    const link = await prisma.link.findUnique({
        where: { code },
    });

    if (!link) {
        return NextResponse.json(
            { error: "Not found" },
            { status: 404 }
        );
    }

    await prisma.link.delete({
        where: { code },
    });

    return NextResponse.json({ success: true });
}