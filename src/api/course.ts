import { api } from "./client";

export async function getStudentSessions() {
  const body = {
    pageNumber: 1,
    pageSize: 999999,
    filters: {},
  };

  const res = await api.post("/course/student/sessions/get", body);
  return res.data;
}

export async function getSessionAttendanceList(sessionId: number) {
  const res = await api.get("/course/session/attendance-list/get", {
    params: { sessionId },
  });

  return res.data;
}
