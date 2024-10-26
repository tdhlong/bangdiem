// Function hiện ẩn phần cộng trừ
function fadeInOut(element) {
    const person = element.closest(".person");
    const addSection = person.querySelector(".add-section");
    const subtractSection = person.querySelector(".subtract-section");
    
    if (!addSection.classList.contains("show")) {
        addSection.classList.add("show");
        subtractSection.classList.add("show");
        // Sử dụng CSS transition cho animation mượt mà hơn
        requestAnimationFrame(() => {
            person.style.marginBottom = "144px";
        });
        
        document.addEventListener("click", hideOnClickOutside);
    } else {
        hideSections();
    }
    
    function hideSections() {
        addSection.classList.remove("show");
        subtractSection.classList.remove("show");
        requestAnimationFrame(() => {
            person.style.marginBottom = "18px";
        });
        document.removeEventListener("click", hideOnClickOutside);
    }
    
    function hideOnClickOutside(event) {
        if (!person.contains(event.target)) {
            hideSections();
        }
    }
}

// Function cập nhật điểm với animation
function ChangeScore(element) {
    const person = element.closest(".person");
    const scoreElement = person.querySelector(".score");
    const currentScore = parseInt(scoreElement.textContent);
    const changeValue = parseInt(element.textContent);
    
    // Thêm class để trigger animation
    scoreElement.classList.add("updating");
    
    // Tính toán điểm mới
    let newScore = Math.max(0, currentScore + changeValue);
    
    // Update score sau animation nhỏ
    setTimeout(() => {
        scoreElement.textContent = newScore;
        scoreElement.classList.remove("updating");
        // Gọi hàm sắp xếp sau khi cập nhật điểm
        sortPlayers();
    }, 200);
}

// Xếp hạng người chơi với animation mượt
function sortPlayers() {
    const playerList = document.querySelector(".person-list");
    const players = Array.from(playerList.children);
    
    // Lưu trữ kích thước gốc của container
    const listRect = playerList.getBoundingClientRect();
    const containerWidth = listRect.width;
    
    // Clone vị trí ban đầu của mỗi player trước khi sắp xếp
    const initialRects = players.map(player => {
        return {
            rect: player.getBoundingClientRect(),
            element: player
        };
    });

    // Sắp xếp mảng players theo điểm
    players.sort((a, b) => {
        const scoreA = parseInt(a.querySelector(".score").textContent);
        const scoreB = parseInt(b.querySelector(".score").textContent);
        return scoreB - scoreA;
    });

    // Set container style để giữ không gian
    playerList.style.height = `${playerList.offsetHeight}px`;
    playerList.style.position = 'relative';

    // Set position absolute cho tất cả players và giữ nguyên vị trí ban đầu
    initialRects.forEach(({ rect, element }) => {
        element.style.position = 'absolute';
        element.style.top = `${rect.top - listRect.top}px`;
        element.style.left = '0';
        element.style.width = `${containerWidth}px`;
        element.style.zIndex = '1';
    });

    // Force reflow
    void playerList.offsetHeight;

    // Thêm transition cho mỗi player
    players.forEach((player) => {
        player.style.transition = 'all 0.5s ease-in-out';
    });

    // Di chuyển đến vị trí mới
    requestAnimationFrame(() => {
        const playerHeight = players[0].offsetHeight;
        const marginBottom = 18; // margin giữa các player

        players.forEach((player, index) => {
            player.style.top = `${index * (playerHeight + marginBottom)}px`;
        });

        // Cleanup sau khi animation hoàn tất
        setTimeout(() => {
            playerList.style.height = '';
            playerList.style.position = '';

            players.forEach(player => {
                player.style.position = '';
                player.style.top = '';
                player.style.left = '';
                player.style.width = '';
                player.style.transition = '';
                player.style.zIndex = '';
                playerList.appendChild(player);
            });
        }, 500); // Thời gian phải khớp với transition
    });
}

const style = document.createElement('style');
style.textContent = `
.person-list {
    position: relative;
    color: #fff;
    min-height: 100px; 
}

.person {
    display: flex;
    align-items: center;
    border-radius: 8px;
    margin-bottom: 18px;
    background-color: #2d3e50;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transform-origin: center center;
    will-change: transform;
}

.person[style*="position: absolute"] {
    margin-bottom: 0;
}

@keyframes scoreUpdate {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.score.updating {
    animation: scoreUpdate 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
`;
document.head.appendChild(style);