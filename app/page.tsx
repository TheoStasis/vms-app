import { redirect } from "next/navigation";

export default function HomePage() {
  // Instantly bounce the user to the dashboard
  redirect("/dashboard");
}