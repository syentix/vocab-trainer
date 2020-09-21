import React from 'react';
import './Lesson.scss';

class Lesson extends React.Component {
  render() {
    return (
      <div className="card shadow-card">
        <h3>{this.props.lessonName}</h3>
      </div>
    );
  }
}

export default Lesson;
