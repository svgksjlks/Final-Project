// src/components/CourseCard.jsx
import { Link } from 'react-router-dom';
import { FaUsers, FaClock, FaBookOpen } from 'react-icons/fa';

const CourseCard = ({ course }) => {
    return (
        <div className="cyber-card group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="h-40 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 
                                flex items-center justify-center">
                    <span className="text-5xl">🔐</span>
                </div>
                <span className="absolute top-2 left-2 bg-cyan-500 text-white 
                                 text-xs px-2 py-1 rounded-full">
                    {course.level}
                </span>
            </div>

            <span className="text-cyan-400 text-sm font-medium">
                {course.category}
            </span>

            <h3 className="text-lg font-bold text-white mt-2 mb-3 
                           group-hover:text-cyan-400 transition-colors">
                {course.title}
            </h3>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {course.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span><FaBookOpen className="inline ml-1" /> 
                    {course.lessons?.length || 0} درس
                </span>
                <span><FaClock className="inline ml-1" /> 
                    {course.duration || 'غير محدد'}
                </span>
                <span><FaUsers className="inline ml-1" /> 
                    {course.studentsEnrolled}
                </span>
            </div>

            <Link to={`/courses/${course._id}`} 
                  className="cyber-btn w-full text-center block text-sm py-2">
                ابدأ التعلم ←
            </Link>
        </div>
    );
};

export default CourseCard;