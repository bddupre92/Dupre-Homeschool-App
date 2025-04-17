import React, { useState, useEffect } from 'react';
import { withErrorBoundary } from '../app/index';
import { useAnalytics } from '../lib/analytics';
import { useLocalStorageCache } from '../hooks/useLocalStorageCache';

const ProgressTracker = () => {
  const { trackEvent } = useAnalytics();
  const { getItem, setItem } = useLocalStorageCache();
  
  // Load students from local storage or initialize empty array
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([
    'Math', 'Science', 'Language Arts', 'History', 'Art', 'Music', 'Physical Education'
  ]);
  
  // New student form state
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '',
    subjects: []
  });
  
  // New subject form state
  const [newSubject, setNewSubject] = useState('');
  
  // Progress entry state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [progressEntry, setProgressEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    activity: '',
    completed: false,
    score: '',
    notes: ''
  });
  
  // Load data from local storage on component mount
  useEffect(() => {
    const savedStudents = getItem('progress-tracker-students', []);
    const savedSubjects = getItem('progress-tracker-subjects', subjects);
    
    setStudents(savedStudents);
    setSubjects(savedSubjects);
  }, []);
  
  // Save data to local storage whenever it changes
  useEffect(() => {
    setItem('progress-tracker-students', students);
  }, [students]);
  
  useEffect(() => {
    setItem('progress-tracker-subjects', subjects);
  }, [subjects]);
  
  // Handle adding a new student
  const handleAddStudent = (e) => {
    e.preventDefault();
    
    if (!newStudent.name || !newStudent.grade) {
      alert('Please enter student name and grade');
      return;
    }
    
    const student = {
      id: Date.now().toString(),
      name: newStudent.name,
      grade: newStudent.grade,
      subjects: newStudent.subjects.length > 0 ? newStudent.subjects : subjects.slice(0, 3),
      progress: {}
    };
    
    // Initialize progress tracking for each subject
    student.subjects.forEach(subject => {
      student.progress[subject] = [];
    });
    
    setStudents([...students, student]);
    
    // Track student creation
    trackEvent('student_added', {
      grade: student.grade,
      subjectCount: student.subjects.length
    });
    
    // Reset form
    setNewStudent({
      name: '',
      grade: '',
      subjects: []
    });
  };
  
  // Handle adding a new subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    
    if (!newSubject || subjects.includes(newSubject)) {
      alert('Please enter a new unique subject');
      return;
    }
    
    setSubjects([...subjects, newSubject]);
    
    // Track subject creation
    trackEvent('subject_added', {
      subject: newSubject
    });
    
    // Reset form
    setNewSubject('');
  };
  
  // Handle subject selection for a student
  const handleSubjectSelection = (studentId, subject, isChecked) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        let updatedSubjects;
        
        if (isChecked) {
          updatedSubjects = [...student.subjects, subject];
          
          // Initialize progress array for this subject if it doesn't exist
          if (!student.progress[subject]) {
            student.progress[subject] = [];
          }
        } else {
          updatedSubjects = student.subjects.filter(s => s !== subject);
        }
        
        return {
          ...student,
          subjects: updatedSubjects
        };
      }
      return student;
    }));
  };
  
  // Handle adding a progress entry
  const handleAddProgress = (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedSubject || !progressEntry.activity) {
      alert('Please select a student, subject, and enter an activity');
      return;
    }
    
    const entry = {
      id: Date.now().toString(),
      ...progressEntry
    };
    
    setStudents(students.map(student => {
      if (student.id === selectedStudent) {
        return {
          ...student,
          progress: {
            ...student.progress,
            [selectedSubject]: [
              ...(student.progress[selectedSubject] || []),
              entry
            ]
          }
        };
      }
      return student;
    }));
    
    // Track progress entry
    trackEvent('progress_entry_added', {
      subject: selectedSubject,
      completed: entry.completed,
      hasScore: !!entry.score
    });
    
    // Reset form
    setProgressEntry({
      date: new Date().toISOString().split('T')[0],
      activity: '',
      completed: false,
      score: '',
      notes: ''
    });
  };
  
  // Handle deleting a student
  const handleDeleteStudent = (studentId) => {
    setStudents(students.filter(student => student.id !== studentId));
    
    // Track student deletion
    trackEvent('student_deleted', {
      studentId
    });
    
    // Reset selected student if it was deleted
    if (selectedStudent === studentId) {
      setSelectedStudent(null);
    }
  };
  
  // Handle deleting a progress entry
  const handleDeleteProgressEntry = (studentId, subject, entryId) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          progress: {
            ...student.progress,
            [subject]: student.progress[subject].filter(entry => entry.id !== entryId)
          }
        };
      }
      return student;
    }));
    
    // Track progress entry deletion
    trackEvent('progress_entry_deleted', {
      subject
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Progress Tracking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Management */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Student Management</h2>
          
          <form onSubmit={handleAddStudent} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name *
              </label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Level *
              </label>
              <select
                value={newStudent.grade}
                onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Grade</option>
                <option value="Preschool">Preschool</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="1st Grade">1st Grade</option>
                <option value="2nd Grade">2nd Grade</option>
                <option value="3rd Grade">3rd Grade</option>
                <option value="4th Grade">4th Grade</option>
                <option value="5th Grade">5th Grade</option>
                <option value="6th Grade">6th Grade</option>
                <option value="7th Grade">7th Grade</option>
                <option value="8th Grade">8th Grade</option>
                <option value="High School">High School</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Student
            </button>
          </form>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Add Custom Subject</h3>
            <form onSubmit={handleAddSubject} className="flex">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="New subject name"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-r-md hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </form>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Students</h3>
            {students.length > 0 ? (
              <div className="space-y-3">
                {students.map(student => (
                  <div key={student.id} className="bg-gray-50 p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <div className="text-sm text-gray-600">{student.grade}</div>
                        <div className="text-sm mt-1">
                          <span className="font-medium">Subjects:</span> {student.subjects.join(', ')}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-2">
                      <button
                        onClick={() => setSelectedStudent(student.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Manage Subjects & Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No students added yet</p>
            )}
          </div>
        </div>
        
        {/* Progress Tracking */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Progress Tracking</h2>
          
          {selectedStudent ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  {students.find(s => s.id === selectedStudent)?.name} - Subject Management
                </h3>
                
                <div className="bg-gray-50 p-4 rounded border mb-4">
                  <h4 className="font-medium mb-2">Tracked Subjects</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {subjects.map(subject => (
                      <label key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={students.find(s => s.id === selectedStudent)?.subjects.includes(subject) || false}
                          onChange={(e) => handleSubjectSelection(selectedStudent, subject, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <form onSubmit={handleAddProgress} className="bg-gray-50 p-4 rounded border">
                  <h4 className="font-medium mb-3">Add Progress Entry</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Subject</option>
                        {students.find(s => s.id === selectedStudent)?.subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={progressEntry.date}
                        onChange={(e) => setProgressEntry({...progressEntry, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity/Assignment *
                    </label>
                    <input
                      type="text"
                      value={progressEntry.activity}
                      onChange={(e) => setProgressEntry({...progressEntry, activity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Score/Grade (optional)
                      </label>
                      <input
                        type="text"
                        value={progressEntry.score}
                        onChange={(e) => setProgressEntry({...progressEntry, score: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 90%, A-, 18/20"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center mt-5">
                        <input
                          type="checkbox"
                          checked={progressEntry.completed}
                          onChange={(e) => setProgressEntry({...progressEntry, completed: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Completed</span>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Progress Entry
                  </button>
                </form>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">No student selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(ProgressTracker);