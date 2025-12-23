import { api } from "./client";

export async function getStudentAttendance(courseGroupId: number) {
  const res = await api.get("/course/student/attendance/get", {
    params: { courseGroupId },
  });
  return res.data;
}
