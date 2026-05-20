// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Courses from './pages/Courses';
// import CourseDetail from './pages/CourseDetail';
// import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//     return (
//         <AuthProvider>
//             <Router>
//                 <div className="min-h-screen bg-[#0a0a1a]">
//                     <Navbar />
//                     <Routes>
//                         <Route path="/" element={<Home />} />
//                         <Route path="/login" element={<Login />} />
//                         <Route path="/register" element={<Register />} />
//                         <Route path="/courses" element={<Courses />} />
//                         <Route path="/courses/:id" element={<CourseDetail />} />
//                         <Route
//                             path="/dashboard"
//                             element={
//                                 <ProtectedRoute>
//                                     <Dashboard />
//                                 </ProtectedRoute>
//                             }
//                         />
//                     </Routes>
//                     <Footer />
//                 </div>
//             </Router>
//         </AuthProvider>
//     );
// }

// export default App;