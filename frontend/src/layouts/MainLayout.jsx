import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t mt-16 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Gro-Cart. All rights reserved.
      </footer>
    </div>
  );
}
