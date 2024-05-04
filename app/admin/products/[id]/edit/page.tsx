import prisma from "@/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";

export default async function NewProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product}></ProductForm>
    </>
  );
}
