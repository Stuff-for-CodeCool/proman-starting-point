from flask import Flask, render_template, jsonify, request
from random import randint

app = Flask(__name__)

# From database
boards = [{"name": "board 1", "id": 1}, {"name": "board 2", "id": 2}]
statuses = [
    {"name": "to do", "id": 1},
    {"name": "in progress", "id": 2},
    {"name": "done", "id": 3},
]
cards = [
    {
        "id": index,
        "name": f"Card {index}",
        "status": randint(1, 3),
        "board": randint(1, 2),
    }
    for index in range(16)
]


@app.route("/")
def index():
    return render_template("index.html", boards=boards, statuses=statuses, cards=cards)


@app.route("/api/boards")
def get_boards():
    # Gets boards from database
    return jsonify(
        {
            "boards": boards,
            "statuses": statuses,
            "cards": cards,
        }
    )


@app.route("/api/boards/<int:id>/rename", methods=["POST"])
def rename_board(id):
    global boards

    # Gets the new name from the JSON post
    new_name = request.json.get("newName")

    for index, board in enumerate(boards):
        if board.get("id") == id:
            # This should be done in the database
            boards[index]["name"] = new_name

    return get_boards()


app.run(debug=True)
