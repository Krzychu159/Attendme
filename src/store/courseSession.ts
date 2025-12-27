import { defineStore } from "pinia";
import { getSessionAttendanceList } from "@/api/course";
import { useTeacherCoursesStore } from "@/store/courses";
import { toogleAttendance as toogleAttendanceApi } from "@/api/attendance";

export const useCourseSessionStore = defineStore("courseSession", {
  state: () => ({
    session: null as any | null,
    students: [] as any[],
    loading: false,
    error: null as string | null,
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
      } catch (e) {
        this.error = "Nie udało się pobrać listy obecności";
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.session = null;
      this.students = [];
      this.error = null;
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
      } catch (e) {
        this.error = "Nie udało się zaktualizować obecności studenta";
      } finally {
        this.loading = false;
      }
    },
  },
});
