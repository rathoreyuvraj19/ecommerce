"use server";

import prisma from "@/db/db";
import { Resend } from "resend";
import { z } from "zod";
import OrderHistoryEmail from "@/emails/OrderHistoryEmail";

const formSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function emailOrderHistoryAction(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const email = formData.get("email");
  const result = await formSchema.safeParse(email);

  if (!result.success) {
    return { error: "Invalid email address" };
  }

  const user = await prisma.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          id: true,
          price: true,
          createdAt: true,
          productId: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });
  if (!user) {
    return { error: "User not found" };
  }

  const orders = user.orders.map(async (order) => {
    return {
      ...order,
      downloadVerificationId: (
        await prisma.downloadVerification.create({
          data: {
            expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
            productId: order.product.id,
          },
        })
      ).id,
    };
  });

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
  });

  if (data.error) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }

  return {
    message:
      "Check your email to view your order history and download your products.",
  };
}
