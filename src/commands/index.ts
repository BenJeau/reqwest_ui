import { QueryClient, useMutation } from "@tanstack/react-query";

import { Request, commands } from "@/bindings";
import { Header } from "@/utils/types";

export const queryClient = new QueryClient();

type RequestParams = Omit<Request, "headers" | "body"> & {
  headers: Header[];
  body?: string;
};

export const useExecuteRequest = () => {
  return useMutation({
    mutationFn: async ({
      method,
      url,
      body,
      options,
      headers,
    }: RequestParams) => {
      const data = await commands.executeRequest({
        method,
        url,
        headers: headers.reduce(
          (acc, { enabled, key, value }) => {
            if (enabled && key !== "" && value !== "") {
              acc[key] = value;
            }
            return acc;
          },
          { Connection: "keep-alive" } as Record<string, string>
        ),
        body: body ?? null,
        options: {
          http_version: "Http11",
          ...options,
        },
      });

      if (data.status === "ok") {
        return data.data;
      } else {
        throw new Error(data.error ?? undefined);
      }
    },
  });
};
