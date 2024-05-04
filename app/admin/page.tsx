import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import prisma from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatter";

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { price: true },
    _count: true,
  });
  return {
    amount: (data._sum.price || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const userCount = await prisma.user.count();
  const orderData = await prisma.order.aggregate({
    _sum: { price: true },
  });

  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.price || 0) / userCount / 100,
  };
}

async function getProductData() {
  const activeCount = await prisma.product.count({
    where: { isAvailableForPurchase: true },
  });
  const inactiveCount = await prisma.product.count({
    where: { isAvailableForPurchase: false },
  });

  return {
    activeCount,
    inactiveCount,
  };
}

export default async function AdminDashboard() {
  const salesData = await getSalesData();
  const userData = await getUserData();
  const productData = await getProductData();

  return (
    <div>
      <DashboardCard
        title={"Sales"}
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title={"Customers"}
        subtitle={`${formatCurrency(userData.averageValuePerUser)} Average`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title={"Active Products"}
        subtitle={`${formatNumber(productData.activeCount)} Inactive`}
        body={formatNumber(productData.inactiveCount)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{body}</p>
        </CardContent>
      </Card>
    </div>
  );
}