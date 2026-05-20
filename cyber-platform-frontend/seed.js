// seed.js - لإضافة بيانات تجريبية
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
require('dotenv').config();

const seedData = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // مسح البيانات القديمة
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});

    // إنشاء كورس
    const course1 = await Course.create({
        title: "مقدمة في الأمن السيبراني",
        description: "تعرف على عالم الأمن السيبراني من الصفر. ستتعلم المفاهيم الأساسية والمصطلحات المهمة ومجالات العمل المختلفة.",
        category: "مقدمة في الأمن السيبراني",
        level: "مبتدئ",
        duration: "3 ساعات",
        isPublished: true
    });

    // إنشاء دروس
    const lesson1 = await Lesson.create({
        title: "ما هو الأمن السيبراني؟",
        content: `
# ما هو الأمن السيبراني؟ 🔐

الأمن السيبراني هو ممارسة حماية الأنظمة والشبكات والبرامج من الهجمات الرقمية.

## لماذا الأمن السيبراني مهم؟

- حماية البيانات الشخصية
- حماية المؤسسات من الخسائر المالية
- الحفاظ على سمعة الشركات
- حماية البنية التحتية الحيوية

## أنواع الأمن السيبراني:

1. **أمن الشبكات** - حماية شبكات الكمبيوتر
2. **أمن التطبيقات** - حماية البرمجيات
3. **أمن المعلومات** - حماية البيانات
4. **أمن العمليات** - إدارة صلاحيات الوصول
5. **التعافي من الكوارث** - الاستجابة للحوادث
        `,
        course: course1._id,
        order: 1,
        resources: [
            { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" }
        ]
    });

    // إنشاء اختبار
    const quiz1 = await Quiz.create({
        title: "اختبار: مقدمة في الأمن السيبراني",
        course: course1._id,
        questions: [
            {
                questionText: "ما هو الهدف الرئيسي للأمن السيبراني؟",
                options: [
                    { text: "حماية الأنظمة والشبكات من الهجمات الرقمية", isCorrect: true },
                    { text: "تصميم مواقع الويب", isCorrect: false },
                    { text: "إدارة قواعد البيانات", isCorrect: false },
                    { text: "برمجة تطبيقات الجوال", isCorrect: false }
                ],
                explanation: "الأمن السيبراني يركز على حماية الأنظمة الرقمية من التهديدات"
            },
            {
                questionText: "أي من التالي ليس من أنواع الأمن السيبراني؟",
                options: [
                    { text: "أمن الشبكات", isCorrect: false },
                    { text: "أمن التطبيقات", isCorrect: false },
                    { text: "أمن الديكور", isCorrect: true },
                    { text: "أمن المعلومات", isCorrect: false }
                ],
                explanation: "أمن الديكور ليس من مجالات الأمن السيبراني"
            },
            {
                questionText: "ما هو CIA Triad؟",
                options: [
                    { text: "وكالة استخبارات أمريكية فقط", isCorrect: false },
                    { text: "السرية والتكامل والتوفر", isCorrect: true },
                    { text: "نوع من الفيروسات", isCorrect: false },
                    { text: "لغة برمجة", isCorrect: false }
                ],
                explanation: "CIA Triad يشير إلى: Confidentiality, Integrity, Availability"
            }
        ],
        passingScore: 70
    });

    // تحديث الكورس بالدروس والاختبارات
    course1.lessons.push(lesson1._id);
    course1.quizzes.push(quiz1._id);
    await course1.save();

    console.log('✅ تم إضافة البيانات التجريبية بنجاح');
    process.exit();
};

seedData();