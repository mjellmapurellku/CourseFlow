// src/pages/CoursePlayer.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, getEnrollmentStatus, getLessonsByCourse, getTrialStatus, startTrial, updateProgress } from "../services/api";
import "../styles/CoursePlayer.css";

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [sections, setSections] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [progressPercent, setProgressPercent] = useState(0);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  // auth / enrollment / trial
  const [enrollment, setEnrollment] = useState(null);
  const [trial, setTrial] = useState(null);
  const [loadingTrial, setLoadingTrial] = useState(false);

  const videoRef = useRef(null);
  const lastSavedRef = useRef({ percent: 0, time: Date.now() });

  // parse user
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }
  const userId = user?.id ?? user?.data?.id ?? user?.user?.id ?? null;

  const buildSections = useCallback((ls) => {
    const bySection = new Map();
    for (const l of ls) {
      const key = l.section ?? "Course Content";
      if (!bySection.has(key)) bySection.set(key, []);
      bySection.get(key).push(l);
    }
    const s = [];
    for (const [title, items] of bySection.entries()) {
      items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      s.push({ title, lessons: items });
    }
    return s;
  }, []);

  // load course & lessons + enrollment & trial status
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
        const normalized = sorted.map((lsn) => ({ ...lsn, isCompleted: !!lsn.isCompleted }));
        setLessons(normalized);

        const built = buildSections(normalized);
        setSections(built);

        const initialOpen = {};
        built.forEach((s, i) => (initialOpen[s.title] = i === 0));
        setOpenSections(initialOpen);

        // set current lesson from url, or redirect to first
        const selected = normalized.find((x) => String(x.id) === String(lessonId));
        if (!selected) {
          const first = normalized[0];
          if (first) {
            navigate(`/course-player/${courseId}/${first.id}`, { replace: true });
            setCurrentLesson(first);
          } else {
            setCurrentLesson(null);
          }
        } else {
          setCurrentLesson(selected);
        }

        const completedCount = normalized.filter((l) => l.isCompleted).length;
        const percent = Math.round((completedCount / Math.max(1, normalized.length)) * 100);
        setProgressPercent(percent);
        lastSavedRef.current = { percent, time: Date.now() };

        // load enrollment status/trial (if user)
        if (userId) {
          try {
            const eRes = await getEnrollmentStatus(userId, Number(courseId));
            setEnrollment(eRes.data);
          } catch (err) {
            // ignore not found
          }
          try {
            setLoadingTrial(true);
            const tRes = await getTrialStatus(userId);
            setTrial(tRes.data);
          } catch (err) {
            console.error("failed to load trial", err);
          } finally {
            setLoadingTrial(false);
          }
        }
      } catch (err) {
        console.error("CoursePlayer load failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [courseId, lessonId, navigate, buildSections, userId]);

  // keep currentLesson in sync
  useEffect(() => {
    if (!lessons.length) return;
    const found = lessons.find((l) => String(l.id) === String(lessonId));
    if (found) setCurrentLesson(found);
  }, [lessonId, lessons]);

  // autoplay video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      try {
        await v.play();
      } catch {}
    };
    tryPlay();
  }, [currentLesson]);

  // auto-save progress
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let mounted = true;
    const onTimeUpdate = async () => {
      if (!v.duration || !isFinite(v.duration)) return;
      const percent = Math.floor((v.currentTime / v.duration) * 100);
      const now = Date.now();
      const last = lastSavedRef.current;

      if (percent - last.percent >= 10 || now - last.time >= 15000) {
        lastSavedRef.current = { percent, time: now };
        setProgressPercent(percent);

        if (!userId) return;

        try {
          setIsSavingProgress(true);
          await updateProgress(userId, Number(courseId), percent);
        } catch (err) {
          console.error("auto save progress failed", err);
        } finally {
          if (mounted) setIsSavingProgress(false);
        }
      }
    };

    v.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      mounted = false;
      v.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [userId, courseId]);

  const computePercentForIndex = (idx) => {
    const completedCount = Math.max(0, idx + 1);
    return Math.round((completedCount / Math.max(1, lessons.length)) * 100);
  };

  const markLessonCompleted = async (targetLessonId) => {
    if (!userId) {
      navigate(`/login?redirect=/course-player/${courseId}/${targetLessonId}`);
      return;
    }

    const idx = lessons.findIndex((l) => String(l.id) === String(targetLessonId));
    if (idx === -1) return;
    const percent = computePercentForIndex(idx);

    try {
      setIsSavingProgress(true);
      await updateProgress(userId, Number(courseId), percent);
      setLessons((prev) => prev.map((l, i) => (i <= idx ? { ...l, isCompleted: true } : l)));
      setProgressPercent(percent);
      lastSavedRef.current = { percent, time: Date.now() };
    } catch (err) {
      console.error("markComplete failed", err);
    } finally {
      setIsSavingProgress(false);
    }
  };

  const onVideoEnded = async () => {
    if (!currentLesson) return;
    await markLessonCompleted(currentLesson.id);

    const idx = lessons.findIndex((l) => String(l.id) === String(currentLesson.id));
    const next = lessons[idx + 1];
    if (next) navigate(`/course-player/${courseId}/${next.id}`);
  };

  const goToPrev = () => {
    const idx = lessons.findIndex((l) => String(l.id) === String(currentLesson?.id));
    if (idx > 0) navigate(`/course-player/${courseId}/${lessons[idx - 1].id}`);
  };
  const goToNext = () => {
    const idx = lessons.findIndex((l) => String(l.id) === String(currentLesson?.id));
    if (idx >= 0 && idx < lessons.length - 1) navigate(`/course-player/${courseId}/${lessons[idx + 1].id}`);
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!course) return <div>Course not found.</div>;
  if (!currentLesson) return <div className="loader">Select a lesson…</div>;

  // Check lock for current lesson
  const isEnrolled = !!enrollment;
  const isTrialActive = !!(trial && trial.isActive);
  const currentLocked = !(isEnrolled || isTrialActive || currentLesson.isFree);

  return (
    <div className="course-details-page">
      <div className="course-layout">
        {/* LEFT COLUMN */}
        <div className="left-col">
          {/* COURSE TITLE */}
          <h1 style={{ marginBottom: 4 }}>{course.title}</h1>

          {/* LESSON TITLE */}
          <h2 style={{ margin: "4px 0" }}>{currentLesson.title}</h2>

          {/* PROGRESS PERCENTAGE */}
          <div style={{ marginBottom: 12, color: "#666", fontWeight: 600 }}>
            Progress: {progressPercent}%
          </div>

          {/* VIDEO */}
          <div className="video-wrapper">
            {currentLocked ? (
              <div style={{ padding: 28, textAlign: "center", background: "#000", color: "#fff", borderRadius: 8 }}>
                <h3>Lesson locked</h3>
                <p style={{ marginTop: 8 }}>
                  This lesson is locked. Start a free trial or enroll to access it.
                </p>
                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn primary"
                    onClick={async () => {
                      if (!userId) {
                        navigate(`/login?redirect=/course-player/${courseId}/${currentLesson.id}`);
                        return;
                      }
                      // Start trial if user doesn't have one
                      try {
                        setLoadingTrial(true);
                        await startTrial(userId);
                        const res = await getTrialStatus(userId);
                        setTrial(res.data);
                        alert("Trial started — enjoy!");
                      } catch (err) {
                        console.error("start trial error", err);
                        alert("Unable to start trial.");
                      } finally {
                        setLoadingTrial(false);
                      }
                    }}
                    disabled={loadingTrial}
                  >
                    {loadingTrial ? "Starting…" : "Start free trial"}
                  </button>

                  <button
                    className="btn secondary"
                    onClick={() => navigate(`/courses/${courseId}`)}
                    style={{ marginLeft: 8 }}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                key={currentLesson.id}
                controls
                onEnded={onVideoEnded}
                className="html5-video"
              >
                <source src={currentLesson.videoUrl || course.videoUrl} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            )}
          </div>

          {/* NAV BUTTONS UNDER VIDEO */}
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button className="btn" onClick={goToPrev} disabled={lessons.findIndex(l => String(l.id) === String(currentLesson.id)) <= 0}>
              Prev
            </button>
            <button
              className="btn primary"
              onClick={() => markLessonCompleted(currentLesson.id)}
              disabled={currentLesson.isCompleted || isSavingProgress}
            >
              {currentLesson.isCompleted ? "Completed" : "Mark complete"}
            </button>
            <button className="btn" onClick={goToNext} disabled={lessons.findIndex(l => String(l.id) === String(currentLesson.id)) >= lessons.length - 1}>
              Next
            </button>
          </div>

          {/* LESSON DESCRIPTION */}
          <div style={{ marginTop: 12, color: "#666" }}>{currentLesson.description}</div>
        </div>

        {/* RIGHT COLUMN - LESSONS SIDEBAR */}
        <aside className="right-col">
          <div className="lessons-card">
            <h4>Lessons ({lessons.length})</h4>

            <div
              className="section-header clickable"
              onClick={() => setOpenSections((s) => ({ ...s, all: !s.all }))}
              style={{ marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>Course Content</span>
              <span>{openSections.all ? "▲" : "▼"}</span>
            </div>

            {openSections.all !== false && (
              <ul className="lessons-list" style={{ maxHeight: 420, overflow: "auto" }}>
                {sections.map((sec) => (
                  <li key={sec.title} style={{ listStyle: "none", marginBottom: 10 }}>
                    <div
                      className="section-title"
                      onClick={() => setOpenSections((s) => ({ ...s, [sec.title]: !s[sec.title] }))}
                      style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "#f9fafb", borderRadius: 8, cursor: "pointer" }}
                    >
                      <strong>{sec.title}</strong>
                      <span>{openSections[sec.title] ? "▲" : "▼"}</span>
                    </div>

                    {openSections[sec.title] !== false && (
                      <ul style={{ padding: 0, margin: "8px 0 0 0" }}>
                        {sec.lessons.map((lesson) => {
                          const active = String(currentLesson.id) === String(lesson.id);
                          const locked = !(isEnrolled || isTrialActive || lesson.isFree);
                          return (
                            <li
                              key={lesson.id}
                              className={`lesson-row ${active ? "active" : ""} ${locked ? "locked" : ""}`}
                              onClick={() => {
                                if (locked) return;
                                navigate(`/course-player/${courseId}/${lesson.id}`);
                              }}
                              style={{ listStyle: "none" }}
                            >
                              <div className="lesson-left">
                                <div className="order" style={{ minWidth: 28 }}>{lesson.order}</div>
                                <div className="meta">
                                  <div className="title">{lesson.title}{lesson.isFree && !isEnrolled && <span style={{marginLeft:8, color:'#0ea5a4', fontWeight:700}}>FREE</span>}</div>
                                </div>
                              </div>
                              <div className="lesson-right">
                                {lesson.isCompleted ? (
                                  <span style={{ color: "#10b981", fontWeight: 600 }}>✓</span>
                                ) : (
                                  <button
                                    className="btn small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markLessonCompleted(lesson.id);
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
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
