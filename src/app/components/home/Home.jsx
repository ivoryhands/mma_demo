import React from 'react';
import { Link } from 'react-router';

function Home() {
  return (
    <div>
    <section className="intro bg-cover">
      <div className="content">
        <h1>MMA CLASH</h1>
        <p>Clash against other fight fans as you make fight picks in realtime and compete for top spot.</p>
        <Link to ="signin" className="btn btn-outline-secondary btn-lg" role="button">Sign In</Link>
        <Link to ="signup" className="btn btn-outline-secondary btn-signin btn-lg" role="button">Sign Up</Link>

     </div>
    </section>
    <footer>
        <span>Made by EGAP</span>
    </footer>
  </div>
  )
}

export default Home;
