import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/learningPathDetails.css';

const pathsData = {
  'cyber-basics': {
    title: 'أساسيات الأمن السيبراني',
    description: 'ابدأ من الصفر وتعلم المبادئ الأساسية في الأمن السيبراني والشبكات والتهديدات الأمنية.',
    topics: [
      'مقدمة في الأمن السيبراني',
      'أساسيات الشبكات',
      'أنواع التهديدات والهجمات',
      'أساسيات الحماية',
      'التوعية الأمنية'
    ]
  },
  'red-team': {
    title: 'Red Team',
    description: 'تعلم أساسيات الهجوم الأخلاقي واكتشاف الثغرات واختبار الاختراق.',
    topics: [
      'مقدمة في Red Team',
      'Reconnaissance',
      'Scanning',
      'Exploitation Basics',
      'Privilege Escalation'
    ]
  },
  'blue-team': {
    title: 'Blue Team',
    description: 'تعرف على الدفاعات الأمنية وتحليل السجلات ومراقبة الأنظمة.',
    topics: [
      'مقدمة في Blue Team',
      'Monitoring',
      'Log Analysis',
      'Incident Response',
      'Threat Detection'
    ]
  },
  'soc': {
    title: 'SOC',
    description: 'تعلم دور محلل مركز العمليات الأمنية وطريقة التعامل مع التنبيهات الأمنية.',
    topics: [
      'ما هو SOC؟',
      'أنظمة SIEM',
      'تحليل التنبيهات',
      'إدارة الحوادث',
      'التقارير الأمنية'
    ]
  },
  'pen-tester': {
    title: 'Pen Tester',
    description: 'مسار متخصص في اختبار الاختراق وتقييم الأنظمة والتطبيقات واكتشاف الثغرات.',
    topics: [
      'مقدمة في Pen Testing',
      'Web Testing',
      'Network Testing',
      'Reporting',
      'Ethical Hacking Basics'
    ]
  },
  'network-security': {
    title: 'Network Security',
    description: 'تعلم حماية الشبكات، البروتوكولات، الجدران النارية، وأنظمة الكشف عن التسلل.',
    topics: [
      'أساسيات أمن الشبكات',
      'Firewalls',
      'IDS/IPS',
      'Secure Protocols',
      'Network Hardening'
    ]
  },
  'forensics': {
    title: 'Forensics',
    description: 'مقدمة في الأدلة الجنائية الرقمية وتحليل الحوادث واستخراج الأدلة.',
    topics: [
      'مقدمة في Digital Forensics',
      'جمع الأدلة',
      'تحليل الأجهزة',
      'تحليل السجلات',
      'كتابة التقارير'
    ]
  }
};

const LearningPathDetails = () => {
  const { slug } = useParams();
  const path = pathsData[slug];

  if (!path) {
    return (
      <div className="path-details-page">
        <h1>المسار غير موجود</h1>
        <Link to="/learning-paths" className="back-btn">
          العودة إلى المسارات
        </Link>
      </div>
    );
  }

  return (
    <div className="path-details-page">
      <h1 className="path-details-title">{path.title}</h1>
      <p className="path-details-description">{path.description}</p>

      <div className="path-topics-box">
        <h2>محتوى المسار</h2>
        <ul>
          {path.topics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      </div>

      <Link to="/learning-paths" className="back-btn">
        العودة إلى كل المسارات
      </Link>
    </div>
  );
};

export default LearningPathDetails;