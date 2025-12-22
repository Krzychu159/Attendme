import { api } from "./client";

export async function getStudentSessions(studentId: number) {
  const res = await api.post("/course/student/sessions/get", { studentId });
  return res.data;
}

export async function getSessionAttendanceList(sessionId: number) {
  const res = await api.get("/course/session/attendance-list/get", {
    params: { sessionId },
  });

  return res.data;
}
