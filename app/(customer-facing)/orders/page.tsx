"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { emailOrderHistoryAction } from "../_actions/sendOrderHistoryAction";

export default function MyOrdersPage() {
  const [data, action] = useFormState(emailOrderHistoryAction, {});
  console.log(data.message);
  // if (data.error) {
  //   alert(data.error);
  //   console.log(data.error);
  // }
  return (
    <form action={action} className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter Your email and we will send you your order history and
            download link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="xyx@example.com"
              required
              name="email"
            ></Input>
            {data.error && <div className="text-destructive">{data.error}</div>}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton></SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" size={"lg"} disabled={pending}>
      {pending ? "Sending" : "Send"}
    </Button>
  );
}
