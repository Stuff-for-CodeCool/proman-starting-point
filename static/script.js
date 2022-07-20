const refreshButton = document.querySelector("#refresh");
const boardsHolder = document.querySelector("#boards");

function init() {
    refreshButton.addEventListener("click", loadBoards);
    document.querySelectorAll(".renameBoard").forEach((button) => {
        button.addEventListener("click", rename);
    });
}

async function loadBoards() {
    const request = await fetch("/api/boards");
    if (request.ok) {
        alert("rebuilding boards");
        const response = await request.json();

        boardsHolder.innerHTML = response.boards
            .map((board) => makeBoard(board, response.statuses, response.cards))
            .join("");
    }
}

async function rename(e) {
    e.preventDefault();
    const newName = prompt("Enter new name");

    const request = await fetch(
        `/api/boards/${e.target.dataset.boardId}/rename`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                newName: newName,
            }),
        }
    );

    if (request.ok) {
        init();
        loadBoards()
    }

    console.log(newName);
}

function makeBoard(board, statuses, cards) {
    return `
<div data-board-id="${board.id}">
    <h2>Board title: ${board.name}</h2>
    <button data-board-id="${board.id}" class="renameBoard">Rename me</button>
    ${statuses.map((status) => makeStatus(status, cards, board.id)).join("")}
</div>`;
}

function makeStatus(status, cards, boardId) {
    return `
<div data-status-id="${status.id}">
    <h3>${status.name}</h3>
    ${cards.map((card) => makeCard(card, boardId, status.id)).join("")}
</div>
    `;
}

function makeCard(card, boardId, statusId) {
    if (card.board === boardId && card.status === statusId) {
        return `
            <div class="card" data-card-id="${card.id}">${card.name}</div>
        `;
    }
}

init();
