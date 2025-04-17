import React, { useState } from 'react';
import { withErrorBoundary } from '../../components/ErrorBoundary';
import { useAnalytics } from '../../lib/analytics';

const LessonPlanner = () => {
  const { trackEvent } = useAnalytics();
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: '',
    subject: '',
    grade: '',
    day: 'Monday',
    recurring: false,
    duration: 30,
    materials: '',
    notes: ''
  });
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const subjects = ['Math', 'Science', 'Language Arts', 'History', 'Art', 'Music', 'Physical Education', 'Other'];
  const grades = ['Preschool', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', 'High School'];
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLesson({
      ...newLesson,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleAddLesson = (e) => {
    e.preventDefault();
    
    if (!newLesson.title || !newLesson.subject || !newLesson.grade) {
      alert('Please fill in all required fields');
      return;
    }
    
    const lesson = {
      ...newLesson,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setLessons([...lessons, lesson]);
    
    // Track lesson creation
    trackEvent('lesson_created', {
      subject: lesson.subject,
      grade: lesson.grade,
      day: lesson.day,
      recurring: lesson.recurring
    });
    
    // Reset form
    setNewLesson({
      title: '',
      subject: '',
      grade: '',
      day: 'Monday',
      recurring: false,
      duration: 30,
      materials: '',
      notes: ''
    });
  };
  
  const handleDeleteLesson = (id) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
    
    // Track lesson deletion
    trackEvent('lesson_deleted', {
      lessonId: id
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dynamic Lesson Planner</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lesson Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Lesson</h2>
          
          <form onSubmit={handleAddLesson}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lesson Title *
              </label>
              <input
                type="text"
                name="title"
                value={newLesson.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                name="subject"
                value={newLesson.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Level *
              </label>
              <select
                name="grade"
                value={newLesson.grade}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Grade</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day of Week
              </label>
              <select
                name="day"
                value={newLesson.day}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={newLesson.duration}
                onChange={handleInputChange}
                min="5"
                step="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={newLesson.recurring}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Recurring Weekly</span>
              </label>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Materials Needed
              </label>
              <textarea
                name="materials"
                value={newLesson.materials}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="2"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={newLesson.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="2"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Lesson
            </button>
          </form>
        </div>
        
        {/* Weekly Schedule */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
          
          {days.map(day => (
            <div key={day} className="mb-6">
              <h3 className="text-lg font-medium mb-2 pb-1 border-b">{day}</h3>
              
              {lessons.filter(lesson => lesson.day === day).length > 0 ? (
                <div className="space-y-3">
                  {lessons
                    .filter(lesson => lesson.day === day)
                    .map(lesson => (
                      <div key={lesson.id} className="bg-gray-50 p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <div className="text-sm text-gray-600">
                              {lesson.subject} | {lesson.grade} | {lesson.duration} min
                              {lesson.recurring && " | Recurring"}
                            </div>
                            
                            {lesson.materials && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Materials:</span> {lesson.materials}
                              </div>
                            )}
                            
                            {lesson.notes && (
                              <div className="mt-1 text-sm">
                                <span className="font-medium">Notes:</span> {lesson.notes}
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No lessons scheduled</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(LessonPlanner, {
  onError: (error, errorInfo) => {
    console.error('Error in LessonPlanner component:', error, errorInfo);
  }
});
