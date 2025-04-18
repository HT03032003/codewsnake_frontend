import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/exercise.css';

function Exercise() {
  const [exercises, setChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const url = token
      ? `${process.env.REACT_APP_API_URL}/exercises/get_exercises/`
      : `${process.env.REACT_APP_API_URL}/exercises/public_exercises/`;

    fetch(url, {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setChallenges(data);
        } else {
          console.error('Expected an array but received:', data);
          setChallenges([]);
        }
      })
      .catch((error) => {
        console.error('❌ Lỗi fetch exercises:', error);
        setChallenges([]);
      });
  }, []);

  return (
    <div className="practice-container">
      <div className="rules-section">
        <div className='rules-title'>
          <h2>Thể lệ</h2>
        </div>
        <p className='rules-text'>Bạn phải hoàn thành bài tập trước để tích điểm mở bài tập tiếp theo</p>
        <table>
          <tbody>
            <tr>
              <td>
                <ul>
                  <li className='easy-level'>Dễ</li>
                  <li className='medium-level'>Medium</li>
                  <li className='hard-level'>Khó</li>
                </ul>
              </td>
              <td>
                <ul style={{ listStyle: 'none' }}>
                  <li className='easy-level-point'>x5 XP</li>
                  <li className='medium-level-point'>x10 XP</li>
                  <li className='hard-level-point'>x15 XP</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="exercises-section">
        {Array.isArray(exercises) && exercises.map((exercise, index) => (
          <Link key={exercise.id} to={`/exercise/${exercise.id}`}>
            <div className={`exercise-card ${!exercise.is_unlocked ? 'locked' : ''}`}>
              <div className="tag-level">
                <p className="card-difficulty">{exercise.difficulty}</p>
              </div>
              <h3 className="card-title">{exercise.title}</h3>
              <p className="card-description">{exercise.description}</p>
              <div className="card-info">
                {exercise.difficulty === 'dễ' && <p>x5 XP</p>}
                {exercise.difficulty === 'trung bình' && <p>x10 XP</p>}
                {exercise.difficulty === 'khó' && <p>x15 XP</p>}
              </div>
              {exercise.is_completed && (
                <div className="completed-tick">✅ Hoàn thành</div>
              )}
              {!exercise.is_unlocked && (
                <div className="locked-overlay">🔒 Bài bị khóa</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Exercise;
