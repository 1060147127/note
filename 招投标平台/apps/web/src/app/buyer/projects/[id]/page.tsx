import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import BuyerProjectClient from "./BuyerProjectClient";

export default async function BuyerProjectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "BUYER") redirect("/");
  return (
    <>
      <AppHeader user={user} />
      <BuyerProjectClient />
    </>
  );
}
