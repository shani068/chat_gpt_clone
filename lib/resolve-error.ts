export function resolveError(err: unknown): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    if (typeof axiosErr.response?.data?.message === "string") {
      return axiosErr.response.data.message;
    }
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
