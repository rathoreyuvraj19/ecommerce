"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatter";
import { useState } from "react";
import { addProduct, updateProduct } from "../../_action/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";

export function ProductForm({ product }: { product?: Product | null }) {
  const [price, setPrice] = useState<number | undefined>(product?.price);
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name}
        ></Input>

        {error.name && <div className="destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          type="text"
          id="price"
          name="price"
          required
          value={price}
          onChange={(e) => setPrice(Number(e.target.value) || undefined)}
          defaultValue={product?.price}
        ></Input>
        <div className="text-muted-foreground">
          {formatCurrency(price || 0)}
        </div>
        {error.price && <div className="text-destructive">{error.price}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description}
        ></Textarea>
      </div>
      {error.description && (
        <div className="text-destructive">{error.description}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          type="file"
          id="file"
          name="file"
          required={product === null}
        ></Input>
        {product !== null && (
          <div className="text-muted-foreground">{product?.filePath}</div>
        )}
      </div>
      {error.file && <div className="text-destructive">{error.file}</div>}
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="iamge"
          name="image"
          required={product === null}
        ></Input>
        {product !== null && (
          <img
            height={"400"}
            width={"400"}
            src={product?.imagePath}
            alt="Product Image"
          />
        )}
      </div>
      {error.image && <div className="text-destructive">{error.image}</div>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
