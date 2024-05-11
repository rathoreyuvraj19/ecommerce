import { Button } from "@/components/ui/button";
import prisma from "@/db/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  ProductCard,
  ProductCardSkeleton,
} from "../admin/_components/ProductsCard";
import { Suspense } from "react";

function getMostPopular() {
  return prisma.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: "desc" } },
    take: 6,
  });
}

function getNewestProducts() {
  return prisma.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

export default function Home() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productsFetcher={getMostPopular}
      ></ProductGridSection>
      <ProductGridSection
        title="Newest"
        productsFetcher={getNewestProducts}
      ></ProductGridSection>
    </main>
  );
}

interface ProductsFetcherProps {
  title: string;
  productsFetcher: () => Promise<Product[]>;
}

function ProductGridSection({ title, productsFetcher }: ProductsFetcherProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant={"outline"} asChild>
          <Link className="space-x-2" href="/products">
            <span>View All</span>
            <ArrowRight className="size-4"></ArrowRight>
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 mdLgrid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton></ProductCardSkeleton>
              <ProductCardSkeleton></ProductCardSkeleton>
              <ProductCardSkeleton></ProductCardSkeleton>
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher}></ProductSuspense>
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  const products = await productsFetcher();
  return (
    <>
      {products.map((product) => {
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imagePath={product.imagePath}
          ></ProductCard>
        );
      })}
    </>
  );
}
