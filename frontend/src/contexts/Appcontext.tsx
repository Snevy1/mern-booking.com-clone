import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { UserType } from "../../../backend/src/shared/types";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || '';
const stripePromise = loadStripe(STRIPE_PUB_KEY);

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  user?: UserType; // Made optional as it's undefined when logged out
  stripePromise: Promise<Stripe | null>;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  // 1. Validate the token to check login status
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  // 2. Fetch the user data safely inside the component
  // We only enable this query if the user is NOT in an error state (likely logged in)
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
    {
      enabled: !isError, // Only run if token is valid
    }
  );

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        user: currentUser,
        stripePromise,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};