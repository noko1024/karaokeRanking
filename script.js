// ランキングデータをローカルストレージに保存・取得する関数
function saveRankingsToLocalStorage() {
    localStorage.setItem('rankings', JSON.stringify(rankings));
}

function loadRankingsFromLocalStorage() {
    const savedRankings = localStorage.getItem('rankings');
    if (savedRankings) {
        rankings = JSON.parse(savedRankings);
    } else {
        rankings = [
            { name: "Taro", score: 95 },
            { name: "Hanako", score: 90 },
            { name: "Jiro", score: 85 }
        ];
    }
}

// 初期ランキングデータ
let rankings = [];

// ランキングをレンダリングする関数（表示画面用）
function renderRanking() {
    const rankingList = document.getElementById('ranking-list');
    if (!rankingList) return;  // ランキングリストが存在しない場合は処理を中断

    rankingList.innerHTML = '';

    rankings.sort((a, b) => b.score - a.score);  // 得点でソート

    let currentRank = 1;  // 現在の順位
    let previousScore = null;  // 前のエントリの得点
    let skippedRanks = 0;  // スキップした順位数

    rankings.forEach((entry, index) => {
        if (previousScore !== null && entry.score !== previousScore) {
            // 前の得点と違う場合、新しい順位を割り当てる
            currentRank = index + 1 - skippedRanks;
        }

        const li = document.createElement('li');
        li.textContent = `${currentRank}位: ${entry.name} - ${entry.score}点`;
        rankingList.appendChild(li);

        previousScore = entry.score;
    });
}

// ランキングをレンダリングする関数（管理画面用）
function renderAdminRanking() {
    const adminList = document.getElementById('admin-ranking-list');
    if (!adminList) return;  // 管理画面のランキングリストが存在しない場合は処理を中断

    adminList.innerHTML = '';

    rankings.sort((a, b) => b.score - a.score);

    let currentRank = 1;
    let previousScore = null;
    let skippedRanks = 0;

    rankings.forEach((entry, index) => {
        if (previousScore !== null && entry.score !== previousScore) {
            currentRank = index + 1 - skippedRanks;
        }

        const li = document.createElement('li');
        li.textContent = `${currentRank}: ${entry.name} - ${entry.score}点`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => deleteRanking(index));
        li.appendChild(deleteBtn);
        adminList.appendChild(li);

        previousScore = entry.score;
    });
}

// ランキングを削除する関数
function deleteRanking(index) {
    rankings.splice(index, 1);
    saveRankingsToLocalStorage();
    renderAdminRanking();
}

// フォーム送信時の処理（ランキング追加）
document.getElementById('ranking-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const score = parseInt(document.getElementById('score').value, 10);
    
    if (name && score) {
        rankings.push({ name, score });
        saveRankingsToLocalStorage();
        renderAdminRanking();
    }

    this.reset();
});

// ページ読み込み時にデータを取得して表示
window.onload = () => {
    loadRankingsFromLocalStorage();
    renderRanking();
    renderAdminRanking();
};

// ランキングの変更を他のタブに反映
window.addEventListener('storage', function(event) {
    if (event.key === 'rankings') {
        loadRankingsFromLocalStorage();
        renderRanking();
    }
});

