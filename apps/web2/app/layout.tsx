import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Почему нет?",
  description: "Проект практики.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-10 text-sm text-white/50">
          <div className="mt-10 border-t border-white/10 pt-6">Почему нет - демо</div>
        </footer>
      </body>
    </html>
  );
}
