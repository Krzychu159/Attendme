import { api } from "./client";

//  Pobranie tokenu sesji skanera
export async function getScannerSessionToken(courseSessionId: number) {
  const res = await api.get("/course/session/attendance/scanner/token/get", {
    params: { courseSessionId },
  });

  return res.data as {
    token: string;
    expires: string;
  };
}

// Rejestracja obecności po zeskanowaniu QR
export async function registerAttendance(attenderToken: string) {
  const res = await api.post("/course/session/attendance/register", {
    attenderToken,
  });

  return res.data; // User
}
