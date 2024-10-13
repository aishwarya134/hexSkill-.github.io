const main = document.querySelector(".main"); // Selecting the main container
const newQuest = document.querySelector(".new"); // Selecting the new question button
const clearBtn = document.querySelector(".clear"); // Selecting the clear button
const resultContainer = document.querySelector(".result-container"); // Selecting the result container
const amount = 5; // Number of Java questions
let currentQuestionIndex = 0; // Track the current question being displayed
let questionWrappers = []; // Store all question wrappers
let submitted = false; // Track if the quiz has been submitted

// Hardcoded Java questions
const javaQuestions = [
    {
        question: "What is the size of `int` in Java?",
        correct_answer: "4 bytes",
        incorrect_answers: ["8 bytes", "2 bytes", "Depends on the OS"]
    },
    {
        question: "Which of the following is not a keyword in Java?",
        correct_answer: "include",
        incorrect_answers: ["volatile", "transient", "extends"]
    },
    {
        question: "Which method is used to find the length of a string in Java?",
        correct_answer: "length()",
        incorrect_answers: ["size()", "getLength()", "getSize()"]
    },
    {
        question: "What is the default value of a boolean variable in Java?",
        correct_answer: "false",
        incorrect_answers: ["true", "0", "null"]
    },
    {
        question: "Which of these data types are objects in Java?",
        correct_answer: "String",
        incorrect_answers: ["int", "boolean", "char"]
    }
];

// Function for fetching data (simulated by using the local Java questions)
const getData = async () => {
    main.setAttribute("interact", "true");
    newQuest.setAttribute("highlight", "false");
    clearBtn.setAttribute("highlight", "false");
    resultContainer.setAttribute("show", "false");

    document.querySelector(".main").innerHTML = "";
    document.querySelector(".loader-wrapper").setAttribute("show", "true");

    try {
        const result = javaQuestions; // Use hardcoded Java questions
        create(result); // Create the quiz questions
    } catch (err) {
        console.error("Error loading questions", err);
    } finally {
        document.querySelector(".loader-wrapper").setAttribute("show", "false");
    }
};

// Function for adding questions to the DOM
const create = (result) => {
    questionWrappers = result.map((res, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.display = index === 0 ? "block" : "none"; // Show only the first question initially

        const question = document.createElement("div");
        wrapper.append(question);
        question.innerHTML = `${index + 1}. ${res.question}`;

        const optWrapper = document.createElement("div");
        wrapper.append(optWrapper);
        optWrapper.className = "opt-wrapper";

        const options = [...res.incorrect_answers];
        options.splice(Math.floor(Math.random() * 4), 0, res.correct_answer); // Insert correct answer randomly

        options.forEach((opt) => {
            const optionContainer = document.createElement("div");
            optWrapper.append(optionContainer);
            optionContainer.className = "opt-container";
            optionContainer.innerHTML = opt;
            optionContainer.setAttribute("selected", "false");
            optionContainer.addEventListener("click", (e) => {
                if (!submitted) {
                    e.target.setAttribute("ans", "false");
                    const status = optionContainer.getAttribute("selected");
                    optionContainer.setAttribute("selected", status == "false");

                    const all = optionContainer.parentElement.children;
                    for (const el of all) {
                        if (el !== e.target) {
                            el.setAttribute("selected", "false");
                        }
                    }
                }
            });
        });

        main.append(wrapper);
        return wrapper;
    });

    // Create "Previous" and "Next" buttons
    createNavigationButtons();
};

// Function to create navigation buttons for questions
const createNavigationButtons = () => {
    const navWrapper = document.createElement("div");
    navWrapper.className = "nav-wrapper";

    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.className = "prev-btn";
    prevButton.addEventListener("click", () => changeQuestion(-1)); // Move to previous question

    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.className = "next-btn";
    nextButton.addEventListener("click", () => changeQuestion(1)); // Move to next question

    navWrapper.append(prevButton, nextButton);
    main.append(navWrapper);
};

// Function to change the displayed question
const changeQuestion = (direction) => {
    questionWrappers[currentQuestionIndex].style.display = "none"; // Hide current question
    currentQuestionIndex += direction; // Update index

    // Keep the index within bounds
    if (currentQuestionIndex < 0) currentQuestionIndex = 0;
    if (currentQuestionIndex >= questionWrappers.length) currentQuestionIndex = questionWrappers.length - 1;

    questionWrappers[currentQuestionIndex].style.display = "block"; // Show the new question
};

// Submit button functionality
document.querySelector(".submit").addEventListener("click", () => {
    const optionWrapper = document.querySelectorAll(".opt-wrapper");
    let score = 0; // Initialize score
    submitted = true; // Mark quiz as submitted

    optionWrapper.forEach((wrapper, index) => {
        const opt = wrapper.childNodes;
        opt.forEach((o) => {
            if (o.getAttribute("selected") == "true") {
                // Check if the selected answer is correct
                if (o.innerHTML == javaQuestions[index].correct_answer) {
                    score++; // Increment score if correct
                } else {
                    o.setAttribute("ans", "no"); // Show the selected option is wrong
                }
            }
            if (o.innerHTML == javaQuestions[index].correct_answer) {
                o.setAttribute("ans", "yes"); // Show the correct answer
            }
        });
    });

    // Display the final score
    document.querySelector(".final").innerText = `${score}/${amount}`;
    document.querySelector(".result-container").setAttribute("show", "true");
    main.setAttribute("interact", "false");
    newQuest.setAttribute("highlight", "true");
    clearBtn.setAttribute("highlight", "true");

    // Prepare to display answers
    displayAnswers();
});



// Function to display all answers one by one after submission
const displayAnswers = () => {
    currentQuestionIndex = 0; // Reset to the first answer
    questionWrappers.forEach((wrapper) => {
        wrapper.style.display = "none"; // Hide all answers initially
    });
    questionWrappers[currentQuestionIndex].style.display = "block"; // Show the first answer

    // Remove any previous view answers button
    const existingButton = document.querySelector(".view-answers-btn");
    if (existingButton) {
        existingButton.remove();
    }

    // Create navigation buttons for viewing answers
    const navWrapper = document.createElement("div");
    navWrapper.className = "nav-wrapper";

    const prevAnswerButton = document.createElement("button");
    prevAnswerButton.innerText = "Previous";
    prevAnswerButton.className = "prev-btn";
    prevAnswerButton.addEventListener("click", prevAnswer); // Move to previous answer

    const nextAnswerButton = document.createElement("button");
    nextAnswerButton.innerText = "Next";
    nextAnswerButton.className = "next-btn";
    nextAnswerButton.addEventListener("click", nextAnswer); // Move to next answer

    navWrapper.append(prevAnswerButton, nextAnswerButton);
    resultContainer.append(navWrapper);
};

// Clear button functionality
document.querySelector(".clear").addEventListener("click", () => {
    main.setAttribute("interact", "true");
    newQuest.setAttribute("highlight", "false");
    clearBtn.setAttribute("highlight", "false");
    submitted = false; // Reset the submission status

    const selectedOptions = document.querySelectorAll(".opt-container");
    selectedOptions.forEach((opt) => {
        opt.setAttribute("selected", false);
        opt.setAttribute("ans", "null");
    });

    // Reset score display
    document.querySelector(".final").innerText = `?/${amount}`;
});

// Close result container functionality
document.querySelector(".close-btn").addEventListener("click", () => {
    resultContainer.setAttribute("show", "false");
});

// Fetching data on page load
getData();
