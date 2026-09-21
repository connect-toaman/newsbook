import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    
    // Strict authentication: Only ADMINs can change user roles
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, newRole } = await req.json();

    if (!userId || !["USER", "CONTRIBUTOR", "ADMIN"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // Prevent an admin from removing their own admin access accidentally
    if (userId === session.userId && newRole !== "ADMIN") {
      return NextResponse.json({ error: "You cannot demote yourself. Ask another Admin." }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as any }, // 'any' cast avoids prisma enum strict typing issues locally
    });

    return NextResponse.json({ success: true, user: { id: updatedUser.id, role: updatedUser.role } });
  } catch (error) {
    console.error("User Role update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
