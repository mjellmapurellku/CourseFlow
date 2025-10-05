import "./Home.css";

const courses = [
  { id: 1, title: "AI for Beginners", category: "AI", rating: 4.7 },
  { id: 2, title: "React from Zero to Hero", category: "Programming", rating: 4.8 },
  { id: 3, title: "UI/UX Design Essentials", category: "Design", rating: 4.6 },
  { id: 4, title: "Machine Learning 101", category: "AI", rating: 4.9 },
  { id: 5, title: "Marketing Mastery", category: "Marketing", rating: 4.5 },
  { id: 6, title: "Business Strategy", category: "Business", rating: 4.4 },
  { id: 7, title: "Data Science Basics", category: "Data Science", rating: 4.7 },
  { id: 8, title: "Advanced Python", category: "Programming", rating: 4.8 },
];

const getRecommendedCourses = (allCourses, interest = "AI") =>
  allCourses.filter(c => c.category === interest).slice(0, 4);

const getTopRatedCourses = (allCourses) =>
  [...allCourses].sort((a, b) => b.rating - a.rating).slice(0, 4);

export default function Home() {
  const recommended = getRecommendedCourses(courses);
  const topRated = getTopRatedCourses(courses);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Learn Anything. Anytime. With AI Guidance.</h1>
          <p>
            Boost your career with courses recommended just for you — powered by AI.
          </p>
          <button className="btn-discover">Discover Courses</button>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2>Explore Categories</h2>
        <div className="categories-grid">
          {["AI", "Programming", "Design", "Marketing", "Business", "Data Science"].map(
            (cat) => (
              <div key={cat} className="category-card">
                <span>{cat}</span>
              </div>
            )
          )}
        </div>
      </section>

      {/* Recommended */}
      <section className="recommended-section">
        <h2>Recommended for You</h2>
        <div className="course-grid">
          {recommended.map((c) => (
            <div key={c.id} className="course-card">
              <h3>{c.title}</h3>
              <p>Category: {c.category}</p>
              <span>⭐ {c.rating}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="top-rated-section">
        <h2>Top Rated Courses</h2>
        <div className="course-grid">
          {topRated.map((c) => (
            <div key={c.id} className="course-card">
              <h3>{c.title}</h3>
              <p>Category: {c.category}</p>
              <span>⭐ {c.rating}</span>
            </div>
          ))}
        </div>
      </section>

      
      {/* <footer className="footer">
        <p>© 2025 CourseFlow | Learn smarter with AI</p>
      </footer> */}
    </div>
  );
}
