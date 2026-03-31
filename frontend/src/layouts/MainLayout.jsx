import Navbar from '../components/Navbar';

export default function MainLayout({ children, contentClassName, hideFooter = false, navbarProps = {}, backgroundStyle = {} }) {
  const defaultBackgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDeX4zOPo9TX3mkIqXejygJX8y9j01whBwv0ZKx080l-wfAJttySxhoIoNkAKEQS7lYt9gZkH3fcWUc-OTSSyc5WSWss1pXtjWpBi22Lkf5_syDMf1g_-Dm3sIoZ-hgsVs3_K32J6NUT11S3_WoqLe3O5ahFXC65EgH2rwf8mZNnqgDHB4lc7G0JKAYMdOw7M_F36tHRTDgGygRlz6ZWhC1gOlaiLstaG3z05Dxt3JlKDWNzagnylvAcIdG16Cp0TnbaR6j-P8UXKE)",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface" style={{ ...defaultBackgroundStyle, ...backgroundStyle }}>
      <Navbar {...navbarProps} />
      <main className={contentClassName || 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1'}>
        {children}
      </main>
      {!hideFooter && (
        <footer className="border-t mt-auto py-8 text-center text-sm text-on-surface-variant" style={{ backgroundColor: 'rgb(255 255 255 / 0.8)' }}>
          © {new Date().getFullYear()} Gro-Cart. All rights reserved.
        </footer>
      )}
    </div>
  );
}
