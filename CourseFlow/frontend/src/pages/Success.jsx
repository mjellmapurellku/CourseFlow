import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("courseId");

  useEffect(() => {
    async function handleSuccess() {
      if (!courseId) {
        navigate("/courses");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:55554/api/lessons/course/${courseId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load lessons");
        }

        const lessons = await response.json();

        if (!lessons || lessons.length === 0) {
          navigate(`/courses/${courseId}`);
          return;
        }

        const sortedLessons = lessons.sort(
          (a, b) => a.order - b.order
        );

        const firstLessonId = sortedLessons[0].id;

        navigate(`/course-player/${courseId}/${firstLessonId}`);
      } catch (error) {
        console.error("Success redirect error:", error);
        navigate("/courses");
      }
    }

    handleSuccess();
  }, [courseId, navigate]);

  return (
    <div className="flex justify-center items-center h-[60vh]">
      <h2 className="text-xl font-semibold">
        Payment successful 🎉 Redirecting to your course...
      </h2>
    </div>
  );
}

export default Success;
