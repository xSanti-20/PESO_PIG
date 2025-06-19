import { ToastProvider } from "@/components/ui/toast";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PESO PIG",
  description: "Proyecto inspirado en la unidad de Porcinos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/assets/img/pesopig.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
