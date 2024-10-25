function fadeInOut(element) {
    // const pointAdd = document.getElementById("point-add");
    // const pointSubtract = document.getElementById("point-subtract");

    const person = element.closest(".person");
    const pointAdd = person.querySelector(".point-add");
    const pointSubtract = person.querySelector(".point-subtract");

    // Kiểm tra hiện ẩn
    if (pointAdd.style.display === "none" || pointAdd.style.display === "") {
        pointAdd.style.display = "inline-block";
        pointSubtract.style.display = "inline-block";
        
        // Làm hiệu ứng hiện mượt hơn
        setTimeout(() => {
            pointSubtract.style.opacity = "1";
        }, 10);

        setTimeout(() => {
            pointAdd.style.opacity = "1";
        }, 120)
        
    } else {
        // Làm hiệu ứng ẩn mượt hơn
        pointAdd.style.opacity = "0";
        
        setTimeout(() => {
            pointAdd.style.display = "none";
        }, 200);
        
        setTimeout(() => {
            pointSubtract.style.opacity = "0";
        }, 150);

        setTimeout(() => {
            pointSubtract.style.display = "none";
        }, 300);
    }
}