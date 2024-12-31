import { useState, useEffect } from "react";
import { User } from "@/types/models";
import { UseAuthReturn } from "@/types/auth";
import { useRouter } from "next/navigation";

export function useAuth(): UseAuthReturn {
  const router = useRouter();

  // Dummy state values
  const dummyUser: User = {
    user_id: "dummy-user-id",
    email: "dummy@example.com",
    name: "Dummy User",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stripe_customer_id: null,
    subscription_plan: "free",
    tasks_limit: 100,
    tasks_created: 0,
  };

  // State with dummy values
  const [session, setSession] = useState<any>({
    user: { id: "dummy-session-id" },
  });
  const [user, setUser] = useState<User | null>(dummyUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Placeholder functions
  const clearError = () => {
    console.log("TODO: Implement clearError");
    setError(null);
  };

  const signOut = async () => {
    console.log("TODO: Implement signOut");
    setSession(null);
    setUser(null);
    setIsLoggedIn(false);
    setIsLoading(false);
    router.push("/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("TODO: Implement handleLogin:", { email, password });
    setIsLoggedIn(true);
    setUser(dummyUser);
    setIsLoading(false);
    router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    console.log("TODO: Implement handleGoogleLogin");
    setIsLoggedIn(true);
    setUser(dummyUser);
    setIsLoading(false);
    router.push("/dashboard");
  };

  const handleSignup = async () => {
    console.log("TODO: Implement handleSignup:", { email, password });
    setIsLoggedIn(true);
    setUser(dummyUser);
    setIsLoading(false);
    router.push("/dashboard");
  };

  // Mock initialization
  useEffect(() => {
    console.log("TODO: Implement auth initialization");
    setIsLoggedIn(true);
    setUser(dummyUser);
  }, []);

  return {
    // State
    user,
    session,
    email,
    password,
    isLoggedIn,
    isLoading,
    error,
    isSignUpMode,

    // Operations
    signOut,
    handleLogin,
    handleGoogleLogin,
    handleSignup,
    setEmail,
    setPassword,
    setIsSignUpMode,
    clearError,
  };
}
