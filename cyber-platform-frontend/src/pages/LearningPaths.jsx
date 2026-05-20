import React from 'react';
import '../styles/learningPaths.css';

const paths = [
  {
    id: 1,
    title: 'أساسيات الأمن السيبراني',
    description: 'ابدأ من الصفر وتعلم المفاهيم الأساسية التي يحتاجها أي مبتدئ في المجال.'
  },
  {
    id: 2,
    title: 'Red Team',
    description: 'تعلم أساسيات اختبار الاختراق والهجوم الأخلاقي واكتشاف الثغرات.'
  },
  {
    id: 3,
    title: 'Blue Team',
    description: 'تعرف على الدفاعات الأمنية ومراقبة الأنظمة والاستجابة للهجمات.'
  },
  {
    id: 4,
    title: 'SOC',
    description: 'تعلم دور محلل مركز العمليات الأمنية وكيفية تحليل التنبيهات الأمنية.'
  },
  {
    id: 5,
    title: 'Pen Tester',
    description: 'مسار متخصص في اختبار الاختراق وتقييم الأنظمة والتطبيقات.'
  },
  {
    id: 6,
    title: 'Network Security',
    description: 'تعلم حماية الشبكات والبروتوكولات وأفضل الممارسات الأمنية.'
  },
  {
    id: 7,
    title: 'Forensics',
    description: 'مقدمة في الأدلة الجنائية الرقمية وتحليل الحوادث الأمنية.'
  }
];

const LearningPaths = () => {
  return (
    <div className="paths-page">
      <h1 className="paths-title">مسارات التعلم</h1>

      <div className="paths-grid">
        {paths.map((path) => (
          <div key={path.id} className="path-card">
            <h2>{path.title}</h2>
            <p>{path.description}</p>
            <button className="path-btn">ابدأ هذا المسار</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPaths;