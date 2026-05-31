import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import api from "../api/axios";
import {
  User,
  Mail,
  Shield,
  MapPin,
  Package,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface OrderItem {
  product: { _id: string; name: { en: string; ar: string }; price: number; image?: string };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { addresses } = useSelector((state: RootState) => state.addresses);
  const currentLang = (i18n.language as "en" | "ar") || "en";
  const Chevron = currentLang === "ar" ? ChevronLeft : ChevronRight;
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        const orders = res.data?.data || res.data?.orders || [];
        setRecentOrders(orders.slice(0, 3));
      } catch {
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        currentLang === "ar" ? "ar-EG" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
      );
    } catch {
      return "";
    }
  };

  return (
    <div className="py-8 md:py-12 px-4 md:px-8 bg-surface-mint min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-8">
          {t("profile.myProfile")}
        </h1>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white border border-border-light rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-text-primary">{user?.name || "-"}</h2>
                <p className="text-xs text-text-tertiary mt-1">{user?.email || "-"}</p>
                {user?.role === "admin" && (
                  <span className="mt-2 px-3 py-1 bg-primary-light text-primary text-[10px] font-bold rounded-md">
                    {t("profile.role")}: {user.role}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white border border-border-light rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {t("profile.savedAddresses")}
              </h3>
              {addresses.length === 0 ? (
                <p className="text-xs text-text-tertiary">{t("profile.noSavedAddresses")}</p>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3 rounded-xl bg-accent/20 border border-accent/40"
                    >
                      <p className="text-xs font-semibold text-text-primary">{addr.label}</p>
                      <p className="text-[10px] text-text-tertiary mt-0.5">
                        {addr.city}, {addr.street}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-white border border-border-light rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {t("profile.accountDetails")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/20">
                  <User className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-text-tertiary">{t("profile.name")}</p>
                    <p className="text-sm font-semibold text-text-primary">{user?.name || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/20">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-text-tertiary">{t("profile.email")}</p>
                    <p className="text-sm font-semibold text-text-primary">{user?.email || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/20">
                  <Shield className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-text-tertiary">{t("profile.role")}</p>
                    <p className="text-sm font-semibold text-text-primary capitalize">
                      {user?.role || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border-light rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                {t("profile.recentOrders")}
              </h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : recentOrders.length === 0 ? (
                <p className="text-xs text-text-tertiary">{t("profile.noRecentOrders")}</p>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((order) => (
                    <button
                      key={order._id}
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-accent/20 hover:bg-accent/40 transition-all"
                    >
                      <div className="text-start">
                        <p className="text-xs font-mono font-bold text-text-primary">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-text-tertiary mt-0.5">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold font-mono text-primary">
                          ${order.total?.toFixed(2)}
                        </span>
                        <Chevron className="w-4 h-4 text-text-tertiary" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
