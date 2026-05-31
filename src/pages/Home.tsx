import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import HeroBanner from "../components/HeroBanner";
import FeaturedRow from "../components/FeaturedRow";
import Menu from "./Menu";

interface Product {
  _id: string;
  name: { en: string; ar: string };
  price: number;
  image: string;
}

function Home() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "ar") || "en";
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/products");
        const products = res.data?.data || res.data?.products || [];
        const shuffled = [...products].sort(() => Math.random() - 0.5);
        setFeatured(shuffled.slice(0, 8));
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getLocalizedText = (obj: { en: string; ar: string }) =>
    currentLang === "ar" ? obj.ar : obj.en;

  const featuredItems = featured.map((p) => ({
    _id: p._id,
    name: p.name,
    price: p.price,
    image: p.image,
  }));

  return (
    <div>
      <HeroBanner />
      <FeaturedRow products={featuredItems} loading={loading} />
      <Menu />
    </div>
  );
}

export default Home;
