import { api } from "./client";

// Pobiera istniejący token rejestracyjny dla zarejestrowanego urządzenia
export async function getDeviceToken(deviceUserId: number) {
  const res = await api.get("/user/device/register/token/get", {
    params: { deviceUserId },
  });
  return res.data; // { token, expires }
}

// Generuje nowy token rejestracyjny dla urządzenia
export async function registerDeviceForStudent(
  token: string,
  data: {
    deviceName: string;
    studentName: string;
    studentSurname: string;
    albumIdNumber: number;
  }
) {
  const res = await api.post("/user/device/register", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { token, expires }
}

// Resetuje zarejestrowane urządzenie
export async function resetDevice(deviceUserId: number, deviceToken: string) {
  const res = await api.post("/user/device/reset", null, {
    params: { deviceUserId },
    headers: {
      Authorization: `Bearer ${deviceToken}`,
    },
  });
  return res.data;
}
