export const httpMethods = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
] as const;

export type HttpMethod = (typeof httpMethods)[number];

export type Header = {
  enabled: boolean;
  key: string;
  value: string;
};

export const panels = ["Params", "Headers", "Body"] as const;
export type Panel = (typeof panels)[number];

export type Param = {
  key: string;
  value: string;
};
