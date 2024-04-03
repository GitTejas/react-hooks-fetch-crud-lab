import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
// import QuestionItem from "./QuestionItem";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then(resp => resp.json())
      .then(setQuestions);
  }, []);

  function addQuestion(newQuestion) {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
    .then(resp => resp.json())
    .then(json => setQuestions([...questions, json])); // Update state with new question
  }

  function onDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE"
    }).then(() => setQuestions(questions.filter(question => question.id !== id)));
  }

  function updateAnswer(questionId, correctIndex) {
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correctIndex })
    }).then(() =>
      setQuestions(
        questions.map(question =>
          question.id === questionId ? { ...question, correctIndex } : question
        )
      )
    );
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm addQuestion={addQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDelete={onDelete}
          onUpdateAnswer={updateAnswer}
        />
      )}
    </main>
  );
}

export default App;