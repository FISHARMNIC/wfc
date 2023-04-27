// MAKE SURE THIS IS THE SAME AS IN MAIN.JS
var boardSize = 10


var boxSize = 60
var separation = 0
var data = []

function prepare() {
    var gCount = 0
    document.write(`<div style="width: ${boardSize * (boxSize-separation)}px;height: ${boardSize * (boxSize-separation)}px; margin:0 auto">`)
    for (i = 0; i < boardSize; i++) {
        for (n = 0; n < boardSize; n++) {
            document.write(`
                <div style="width: ${boxSize}px; height: ${boxSize}px; float: left;">
                    <img src="/assets/${data[i][n]}.png" width="${boxSize - separation}" height="${boxSize - separation}">  
                </div>
            `)
            //gCount++
        }
    }
    document.write(`</div>`)
}

fetch('../out.txt')
    .then(response => response.text())
    .then(text => {data = JSON.parse(text)})
    .then(prepare)

