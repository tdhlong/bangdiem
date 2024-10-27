// Function hiện ẩn phần cộng trừ
function fadeInOut(element) {
    const person = element.closest(".person");
    const addSection = person.querySelector(".add-section");
    const subtractSection = person.querySelector(".subtract-section");

    if (!addSection.classList.contains("show")) {
        addSection.classList.add("show");
        subtractSection.classList.add("show");
        person.style.marginBottom = "144px"; 
        document.addEventListener("click", hideOnClickOutside);
    } else {
        hideSections();
    }

    function hideSections() {
        addSection.classList.remove("show");
        subtractSection.classList.remove("show");
        person.style.marginBottom = "18px";
        document.removeEventListener("click", hideOnClickOutside);
    }

    function hideOnClickOutside(event) {
        if (!person.contains(event.target)) {
            hideSections();
        }
    }
}

// Function cập nhật điểm
function ChangeScore(element) {
    const person = element.closest(".person");
    const scoreElement = person.querySelector(".score");
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

    // Gọi hàm sắp xếp người chơi
    sortPlayers();

    // Ẩn các phần tử add-section và subtract-section sau khi cập nhật điểm
    hideSections();

    function hideSections() {
        const persons = document.querySelectorAll('.person');
        persons.forEach(person => {
            const addSection = person.querySelector(".add-section");
            const subtractSection = person.querySelector(".subtract-section");
    
            if (addSection.classList.contains("show")) {
                addSection.classList.remove("show");
            }
            if (subtractSection.classList.contains("show")) {
                subtractSection.classList.remove("show");
            }
            person.style.marginBottom = "18px";
        });
    }
}

// Xếp hạng người chơi
function sortPlayers() {
    const playerList = document.querySelector(".person-list");
    const players = Array.from(playerList.children);

    // Get current score order
    const currentOrder = players.map(player => parseInt(player.querySelector(".score").textContent));

    // Sort players by score and determine if new order is different
    const sortedPlayers = [...players].sort((a, b) => {
        const scoreA = parseInt(a.querySelector(".score").textContent);
        const scoreB = parseInt(b.querySelector(".score").textContent);
        return scoreB - scoreA;
    });

    const newOrder = sortedPlayers.map(player => parseInt(player.querySelector(".score").textContent));

    // Check if the current order is already the desired order
    const isSameOrder = currentOrder.every((score, index) => score === newOrder[index]);
    if (isSameOrder) return; // Exit if no reorder is necessary

    // If the order needs to change, apply transformations
    const positions = players.map(player => player.getBoundingClientRect());

    sortedPlayers.forEach((player, index) => {
        const newPosition = positions[index];
        const currentPosition = player.getBoundingClientRect();
        const deltaX = currentPosition.left - newPosition.left;
        const deltaY = currentPosition.top - newPosition.top;

        player.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        requestAnimationFrame(() => {
            player.style.transition = "all 0.8s ease";
            player.style.transform = "";
        });

        playerList.appendChild(player);
    });

    sortedPlayers.forEach(player => {
        player.addEventListener("transitionend", () => {
            player.style.transition = "";
        }, { once: true });
    });
}