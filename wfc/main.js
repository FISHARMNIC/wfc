// this returns what the wfc is to look like, plug that into the renderjs

const fs = require('fs');

// load every possible state from the ones provided
var allStates = []
fs.readdirSync("assets").forEach(e => {
    if(e.includes(".png"))
        allStates.push(e.slice(0, e.indexOf(".")));
});

// create board
var boardSize = 10; //10x10
var board = [];
for (var o = 0; o < boardSize; o++) {
    board[o] = [];
    for (var i = 0; i < boardSize; i++)
        board[o][i] = allStates.slice() //duplicate
};

// pick a random starting tile
board[0][0] = ["1010"]; //test
//board[0][0] = [allStates[Math.floor(Math.random() * allStates.length)]]; // note: replace [2][2] with random

// remove all impossible states
function collapse() {
    for (var o = 0; o < boardSize; o++) {
        for (var i = 0; i < boardSize; i++) {
            var get_current = () => board[o][i].slice();
            var set_current = (n) => { board[o][i] = n.slice() };

            var offset = (x, y) => {
                var oy = o + y;
                var ox = i + x;
                if (ox < 0 || oy < 0 || ox >= boardSize || oy >= boardSize)
                    return undefined;
                return board[oy][ox].slice();
            }

            var check = (neighbor, meFromHim, himFromMe) => {
                    if (neighbor != undefined && get_current().length > 1) { // skip if that neighbor doesn't exist
                        var run_sec = true
                        if (neighbor.length == 1) // they only have one state
                        {
                            var run_sec = false
                            var current_neighbor = neighbor[0];
                            //console.log(get_current())

                            var old = get_current()
                            set_current(get_current().map(x => { // for each item
                                if (x[himFromMe] != current_neighbor[meFromHim]) {
                                    // console.log("[%i, %i] [meFromHim: %i] [himFromMe: %i] removed: %s", i, o,meFromHim, himFromMe, x);
                                    return undefined;
                                }
                                return x;
                            }).filter(x => x))

                            if (JSON.stringify(old) == JSON.stringify(get_current()))
                                run_sec = true

                        }
                        if (run_sec && get_current().length <= tollerance) {

                            var temp = get_current()
                            temp.splice(Math.floor(Math.random() * temp.length), 1);
                            set_current(temp)

                            tollerance--
                        }
                    }
            }

            // scan surrounding

            // he is to my left
            var meFromHim = 2 // which character relative to my neighbor am I (in this case I am at their right)
            var himFromMe = 0 // which character is my neighbor (they are at my left)
            var neighbor = offset(-1, 0) // left
            check(neighbor, meFromHim, himFromMe)

            // he is on top of me
            meFromHim = 3
            himFromMe = 1
            neighbor = offset(0, -1)
            check(neighbor, meFromHim, himFromMe)

            // he is to my right
            meFromHim = 0
            himFromMe = 2
            neighbor = offset(0, 1)
            check(neighbor, meFromHim, himFromMe)

            // he is below me
            meFromHim = 1
            himFromMe = 3
            neighbor = offset(1, 0)
            check(neighbor, meFromHim, himFromMe)


        }
    }
}


// main loop
var tollerance = 0;
var current_size;

var iterations = 0;
do {
    var old_board = board.slice();
    collapse();
    if (JSON.stringify(board) == JSON.stringify(old_board))
        tollerance++;

    current_size = board.flat(5).length;

    iterations++;
} while (current_size != boardSize * boardSize)

fs.writeFileSync("out.txt", JSON.stringify(board))
console.log("Took %i iterations. Saved in [out.txt]", iterations)