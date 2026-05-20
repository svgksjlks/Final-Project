import React from 'react';
import '../styles/articles.css';

const articles = [
  {
    id: 1,
    title: 'ما هو الأمن السيبراني؟',
    summary: 'مقدمة بسيطة لفهم مفهوم الأمن السيبراني وأهميته في حماية الأنظمة والبيانات.',
    content:
      'الأمن السيبراني هو مجموعة من الممارسات والتقنيات المستخدمة لحماية الأنظمة والشبكات والبرامج من الهجمات الرقمية. يهدف إلى الحفاظ على سرية البيانات وسلامتها وتوافرها.'
  },
  {
    id: 2,
    title: 'أنواع الهجمات السيبرانية',
    summary: 'تعرف على أكثر أنواع الهجمات السيبرانية شيوعًا مثل التصيد والبرمجيات الخبيثة.',
    content:
      'من أشهر الهجمات السيبرانية: التصيد الاحتيالي، هجمات حجب الخدمة، البرمجيات الخبيثة، وهجمات كلمات المرور. فهم هذه الأنواع هو أول خطوة للحماية منها.'
  },
  {
    id: 3,
    title: 'أهمية كلمات المرور القوية',
    summary: 'كيف تنشئ كلمة مرور قوية ولماذا تعتبر خط الدفاع الأول؟',
    content:
      'كلمات المرور القوية تساعد على تقليل احتمالات اختراق الحسابات. يفضل أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز، وأن تكون فريدة لكل حساب.'
  }
];

const Articles = () => {
  return (
    <div className="articles-page">
      <h1 className="articles-title">المقالات التعليمية</h1>

      <div className="articles-list">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <h2>{article.title}</h2>
            <p className="article-summary">{article.summary}</p>

            <details className="article-details">
              <summary>عرض المحتوى الكامل</summary>
              <p>{article.content}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;