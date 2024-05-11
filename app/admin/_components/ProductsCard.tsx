import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  id: string;
  price: number;
  description: string;
  imagePath: string;
}

export function ProductCard({
  name,
  id,
  price,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className="flex overflow-hidden flex-col">
      <div className="relative w-full h-auto aspect-video">
        <Image src={imagePath} fill alt={name}></Image>
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(price / 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size={"lg"} className="w-full">
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="flex overflow-hidden flex-col">
      <div className="relative w-full h-auto aspect-video">
        <Skeleton className="h-full w-full rounded-xl"></Skeleton>
      </div>
      <CardHeader>
        <Skeleton className="h-6 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-4 w-[250px]" />
      </CardContent>
      <CardFooter>
        <Button asChild size={"lg"} className="w-full">
          <Skeleton></Skeleton>
        </Button>
      </CardFooter>
    </Card>
  );
}
