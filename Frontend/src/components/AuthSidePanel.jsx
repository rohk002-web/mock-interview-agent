import "./AuthStyles.css";

const AuthSidePanel = () => {
  return (
    <div className="auth-hero">
      <div className="hero-badge">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        AI-powered interviews in seconds
      </div>

      <h1 className="hero-title">
        Master your next <span>Interview</span> with AI.
      </h1>

      <p className="hero-description">
        Get personalized mock interviews, real-time feedback, and role-specific questions tailored to your career goals.
      </p>

      <div className="hero-features">
        <div className="feature-item">
          <div className="feature-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="feature-text">
            <h4>Role-Based Questions</h4>
            <p>Specific scenarios for SDE, PM, Data Science, and more.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="feature-text">
            <h4>Real-time AI Feedback</h4>
            <p>Instant analysis of your answers and body language.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="feature-text">
            <h4>Performance Analytics</h4>
            <p>Track your progress and identify areas for improvement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidePanel;
