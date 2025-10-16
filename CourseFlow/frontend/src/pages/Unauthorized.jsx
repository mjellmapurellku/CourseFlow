// src/components/Unauthorized.jsx
import { Link } from "react-router-dom";
export default function Unauthorized() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Unauthorized</h2>
      <p>You don't have permission to view this page.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}
