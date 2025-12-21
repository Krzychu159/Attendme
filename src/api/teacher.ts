import { api } from "./client";

export async function getTeacherSessions() {
  const body = {
    pageNumber: 1,
    pageSize: 999999,
  };

  const res = await api.post("/course/teacher/sessions/get", body);
  return res.data;
}
