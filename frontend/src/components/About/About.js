import React from 'react';
import './About.css';
import team1 from "../../Assets/team1.png";
import team2 from "../../Assets/team2.png";

const About = () => {
    return (
      <div className="about-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>About Our Blog</h1>
            <p>Sharing insights, knowledge, and stories that shape the future.</p>
          </div>
        </section>
  
        {/* Mission Statement */}
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide readers with insightful, thought-provoking, and engaging content that spans across industries such as technology, health, finance, and beyond. We aim to empower, educate, and inspire through authentic storytelling and expert perspectives.
          </p>
        </section>
  
        {/* What We Do */}
        <section className="what-we-do-section">
          <h2>What We Do</h2>
          <p>
            We curate and create quality articles, interviews, and features on topics that matter most to today’s curious minds. Our blog is a platform for professionals, enthusiasts, and learners to explore trending topics, new technologies, and innovations shaping the world.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <h3>Expert Content</h3>
              <p>Our writers and contributors are industry experts with a passion for sharing their knowledge.</p>
            </div>
            <div className="feature-item">
              <h3>Diverse Perspectives</h3>
              <p>We believe in the power of different perspectives, sharing stories from all walks of life.</p>
            </div>
            <div className="feature-item">
              <h3>Engaging Topics</h3>
              <p>We explore a wide range of topics from the latest in tech to health and wellness, finance, and more.</p>
            </div>
          </div>
        </section>
  
        {/* Team Section */}
        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-members">
            <div className="team-member">
              <img src={ team1 }  alt="Gabriel" />
              <h3>Gabriel Emmanuel</h3>
              <p>Frontend Engineer</p>
            </div>
            <div className="team-member">
              <img src= { team2 } alt="Praise" />
              <h3>Praise Josiah</h3>
              <p>Bakend Engineer</p>
            </div>
          </div>
        </section>
  
        {/* Call to Action */}
        <section className="call-to-action-section">
          <h2>Join Our Journey</h2>
          <p>Stay updated with our latest posts, stories, and articles. Subscribe to our newsletter and become part of a growing community of thinkers and innovators.</p>
          <a href="/subscribe" className="cta-button">Subscribe Now</a>
        </section>
      </div>
    );
  };

  export default About;
