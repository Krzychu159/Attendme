import { api } from "./client";

/**
 * Pobiera wszystkie sesje (lekcje) przypisane do zalogowanego studenta.
 * Backend automatycznie rozpoznaje studenta po tokenie.
 */
export async function getStudentSessions() {
  const res = await api.get("/course/student/group/sessions/get");
  return res.data;
}

/**
 * Pobiera szczegóły konkretnej sesji / kursu (opcjonalnie, do widoku CourseDetails).
 */
export async function getCourseDetails(sessionId: number) {
  const res = await api.get(
    `/course/session/attendance-list/get?sessionId=${sessionId}`
  );
  return res.data;
}
