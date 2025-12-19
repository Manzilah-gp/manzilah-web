import React, { useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

  const handleExploreClick = () => navigate("/public/courses");
  const handleCoursesClick = () => navigate("/public/courses");
  const handleMosquesClick = () => navigate("/public/mosques");
  const handleRegisterClick = () => navigate("/registration");

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elementsToObserve = document.querySelectorAll('.feature-card, .stat-item, .section-header, .journey-step');
    elementsToObserve.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // RTL/LTR direction handling
  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="home-container" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">{t('hero.welcome', 'Welcome to')}</span>
              <span className="title-highlight">Manzilah</span>
            </h1>
            <p className="hero-description">
              {t('hero.description', 'Manzilah connects mosques, Quran memorization centers, teachers, students, parents, and donors — empowering spiritual growth and learning for communities across Palestine.')}
            </p>
            <div className="hero-buttons">
              <button className="cta-btn primary pulse" onClick={handleExploreClick}>
                <span>{t('hero.exploreCourses', 'Explore Courses')}</span>
                <div className="btn-icon">{i18n.language === 'ar' ? '←' : '→'}</div>
              </button>
              <button className="cta-btn secondary" onClick={handleRegisterClick}>
                <span>{t('hero.getStarted', 'Get Started')}</span>
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">🕌</div>
              <p>{t('hero.mosques', 'Mosques')}</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">📚</div>
              <p>{t('hero.courses', 'Courses')}</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">👨‍👩‍👧‍👦</div>
              <p>{t('hero.community', 'Community')}</p>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef}>
        <div className="container">
          <div className="section-header">
            <h2>{t('features.title', 'Our Key Services')}</h2>
            <p>
              {t('features.subtitle', 'Comprehensive management for mosques and Quran memorization centers, supporting students, parents, teachers, and donors.')}
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card" onClick={handleCoursesClick}>
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📚</div>
                <div className="icon-bg"></div>
              </div>
              <h3>{t('features.courses.title', 'Islamic Courses')}</h3>
              <p>
                {t('features.courses.description', 'Enroll in short or long courses, track progress, and advance levels under qualified teachers. Courses include Quran, Arabic, Fiqh, and more.')}
              </p>
              <button className="feature-link">
                <span>{t('features.courses.button', 'Browse Courses')}</span>
                <div className="link-arrow">{i18n.language === 'ar' ? '←' : '→'}</div>
              </button>
            </div>

            <div className="feature-card" onClick={handleRegisterClick}>
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📝</div>
                <div className="icon-bg"></div>
              </div>
              <h3>{t('features.registration.title', 'Easy Registration')}</h3>
              <p>
                {t('features.registration.description', 'Register for courses and events easily. Parents can enroll their children, track progress, and receive notifications.')}
              </p>
              <button className="feature-link">
                <span>{t('features.registration.button', 'Register Now')}</span>
                <div className="link-arrow">{i18n.language === 'ar' ? '←' : '→'}</div>
              </button>
            </div>

            <div className="feature-card" onClick={handleMosquesClick}>
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🕌</div>
                <div className="icon-bg"></div>
              </div>
              <h3>{t('features.mosques.title', 'Mosque & Center Finder')}</h3>
              <p>
                {t('features.mosques.description', 'Locate mosques and Quran memorization centers. Get event schedules, prayer times, and stay connected with your local community.')}
              </p>
              <button className="feature-link">
                <span>{t('features.mosques.button', 'Find Mosques')}</span>
                <div className="link-arrow">{i18n.language === 'ar' ? '←' : '→'}</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Student Journey Section */}
      <section className="journey-section">
        <div className="journey-container">
          <div className="section-header">
            <h2>{t('journey.title', 'The Hafiz\'s Journey in Our App')}</h2>
            <p>{t('journey.subtitle', 'Simple Steps to Easily and Dedicatedly Memorize the Quran')}</p>
          </div>
          <div className="journey-timeline">
            {[
              {
                icon: "📝",
                title: t('journey.step1.title', 'Registration and Joining'),
                desc: t('journey.step1.description', 'Create your account and choose the mosque or study circle appropriate for your age and level.')
              },
              {
                icon: "📖",
                title: t('journey.step2.title', 'Starting Memorization'),
                desc: t('journey.step2.description', 'You are assigned a supervisor, and the app sets the start date for your daily memorization plan.')
              },
              {
                icon: "🎧",
                title: t('journey.step3.title', 'Recitation and Review'),
                desc: t('journey.step3.description', 'Recite directly to your supervisor or use the AI-powered recitation for review.')
              },
              {
                icon: "📊",
                title: t('journey.step4.title', 'Follow-up and Evaluation'),
                desc: t('journey.step4.description', 'Receive periodic progress reports, and parents can monitor their child\'s memorization progress.')
              },
              {
                icon: "🏆",
                title: t('journey.step5.title', 'Competitions and Motivation'),
                desc: t('journey.step5.description', 'Participate in mosque competitions and events, earning digital badges and certificates.')
              },
              {
                icon: "🌟",
                title: t('journey.step6.title', 'Achievement and Recognition'),
                desc: t('journey.step6.description', 'Upon completion, the student is recognized and displayed on the honor roll and mosque\'s honor board.')
              },
            ].map((step, index) => (
              <div key={index} className="journey-step">
                <div className="journey-icon-wrapper">
                  <div className="journey-icon">{step.icon}</div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donations & Events Section */}
      <section className="donations-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('donations.title', 'Support & Participate')}</h2>
            <p>
              {t('donations.subtitle', 'Contribute to approved donation campaigns or join events organized by mosques and centers.')}
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card donation-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">💝</div>
                <div className="icon-bg"></div>
              </div>
              <h3>{t('donations.donations.title', 'Donations')}</h3>
              <p>
                {t('donations.donations.description', 'Donate safely via our integrated payment gateway to support approved campaigns.')}
              </p>
              <button className="feature-link">
                <span>{t('donations.donations.button', 'Donate Now')}</span>
                <div className="link-arrow">{i18n.language === 'ar' ? '←' : '→'}</div>
              </button>
            </div>
            <div className="feature-card event-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📅</div>
                <div className="icon-bg"></div>
              </div>
              <h3>{t('donations.events.title', 'Events')}</h3>
              <p>
                {t('donations.events.description', 'Participate in approved events, workshops, and community activities hosted by mosques and memorization centers.')}
              </p>
              <button className="feature-link">
                <span>{t('donations.events.button', 'View Events')}</span>
                <div className="link-arrow">{i18n.language === 'ar' ? '←' : '→'}</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="section-header">
            <h2>{t('stats.title', 'Our Impact')}</h2>
            <p>{t('stats.subtitle', 'Empowering students, families, and communities across Palestine')}</p>
          </div>
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number" data-count="50">10+</div>
              <p>{t('stats.courses', 'Courses Available')}</p>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="100">50+</div>
              <p>{t('stats.mosques', 'Mosques & Centers')}</p>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="5000">213+</div>
              <p>{t('stats.students', 'Students Enrolled')}</p>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <p>{t('stats.support', 'Support Available')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('faq.title', 'Common Questions')}</h2>
            <p>{t('faq.subtitle', 'Find quick answers to the most frequently asked questions about our platform and services.')}</p>
          </div>
          <div className="faq-accordion">
            <div className="faq-item">
              <input type="checkbox" id="faq1" className="faq-toggle" />
              <label htmlFor="faq1" className="faq-title">
                {t('faq.question1', 'How do I register for a course?')}
              </label>
              <div className="faq-content">
                <p>{t('faq.answer1', 'Registration is simple! Click on the "Get Started" button in the hero section or navigate to the Registration page. You will be guided through a few easy steps to create your account and enroll in your desired courses.')}</p>
              </div>
            </div>
            <div className="faq-item">
              <input type="checkbox" id="faq2" className="faq-toggle" />
              <label htmlFor="faq2" className="faq-title">
                {t('faq.question2', 'Are the courses free?')}
              </label>
              <div className="faq-content">
                <p>{t('faq.answer2', 'Our platform offers a mix of free and premium courses. Many foundational courses are available at no cost, while specialized or certified programs may require a small fee. Check the Courses page for details.')}</p>
              </div>
            </div>
            <div className="faq-item">
              <input type="checkbox" id="faq3" className="faq-toggle" />
              <label htmlFor="faq3" className="faq-title">
                {t('faq.question3', 'How can I donate to a mosque or center?')}
              </label>
              <div className="faq-content">
                <p>{t('faq.answer3', 'You can donate securely through our integrated payment gateway in the Donations section. All campaigns are vetted and approved to ensure your contribution goes directly to the intended cause.')}</p>
              </div>
            </div>
            <div className="faq-item">
              <input type="checkbox" id="faq4" className="faq-toggle" />
              <label htmlFor="faq4" className="faq-title">
                {t('faq.question4', 'Can parents track their children\'s progress?')}
              </label>
              <div className="faq-content">
                <p>{t('faq.answer4', 'Yes, parents who register their children will have access to a dedicated dashboard to monitor attendance, view grades, and track overall progress in real-time.')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-overlay"></div>
        </div>
        <div className="container">
          <div className="cta-content">
            <h2>{t('cta.title', 'Start Your Spiritual Journey Today')}</h2>
            <p>
              {t('cta.description', 'Join thousands of students, parents, and donors who are benefiting from Manzilah\'s unified platform.')}
            </p>
            <div className="cta-buttons">
              <button className="cta-btn primary glow" onClick={handleRegisterClick}>
                <span>{t('cta.getStarted', 'Get Started')}</span>
                <div className="btn-icon">🎯</div>
              </button>
              <button className="cta-btn secondary" onClick={handleCoursesClick}>
                <span>{t('cta.learnMore', 'Learn More')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;