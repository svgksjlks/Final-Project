import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/learnNow.css';

const LearnNow = () => {
  return (
    <div className="learn-page">
      <h1 className="learn-title">تعلم الآن</h1>
      <p className="learn-subtitle">
        ابدأ رحلتك التعليمية من خلال المقالات والدورات والتكليفات التعليمية.
      </p>

      <div className="learn-grid">
        <div className="learn-card">
          <h2>📘 المقالات التعليمية</h2>
          <p>
            مقالات مبسطة تساعدك على فهم أساسيات الأمن السيبراني والمفاهيم المهمة.
          </p>
          <Link to="/learn-now/articles" className="learn-btn">
            عرض المقالات
          </Link>
        </div>

        <div className="learn-card">
          <h2>🎓 الدورات التعليمية</h2>
          <p>
            تصفح الدورات المتاحة وابدأ التعلم خطوة بخطوة بشكل منظم.
          </p>
          <Link to="/courses" className="learn-btn">
            عرض الدورات
          </Link>
        </div>

        <div className="learn-card">
          <h2>📝 تكليفات الدورات</h2>
          <p>
            راجع التكليفات والمهام المطلوبة لتثبيت المعلومات وزيادة الفهم.
          </p>
          <Link to="/learn-now/assignments" className="learn-btn">
            عرض التكليفات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearnNow;