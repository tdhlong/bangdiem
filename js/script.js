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

    if (changeValue > 0) {
        document.getElementById("clap-sound").play();
    } else {
        document.getElementById("lose-sound").play();
    }

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

// Mở cửa sổ Edit người chơi
function DisplayEdit() {
    const editPopup = document.querySelector(".edit-popup");
    const editArea = document.querySelector(".edit-area");
    editPopup.style.display = "flex";

    // Lấy danh sách tên và điểm của người chơi, hiển thị trong textarea
    const players = document.querySelectorAll(".person"); // Lấy tất cả các phần tử người chơi
    const namesAndScores = Array.from(players).map(player => {
        const name = player.querySelector(".nickname").textContent.trim(); // Lấy tên
        const score = player.querySelector(".score").textContent.trim(); // Lấy điểm
        return `${name}: ${score}`; // Ghép tên và điểm cách nhau bởi khoảng trắng
    }).join("\n"); // Ghép tất cả các dòng lại với dấu ngắt dòng

    editArea.value = namesAndScores;
}

document.querySelector(".edit-popup").addEventListener("click", function(event) {
    // Kiểm tra nếu click ngoài box
    const box = document.querySelector(".box");
    if (!box.contains(event.target)) {
        this.style.display = "none";  // Ẩn box
    }
});

// Đóng cửa sổ Edit người chơi
function CloseEdit() {
    const editPopup = document.querySelector(".edit-popup");
    editPopup.style.display = "none";

}

// Cập nhật tên và điểm của người chơi từ textarea khi nhấn OK
function UpdateNamesAndScores() {
    const editArea = document.querySelector(".edit-area");
    const newEntries = editArea.value.split("\n"); // Tách từng dòng
    
    // Lấy danh sách các phần tử người chơi
    const players = document.querySelectorAll(".person");
    players.forEach((player, index) => {
        if (newEntries[index]) { // Chỉ cập nhật nếu có dòng dữ liệu mới trong textarea
            // Tách tên và điểm, loại bỏ các khoảng trắng dư thừa
            const [name, score] = newEntries[index].replace(":", "").trim().split(/\s+(?=\d+$)/);
            
            // Cập nhật tên nếu có tên hợp lệ
            const nicknameElement = player.querySelector(".nickname");
            if (nicknameElement && name) {
                nicknameElement.textContent = name;
            }
            
            // Cập nhật điểm nếu có điểm hợp lệ
            const scoreElement = player.querySelector(".score");
            if (scoreElement && !isNaN(score)) {
                scoreElement.textContent = score;
            }
        }
    });

    CloseEdit(); // Đóng popup sau khi cập nhật

    sortPlayers();
}

// Endgame
function EndGame() {
    const endPopup = document.querySelector(".end-popup");
    const celebrateSound = document.getElementById("celebrate-sound");

    endPopup.style.display = "flex";
    endPopup.style.backgroundImage = "url('./img/celebrate.gif')";
    
    // Phát âm thanh
    celebrateSound.play();

    // Dừng âm thanh sau 4 giây
    setTimeout(() => {
        celebrateSound.pause(); // Dừng âm thanh
        celebrateSound.currentTime = 0; // Đặt lại thời gian phát về 0
    }, 4000);

    setTimeout(() => {
        endPopup.style.backgroundImage = "none";
    }, 7500);

    updateLeaderboardImages();
}

document.querySelector(".end-popup").addEventListener("click", function(event) {
    // Kiểm tra nếu click ngoài leaderboard
    const leaderboard = document.querySelector(".leaderboard");
    if (!leaderboard.contains(event.target)) {
        this.style.display = "none"; // Ẩn end-popup
    }
});

function updateLeaderboardImages() {
    // Lấy tất cả các phần tử "person" từ danh sách người chơi
    const players = Array.from(document.querySelectorAll('.person'));
    
    // Sắp xếp danh sách dựa trên điểm của từng đội
    players.sort((a, b) => {
        const scoreA = parseInt(a.querySelector('.score').textContent);
        const scoreB = parseInt(b.querySelector('.score').textContent);
        return scoreB - scoreA;
    });

    // Cập nhật hình ảnh cho vị trí thứ nhất, thứ hai và thứ ba
    if (players[0]) {
        const firstImageSrc = players[0].querySelector('.avatar').src;
        const firstName = players[0].querySelector('.nickname').textContent;
        document.getElementById('first-place-image').src = firstImageSrc;
        document.querySelector('.first-place .winner-name-first').textContent = firstName;
    }
    if (players[1]) {
        const secondImageSrc = players[1].querySelector('.avatar').src;
        const secondName = players[1].querySelector('.nickname').textContent;
        document.getElementById('second-place-image').src = secondImageSrc;
        document.querySelector('.second-place .winner-name').textContent = secondName;
    }
    if (players[2]) {
        const thirdImageSrc = players[2].querySelector('.avatar').src;
        const thirdName = players[2].querySelector('.nickname').textContent;
        document.getElementById('third-place-image').src = thirdImageSrc;
        document.querySelector('.third-place .winner-name').textContent = thirdName;
    }
}
