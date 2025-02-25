// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';
import Bisection from './Root/Bisection';
import FalsePosition from './Root/FalsePosition';
import NewtonRaphson from './Root/NewtonRaphson';
import OnePointIteration from './Root/OnePointIteration';
import Navbar from './Navbar';
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";



function App() {
  
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
);

useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", darkMode);
}, [darkMode]);


  return (
    <div className="App">
     <Navbar/>
     
     <Routes>
        <Route path="/home" element={<App/>}/>
        <Route path="/Bisection" element={<Bisection/>}/>
        <Route path="/FalsePosition" element={<FalsePosition/>}/>
        <Route path="/NewtonRaphson" element={<NewtonRaphson/>}/>
        <Route path="/OnePointIteration" element={<OnePointIteration/>}/>
      </Routes>
     
      <div>
          <Button variant="secondary" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </Button>
      </div>
    </div>
  );
}

export default App;

