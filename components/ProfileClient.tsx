"use client";

import { useState, useTransition, useEffect, FormEvent } from "react";
import { User, Order, Product, Article, Address, NewsletterSubscriber } from "@prisma/client";
import { useToast } from "@/components/toast/use-toast";
import {
  updateUserProfile,
  changeUserPassword,
  deleteAddress,
} from "@/app/actions/profileOps";
import { updateNewsletterStatus } from "@/app/actions/cms/newsletter";
import { unsaveArticle, unsaveProduct } from "@/app/actions/saver";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AddAddressModal } from "./Addaddress";

// --- TYPE DEFINITION ---
type ProfileUser = User & {
  savedArticles: Article[];
  savedProducts: Product[];
  orders: Order[];
  addresses: Address[];
  newsletterSubscription: NewsletterSubscriber | null;
};

// --- MAIN CLIENT COMPONENT ---
export const ProfileClient = ({
  user,
  sessionId,
}: {
  user: ProfileUser;
  sessionId: string;
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  // State for data that can be updated live on the client
  const [currentUser, setCurrentUser] = useState(user);
  const [addresses, setAddresses] = useState(user.addresses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(user);
    setAddresses(user.addresses);
  }, [user]);

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders" },
    { id: "saved", label: "Saved Items" },
    { id: "addresses", label: "Addresses" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-3 lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              <div className="hidden md:block">
                <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] mb-4">MENU</h2>
                <nav className="flex flex-col space-y-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`text-left px-4 py-3 text-sm font-bold tracking-widest transition-all duration-300 border-l-2 ${activeTab === tab.id
                        ? "border-gold-primary text-gold-primary pl-6 bg-white/5"
                        : "border-transparent text-muted-foreground hover:text-white hover:pl-6"
                        }`}
                    >
                      {tab.label.toUpperCase()}
                    </button>
                  ))}
                </nav>
              </div>
              {/* Mobile Nav */}
              <div className="md:hidden">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full bg-black-secondary border border-white/20 text-white p-3 font-bold tracking-widest uppercase focus:ring-1 focus:ring-gold-primary outline-none"
                >
                  {TABS.map((tab) => (
                    <option key={tab.id} value={tab.id}>{tab.label.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="md:col-span-9 lg:col-span-9 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "overview" && (
                  <OverviewView user={currentUser} setActiveTab={setActiveTab} />
                )}
                {activeTab === "orders" && (
                  <OrdersView user={currentUser} />
                )}
                {activeTab === "saved" && (
                  <SavedItemsView
                    products={currentUser.savedProducts}
                    articles={currentUser.savedArticles}
                    userId={currentUser.id}
                    onRemoveProduct={(id) => {
                      // Basic state update simulation for now, deep update relies on effect or refetch usually
                      setCurrentUser(prev => ({ ...prev, savedProducts: prev.savedProducts.filter(p => p.id !== id) }))
                    }}
                    onRemoveArticle={(id) => {
                      setCurrentUser(prev => ({ ...prev, savedArticles: prev.savedArticles.filter(a => a.id !== id) }))
                    }}
                  />
                )}
                {activeTab === "addresses" && (
                  <AddressBookView
                    addresses={addresses}
                    userId={currentUser.id}
                    onAddAddressClick={() => setIsModalOpen(true)}
                    onRemoveAddress={(id) =>
                      setAddresses((addrs) => addrs.filter((a) => a.id !== id))
                    }
                  />
                )}
                {activeTab === "settings" && (
                  <SettingsView
                    user={currentUser}
                    onProfileUpdate={setCurrentUser}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={sessionId}
        onAddressAdded={(newAddress) =>
          setAddresses((current) => [...current, newAddress])
        }
      />
    </>
  );
};

// --- SUB-COMPONENTS ---

const OverviewView = ({ user, setActiveTab }: { user: ProfileUser, setActiveTab: (tab: string) => void }) => {
  return (
    <div className="space-y-12">
      <header className="border-b border-white/10 pb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Hello, {user.name?.split(' ')[0] || "User"}</h2>
        <p className="text-muted-foreground">Here's a snapshot of your Mode Men account.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div onClick={() => setActiveTab('orders')} className="bg-black-secondary border border-white/10 p-8 cursor-pointer group hover:border-gold-primary transition-colors">
          <p className="text-gold-primary text-4xl font-bold mb-2 group-hover:scale-110 transition-transform origin-left">{user.orders.length}</p>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground group-hover:text-white">Total Orders</p>
        </div>
        <div onClick={() => setActiveTab('saved')} className="bg-black-secondary border border-white/10 p-8 cursor-pointer group hover:border-gold-primary transition-colors">
          <p className="text-gold-primary text-4xl font-bold mb-2 group-hover:scale-110 transition-transform origin-left">{user.savedProducts.length}</p>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground group-hover:text-white">Saved Products</p>
        </div>
        <div onClick={() => setActiveTab('saved')} className="bg-black-secondary border border-white/10 p-8 cursor-pointer group hover:border-gold-primary transition-colors">
          <p className="text-gold-primary text-4xl font-bold mb-2 group-hover:scale-110 transition-transform origin-left">{user.savedArticles.length}</p>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground group-hover:text-white">Saved Articles</p>
        </div>
      </div>

      {user.orders.length > 0 && (
        <div>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-bold tracking-widest text-white">RECENT ORDER</h3>
            <button onClick={() => setActiveTab('orders')} className="text-xs text-gold-primary hover:text-white transition-colors tracking-widest uppercase">View All</button>
          </div>
          {/* Render just the first order reusing the card styles roughly or simplified */}
          <div className="border border-white/10 p-6 bg-black-secondary/50">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold tracking-wide">#{user.orders[0].orderId.substring(0, 8).toUpperCase()}</p>
              <p className="text-gold-primary font-bold">${user.orders[0].total.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {new Date(user.orders[0].createdAt).toLocaleDateString()} &bull; {user.orders[0].status}
            </p>
            <Link href={`/orders/${user.orders[0].id}`} className="text-xs font-bold border-b border-white/20 pb-1 hover:border-gold-primary hover:text-gold-primary transition-colors uppercase tracking-widest">
              View Order Details
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

const OrdersView = ({ user }: { user: ProfileUser }) => {
  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-2xl font-bold text-white tracking-widest">ORDER HISTORY</h2>
      </div>
      {user.orders.length === 0 ? (
        <EmptyState message="You haven't placed any orders yet." linkHref="/shop" linkText="BROWSE SHOP" />
      ) : (
        <div className="space-y-6">
          {user.orders.map((order) => (
            <div key={order.id} className="border border-white/10 p-6 bg-black-secondary hover:border-white/30 transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-bold text-white tracking-widest">ORDER #{order.orderId.substring(0, 8).toUpperCase()}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${order.status === 'DELIVERED' ? 'border-green-500 text-green-500' :
                      order.status === 'PAID' ? 'border-blue-500 text-blue-500' :
                        order.status === 'PENDING' ? 'border-yellow-500 text-yellow-500' :
                          'border-red-500 text-red-500'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold text-gold-primary mb-2">${order.total.toFixed(2)}</p>
                  <Link href={`/orders/${order.id}`} className="inline-block text-xs font-bold text-white bg-white/10 px-4 py-2 hover:bg-white hover:text-black-primary transition-colors tracking-widest uppercase">
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// --- SETTINGS VIEW COMPONENT ---
const SettingsView = ({
  user,
  onProfileUpdate,
}: {
  user: ProfileUser;
  onProfileUpdate: (user: ProfileUser) => void;
}) => {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [name, setName] = useState(user.name || "");

  const handleProfileUpdate = () => {
    startTransition(async () => {
      const result = await updateUserProfile(user.id, name);
      if (result.error || !result.data) {
        showToast(result.error || "Failed to update profile.", "error");
      } else {
        showToast(result.success!, "success");
        onProfileUpdate(result.data); // Update parent state with new user data
      }
    });
  };

  const handlePasswordChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;

    startPasswordTransition(async () => {
      const result = await changeUserPassword(user.id, formData);
      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast(result.success!, "success");
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="border border-border p-6">
        <h3 className="text-xl font-bold tracking-widest mb-4">
          PROFILE INFORMATION
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground tracking-widest">
              FULL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black-primary border border-border p-3 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-widest">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-black-secondary border border-border p-3 mt-1 text-muted-foreground cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleProfileUpdate}
            disabled={isPending || name === user.name}
            className="bg-gold-primary text-black-primary font-bold py-3 px-6 tracking-widest text-xs hover:bg-gold-secondary disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isPending ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>

      <div className="border border-border p-6">
        <h3 className="text-xl font-bold tracking-widest mb-4">
          NEWSLETTER PREFERENCES
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Subscribe to Mode Men Newsletter</p>
            <p className="text-xs text-muted-foreground mt-1">
              Receive exclusive updates, offers, and curated content.
            </p>
          </div>
          <NewsletterToggle
            userId={user.id}
            initialStatus={user.newsletterSubscription?.isSubscribed!}
          />
        </div>
      </div>

      <div className="border border-border p-6">
        <h3 className="text-xl font-bold tracking-widest mb-4">
          CHANGE PASSWORD
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            name="currentPassword"
            type="password"
            placeholder="Current Password"
            required
            className="w-full bg-black-primary border border-border p-3"
          />
          <input
            name="newPassword"
            type="password"
            placeholder="New Password"
            required
            className="w-full bg-black-primary border border-border p-3"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            required
            className="w-full bg-black-primary border border-border p-3"
          />
          <button
            type="submit"
            disabled={isPasswordPending}
            className="bg-gold-primary text-black-primary font-bold py-3 px-6 tracking-widest text-xs hover:bg-gold-secondary disabled:bg-gray-600"
          >
            {isPasswordPending ? "UPDATING..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- COMBINED ACTIVITY & ADDRESSES VIEW ---
const ActivityView = ({
  user,
  addresses,
  onAddAddressClick,
  onRemoveAddress,
}: {
  user: ProfileUser;
  addresses: Address[];
  onAddAddressClick: () => void;
  onRemoveAddress: (id: string) => void;
}) => {
  const [savedProducts, setSavedProducts] = useState(user.savedProducts);
  const [savedArticles, setSavedArticles] = useState(user.savedArticles);

  useEffect(() => {
    setSavedProducts(user.savedProducts);
    setSavedArticles(user.savedArticles);
  }, [user]);

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold tracking-widest mb-6">
          ORDER HISTORY
        </h3>
        {user.orders.length === 0 ? (
          <EmptyState
            message="You have not placed any orders yet."
            linkHref="/shop"
            linkText="Start Shopping"
          />
        ) : (
          <div className="space-y-4">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="border border-border p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div>
                  <p className="font-bold tracking-wide">
                    Order #{order.orderId.substring(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`mt-2 text-xs font-bold uppercase tracking-widest px-2 py-1 inline-block ${order.status === "DELIVERED"
                      ? "bg-blue-700"
                      : order.status === "PAID"
                        ? "bg-green-700"
                        : order.status === "PENDING"
                          ? "bg-yellow-600"
                          : "bg-red-700"
                      }`}
                  >
                    {order.status}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-gold-primary text-lg">
                    ${order.total.toFixed(2)}
                  </p>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm mt-1 text-muted-foreground hover:text-gold-primary hover:underline underline-offset-4"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SavedItemsView
        products={savedProducts}
        articles={savedArticles}
        userId={user.id}
        onRemoveProduct={(id) =>
          setSavedProducts((prods) => prods.filter((p) => p.id !== id))
        }
        onRemoveArticle={(id) =>
          setSavedArticles((arts) => arts.filter((a) => a.id !== id))
        }
      />

      <AddressBookView
        addresses={addresses}
        userId={user.id}
        onAddAddressClick={onAddAddressClick}
        onRemoveAddress={onRemoveAddress}
      />
    </div>
  );
};

// --- CHILD COMPONENTS FOR ACTIVITY VIEW ---
const SavedItemsView = ({
  products,
  articles,
  userId,
  onRemoveProduct,
  onRemoveArticle,
}: {
  products: Product[];
  articles: Article[];
  userId: string;
  onRemoveProduct: (id: string) => void;
  onRemoveArticle: (id: string) => void;
}) => {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleRemoveProduct = (id: string) => {
    startTransition(async () => {
      if (await unsaveProduct(id, userId)) {
        showToast("Product removed.", "success");
        onRemoveProduct(id);
      } else {
        showToast("Failed to remove product.", "error");
      }
    });
  };

  const handleRemoveArticle = (id: string) => {
    startTransition(async () => {
      if (await unsaveArticle(id, userId)) {
        showToast("Article removed.", "success");
        onRemoveArticle(id);
      } else {
        showToast("Failed to remove article.", "error");
      }
    });
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-2xl font-bold tracking-widest mb-6">
          SAVED PRODUCTS
        </h3>
        {products.length === 0 ? (
          <p className="text-muted-foreground">No products saved.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.id} className="border border-border p-4 flex gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold leading-tight">{p.name}</h4>
                  <p className="text-gold-primary font-bold mt-1">
                    ${p.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveProduct(p.id)}
                    disabled={isPending}
                    className="text-xs text-muted-foreground hover:text-destructive mt-2 uppercase tracking-widest"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold tracking-widest mb-6">
          SAVED ARTICLES
        </h3>
        {articles.length === 0 ? (
          <p className="text-muted-foreground">No articles saved.</p>
        ) : (
          <div className="space-y-4">
            {articles.map((a) => (
              <div
                key={a.id}
                className="border border-border p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <h4 className="font-bold">{a.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    By {a.writtenBy}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <Link
                    href={`/article/${a.slug}`}
                    className="text-sm font-bold hover:text-gold-primary uppercase tracking-widest"
                  >
                    Read
                  </Link>
                  <button
                    onClick={() => handleRemoveArticle(a.id)}
                    disabled={isPending}
                    className="text-sm font-bold text-muted-foreground hover:text-destructive uppercase tracking-widest"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AddressBookView = ({
  addresses,
  userId,
  onAddAddressClick,
  onRemoveAddress,
}: {
  addresses: Address[];
  userId: string;
  onAddAddressClick: () => void;
  onRemoveAddress: (id: string) => void;
}) => {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleRemove = (id: string) => {
    startTransition(async () => {
      const res = await deleteAddress(id, userId);
      if (res.error) {
        showToast(res.error, "error");
      } else {
        showToast(res.success!, "success");
        onRemoveAddress(id);
      }
    });
  };

  return (
    <div>
      <h3 className="text-2xl font-bold tracking-widest mb-6">ADDRESS BOOK</h3>
      <div className="space-y-6">
        <button
          onClick={onAddAddressClick}
          className="w-full bg-gold-primary text-black-primary font-bold py-3 tracking-widest text-sm hover:bg-gold-secondary transition-colors"
        >
          ADD NEW ADDRESS
        </button>
        {addresses.length === 0 ? (
          <EmptyState message="You have no saved addresses." />
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className="border border-border p-6">
              <p className="font-bold">{addr.street}</p>
              <p className="text-muted-foreground">
                {addr.city}, {addr.state} {addr.zipCode}
              </p>
              <p className="text-muted-foreground">{addr.country}</p>
              <div className="mt-4 pt-4 border-t border-border/50 space-x-4">
                <button
                  disabled
                  className="text-sm text-muted-foreground cursor-not-allowed uppercase tracking-widest"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(addr.id)}
                  disabled={isPending}
                  className="text-sm text-muted-foreground hover:text-destructive uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EmptyState = ({
  message,
  linkHref,
  linkText,
}: {
  message: string;
  linkHref?: string;
  linkText?: string;
}) => (
  <div className="text-center py-12 border border-dashed border-border">
    <p className="text-muted-foreground mb-4">{message}</p>
    {linkHref && linkText && (
      <Link
        href={linkHref}
        className="inline-block px-6 py-2 bg-gold-primary text-black-primary font-bold tracking-widest text-xs hover:bg-gold-secondary"
      >
        {linkText}
      </Link>
    )}
  </div>
);

const NewsletterToggle = ({ userId, initialStatus }: { userId: string, initialStatus: boolean }) => {
  const [isSubscribed, setIsSubscribed] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleToggle = () => {
    const newStatus = !isSubscribed;
    setIsSubscribed(newStatus); // Optimistic update locally

    startTransition(async () => {
      const result = await updateNewsletterStatus(userId, newStatus);
      if (result.error) {
        showToast(result.error, "error");
        setIsSubscribed(!newStatus); // Revert if failed
      } else {
        showToast(result.success!, "success");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isSubscribed ? "bg-gold-primary" : "bg-white/20"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSubscribed ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );
};
