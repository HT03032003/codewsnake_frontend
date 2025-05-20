import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Progress = () => {
  const [data, setData] = useState({ done: 0, not_done: 0, percent: 0 });
  const [exerciseList, setExerciseList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${process.env.REACT_APP_API_URL}/user/exercise-progress/`, { headers })
      .then(res => setData(res.data))
      .catch(err => console.error(err));

    axios.get(`${process.env.REACT_APP_API_URL}/user/exercise-list/`, { headers })
      .then(res => setExerciseList(res.data))
      .catch(err => console.error(err));
  }, []);

  const chartData = {
    labels: ['Đã làm', 'Chưa làm'],
    datasets: [{
      data: [data.done, data.not_done],
      backgroundColor: ['#4CAF50', '#FF9800'],
      borderWidth: 1,
    }]
  };

  return (
    <div style={{ padding: 30 }}>
      <h3 style={{ textAlign: 'center', color: '#fff' }}>Tiến độ làm bài</h3>
      <div style={{ width: '300px', margin: '0 auto' }}>
        <Pie data={chartData} />
      </div>

      {/* Thanh tiến độ tổng thể */}
      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <h4 style={{ color: '#fff' }}>Tổng tiến trình: {data.percent}%</h4>
        <div style={{
          height: 20,
          width: '60%',
          margin: 'auto',
          backgroundColor: '#ccc',
          borderRadius: 10,
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${data.percent}%`,
            backgroundColor: '#4CAF50',
            transition: 'width 0.5s'
          }}></div>
        </div>
      </div>

      {/* Danh sách bài tập */}
      <div style={{ marginTop: 40 }}>
        <h4 style={{ textAlign: 'center', color: '#fff' }}>Danh sách bài tập</h4>
        <table style={{ width: '80%', margin: 'auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Tên bài</th>
              <th style={thStyle}>Độ khó</th>
              <th style={thStyle}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {exerciseList.map((ex, i) => (
              <tr key={i}>
                <td style={tdStyle}>{ex.title}</td>
                <td style={tdStyle}>{ex.difficulty}</td>
                <td style={{
                  ...tdStyle,
                  color: ex.status === "Đã làm" ? "#4CAF50" : "#FF9800",
                  fontWeight: 600
                }}>
                  {ex.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle = {
  borderBottom: '1px solid #999',
  padding: 10,
  color: '#00ffff',
  textAlign: 'center'
};

const tdStyle = {
  padding: 8,
  textAlign: 'center',
  color: '#fff',
  whiteSpace: 'normal',         // Cho phép xuống dòng
  wordBreak: 'break-word',      // Tự ngắt nếu dài quá
  maxWidth: 300   
};

export default Progress;
