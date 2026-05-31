import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { selectAddress, removeAddress, type Address } from "../redux/slices/addressesSlice";
import { MapPin, Trash2, CheckCircle } from "lucide-react";

interface SavedAddressesProps {
  onSelect: (address: Address) => void;
}

function SavedAddresses({ onSelect }: SavedAddressesProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, selectedId } = useSelector(
    (state: RootState) => state.addresses,
  );

  if (!addresses || addresses.length === 0) {
    return null;
  }

  const handleSelect = (addr: Address) => {
    dispatch(selectAddress(addr.id));
    onSelect(addr);
  };

  return (
    <div className="space-y-2 mb-4">
      <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wide mb-3">
        {t("checkout.savedAddresses")}
      </h3>
      {addresses.map((addr) => (
        <button
          key={addr.id}
          onClick={() => handleSelect(addr)}
          className={`w-full text-start p-3 rounded-xl border transition-all ${
            selectedId === addr.id
              ? "bg-primary-light/50 border-primary/30"
              : "bg-white border-border-light hover:border-primary/20 hover:bg-accent/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedId === addr.id
                  ? "border-primary bg-primary"
                  : "border-border-medium"
              }`}
            >
              {selectedId === addr.id && (
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-text-primary truncate">
                  {addr.label}
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-0.5 truncate">
                {addr.fullName} — {addr.city}, {addr.street}
              </p>
              <p className="text-xs text-text-tertiary">{addr.phone}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(removeAddress(addr.id));
              }}
              className="p-1 rounded text-text-tertiary hover:text-error transition-colors flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </button>
      ))}
    </div>
  );
}

export default SavedAddresses;
