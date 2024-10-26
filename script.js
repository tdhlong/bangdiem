// Function hiện ẩn phần cộng trừ
function fadeInOut(element) {

    const person = element.closest(".person");

    const pointAdd = person.querySelector(".point-add");
    const addSection = person.querySelector(".add-section");

    const pointSubtract = person.querySelector(".point-subtract");
    const subtractSection = person.querySelector(".subtract-section");

    // Kiểm tra hiện ẩn phần cộng, trừ
    if (pointAdd.style.display === "none" || pointAdd.style.display === "") {
        pointAdd.style.display = "inline-block";
        pointSubtract.style.display = "inline-block";
        
        // Làm hiệu ứng hiện mượt hơn
        setTimeout(() => {
            pointAdd.style.opacity = "1";
        }, 10);
        
        setTimeout(() => {
            pointSubtract.style.opacity = "1";
        }, 120)
        
    } else {

        // Làm hiệu ứng ẩn mượt hơn
        pointSubtract.style.opacity = "0";
        pointAdd.style.opacity = "0";
        
        setTimeout(() => {
            pointAdd.style.display = "none";
        }, 10);
        
        setTimeout(() => {
            pointSubtract.style.display = "none";
        }, 120);
    }

    // Kiểm tra phần cộng điểm xem có đang hiện không, nếu hiện thì tắt
    if (addSection.style.display === "flex" || subtractSection.style.display === "flex") {
        addSection.style.display = "none";
        subtractSection.style.display = "none";
    }

}

// Function hiện ẩn phần cộng điểm
function FadeInAdd(element) {

    // Kiểm tra hiện ẩn phần cộng điểm
    const person = element.closest(".person");
    const addSection = person.querySelector(".add-section");
    const subtractSection = person.querySelector(".subtract-section");

    if (addSection.style.display === "none" || addSection.style.display === "") {
        addSection.style.display = "flex";
    } else {
        addSection.style.display = "none";
    }

    // Kiểm tra phần trừ điểm có hiện không, nếu có thì ẩn
    if (subtractSection.style.display === "flex") {
        subtractSection.style.display = "none";
    }
}

// Function hiện ẩn phần trừ điểm
function FadeInSubtract(element) {

    // Kiểm tra hiện ẩn phần trừ điểm
    const person = element.closest(".person");
    const addSection = person.querySelector(".add-section");
    const subtractSection = person.querySelector(".subtract-section");

    if (subtractSection.style.display === "none" || subtractSection.style.display === "") {
        subtractSection.style.display = "flex";
    } else {
        subtractSection.style.display = "none";
    }

    // Kiểm tra phần cộng điểm có hiện không, nếu có thì ẩn
    if (addSection.style.display === "flex") {
        addSection.style.display = "none";
    }
}

// Function cập nhật điểm
function ChangeScore(element) {
    const scoreElement = document.querySelector(".score");
    let currentScore = parseInt(scoreElement.textContent);

    const changeValue = parseInt(element.textContent);

    // Cập nhật điểm mới
    currentScore += changeValue;

    if (currentScore <= 0) {
        scoreElement.textContent = 0;
    } else {
        // Cập nhật điểm mới cho phần tử .score
        scoreElement.textContent = currentScore;
    }

}