import { api } from "./client";

export async function getUserInfo(userId: number) {
  const res = await api.get("/user/get", {
    params: { userId },
  });
  return res.data;
}
