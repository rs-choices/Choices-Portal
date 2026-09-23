import type { Metadata } from "next";
import { PortalProvider } from "@/components/portal/PortalProvider";
import { fontVariables } from "@/theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Choices Business Portal", template: "%s · Choices Business Portal" },
  description: "Post offers, manage bookings and see how customers find your venue on Choices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PortalProvider>{children}</PortalProvider>
      </body>
    </html>
  );
}
