// import { FiAward, FiBook, FiTarget, FiUsers, FiZap } from "react-icons/fi";
// import "./About.css";

// export default function About() {
//   const stats = [
//     { icon: <FiUsers />, number: "10,000+", label: "Active Students" },
//     { icon: <FiBook />, number: "500+", label: "Quality Courses" },
//     { icon: <FiAward />, number: "50+", label: "Expert Instructors" },
//     { icon: <FiZap />, number: "95%", label: "Success Rate" },
//   ];

//   const values = [
//     {
//       icon: <FiTarget />,
//       title: "Our Mission",
//       description: "To democratize education by providing accessible, high-quality learning experiences powered by AI technology."
//     },
//     {
//       icon: <FiZap />,
//       title: "Innovation",
//       description: "We leverage cutting-edge AI to personalize learning paths and provide intelligent recommendations for every student."
//     },
//     {
//       icon: <FiAward />,
//       title: "Excellence",
//       description: "Our courses are crafted by industry experts and continuously updated to reflect the latest trends and best practices."
//     },
//   ];

//   const team = [
//     {
//       name: "Sarah Johnson",
//       role: "CEO & Founder",
//       image: "https://source.unsplash.com/random/300x300?portrait,woman,professional",
//       description: "Former educator with 15+ years of experience in online learning."
//     },
//     {
//       name: "Michael Chen",
//       role: "CTO",
//       image: "https://source.unsplash.com/random/300x300?portrait,man,tech",
//       description: "AI specialist passionate about transforming education through technology."
//     },
//     {
//       name: "Emily Rodriguez",
//       role: "Head of Content",
//       image: "https://source.unsplash.com/random/300x300?portrait,woman,business",
//       description: "Curriculum designer with expertise in creating engaging learning experiences."
//     },
//     {
//       name: "David Kim",
//       role: "Lead Instructor",
//       image: "https://source.unsplash.com/random/300x300?portrait,man,teacher",
//       description: "Industry veteran with a passion for teaching and mentoring students."
//     },
//   ];

//   return (
//     <div className="about-page">
//       {/* Hero Section */}
//       <section className="about-hero">
//         <div className="about-hero-content">
//           <h1>About <span className="highlight">CourseFlow</span></h1>
//           <p>
//             Empowering learners worldwide with AI-powered education that adapts to your unique learning style and goals.
//           </p>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="stats-section">
//         <div className="stats-container">
//           {stats.map((stat, index) => (
//             <div key={index} className="stat-card">
//               <div className="stat-icon">{stat.icon}</div>
//               <div className="stat-number">{stat.number}</div>
//               <div className="stat-label">{stat.label}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Story Section */}
//       <section className="story-section">
//         <div className="story-content">
//           <div className="story-text">
//             <h2>Our Story</h2>
//             <p>
//               Founded in 2023, CourseFlow was born from a simple belief: everyone deserves access to quality education that adapts to their unique learning journey.
//             </p>
//             <p>
//               We combine the expertise of world-class instructors with the power of artificial intelligence to create personalized learning experiences that help students achieve their goals faster and more effectively.
//             </p>
//             <p>
//               Today, we're proud to serve thousands of students worldwide, offering courses across multiple disciplines and skill levels. Our platform continues to evolve, incorporating the latest in educational technology and pedagogical research.
//             </p>
//           </div>
//           <div className="story-image">
//             <img src="https://source.unsplash.com/random/600x400?education,learning" alt="Our Story" />
//           </div>
//         </div>
//       </section>

//       {/* Values Section */}
//       <section className="values-section">
//         <h2>What We Stand For</h2>
//         <div className="values-grid">
//           {values.map((value, index) => (
//             <div key={index} className="value-card">
//               <div className="value-icon">{value.icon}</div>
//               <h3>{value.title}</h3>
//               <p>{value.description}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="team-section">
//         <h2>Meet Our Team</h2>
//         <p className="team-intro">
//           Passionate educators and technologists dedicated to transforming online learning
//         </p>
//         <div className="team-grid">
//           {team.map((member, index) => (
//             <div key={index} className="team-card">
//               <div className="team-image" style={{ backgroundImage: `url(${member.image})` }}></div>
//               <div className="team-info">
//                 <h3>{member.name}</h3>
//                 <p className="team-role">{member.role}</p>
//                 <p className="team-description">{member.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="about-cta">
//         <div className="about-cta-content">
//           <h2>Join Our Learning Community</h2>
//           <p>Start your journey with CourseFlow today and unlock your potential</p>
//           <button className="btn btn-primary btn-large">Get Started Now</button>
//         </div>
//       </section>
//     </div>
//   );
// }
