import {
  ProductCard,
  ProductCardSkeleton,
} from "@/app/admin/_components/ProductsCard";
import prisma from "@/db/db";
import { Suspense } from "react";

async function getProducts() {
  return prisma.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
  });
}

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 mdLgrid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
            <ProductCardSkeleton></ProductCardSkeleton>
          </>
        }
      >
        <ProductsSuspense></ProductsSuspense>
      </Suspense>
    </div>
  );
}

async function ProductsSuspense() {
  const products = await getProducts();
  return products.map((product) => {
    return <ProductCard key={product.id} {...product}></ProductCard>;
  });
}
