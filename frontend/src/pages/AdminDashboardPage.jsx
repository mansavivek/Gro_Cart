import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';

const adminCards = [
  { title: 'Product Management', description: 'Add, edit, and remove products', emoji: '📦', to: '/admin/products' },
  { title: 'Order Management', description: 'View and update order statuses', emoji: '🚚', to: '/admin/orders' },
];

export default function AdminDashboardPage() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {adminCards.map((card) => (
          <Link key={card.to} to={card.to}>
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{card.emoji}</span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </MainLayout>
  );
}
