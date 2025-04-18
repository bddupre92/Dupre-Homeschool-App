"use client";
import React, { useState, useEffect } from 'react';

export default function TestPage() {
  const [status, setStatus] = useState<string>("Loading...");
  const [count, setCount] = useState<number>(0);
  const [navigationTest, setNavigationTest] = useState<string>("Not tested");
  
  useEffect(() => {
    // Test that component mounted successfully
    setStatus("Component mounted successfully");
    
    // Check if window and document are available (client-side rendering)
    const windowAvailable = typeof window !== 'undefined';
    const documentAvailable = typeof document !== 'undefined';
    if (windowAvailable && documentAvailable) {
      console.log("Browser APIs available");
    }
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#333' }}>Diagnostic Test Page</h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
        <h2>Status</h2>
        <p><strong>Page Status:</strong> {status}</p>
        <button 
          onClick={() => setStatus("Status updated: " + new Date().toLocaleTimeString())}
          style={{
            background: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Update Status
        </button>
      </div>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
        <h2>Interactivity Test</h2>
        <p>Counter: {count}</p>
        <button 
          onClick={() => setCount(prev => prev + 1)}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Increment
        </button>
        <button 
          onClick={() => setCount(0)}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
        <h2>Navigation Test</h2>
        <p>Status: {navigationTest}</p>
        <button 
          onClick={() => {
            setNavigationTest("Attempting navigation...");
            try {
              window.location.href = "/";
            } catch (error) {
              setNavigationTest(`Error: ${error}`);
            }
          }}
          style={{
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Navigate Home
        </button>
      </div>
    </div>
  );
} 