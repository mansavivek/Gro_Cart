import Navbar from '../components/Navbar';

export default function MainLayout({ children, contentClassName, hideFooter = false, navbarProps = {} }) {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar {...navbarProps} />
      <main className={contentClassName || 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {children}
      </main>
      {!hideFooter && (
        <footer className="bg-surface-container-low border-t mt-16 py-8 text-center text-sm text-on-surface-variant">
          © {new Date().getFullYear()} Gro-Cart. All rights reserved.
        </footer>
      )}
    </div>
  );
}
