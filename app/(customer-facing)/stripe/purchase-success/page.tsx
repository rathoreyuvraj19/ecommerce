import Stripe from "stripe";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/db/db";
import { formatCurrency } from "@/lib/formatter";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (paymentIntent.metadata.productId === null) {
    return notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });

  if (product === null) {
    return notFound();
  }

  const isSuccess = paymentIntent.status === "succeeded";
  return (
    <div className="max-2-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl fomt-bold">{isSuccess ? "Success!" : "Error"}</h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image src={product.imagePath} fill alt={product.name}></Image>
        </div>
        <div>
          <div className="text-lg">{formatCurrency(product.price / 100)}</div>
          <h1 className="text-2xl">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button className="mt-4" size="lg" asChild>
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(
                  product.id
                )}`}
              >
                Download
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}></Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  return await prisma.downloadVerification.create({
    data: { productId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
  });
}
