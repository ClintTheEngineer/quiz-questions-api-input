document.addEventListener("DOMContentLoaded", ()=> {
    fetchQuestions();

    document.getElementById("questionForm").addEventListener("submit", (e)=> {
        e.preventDefault(); 
        const questionId = document.getElementById("questionId").value;
        const questionNumber = document.getElementById("questionNumber").value;
        const questionText = document.getElementById("questionText").value;
        const questionAnswer = document.getElementById("questionAnswer").value;
        const questionOptions = document.getElementById("questionOptions").value.split("\n");

        if(questionId) {
            updateQuestion(questionId, questionNumber, questionText, questionAnswer, questionOptions);
        } 

        document.getElementById("questionForm").reset();
        document.getElementById("questionId").value = "";
    });

  document.getElementById('createForm').addEventListener('submit', (e)=> {
    e.preventDefault();
    const createId = document.getElementById('createId').value;
    const createNumber = document.getElementById('createNumber').value;
    const createText = document.getElementById('createText').value;
    const createAnswer = document.getElementById('createAnswer').value;
    const createOptions = document.getElementById('createOptions').value.split('\n');
    createQuestion(createId, createNumber, createText, createAnswer, createOptions);
    document.getElementById('createForm').reset();

    
});

});

function fetchQuestions() {
    fetch("https://bewildered-shrug-fish.cyclic.app/questions/")
        .then(response => response.json())
        .then(questions => {
            const questionList = document.getElementById("questionList");
            questionList.innerHTML = ""; 

            questions.forEach(question => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <div>
                        <strong>ID:</strong> ${question.id}
                    </div>
                    <div>
                        <strong>Number:</strong> ${question.number}
                    </div>
                    <div>
                        <strong>Question:</strong> ${question.question}
                    </div>
                    <div>
                        <strong>Answer:</strong> ${question.answer}
                    </div>
                    <div>
                        <strong>Options:</strong>
                        <ul>
                            ${question.options.map(option => `<li>${option}</li>`).join("")}
                        </ul>
                    </div>
                    <div>
                        <button onclick="editQuestion(${question.id})">Edit</button>
                        <button onclick="deleteQuestion(${question.id})">Delete</button>
                    </div>
                    <hr>
                `;

                questionList.appendChild(listItem);
            });
        });
}

function createQuestion(id, number, question, answer, options) {
    const data = {
        id: id,
        number: number,
        question: question,
        answer: answer,
        options: options
    };

    fetch("https://bewildered-shrug-fish.cyclic.app/questions/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                fetchQuestions(); 
            } else {
                console.error("Failed to create question.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function updateQuestion(id, number, question, answer, options) {
    const data = {
        id: id,
        number: number,
        question: question,
        answer: answer,
        options: options
    };

    fetch(`https://bewildered-shrug-fish.cyclic.app/questions/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                fetchQuestions(); 
            } else {
                console.error("Failed to update question.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function deleteQuestion(id) {
    fetch(`https://bewildered-shrug-fish.cyclic.app/questions/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                fetchQuestions();
            } else {
                console.error("Failed to delete question.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function editQuestion(id) {
    fetch(`https://bewildered-shrug-fish.cyclic.app/questions/${id}`)
        .then(response => response.json())
        .then(question => {
            document.getElementById("questionId").value = question.id;
            document.getElementById("questionNumber").value = question.number;
            document.getElementById("questionText").value = question.question;
            document.getElementById("questionAnswer").value = question.answer;
            document.getElementById("questionOptions").value = question.options.join("\n");
        });
}