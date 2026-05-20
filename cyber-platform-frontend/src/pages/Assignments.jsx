import React from 'react';
import '../styles/assignments.css';

const assignments = [
  {
    id: 1,
    title: 'تكليف: البحث عن أنواع الهجمات السيبرانية',
    description: 'اكتب ملخصًا قصيرًا عن 3 أنواع من الهجمات السيبرانية مع أمثلة لكل نوع.'
  },
  {
    id: 2,
    title: 'تكليف: إنشاء كلمة مرور قوية',
    description: 'قم بإنشاء 5 أمثلة لكلمات مرور قوية واشرح لماذا تعتبر قوية.'
  },
  {
    id: 3,
    title: 'تكليف: مقارنة بين Red Team و Blue Team',
    description: 'اكتب الفرق بين الفريق الأحمر والفريق الأزرق ودور كل منهما في الأمن السيبراني.'
  }
];

const Assignments = () => {
  return (
    <div className="assignments-page">
      <h1 className="assignments-title">تكليفات الدورات التعليمية</h1>

      <div className="assignments-list">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <h2>{assignment.title}</h2>
            <p>{assignment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;