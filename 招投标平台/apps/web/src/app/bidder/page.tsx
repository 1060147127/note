import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import BidderClient from "./BidderClient";

export default async function BidderPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "BIDDER") redirect("/");
  return (
    <>
      <AppHeader user={user} />
      <BidderClient />
    </>
  );
}
