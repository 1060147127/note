import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import BidderProjectClient from "./BidderProjectClient";

export default async function BidderProjectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "BIDDER") redirect("/");
  return (
    <>
      <AppHeader user={user} />
      <BidderProjectClient />
    </>
  );
}
