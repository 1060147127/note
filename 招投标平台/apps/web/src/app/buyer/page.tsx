import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import BuyerClient from "./BuyerClient";

export default async function BuyerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "BUYER") redirect("/");
  return (
    <>
      <AppHeader user={user} />
      <BuyerClient />
    </>
  );
}
