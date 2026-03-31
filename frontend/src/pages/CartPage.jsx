import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Spinner from '../components/ui/Spinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutModal from '../components/CheckoutModal';

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, emptyCart, fetchCart } = useCart();
  const { user } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openCheckoutModal) {
      setCheckoutOpen(true);
      navigate('/cart', { replace: true, state: null });
    }
  }, [location.state, navigate]);

  if (loading) return <MainLayout><Spinner /></MainLayout>;

  if (cart.items.length === 0 && !checkoutOpen) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-20 text-center">
          <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_basket</span>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-3">Your cart is empty</h2>
            <p className="text-on-surface-variant mb-6">Add fresh items to begin your curated checkout.</p>
            <Link className="inline-flex bg-primary text-on-primary px-6 py-3 rounded-lg font-bold" to="/">
              Start Shopping
            </Link>
          </div>
        </div>
        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cart={cart}
          fetchCart={fetchCart}
          user={user}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-2 font-body">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Shopping Cart</h1>
            <p className="text-on-surface-variant font-medium">You have {cart.items.length} item(s) in your selection.</p>
          </div>
          <button onClick={emptyCart} className="text-sm text-error hover:text-error-dim font-semibold">
            Clear Cart
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <section className="lg:col-span-8 space-y-6">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-surface-container-lowest rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300 shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
                <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                    {item.product?.image_url ? (
                      <img alt={item.product.name} className="h-full w-full object-cover" src={item.product.image_url} />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-outline-variant">shopping_basket</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-on-surface font-headline">{item.product?.name}</h3>
                      <button className="hidden md:block material-symbols-outlined text-outline-variant hover:text-error cursor-pointer transition-colors" onClick={() => removeItem(item.id)} type="button">
                        delete
                      </button>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-4">{item.product?.category?.name || 'Groceries'}</p>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="text-primary font-bold text-lg">${item.product?.price?.toFixed(2)} <span className="text-xs text-outline font-normal">/ unit</span></div>

                      <div className="flex items-center justify-center bg-surface-container-low rounded-full px-2 py-1">
                        <button className="w-8 h-8 flex items-center justify-center text-primary active:scale-90 transition-transform" disabled={item.quantity <= 1} onClick={() => updateItem(item.id, item.quantity - 1)} type="button">
                          <span className="material-symbols-outlined text-lg">remove</span>
                        </button>
                        <span className="px-4 font-bold text-on-surface">{item.quantity}</span>
                        <button className="w-8 h-8 flex items-center justify-center text-primary active:scale-90 transition-transform" onClick={() => updateItem(item.id, item.quantity + 1)} type="button">
                          <span className="material-symbols-outlined text-lg">add</span>
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-outline uppercase tracking-wider font-semibold">Subtotal</p>
                        <p className="text-lg font-black text-on-surface">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <button className="md:hidden text-error mt-2 flex items-center gap-1 text-sm font-semibold" onClick={() => removeItem(item.id)} type="button">
                    <span className="material-symbols-outlined text-sm">delete</span> Remove Item
                  </button>
                </div>
              ))}
          </section>

          <aside className="lg:col-span-4 sticky top-24">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_20px_50px_rgba(43,47,49,0.05)]">
              <h2 className="text-xl font-bold font-headline mb-6 text-on-surface">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Total items ({cart.total_items})</span>
                  <span className="font-semibold text-on-surface">${cart.total_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Delivery charges</span>
                  <span className="font-semibold text-primary">FREE</span>
                </div>
                <div className="pt-6 border-t border-surface-container-high mb-2">
                  <div className="flex justify-between items-end">
                    <span className="text-on-surface font-medium">Total Amount</span>
                    <span className="text-3xl font-black text-on-surface tracking-tighter">${cart.total_price.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-outline text-right mt-1 uppercase tracking-widest font-bold">Including VAT</p>
                </div>
              </div>

              <button
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dim active:scale-[0.98] transition-all"
                onClick={() => setCheckoutOpen(true)}
                type="button"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-outline-variant">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span className="text-xs font-medium uppercase tracking-tighter">Secure SSL Encryption</span>
              </div>

            </div>
          </aside>
        </div>
      </div>
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        fetchCart={fetchCart}
        user={user}
      />
    </MainLayout>
  );
}
