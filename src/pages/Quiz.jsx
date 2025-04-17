import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/quiz.css";

const Quiz = () => {
    const { slug } = useParams();
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/document/quiz/${slug}/`)
            .then(res => {
                setQuestions(res.data);
            })
            .catch(err => {
                console.error("Lỗi khi lấy dữ liệu quiz:", err);
            });
    }, [slug]);

    const handleAnswerChange = (questionId, choiceId) => {
        if (!submitted) {
            setUserAnswers(prev => ({
                ...prev,
                [questionId]: choiceId
            }));
        }
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questions.forEach(q => {
            const correctChoice = q.choices.find(c => c.is_correct);
            if (userAnswers[q.id] === correctChoice?.id) {
                correctCount += 1;
            }
        });
        setScore(correctCount);
        setSubmitted(true);
    };

    const getChoiceClass = (question, choice) => {
        const userChoice = userAnswers[question.id];
        const correctChoice = question.choices.find(c => c.is_correct);

        if (!submitted) return "";

        if (choice.id === correctChoice?.id) return "correct";
        if (choice.id === userChoice && choice.id !== correctChoice?.id) return "incorrect";
        return "";
    };

    return (
            <div className="quiz-container">
                <h2 className="quiz-title">Quiz: {slug}</h2>
                {questions.map((question, index) => (
                    <div key={question.id} className="question-block">
                        <p className="question-content">{index + 1}. {question.content}</p>
                        {question.choices.map(choice => (
                            <label
                                key={choice.id}
                                className={`choice-label ${getChoiceClass(question, choice)}`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={choice.id}
                                    checked={userAnswers[question.id] === choice.id}
                                    onChange={() => handleAnswerChange(question.id, choice.id)}
                                    disabled={submitted}
                                />
                                {choice.content}
                            </label>
                        ))}
                    </div>
                ))}

                {!submitted ? (
                    <button className="submit-button" onClick={handleSubmit}>Nộp bài</button>
                ) : (
                    <div className="result">
                        <p>Bạn đúng {score}/{questions.length} câu.</p>
                    </div>
                )}
            </div>
    );
};

export default Quiz;
