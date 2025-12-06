import { QueryCache } from "@tanstack/react-query";
import { router } from "@/router";

export const queryErrorHandler = new QueryCache({
  onError: (error: any) => {
    const status = error?.response?.status;

    if (!status) return;

    router.navigate({ to: `/${status}` });
  },
});
