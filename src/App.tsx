import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRouter from "./routes/AppRouter";
import { hydrateAuth } from "./redux/slices/authSlice";
import type { AppDispatch } from "./redux/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  // Hydrate auth state from localStorage on app startup
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
