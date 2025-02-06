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

// Đóng cửa sổ Edit người chơi
function CloseEdit() {
    const editPopup = document.querySelector(".edit-popup");
    editPopup.style.display = "none";
}

document.querySelector(".edit-popup").addEventListener("click", function(event) {
    // Kiểm tra nếu click ngoài box
    const box = document.querySelector(".box");
    if (!box.contains(event.target)) {
        this.style.display = "none";  // Ẩn box
    }
});

// Cập nhật tên và điểm của người chơi từ textarea khi nhấn OK
function UpdateNamesAndScores() {
    const editArea = document.querySelector(".edit-area");
    // Tách từng dòng và loại bỏ dòng trống
    const newEntries = editArea.value.split("\n").filter(line => line.trim() !== "");
    const playerListElement = document.querySelector(".person-list");

    // Xóa sạch danh sách hiện tại
    playerListElement.innerHTML = "";

    newEntries.forEach(entry => {
        let formattedEntry = entry.trim();
        // Nếu không có dấu ":" trong chuỗi, thêm vào ": 0"
        if (!formattedEntry.includes(":")) {
            formattedEntry = formattedEntry + ": 0";
        }
        const parts = formattedEntry.split(":");
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const scoreStr = parts.slice(1).join(":").trim();
            const score = parseInt(scoreStr) || 0;
            
            // Kiểm tra xem trong mảng players có người chơi với tên này chưa
            const existingPlayer = players.find(p => p.nickname === name);
            const avatar = existingPlayer ? existingPlayer.avatar : './img/no-image.jpeg';
            
            // Nếu người chơi chưa tồn tại, tạo mới và thêm vào mảng players
            if (!existingPlayer) {
                players.push({
                    avatar: avatar,
                    nickname: name,
                    score: score
                });
            } else {
                // Nếu đã tồn tại, cập nhật điểm (và avatar nếu cần, nhưng avatar đã được giữ lại)
                existingPlayer.score = score;
            }
            
            // Tạo đối tượng người chơi mới dựa trên dữ liệu trong mảng players (dùng dữ liệu mới nhất)
            const playerData = players.find(p => p.nickname === name);
            const playerItem = createPlayerItem(playerData);
            playerListElement.appendChild(playerItem);
        }
    });

    CloseEdit(); // Đóng cửa sổ edit
    sortPlayers(); // Sắp xếp lại nếu cần
}

// Endgame
function EndGame() {
    const endPopup = document.querySelector(".end-popup");
    const celebrateSound = document.getElementById("celebrate-sound");
    const jsConfetti = new JSConfetti();

    endPopup.style.display = "flex";
    jsConfetti.addConfetti();

    // Sau 2 giây, kích hoạt pháo giấy lần thứ hai
    setTimeout(() => {
        jsConfetti.addConfetti();
    }, 2000);
    
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

// Cập nhật Avatar người chơi
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

// Danh sách các người chơi
const players = [
    {
      avatar: './img/teams-logo/conghoa.ico',
      nickname: 'Cơ sở Cộng Hòa',
      score: 0
    },
    {
      avatar: './img/teams-logo/caothang.ico',
      nickname: 'Cơ sở Cao Thắng',
      score: 0
    },
    {
      avatar: './img/teams-logo/vanthanh.ico',
      nickname: 'Cơ sở Văn Thánh, Trần Nhật Duật',
      score: 0
    },
    {
      avatar: './img/teams-logo/nguyen-van-huong.ico',
      nickname: 'Cơ sở Nguyễn Văn Hưởng',
      score: 0
    }
];

const defaultAvatars = [
    '🐒', '🐕', '🐩', '🐈', '🐅', '🐎', '🦌', '🐃', '🐐', 
    '🦒', '🐪', '🐘', '🐇', '🐿️', '🦘', 
    '🐦', '🐧', '🕊️', '🦅', '🦢', '🦩', '🦚', '🦜', '🐦‍🔥',
    '🐊', '🐢', '🦎', '🐍', '🐉', '🦕', '🦖', '🐳', '🐬',
    '🐟', '🐠', '🐙', '🦀', '🦞', '🦐', '🦑',
];
  
// Mảng các giá trị cộng/trừ điểm
const pointValues = {
    add: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    subtract: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
};
  
// Tạo người chơi dựa trên mảng có sẵn ở trên
function createPlayerItem(player) {
    // Tạo phần tử li cho mỗi người chơi
    const li = document.createElement('li');
    li.classList.add('person');

    // Tạo thẻ ảnh đại diện
    const avatarImg = document.createElement('img');
    avatarImg.classList.add('avatar');
    avatarImg.src = player.avatar;
    avatarImg.alt = player.nickname;

    // Tạo input file ẩn để người dùng chọn ảnh mới
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    // Khi nhấp vào ảnh, kích hoạt input file
    avatarImg.addEventListener('click', () => {
        fileInput.click();
    });

    // Khi người dùng chọn ảnh, cập nhật avatar và dữ liệu trong mảng players
    fileInput.addEventListener('change', (event) => {
        handleAvatarUpload(event, avatarImg, player.nickname);
    });

    // Thêm avatar và file input vào li
    li.appendChild(avatarImg);

    // Thêm fileInput
    li.appendChild(fileInput);

    // Tạo phần tên người chơi
    const nicknameSpan = document.createElement('span');
    nicknameSpan.classList.add('nickname');
    nicknameSpan.textContent = player.nickname;
    li.appendChild(nicknameSpan);

    // Tạo nút hiển thị điểm
    const scoreBtn = document.createElement('button');
    scoreBtn.classList.add('score');
    scoreBtn.textContent = player.score;
    scoreBtn.setAttribute('onclick', 'fadeInOut(this)');
    li.appendChild(scoreBtn);

    // Tạo phần danh sách nút cộng/trừ điểm
    const pointBtn = document.createElement('ul');
    pointBtn.classList.add('point-btn');

    const addSection = document.createElement('div');
    addSection.classList.add('add-section');
    pointValues.add.forEach(value => {
        const btn = document.createElement('button');
        btn.classList.add('add-value');
        btn.textContent = `+${value}`;
        btn.setAttribute('onclick', 'ChangeScore(this)');
        addSection.appendChild(btn);
    });

    const subtractSection = document.createElement('div');
    subtractSection.classList.add('subtract-section');
    pointValues.subtract.forEach(value => {
        const btn = document.createElement('button');
        btn.classList.add('subtract-value');
        btn.textContent = `-${value}`;
        btn.setAttribute('onclick', 'ChangeScore(this)');
        subtractSection.appendChild(btn);
    });

    pointBtn.appendChild(addSection);
    pointBtn.appendChild(subtractSection);
    li.appendChild(pointBtn);

    return li;
}
    
document.addEventListener('DOMContentLoaded', function() {
    // Code tạo danh sách
    const personList = document.getElementById('personList');
    players.forEach(player => {
            const playerItem = createPlayerItem(player);
            personList.appendChild(playerItem);
    });
});

function handleAvatarUpload(event, avatarImgElement, playerNickname) {
    const file = event.target.files[0];
    if (file) {
        const imageURL = URL.createObjectURL(file);
        // Cập nhật src của ảnh đại diện trên DOM
        avatarImgElement.src = imageURL;
        
        // Cập nhật avatar trong mảng players
        const player = players.find(p => p.nickname === playerNickname);
        if (player) {
            player.avatar = imageURL;
        }
    }
}
