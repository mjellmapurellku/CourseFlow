// src/utils/SeedCourses.jsx
import axios from "axios";
import { useEffect } from "react";
import { allCourses } from "../data/CourseData";

const API_URL = "https://localhost:55554/api";

export default function SeedCourses() {
  useEffect(() => {
    const seed = async () => {
      console.log("Starting course seeding...");
      for (const c of allCourses) {
        const payload = {
          title: c.title,
          description: c.description ?? `${c.title} - ${c.category}`,
          category: c.category ?? "General",
          level: c.level ?? "Beginner",
          instructorId: 3
        };

        try {
          const res = await axios.post(API_URL, payload, { timeout: 10000 });
          console.log(`✅ Added: ${payload.title} (id: ${res.data?.id ?? "unknown"})`);
        } catch (err) {
          // better error reporting
          if (err?.response) {
            console.error(`❌ Failed to add ${payload.title}: HTTP ${err.response.status}`, err.response.data);
          } else {
            console.error(`❌ Failed to add ${payload.title}:`, err.message || err);
          }
          // continue with next course rather than stopping
        }
      }
      console.log("Seeding finished. Remove or comment out SeedCourses from routes.");
    };

    seed();
  }, []);

  return <div style={{ padding: 20 }}>Seeding courses... check browser console for progress.</div>;
}
