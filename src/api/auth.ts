import { api } from "./client";

export async function login(loginName: string, password: string) {
  const res = await api.post("/user/login", null, {
    params: { loginName, password },
  });
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get("/user/get");
  return res.data;
}
