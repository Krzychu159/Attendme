import { api } from "./client";

export async function getStudentAttendance(courseGroupId: number) {
  const res = await api.get("/course/student/attendance/get", {
    params: { courseGroupId },
  });
  return res.data;
}

export async function toogleAttendance(
  attendingUserId: number,
  courseSessionId: number,
  addOrRemove: boolean
) {
  const res = await api.get("/course/session/attendance/toggle", {
    params: {
      attendingUserId, // ⬅️ MUSI się tak nazywać
      courseSessionId, // ⬅️ MUSI być
      addOrRemove,
    },
  });

  return res.data;
}
