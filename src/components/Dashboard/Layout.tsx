import Sidebar from '@/components/Includes/Sidebar';
import Header from '@/components/Includes/Header';
import Footer from '@/components/Includes/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 bg-gray-700/20 overflow-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
