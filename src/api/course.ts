import { api } from "./client";

export async function getStudentSessions(studentId: number) {
  const res = await api.post("/course/student/sessions/get", { studentId });
  return res.data;
}
