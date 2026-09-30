import type { Metadata } from "next";
import LandingPage from "@/features/marketing/components/LandingPage";

export const metadata: Metadata = {
  title: "CodeSage — AI Pull Request Reviews",
  description:
    "Automated pull request reviews with security insights and repository-aware AI feedback, delivered directly to GitHub.",
};

export default function Home() {
  return <LandingPage />;
}
