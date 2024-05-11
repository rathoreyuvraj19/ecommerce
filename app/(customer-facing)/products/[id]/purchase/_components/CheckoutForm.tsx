"use client";
import { userOrderExists } from "@/app/(customer-facing)/_actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatter";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

interface CheckoutFormProps {
  product: {
    imagePath: string;
    name: string;
    price: number;
    description: string;
    id: string;
  };
  clientSecret: string;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  return (
    <div className="max-2-5xl w-full mx-auto space-y-8">
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
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form price={product.price} productId={product.id}></Form>
      </Elements>
    </div>
  );
}

function Form({ price, productId }: { price: number; productId: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (stripe == null || elements == null || email === null) {
      return;
    }
    setLoading(true);
    //Check for existing order
    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product try downloading it from the My Orders Page"
      );
    }

    stripe
      ?.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          if (error.message === undefined) {
            setErrorMessage("An unknown error occured");
          } else {
            setErrorMessage(error.message);
          }
        } else {
          console.log(error);
          setErrorMessage("An unknown error occured");
        }
      })
      .finally(() => setLoading(false));
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <PaymentElement></PaymentElement>
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            ></LinkAuthenticationElement>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size={"lg"}
            disabled={stripe === null || elements === null || loading}
            type="submit"
          >
            {loading
              ? "Loading..."
              : `Purchase - ${formatCurrency(price / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
