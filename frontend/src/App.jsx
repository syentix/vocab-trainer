import React from 'react';
import './App.scss';

import Navbar from './components/Navbar';
import Lesson from './components/Lesson';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Lesson lessonName="Lesson 1" />
    </div>
  );
}

export default App;
