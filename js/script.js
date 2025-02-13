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
    const placeholderLine = "Nhập tên người chơi";
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
            const avatar = existingPlayer ? existingPlayer.avatar : defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
            
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
    const playerElements = Array.from(document.querySelectorAll('.person'));
    
    // Sắp xếp các phần tử theo điểm (giảm dần)
    playerElements.sort((a, b) => {
        const scoreA = parseInt(a.querySelector('.score').textContent);
        const scoreB = parseInt(b.querySelector('.score').textContent);
        return scoreB - scoreA;
    });
    
    // Cập nhật thông tin cho top 3 người chơi
    updateLeaderboardForPlace(playerElements[0], 'first');
    updateLeaderboardForPlace(playerElements[1], 'second');
    updateLeaderboardForPlace(playerElements[2], 'third');
}

function updateLeaderboardForPlace(playerEl, place) {
    if (!playerEl) return;
    const avatarEl = playerEl.querySelector('.avatar');
    const playerName = playerEl.querySelector('.nickname').textContent.trim();

    // Xác định container hiển thị cho vị trí (ví dụ: "first")
    const imgContainer = document.getElementById(place + '-place-image');
    const emojiContainer = document.getElementById(place + '-place-emoji');

    // Kiểm tra loại avatar: nếu avatarEl là <img> thì hiển thị ảnh, nếu là <span> thì hiển thị emoji
    if (avatarEl.tagName.toLowerCase() === 'img') {
        imgContainer.src = avatarEl.src;
        imgContainer.style.display = "block";
        emojiContainer.style.display = "none";
        emojiContainer.textContent = "";
    } else {
        // Nếu là emoji, hiển thị container <span>
        emojiContainer.textContent = avatarEl.textContent;
        emojiContainer.style.display = "flex";
        emojiContainer.style.backgroundColor = "#fff8dc";
        imgContainer.style.display = "none";
        imgContainer.src = "";
    }

    // Cập nhật tên người chiến thắng
    if (place === 'first') {
        document.querySelector('.first-place .winner-name-first').textContent = playerName;
    } else if (place === 'second') {
        document.querySelector('.second-place .winner-name').textContent = playerName;
    } else if (place === 'third') {
        document.querySelector('.third-place .winner-name').textContent = playerName;
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

// Biến lưu tên người chơi hiện tại cần cập nhật avatar (để dùng khi mở modal)
let currentPlayerNicknameForAvatar = null;

// Hàm mở modal chọn avatar
function openAvatarModal(playerNickname) {
    currentPlayerNicknameForAvatar = playerNickname;
    const modal = document.getElementById('avatarModal');
    modal.style.display = "flex";
    // Ẩn các phần upload và default trước
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('defaultAvatarSection').style.display = "none";
}

// Đóng modal
document.getElementById('closeAvatarModal').addEventListener('click', () => {
    document.getElementById('avatarModal').style.display = "none";
});

// Khi click vào nút "Tải ảnh lên"
document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
    document.getElementById('uploadSection').style.display = "block";
    document.getElementById('defaultAvatarSection').style.display = "none";
    // Kích hoạt file input ngay lập tức (có thể sau một khoảng thời gian ngắn)
    document.getElementById('avatarFileInput').click();
});

// Khi file input thay đổi
document.getElementById('avatarFileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageURL = URL.createObjectURL(file);
        updatePlayerAvatar(currentPlayerNicknameForAvatar, imageURL);
        closeAvatarModal();
    }
});

// Khi click vào nút "Chọn avatar mặc định"
document.getElementById('selectDefaultAvatarBtn').addEventListener('click', () => {
    document.getElementById('defaultAvatarSection').style.display = "block";
    document.getElementById('uploadSection').style.display = "none";
    populateDefaultAvatars();
});

// Hàm hiển thị danh sách emoji mặc định trong modal
function populateDefaultAvatars() {
    const container = document.getElementById('defaultAvatarsContainer');
    container.innerHTML = ""; // Xóa nội dung cũ nếu có
    defaultAvatars.forEach(avatar => {
        const span = document.createElement('span');
        span.classList.add('default-avatar-item');
        span.textContent = avatar;
        
        // Kiểm tra xem emoji đã được chọn cho người chơi nào chưa
        const isUsed = players.some(p => p.avatar === avatar);
        if (isUsed) {
            // Nếu đã được chọn, thêm class 'used'
            span.classList.add('used');
        } else {
            // Nếu chưa được chọn, thêm sự kiện click để chọn emoji
            span.addEventListener('click', () => {
                updatePlayerAvatar(currentPlayerNicknameForAvatar, avatar);
                closeAvatarModal();
            });
        }
        container.appendChild(span);
    });
}

// Hàm cập nhật avatar cho người chơi (cập nhật vào mảng players và DOM)
function updatePlayerAvatar(playerNickname, newAvatar) {
    // Cập nhật dữ liệu trong mảng players
    const player = players.find(p => p.nickname === playerNickname);
    if (player) {
        player.avatar = newAvatar;
    }
    
    // Tìm tất cả các phần tử người chơi trong DOM
    const personElements = document.querySelectorAll(".person");
    personElements.forEach(person => {
        const nameEl = person.querySelector(".nickname");
        if (nameEl && nameEl.textContent.trim() === playerNickname) {
            const avatarEl = person.querySelector(".avatar");
            if (avatarEl) {
                // Cập nhật điều kiện nhận dạng blob URL
                const isImage = newAvatar.startsWith('http') || newAvatar.startsWith('./') || newAvatar.startsWith('blob:');
                
                if (isImage) {
                    // Nếu newAvatar là ảnh và phần tử hiện tại không phải <img>
                    if (avatarEl.tagName.toLowerCase() !== 'img') {
                        const newImg = document.createElement('img');
                        newImg.classList.add('avatar');
                        newImg.src = newAvatar;
                        newImg.alt = playerNickname;
                        // Gán lại sự kiện click để mở modal
                        newImg.addEventListener('click', () => {
                            openAvatarModal(playerNickname);
                        });
                        avatarEl.parentNode.replaceChild(newImg, avatarEl);
                    } else {
                        avatarEl.src = newAvatar;
                        avatarEl.alt = playerNickname;
                    }
                } else {
                    // newAvatar là emoji
                    if (avatarEl.tagName.toLowerCase() !== 'span') {
                        // Tạo thẻ <span> mới
                        const newSpan = document.createElement('span');
                        newSpan.classList.add('avatar');
                        newSpan.textContent = newAvatar;
                        newSpan.style.fontSize = "40px";
                        newSpan.style.display = "inline-block";
                        newSpan.style.width = "100px";
                        newSpan.style.height = "63px";
                        newSpan.style.backgroundColor = "#fff8dc";
                        newSpan.style.textAlign = "center";
                        newSpan.style.lineHeight = "60px";
                        // Gán lại sự kiện click cho newSpan
                        newSpan.addEventListener('click', () => {
                            openAvatarModal(playerNickname);
                        });
                        avatarEl.parentNode.replaceChild(newSpan, avatarEl);
                    } else {
                        avatarEl.textContent = newAvatar;
                    }
                }
            }
        }
    });
}



// Hàm đóng modal
function closeAvatarModal() {
    document.getElementById('avatarModal').style.display = "none";
    // Reset file input để có thể tải lại file giống nhau nếu cần
    document.getElementById('avatarFileInput').value = "";
}
  
// Mảng các giá trị cộng/trừ điểm
const pointValues = {
    add: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    subtract: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
};
  
// Tạo người chơi dựa trên mảng có sẵn ở trên
function createPlayerItem(player) {
    const li = document.createElement('li');
    li.classList.add('person');

    // Tạo phần tử hiển thị avatar: nếu là URL thì dùng <img>, nếu không thì dùng <span>
    let avatarEl;
    if (player.avatar.startsWith('http') || player.avatar.startsWith('./') || player.avatar.startsWith('blob:')) {
        // Nếu avatar là URL
        avatarEl = document.createElement('img');
        avatarEl.classList.add('avatar');
        avatarEl.src = player.avatar;
        avatarEl.alt = player.nickname;
    } else {
        // Nếu avatar là emoji, tạo thẻ <span>
        avatarEl = document.createElement('span');
        avatarEl.classList.add('avatar');
        avatarEl.textContent = player.avatar;
        // Định dạng cơ bản cho emoji (bạn có thể điều chỉnh CSS hoặc style trực tiếp)
        avatarEl.style.fontSize = "40px";
        avatarEl.style.display = "inline-block";
        avatarEl.style.width = "100px";
        avatarEl.style.height = "63px";
        avatarEl.style.backgroundColor = "#fff8dc";
        avatarEl.style.textAlign = "center";
        avatarEl.style.lineHeight = "60px";
    }

    // Khi click vào avatar thì mở modal thay đổi avatar (dùng chung cho cả <img> và <span>)
    avatarEl.addEventListener('click', () => {
        openAvatarModal(player.nickname);
    });

    li.appendChild(avatarEl);

    // Tạo phần hiển thị tên người chơi
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

    // Tạo danh sách nút cộng/trừ điểm (giữ nguyên cách tạo của bạn)
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
