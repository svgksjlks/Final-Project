// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/home.css';

// const Home = () => {
//   return (
//     <div className="home-page">
//       <section className="hero-section">
//         <div className="hero-content">
//           <h1>Welcome to Cyber Security Learning Platform</h1>
//           <p>
//             Learn the fundamentals of cyber security, networking, operating systems,
//             and Linux through structured written lessons designed for beginners.
//           </p>

//           <div className="hero-buttons">
//             <Link to="/courses" className="hero-btn primary-btn">
//               Explore Courses
//             </Link>
//             <Link to="/login" className="hero-btn secondary-btn">
//               Login
//             </Link>
//           </div>
//         </div>
//       </section>

//       <section className="features-section">
//         <h2>Why Choose Our Platform?</h2>
//         <div className="features-grid">
//           <div className="feature-card">
//             <h3>Structured Courses</h3>
//             <p>
//               Learn cyber security concepts in an organized way with complete courses and lessons.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h3>Written Content</h3>
//             <p>
//               Simple and clear written explanations that help students understand key concepts easily.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h3>Beginner Friendly</h3>
//             <p>
//               Our platform is designed for students who are starting their journey in cyber security.
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;








import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>مرحبًا بك في منصة تعلم الأمن السيبراني</h1>
          <p>
            تعلم أساسيات الأمن السيبراني والشبكات وأنظمة التشغيل ولينكس
            من خلال محتوى تعليمي منظم ومناسب للمبتدئين.
          </p>

          <div className="hero-buttons">
            <Link to="/courses" className="hero-btn primary-btn">
              استكشف الدورات
            </Link>

            {user ? (
              <Link to="/dashboard" className="hero-btn secondary-btn">
                اذهب إلى لوحة التحكم
              </Link>
            ) : (
              <Link to="/login" className="hero-btn secondary-btn">
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>لماذا تختار منصتنا؟</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>دورات منظمة</h3>
            <p>
              تعلم مفاهيم الأمن السيبراني بطريقة مرتبة من خلال دورات ودروس متكاملة.
            </p>
          </div>

          <div className="feature-card">
            <h3>محتوى مكتوب واضح</h3>
            <p>
              شروحات بسيطة وواضحة تساعد الطلاب على فهم المفاهيم الأساسية بسهولة.
            </p>
          </div>

          <div className="feature-card">
            <h3>مناسب للمبتدئين</h3>
            <p>
              المنصة مصممة خصيصًا للطلاب الذين يبدأون رحلتهم في مجال الأمن السيبراني.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;