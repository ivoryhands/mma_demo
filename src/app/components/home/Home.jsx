import React from 'react';
import { Link } from 'react-router';

function Home() {
  return (
    <div>
    <section className="intro bg-cover">
      <div className="content">
        <h1 className="white-text">ClashMMA</h1>
        <p className="white-text">Clash against other fight fans as you make fight picks in realtime and compete for top spot.</p>
        <Link to ="signin" className="blocks" role="button">Sign In</Link>
        <Link to ="signup" className="blocks" role="button">Sign Up</Link>

     </div>
    </section>
    <footer>
        <span>Made by EGAP</span>
    </footer>
  </div>
  )
}

export default Home;
