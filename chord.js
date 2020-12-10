//Paul Lewis
//handles all logic for chord identifier program

var canvas = document.getElementById("canvas")

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";  

var ctx = canvas.getContext('2d')

// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
canvas.width = Math.floor(window.innerWidth * scale);
canvas.height = Math.floor(window.innerHeight * scale);

// Normalize coordinate system to use css pixels.
ctx.scale(scale, scale);

ctx.font = "30px Arial"
ctx.fillText("Chord Identifier", 50, 50)

var keyX = canvas.width/(6 * scale)
var keyY = canvas.height/(2 * scale)
var keyIndex = 0
var key = "C"

var paths = []
var expanding = false;
var hovered = null;

//for the key wheel and buttons
var showMinor = false;
var showEnharmonics = false;
var minorButtonPath;
var enharmonicButtonPath;
var minorButtonHovered;
var enharmonicButtonHovered;
var minorButtonX;
var minorButtonY;
var enharmonicButtonX;
var enharmonicButtonY;

var sharps = false;
var flats = false;
var notes = [];

drawKeyWheel()
initKeyButtons()

function preloadImages(srcs, imgs) {
    
    console.log("preloading Images")
    
    var img;
    var remaining = srcs.length;
    for (var i = 0; i < srcs.length; i++) {
        img = new Image();
        img.onload = function() {
            --remaining;
            if (remaining <= 0) {
                setInterval(drawFrame, 50)
            }
        };
        img.src = srcs[i];
        imgs.push(img);
    }
}

//any new image has to be added here and you need to append it otherwise it shifts all other indices
var imageSrcs = ["assets/treble.svg", 
                "assets/bass.svg"
                ];

var images = [];

preloadImages(imageSrcs, images);

canvas.addEventListener('mousemove', function(e) {

    // console.log("moved")
    let found = false;

    //loop through all sectors of key wheel
    for(let i = 0; i < paths.length; i++){

        if(ctx.isPointInPath(paths[i], e.offsetX * scale, e.offsetY * scale)){
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

    //check buttons
    if(ctx.isPointInPath(minorButtonPath, e.offsetX * scale, e.offsetY * scale)){
        
        minorButtonHovered = true
        
    }else{minorButtonHovered = false}
    if(ctx.isPointInPath(enharmonicButtonPath, e.offsetX * scale, e.offsetY * scale)){
        
        enharmonicButtonHovered = true
        
    }else{enharmonicButtonHovered = false}


});

canvas.addEventListener('mousedown', function(e) {


    //loop through all sectors of key wheel
    for(let i = 0; i < paths.length; i++){
        if(ctx.isPointInPath(paths[i], e.offsetX * scale, e.offsetY * scale)){
            keyIndex = i;
            calcKey(keyIndex, true)
            console.log(key)
        }
    }

    //check buttons
    if(ctx.isPointInPath(minorButtonPath, e.offsetX * scale, e.offsetY * scale)){
        
        if(showMinor){
            showMinor = false;
        }else{
            showMinor = true;
        }
        
    }
    if(ctx.isPointInPath(enharmonicButtonPath, e.offsetX * scale, e.offsetY * scale)){
        
        if(showEnharmonics){
            showEnharmonics = false;
        }else{
            showEnharmonics = true;
        }
        
    }

});

//updates key based on given index
function calcKey(index, select){

    switch(index){

        case 0:
            if(!showMinor){
                theKey = "C"
            }else{
                theKey = "Am"
            }
            
            break;
        case 1:
            if(!showMinor){
                theKey = "G"
            }else{
                theKey = "Em"
            }
            break;
        case 2:
            if(!showMinor){
                theKey = "D"
            }else{
                theKey = "Bm"
            }
            break;
        case 3:
            if(!showMinor){
                theKey = "A"
            }else{
                theKey = "F#m"
            }
            break;
        case 4:
            if(!showMinor){
                theKey = "E"
            }else{
                theKey = "C#m"
            }
            break;
        case 5:
            if(!showMinor && !showEnharmonics){
                theKey = "B"
            }else if(!showMinor && showEnharmonics){
                theKey = "Cb"
            }else if(showMinor && !showEnharmonics){
                theKey = "G#m"
            }else{
                theKey = "Abm"
            }
            
            break;
        case 6:
            if(!showMinor && !showEnharmonics){
                theKey = "Gb"
            }else if(!showMinor && showEnharmonics){
                theKey = "F#"
            }else if(showMinor && !showEnharmonics){
                theKey = "D#m"
            }else{
                theKey = "Ebm"
            }
            break;
        case 7:
            if(!showMinor && !showEnharmonics){
                theKey = "Db"
            }else if(!showMinor && showEnharmonics){
                theKey = "C#"
            }else if(showMinor && !showEnharmonics){
                theKey = "A#m"
            }else{
                theKey = "Bbm"
            }
            break;
        case 8:
            if(!showMinor){
                theKey = "Ab"
            }else{
                theKey = "Fm"
            }
            break;
        case 9:
            if(!showMinor){
                theKey = "Eb"
            }else{
                theKey = "Cm"
            }
            break;
        case 10:
            if(!showMinor){
                theKey = "Bb"
            }else{
                theKey = "Gm"
            }
            break;
        case 11:
            if(!showMinor){
                theKey = "F"
            }else{
                theKey = "Dm"
            }
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
    ctx.lineWidth = 1;
    
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

//define paths for two buttons one for toggling minor keys and one for toggling enharmonic names for keys
function initKeyButtons(){

    let x = keyX - 190
    let y = keyY + 250
    let w = 180
    let h = 50
    let radius = 10

    minorButtonPath = new Path2D()

    let r = x + w;
    let b = y + h;
    ctx.beginPath()
    minorButtonPath.moveTo(x+radius, y);
    minorButtonPath.lineTo(r-radius, y);
    minorButtonPath.quadraticCurveTo(r, y, r, y+radius);
    minorButtonPath.lineTo(r, y+h-radius);
    minorButtonPath.quadraticCurveTo(r, b, r-radius, b);
    minorButtonPath.lineTo(x+radius, b);
    minorButtonPath.quadraticCurveTo(x, b, x, b-radius);
    minorButtonPath.lineTo(x, y+radius);
    minorButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    minorButtonX = x + w/2
    minorButtonY = y + h/2

    x += 200;

    enharmonicButtonPath = new Path2D()

    r = x + w;
    b = y + h;
    ctx.beginPath()
    enharmonicButtonPath.moveTo(x+radius, y);
    enharmonicButtonPath.lineTo(r-radius, y);
    enharmonicButtonPath.quadraticCurveTo(r, y, r, y+radius);
    enharmonicButtonPath.lineTo(r, y+h-radius);
    enharmonicButtonPath.quadraticCurveTo(r, b, r-radius, b);
    enharmonicButtonPath.lineTo(x+radius, b);
    enharmonicButtonPath.quadraticCurveTo(x, b, x, b-radius);
    enharmonicButtonPath.lineTo(x, y+radius);
    enharmonicButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    enharmonicButtonX = x + w/2
    enharmonicButtonY = y + h/2
}

function drawKeyButtons(){

    let strokeColor = "red"
    let hoveredFill = "#ffcccb"

    //button shapes
    ctx.fillStyle = "white"
    if(minorButtonHovered){
        ctx.fillStyle = hoveredFill
    }
    ctx.fill(minorButtonPath)

    ctx.fillStyle = "white"
    if(enharmonicButtonHovered){
        ctx.fillStyle = hoveredFill
    }
    ctx.fill(enharmonicButtonPath)

    ctx.fillStyle = "white"

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke(minorButtonPath)

    if(showMinor){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(minorButtonPath)
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke(enharmonicButtonPath)

    if(showEnharmonics){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(enharmonicButtonPath)
    }

    //button text
    ctx.fillStyle = "black"
    ctx.font = "25px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Minor", minorButtonX, minorButtonY + 10)

    ctx.fillStyle = "black"
    ctx.font = "25px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Enharmonic", enharmonicButtonX, enharmonicButtonY + 10)
}

function drawStaff(){

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";

    ctx.beginPath()
    ctx.moveTo(canvas.width/(2.5 * scale), 3 * canvas.height/(12 * scale))
    ctx.lineTo(canvas.width/(2.5 * scale), canvas.height/scale - 1.5 * canvas.height/(6 * scale))

    let startY =  3 * canvas.height/(12 * scale)
    let height = (canvas.height/scale - 1.5 * canvas.height/(6 * scale)) - 3 * canvas.height/(12 * scale)

    for(let i = 0; i < 10; i++){
        ctx.moveTo(canvas.width/(2.5 * scale), startY)
        ctx.lineTo(canvas.width/scale - canvas.width/(8 * scale), startY)

        startY += (height)/10
        if(i == 4){
            startY += (height)/10
        }
    }

    ctx.stroke()

    ctx.drawImage(images[0], canvas.width/(2.66 * scale), 3 * canvas.height/(12 * scale) - 0.3 *  height/10, 200, 5 * height/10)
    ctx.drawImage(images[1], canvas.width/(2.4 * scale), 3 * canvas.height/(12 * scale) + 6 * height/10, 100, 3 * height/10)


}

function drawCanvas(){
    ctx.fillStyle = "#F9F1F1"
    ctx.textAlign = "left"
    ctx.rect(0,0,canvas.width/scale, canvas.height/scale)
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.font = "30px Arial"
    ctx.fillText("Chord Identifier", 50, 50)

    drawKeyWheel()
    drawKeyButtons()

    ctx.fillStyle = "black"
    ctx.font = "30px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Key: " + key, keyX, keyY + 15)

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


