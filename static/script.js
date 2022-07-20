const refreshButton = document.querySelector("#refresh");
const boardsHolder = document.querySelector("#boards");

function init () {
    //  Runs first thing
    refreshButton.addEventListener("click", loadBoards);

    //  Listens to click on the board renaming buttons
    document.querySelectorAll(".renameBoard").forEach((button) => {
        button.addEventListener("click", rename);
    });
}

async function loadBoards () {
    //  Gets all boards from server
    const request = await fetch("/api/boards");
    if (request.ok) {
        alert("rebuilding boards");
        const response = await request.json();

        //  Calls makeBoard to rebuild boards
        boardsHolder.innerHTML = response.boards
            .map((board) => makeBoard(board, response.statuses, response.cards))
            .join("");
    }
}

async function rename (e) {
    //  get user input, sends to server, rebuilds all boards
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
}

function makeBoard (board, statuses, cards) {
    //  Builds board + all statuses
    return `
<div data-board-id="${board.id}">
    <h2>Board title: ${board.name}</h2>
    <button data-board-id="${board.id}" class="renameBoard">Rename me</button>
    ${statuses.map((status) => makeStatus(status, cards, board.id)).join("")}
</div>`;
}

function makeStatus (status, cards, boardId) {
    //  Builds status + its cards
    return `
<div data-status-id="${status.id}">
    <h3>${status.name}</h3>
    ${cards.map((card) => makeCard(card, boardId, status.id)).join("")}
</div>
    `;
}

function makeCard (card, boardId, statusId) {
    //  Builds cards if board id and status id are correct
    if (card.board === boardId && card.status === statusId) {
        return `
            <div class="card" data-card-id="${card.id}">${card.name}</div>
        `;
    }
}

//  MAGIC!
init();
