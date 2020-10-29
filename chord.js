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
    let found = false;

    //loop through all sectors of key wheel
    for(let i = 0; i < paths.length; i++){

        if(ctx.isPointInPath(paths[i], e.offsetX, e.offsetY)){
            console.log(i)
            found = true;

            if(hovered != i){
                expanding = true
                hovered = i
                aState.angle = 0
            }
            
        }
    }
    if(!found){
        hovered = null;
    }

});

canvas.addEventListener('mousedown', function(e) {


    //loop through all sectors of key wheel
    for(let i = 0; i < paths.length; i++){
        if(ctx.isPointInPath(paths[i], e.offsetX, e.offsetY)){
            keyIndex = i;
            calcKey(keyIndex, true)
            console.log(key)
        }
    }

    drawKeyWheel()


});

//updates key based on given index
function calcKey(index, select){

    switch(index){

        case 0:
            theKey = "C"
            break;
        case 1:
            theKey = "G"
            break;
        case 2:
            theKey = "D"
            break;
        case 3:
            theKey = "A"
            break;
        case 4:
            theKey = "E"
            break;
        case 5:
            theKey = "B"
            break;
        case 6:
            theKey = "Gb"
            break;
        case 7:
            theKey = "Db"
            break;
        case 8:
            theKey = "Ab"
            break;
        case 9:
            theKey = "Eb"
            break;
        case 10:
            theKey = "Bb"
            break;
        case 11:
            theKey = "F"
            break;
        
        default:
            theKey = "C"
            break;


    }
    if(select){
        key = theKey
    }

    return theKey
    

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

    //draw the names of keys
    let angle = 0 - 6 * Math.PI/12

    for(let i = 0; i < 12; i++){

        ctx.font = "30px Arial"

        let x = keyX + 155 * Math.cos(angle)
        let y = keyY + 155 * Math.sin(angle) + 10 

        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText(calcKey(i, false), x, y)

        angle += Math.PI/6
    }


}

function drawStaff(){

    ctx.beginPath()
    ctx.moveTo(canvas.width/2.5, 3 * canvas.height/12)
    ctx.lineTo(canvas.width/2.5, canvas.height - 1.5 * canvas.height/6)

    let startY =  3 * canvas.height/12
    let height = (canvas.height - 1.5 * canvas.height/6) - 3 * canvas.height/12

    for(let i = 0; i < 10; i++){
        ctx.moveTo(canvas.width/2.5, startY)
        ctx.lineTo(canvas.width - canvas.width/8, startY)

        startY += (height)/10
        if(i == 4){
            startY += (height)/10
        }
    }

    ctx.stroke()




}

function drawCanvas(){
    ctx.fillStyle = "white"
    ctx.textAlign = "left"
    ctx.rect(0,0,canvas.width, canvas.height)
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.font = "30px Arial"
    ctx.fillText("Chord Identifier", 50, 50)

    drawKeyWheel()

    ctx.fillStyle = "black"
    ctx.font = "30px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Key: " + key, 50, canvas.height - 50)

    drawStaff()
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
