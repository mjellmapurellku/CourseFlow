import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const sessionId = searchParams.get("session_id");
    const courseId = searchParams.get("courseId");

    // Guard: missing params
    if (!sessionId || !courseId) {
      console.error("Missing sessionId or courseId");
      navigate("/courses", { replace: true });
      return;
    }

    const confirmPayment = async () => {
      try {
       await api.post(
  "/enrollment/confirm-payment",
  { sessionId },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
        // ✅ redirect to course
      navigate(`/courses/${courseId}/player`, { replace: true });
      } catch (err) {
        console.error("Payment confirmation failed:", err);
        navigate("/courses", { replace: true });
      }
    };

    confirmPayment();
  }, [navigate, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <h2 className="text-xl font-semibold">
        Payment successful! Redirecting...
      </h2>
    </div>
  );
}
