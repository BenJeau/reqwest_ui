import { HttpMethod } from "@/utils/types";
import { HttpVersion } from "@/bindings";

export const humanizeMicroseconds = (microseconds: number) => {
  if (microseconds < 1000) {
    return `${microseconds}μs`;
  }
  const milliseconds = microseconds / 1000;
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  const seconds = milliseconds / 1000;
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = minutes / 60;
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = hours / 24;
  return `${days}d`;
};

export const humanizeBytes = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(2)}KB`;
  }
  const megabytes = kilobytes / 1024;
  if (megabytes < 1024) {
    return `${megabytes.toFixed(2)}MB`;
  }
  const gigabytes = megabytes / 1024;
  return `${gigabytes.toFixed(2)}GB`;
};

export const httpMethodColors: {
  [key in HttpMethod]: string;
} = {
  GET: "text-blue-400",
  POST: "text-green-400",
  PUT: "text-yellow-400",
  DELETE: "text-red-400",
  PATCH: "text-purple-400",
  HEAD: "text-gray-400",
  OPTIONS: "text-orange-400",
};

export const getHttpStatusCodeColor = (code: number) => {
  if (code >= 200 && code < 300) {
    return "text-green-400";
  }

  if (code >= 300 && code < 400) {
    return "text-yellow-400";
  }

  if (code >= 400 && code < 500) {
    return "text-red-400";
  }

  if (code >= 500 && code < 600) {
    return "text-purple-400";
  }

  return "text-gray-400";
};

export const humanizeHttpVersion: {
  [key in HttpVersion]: string;
} = {
  Http09: "HTTP/0.9",
  Http10: "HTTP/1.0",
  Http11: "HTTP/1.1",
  H2: "HTTP/2",
  H3: "HTTP/3",
};
