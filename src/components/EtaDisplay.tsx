import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Truck } from "lucide-react";

interface EtaDisplayProps {
  createdAt: string;
  status: string;
}

function EtaDisplay({ createdAt, status }: EtaDisplayProps) {
  const { t } = useTranslation();
  const [eta, setEta] = useState("");

  useEffect(() => {
    if (status === "delivered" || status === "cancelled") {
      setEta("");
      return;
    }

    const calcEta = () => {
      const created = new Date(createdAt).getTime();
      const now = Date.now();
      const elapsed = now - created;
      const deliveryBuffer = 45 * 60 * 1000;
      const remaining = Math.max(0, deliveryBuffer - elapsed);

      if (remaining === 0) {
        setEta(t("orderTracking.etaCalculating"));
        return;
      }

      const mins = Math.ceil(remaining / 60000);
      setEta(`${mins} ${mins === 1 ? "min" : "mins"}`);
    };

    calcEta();
    const interval = setInterval(calcEta, 30000);
    return () => clearInterval(interval);
  }, [createdAt, status, t]);

  if (!eta || status === "delivered" || status === "cancelled") return null;

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-accent/40 rounded-xl border border-accent/60">
      <Truck className="w-4 h-4 text-primary" />
      <span className="text-xs font-semibold text-text-secondary">
        {t("orderTracking.etaLabel")}:
      </span>
      <span className="text-sm font-bold font-mono text-primary">{eta}</span>
    </div>
  );
}

export default EtaDisplay;
