// /mnt/data/CourseDetails.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createEnrollment,
  getCourseById,
  getEnrollmentStatus,
  getLessonsByCourse,
  getTrialStatus,
  startTrial,
  updateProgress,
} from "../services/api";
import "../styles/CourseDetails.css";

/* ----------------- MODALS (UNCHANGED) ----------------- */
function EnrollmentModal({ open, onClose, onContinue, course }) {
  if (!open) return null;
  return (
    <div className="enroll-modal-overlay" role="dialog" aria-modal="true">
      <div className="enroll-modal">
        <h2>You're in — Welcome!</h2>
        <p>
          You successfully enrolled in <strong>{course?.title}</strong>.
          Start learning right away or go to My Courses.
        </p>
        <div className="enroll-modal-actions">
          <button className="btn primary" onClick={onContinue}>
            Start first lesson →
          </button>
          <button className="btn secondary" onClick={onClose}>
            Go to My Courses
          </button>
        </div>
      </div>
    </div>
  );
}

function TrialModal({
  open,
  onClose,
  onStartTrial,
  onConfirmEnroll,
  loadingTrial,
  isEnrolling,
  trialEnd,
  onStripeTrial
}) {
  if (!open) return null;

  return (
    <div className="trial-modal-overlay" role="dialog" aria-modal="true">
      <div className="trial-modal">
        <h2>Start your free trial — 7 days</h2>
        <p>Start a 7-day free trial through secure Stripe checkout.</p>

        {trialEnd && <p>Current trial ends: {new Date(trialEnd).toLocaleString()}</p>}

        <div className="trial-modal-actions">
          {/* ✔ Stripe option */}
          <button className="btn primary" onClick={onStripeTrial}>
            Start Free Trial (Stripe)
          </button>

          {/* Legacy manual trial (kept available) */}
          <button
            className="btn outline"
            onClick={onStartTrial}
            disabled={loadingTrial}
            style={{ marginTop: 8 }}
          >
            {loadingTrial ? "Starting…" : "Start Trial (Backend)"}
          </button>

          <button
            className="btn outline"
            onClick={onConfirmEnroll}
            disabled={isEnrolling}
            style={{ marginTop: 8 }}
          >
            {isEnrolling ? "Processing…" : "Enroll with payment"}
          </button>

          <button className="btn secondary" onClick={onClose} style={{ marginTop: 8 }}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------- MAIN PAGE --------------------- */
export default function CourseDetails() {
  const { id } = useParams();
  const courseId = parseInt(id, 10);
  const navigate = useNavigate();
  const location = useLocation();

  /* STATE (unchanged) */
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [trial, setTrial] = useState(null);
  const [loadingTrial, setLoadingTrial] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const htmlVideoRef = useRef(null);
  const savedPercentRef = useRef(0);

  /* USER PARSE */
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }
  const userId = user?.id ?? user?.data?.id ?? user?.user?.id ?? null;

  const alreadyEnrolled = !!enrollment;
  const trialActive = !!(trial && trial.isActive);

  /* ---------------- STRIPE CHECKOUT FUNCTION ---------------- */
  const handleStripeCheckout = async () => {
    try {
      const response = await fetch(
        "https://localhost:55554/api/billing/create-checkout-session",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, courseId })
        }
      );

      const data = await response.json();

      if (!data.url) {
        alert("Stripe session failed");
        return;
      }

      window.location.href = data.url; // 🔥 redirect to Stripe
    } catch (err) {
      console.error("Stripe Checkout error", err);
      alert("Unable to start checkout.");
    }
  };

  /* ---------------- LOADS / EFFECTS (UNCHANGED) ---------------- */
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const cRes = await getCourseById(courseId);
        if (!mounted) return;
        setCourse(cRes.data);

        const lRes = await getLessonsByCourse(courseId);
        if (!mounted) return;
        const sorted = (lRes.data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setLessons(sorted);

        const params = new URLSearchParams(location.search);
        if (params.get("start") && sorted.length > 0) {
          setSelectedLesson(sorted[0]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [courseId, location.search]);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    (async () => {
      try {
        const res = await getEnrollmentStatus(userId, courseId);
        if (!mounted) return;
        setEnrollment(res.data);
        setProgressPercent(res.data?.progressPercent ?? 0);
        savedPercentRef.current = res.data?.progressPercent ?? 0;
      } catch {}
    })();
    return () => (mounted = false);
  }, [userId, courseId]);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    (async () => {
      try {
        setLoadingTrial(true);
        const res = await getTrialStatus(userId);
        if (!mounted) return;
        setTrial(res.data);
      } finally {
        if (mounted) setLoadingTrial(false);
      }
    })();
    return () => (mounted = false);
  }, [userId]);

  /* ---------------- ACTIONS ---------------- */
  const handleEnroll = () => {
    if (!userId) return navigate(`/login?redirect=/courses/${courseId}`);
    setShowTrialModal(true);
  };

  const handleConfirmEnroll = async () => {
    if (!userId) return navigate(`/login?redirect=/courses/${courseId}`);

    setIsEnrolling(true);
    try {
      const res = await createEnrollment({
        UserId: userId,
        CourseId: courseId,
        ProgressPercent: 0,
      });

      setEnrollment(res.data ?? res);
      setProgressPercent(res.data?.progressPercent ?? 0);
      savedPercentRef.current = res.data?.progressPercent ?? 0;
      setShowTrialModal(false);
      setShowEnrollModal(true);
    } finally {
      setIsEnrolling(false);
    }
  };

  /* Your backend trial (kept) */
  const handleStartTrial = async () => {
    if (!userId) return navigate(`/login?redirect=/courses/${courseId}`);

    try {
      setLoadingTrial(true);
      await startTrial(userId);
      const res = await getTrialStatus(userId);
      setTrial(res.data);
      setShowTrialModal(false);
      alert("Your 7-day trial is active — enjoy!");
    } finally {
      setLoadingTrial(false);
    }
  };

  const handleEnrollContinue = () => {
    setShowEnrollModal(false);
    const first = lessons[0];
    navigate(`/course-player/${courseId}/${first?.id ?? 0}`);
  };

  const handleSelectLesson = (lesson) => {
    const locked = !(alreadyEnrolled || trialActive || lesson.isFree);
    if (locked) {
      if (!trialActive) setShowTrialModal(true);
      return;
    }
    setSelectedLesson(lesson);
    navigate(`/course-player/${courseId}/${lesson.id}`);
  };

  const handleMarkCompleted = async (lessonId) => {
    if (!userId) return navigate(`/login?redirect=/course-player/${courseId}/${lessonId}`);

    const idx = lessons.findIndex((l) => l.id === lessonId);
    const completedCount = Math.max(0, idx + 1);
    const percent = Math.round((completedCount / Math.max(1, lessons.length)) * 100);

    try {
      await updateProgress(userId, courseId, percent);
      setProgressPercent(percent);
      savedPercentRef.current = percent;
    } catch {}
  };

  /* ---------------- RENDER ---------------- */
  const renderVideoArea = () => {
    if (!alreadyEnrolled && !trialActive) {
      return (
        <div className="video-wrapper" style={{ position: "relative" }}>
          <img
            src={course?.image || "/assets/default-course.jpg"}
            alt={course?.title || "course"}
            style={{ width: "100%", height: "420px", objectFit: "cover", filter: "blur(1px)" }}
          />
          <div className="locked-overlay">
            <div className="locked-title">Locked preview</div>
            <div>Start a trial or enroll to unlock full lessons & video</div>

            <div style={{ marginTop: 16 }}>
              {/* 🔥 Stripe trial button */}
              <button className="btn primary" onClick={handleStripeCheckout}>
                Start free trial (Stripe)
              </button>

              <button className="btn secondary" onClick={handleEnroll} style={{ marginLeft: 8 }}>
                Enroll — {course?.price ? `$${course.price}` : "Free"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const videoUrl = (selectedLesson && selectedLesson.videoUrl) || course?.videoUrl;
    if (!videoUrl) {
      return (
        <div className="video-wrapper">
          <img src={course?.image || "/assets/default-course.jpg"} alt="" className="course-cover" />
        </div>
      );
    }

    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      return (
        <div className="video-wrapper">
          <iframe
            title={selectedLesson?.title || course?.title}
            src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}?rel=0&enablejsapi=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="responsive-iframe"
          />
        </div>
      );
    }

    return (
      <div className="video-wrapper">
        <video ref={htmlVideoRef} controls className="html5-video">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      </div>
    );
  };

  /* ---------------- PAGE ---------------- */
  if (loading) return <div className="loader">Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="course-details-page">
      {/* header unchanged */}
      <div className="course-header">
        <div className="title-block">
          <h1>{course.title}</h1>
          <div className="meta">
            <span>{course.category}</span> • <span>{course.level}</span> •{" "}
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="header-cta">
          {alreadyEnrolled ? (
            <div className="enrolled-block">
              <div className="progress-small">
                <div className="progress-line">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="progress-label">{progressPercent}% completed</div>
              </div>

              <button
                className="btn primary"
                onClick={() => {
                  const target = selectedLesson || lessons[0];
                  if (target) navigate(`/course-player/${courseId}/${target.id}`);
                }}
              >
                Continue learning →
              </button>
            </div>
          ) : (
            <div style={{ width: 1 }} />
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="course-layout">
        <div className="left-col">{renderVideoArea()}</div>

        <aside className="right-col">
          <div className="about-card">
            <h3>About this course</h3>
            <p>{course.description}</p>

            {!alreadyEnrolled && !trialActive && (
              <div className="enroll-prompt">
                <button className="btn primary enroll-btn" onClick={handleEnroll}>
                  Enroll now — ${course.price}
                </button>

                {/* 🔥 Stripe trial button */}
                <div style={{ marginTop: 10 }}>
                  <button className="btn outline" onClick={handleStripeCheckout}>
                    Start 7-day free trial (Stripe)
                  </button>
                </div>
              </div>
            )}

            {trialActive && !alreadyEnrolled && (
              <div style={{ marginTop: 10, color: "#2563eb", fontWeight: 600 }}>
                Trial active — expires:{" "}
                {trial?.trialEnd ? new Date(trial.trialEnd).toLocaleString() : "—"}
              </div>
            )}

            {alreadyEnrolled && (
              <div className="progress-block">
                <strong>Your Progress</strong>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="progress-text">{progressPercent}%</div>
              </div>
            )}
          </div>

          {/* Lessons (unchanged) */}
          <div className="lessons-card">
            <h4>Lessons ({lessons.length})</h4>
            <ul className="lessons-list">
              {lessons.map((lesson) => {
                const locked = !(alreadyEnrolled || trialActive || lesson.isFree);
                const active = selectedLesson?.id === lesson.id;
                return (
                  <li
                    key={lesson.id}
                    className={`lesson-row ${active ? "active" : ""} ${locked ? "locked" : ""}`}
                    onClick={() => handleSelectLesson(lesson)}
                  >
                    <div className="lesson-left">
                      <div className="order">{lesson.order}</div>
                      <div className="meta">
                        <div className="title">
                          {lesson.title}
                          {lesson.isFree && !alreadyEnrolled && (
                            <span style={{ marginLeft: 8, color: "#0ea5a4", fontWeight: 700 }}>
                              FREE
                            </span>
                          )}
                        </div>
                        <div className="desc">
                          {lesson.description?.slice(0, 80)}
                          {lesson.description?.length > 80 ? "…" : ""}
                        </div>
                      </div>
                    </div>

                    <div className="lesson-right">
                      {locked ? (
                        <span className="lock">🔒</span>
                      ) : (
                        <button
                          className="btn small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkCompleted(lesson.id);
                          }}
                        >
                          Mark complete
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      {/* MODALS */}
      <EnrollmentModal
        open={showEnrollModal}
        onClose={() => navigate("/my-courses")}
        onContinue={handleEnrollContinue}
        course={course}
      />

      <TrialModal
        open={showTrialModal}
        onClose={() => setShowTrialModal(false)}
        onStartTrial={handleStartTrial}
        onConfirmEnroll={handleConfirmEnroll}
        loadingTrial={loadingTrial}
        isEnrolling={isEnrolling}
        trialEnd={trial?.trialEnd}
        onStripeTrial={handleStripeCheckout}
      />
    </div>
  );
}

/* Helper */
function extractYouTubeId(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    return u.pathname.split("/").pop();
  } catch {
    const m = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return m ? m[1] : "";
  }
}
