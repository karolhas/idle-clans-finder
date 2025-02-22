"use client";

//components
import Sidebar from "@/components/Sidebar";

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
}
