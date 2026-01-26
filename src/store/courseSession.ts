import { defineStore } from "pinia";
import { getSessionAttendanceList } from "@/api/course";
import { useTeacherCoursesStore } from "@/store/courses";
import { toogleAttendance as toogleAttendanceApi } from "@/api/attendance";
import { getScannerToken } from "@/api/attendance";
import QRCode from "qrcode";

export const useCourseSessionStore = defineStore("courseSession", {
  state: () => ({
    session: null as any | null,
    students: [] as any[],
    loading: false,
    error: null as string | null,
    qrUrl: null as string | null,
    url: null as string | null,
    scannerToken: null as string | null,
  }),

  actions: {
    setSession(session: any) {
      this.session = session;
    },

    setSessionFromTeacherCourses(sessionId: number, groupId: number) {
      const teacherCoursesStore = useTeacherCoursesStore();

      const found = teacherCoursesStore.courses.find(
        (c: any) =>
          c.courseSessionId === sessionId && c.courseGroupId === groupId
      );

      if (found) {
        this.session = found;
      }
    },

    async fetchAttendanceList(sessionId: number) {
      this.loading = true;
      this.error = null;

      try {
        const data = await getSessionAttendanceList(sessionId);
        this.students = Array.isArray(data) ? data : [];
      } catch {
        this.error = "Nie udało się pobrać listy obecności";
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.session = null;
      this.students = [];
      this.error = null;
      this.qrUrl = null;
      this.url = null;
      this.scannerToken = null;
    },

    async toogleAttendance(
      studentId: number,
      courseSessionId: number,
      addOrRemove: boolean
    ) {
      try {
        this.loading = true;
        this.error = null;

        await toogleAttendanceApi(studentId, courseSessionId, addOrRemove);

        const student = this.students.find(
          (s) => s.attenderUserId === studentId
        );
        if (!student) return;

        student.wasUserPresent = addOrRemove;
      } catch {
        this.error = "Nie udało się zaktualizować obecności studenta";
      } finally {
        this.loading = false;
      }
    },

    async generateQrForSession() {
      if (!this.session?.courseSessionId) {
        this.error = "Brak sesji do wygenerowania QR kodu.";
        return;
      }

      try {
        this.loading = true;
        this.error = null;

        const tokenData = await getScannerToken(this.session.courseSessionId);
        this.scannerToken = tokenData?.token ?? null;

        if (!this.scannerToken) {
          this.error = "Nie udało się pobrać tokenu skanera.";
          return;
        }

        const url = `${window.location.origin}/scanner?token=${encodeURIComponent(
          this.scannerToken
        )}`;

        this.url = url;
        this.qrUrl = await QRCode.toDataURL(url, { margin: 1, width: 256 });
      } catch {
        this.error = "Nie udało się wygenerować QR kodu.";
      } finally {
        this.loading = false;
      }
    },
  },
});
