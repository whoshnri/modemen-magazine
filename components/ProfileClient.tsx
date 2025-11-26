"use client";

import { useState, useTransition, useEffect, FormEvent, Dispatch } from "react";
import { User, Order, Product, Article, Address } from "@prisma/client";
import { useToast } from "@/components/toast/use-toast";
import {
  updateUserProfile,
  changeUserPassword,
  deleteAddress,
} from "@/app/actions/profileOps";
import { unsaveArticle, unsaveProduct } from "@/app/actions/saver";
import Link from "next/link";
import Image from "next/image";
import { AddAddressModal } from "./Addaddress";

// --- TYPE DEFINITION ---
type ProfileUser = User & {
  savedArticles: Article[];
  savedProducts: Product[];
  orders: Order[];
  addresses: Address[];
};

// --- MAIN CLIENT COMPONENT ---
export const ProfileClient = ({
  user,
  sessionId,
}: {
  user: ProfileUser;
  sessionId: string;
}) => {
  const [activeTab, setActiveTab] = useState("settings");

  // State for data that can be updated live on the client
  const [currentUser, setCurrentUser] = useState(user);
  const [addresses, setAddresses] = useState(user.addresses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(user);
    setAddresses(user.addresses);
  }, [user]);

  const TABS = [
    { id: "settings", label: "ACCOUNT SETTINGS" },
    { id: "activity", label: "ACTIVITY & ADDRESSES" },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="flex flex-col space-y-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-left font-bold tracking-widest text-sm uppercase transition-colors ${
                    activeTab === tab.id
                      ? "bg-gold-primary text-black-primary"
                      : "text-muted-foreground hover:bg-black-secondary hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="md:col-span-3">
            {activeTab === "settings" && (
              <SettingsView
                user={currentUser}
                onProfileUpdate={setCurrentUser}
              />
            )}
            {activeTab === "activity" && (
              <ActivityView
                user={currentUser}
                addresses={addresses}
                onAddAddressClick={() => setIsModalOpen(true)}
                onRemoveAddress={(id) =>
                  setAddresses((addrs) => addrs.filter((a) => a.id !== id))
                }
              />
            )}
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
                    className={`mt-2 text-xs font-bold uppercase tracking-widest px-2 py-1 inline-block ${
                      order.status === "DELIVERED"
                        ? "bg-green-700"
                        : "bg-yellow-600"
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
