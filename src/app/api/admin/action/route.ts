import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, action } = await req.json();

    if (!postId || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const newStatus = action === "APPROVE" ? "PUBLISHED" : "REJECTED";

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
