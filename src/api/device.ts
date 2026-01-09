import { api } from "./client";

// Pobiera istniejący token rejestracyjny dla zarejestrowanego urządzenia
export async function getDeviceToken(deviceUserId: number) {
  const res = await api.get("/user/device/register/token/get", {
    params: { deviceUserId },
  });
  return res.data; // { token, expires }
}

// Generuje nowy token rejestracyjny dla urządzenia (POST /user/device/register)
export async function registerDeviceForStudent(data: {
  deviceName: string;
  studentName: string;
  studentSurname: string;
  albumIdNumber: number;
}) {
  const res = await api.post("/user/device/register", data);
  return res.data; // { token, expires }
}
