import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


function randomCode() {
    return Math.random().toString(36).substring(2, 10).slice(0, 8);
}

export async function POST(request: Request) {
    try {
        const { url, code } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        const customCode = code?.trim();
        if (customCode && !/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
            return NextResponse.json(
                { error: "Code must be alphanumeric and 6–8 characters long" },
                { status: 400 }
            );
        }

        if (customCode) {
            const existing = await prisma.link.findUnique({
                where: { code: customCode }
            });

            if (existing) {
                return NextResponse.json(
                    { error: "Code already exists" },
                    { status: 409 }
                );
            }

            const newLink = await prisma.link.create({
                data: { code: customCode, url }
            });
            return NextResponse.json(newLink, { status: 201 });
        }

        let generated = randomCode();

        while (true) {
            const exists = await prisma.link.findUnique({
                where: { code: generated }
            });

            if (!exists) break;

            generated = randomCode();
        }

        const newLink = await prisma.link.create({
            data: { code: generated, url }
        });

        return NextResponse.json(newLink, { status: 201 });

    } catch (error) {
        console.error("Error in POST /api/links:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    const links = await prisma.link.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(links);
}