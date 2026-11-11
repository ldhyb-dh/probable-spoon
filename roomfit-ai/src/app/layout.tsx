import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoomFit AI | 내 방에 맞는 새로운 배치",
  description: "방 크기와 가구를 바탕으로 더 편리한 공간을 계획하는 AI 인테리어 서비스입니다.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
