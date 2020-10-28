//Paul Lewis
//handles all logic for chord identifier program

var canvas = document.getElementById("canvas")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;  

var ctx = canvas.getContext('2d')

ctx.font = "30px Arial"
ctx.fillText("Chord Identifier", 50, 50)

var keyX = canvas.width/6
var keyY = canvas.height/2
var keyIndex = 0
var key = "C"

let paths = []
var expanding = false;
var hovered = null;

drawKeyWheel()

canvas.addEventListener('mousemove', function(e) {

    // console.log("moved")

    //loop through all sectors of key wheel
    for(let i = 0; i < paths.length; i++){

        if(ctx.isPointInPath(paths[i], e.offsetX, e.offsetY)){
            console.log(i)

            if(hovered != i){
                expanding = true
                hovered = i
                aState.angle = 0
            }
            
        }
    }


});

canvas.addEventListener('mousedown', function(e) {


    //loop through all sectors of key wheel
    for(let i = 0; i < paths.length; i++){
        if(ctx.isPointInPath(paths[i], e.offsetX, e.offsetY)){
            keyIndex = i;
            calcKey(keyIndex)
            console.log(key)
        }
    }

    drawKeyWheel()


});

//updates key based on given index
function calcKey(index){

    switch(index){

        case 0:
            key = "C"
            break;
        case 1:
            key = "G"
            break;
        case 2:
            key = "D"
            break;
        case 3:
            key = "A"
            break;
        case 4:
            key = "E"
            break;
        case 5:
            key = "B"
            break;
        case 6:
            key = "Gb"
            break;
        case 7:
            key = "Db"
            break;
        case 8:
            key = "Ab"
            break;
        case 9:
            key = "Eb"
            break;
        case 10:
            key = "Bb"
            break;
        case 11:
            key = "F"
            break;
        
        default:
            key = "C"
            break;


    }

}

function initKeyWheel(){
    
    paths = []

    //orients first sector to be centered on top
    let angle = 0 - 7 * Math.PI/12

    //define the paths for each region of key wheel
    for(let i = 0; i < 12; i++){

        //inner/outer radius
        let innerR = 125
        let outerR = 200

        if(hovered == i){
            outerR += 30 * Math.sin(aState.angle)
        }
        
        let p = new Path2D()

        let startX = keyX + innerR * Math.cos(angle)
        let startY = keyY + innerR * Math.sin(angle)

        ctx.beginPath()
        p.moveTo(startX, startY)
        p.lineTo(keyX + outerR * Math.cos(angle), keyY + outerR * Math.sin(angle))
        p.arc(keyX, keyY, outerR, angle, angle + Math.PI/6, false)
        p.lineTo(keyX + innerR * Math.cos(angle + Math.PI/6), keyY + innerR * Math.sin(angle + Math.PI/6))
        p.arc(keyX, keyY, innerR, angle + Math.PI/6, angle, true)
        ctx.closePath()

        ctx.stroke(p)

        paths.push(p)

        angle += Math.PI/6
    }

}

function drawKeyWheel(){

    //recalculate sector paths
    initKeyWheel()

    ctx.strokeStyle = "black"
    
    //draw each sector draw selected keys sector in red
    for(let i = 0; i < paths.length; i++){
        ctx.fillStyle = "white"

        if(keyIndex == i){
            ctx.fillStyle = "red"
        }else if(hovered == i){
            ctx.fillStyle = "#ffcccb"
        }


        ctx.fill(paths[i])
    }


}

function drawCanvas(){
    ctx.fillStyle = "white"
    ctx.rect(0,0,canvas.width, canvas.height)
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.font = "30px Arial"
    ctx.fillText("Chord Identifier", 50, 50)

    drawKeyWheel()
}

//create a global object to track animation changes
function AnimationState(){
    this.angle = 0
}
AnimationState.prototype.update = function(){
    
    if(expanding && this.angle < Math.PI/2){
        this.angle += Math.PI/25
    }else{
        expanding = false;
    }
    
}

var aState = new AnimationState()

//method to be called on loop
function drawFrame(){
    //console.log("drawing frame" + aState.vertSize)
    aState.update()

    drawCanvas()
}

setInterval(drawFrame, 80)
