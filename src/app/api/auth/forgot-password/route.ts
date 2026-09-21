import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 anyway to prevent email enumeration attacks
      return NextResponse.json({ message: "If an account exists with that email, a reset link has been sent." }, { status: 200 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Store in DB
    await prisma.resetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    try {
      // Configure Nodemailer for Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      // Send the email
      await transporter.sendMail({
        from: `"Pradeshik News Bihar" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "Reset your Pradeshik News Bihar password",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password for Pradeshik News Bihar.</p>
            <p>Click the link below to set a new password. This link will expire in 1 hour.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0B1F33; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email via Nodemailer:", emailError);
      // In development, log the URL so we can test without real emails
      console.log("DEVELOPMENT RESET URL:", resetUrl);
    }

    return NextResponse.json(
      { message: "If an account exists with that email, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
