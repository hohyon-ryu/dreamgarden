import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "꿈이자라는뜰 - AI 통합 발달장애인 모바일 플랫폼",
  description: "발달장애인 당사자와 관련 이해관계자 간의 신뢰 기반 기록 공유 및 성장 지원 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
