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
      attendingUserId,
      courseSessionId,
      addOrRemove,
    },
  });

  return res.data;
}

export async function getScannerToken(sessionId: number) {
  const res = await api.get("/course/session/attendance/scanner/token/get", {
    params: { sessionId },
  });
  return res.data as { token: string; expires?: string };
}

export async function getAttendanceTicket() {
  const res = await api.get("/user/attendance/ticket/get", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("deviceToken")}`,
    },
  });

  return res.data as {
    token: string;
    expires: string;
  };
}

export async function registerAttendance(
  attenderToken: string,
  scannerToken: string
) {
  const res = await api.post(
    "/course/session/attendance/register",
    { attenderToken },
    {
      headers: {
        Authorization: `Bearer ${scannerToken}`,
      },
    }
  );

  return res.data;
}
