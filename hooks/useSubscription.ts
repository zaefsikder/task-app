import { UseSubscriptionReturn } from "@/types/subscription";

export function useSubscription(): UseSubscriptionReturn {
  const manageSubscription = async (accessToken: string) => {
    console.log("manageSubscription called with token:", accessToken);
    console.log("TODO: Implement subscription management logic");
    return Promise.resolve();
  };

  return {
    manageSubscription,
  };
}
