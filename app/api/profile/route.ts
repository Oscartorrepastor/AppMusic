import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    avatar: z.union([z.string().trim().url("Invalid avatar URL"), z.literal("")]).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.union([z.string().min(6, "New password must be at least 6 characters"), z.literal("")]).optional(),
  })
  .superRefine((data, ctx) => {
    if ((data.newPassword ?? "").length > 0 && !(data.currentPassword ?? "").trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentPassword"],
        message: "Current password is required",
      });
    }
  });

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { password: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: {
      name: string;
      avatar: string | null;
      password?: string;
    } = {
      name: validatedData.name,
      avatar: validatedData.avatar?.trim() || null,
    };

    const nextPassword = validatedData.newPassword?.trim();

    if (nextPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        validatedData.currentPassword || "",
        existingUser.password
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(nextPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
