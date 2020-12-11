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

var keyX = canvas.width/(6 * scale)
var keyY = (canvas.height/(scale)) * .45
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
var clearButtonPath;
var clearButtonHovered;
var clearButtonX;
var clearButtonY;

var numSharps = 0;
var numFlats = 0;
var notes = [];

var noteX = 0;
var noteInputPath;
var noteY;
var hoveredNote = false;
var noteSnapped = false;
var hoveredNoteName = "";

var noteDisplayPath;
var noteDisplayX;
var noteDisplayY;

drawKeyWheel()
initButtons()
initNotesDisplay()

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
                "assets/bass.svg",
                "assets/Flat.png",
                "assets/Sharp.png",
                "assets/Natural.png",
                "assets/Stemless notehead filled in.png"
                ];

var images = [];

preloadImages(imageSrcs, images);

canvas.addEventListener('mousemove', function(e) {

    // console.log("moved")
    let found = false;

    //loop through all sectors of key wheel
    for(let i = 0; i < paths.length; i++){

        if(ctx.isPointInPath(paths[i], e.offsetX * scale, e.offsetY * scale)){
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
    if(ctx.isPointInPath(clearButtonPath, e.offsetX * scale, e.offsetY * scale)){
        
        clearButtonHovered = true
        
    }else{clearButtonHovered = false}

    if(ctx.isPointInPath(noteInputPath, e.offsetX * scale, e.offsetY * scale)){

        hoveredNote = true
        noteSnapped = false

        noteY = e.offsetY

    }else{hoveredNote = false}

});

canvas.addEventListener('mousedown', function(e) {


    //loop through all sectors of key wheel
    for(let i = 0; i < paths.length; i++){
        if(ctx.isPointInPath(paths[i], e.offsetX * scale, e.offsetY * scale)){
            keyIndex = i;
            calcKey(keyIndex, true)
            // console.log(key)
        }
    }

    //check buttons
    if(ctx.isPointInPath(minorButtonPath, e.offsetX * scale, e.offsetY * scale)){
        
        if(showMinor){
            showMinor = false;
        }else{
            showMinor = true;
        }

        calcKey(keyIndex, true)
        
    }
    if(ctx.isPointInPath(enharmonicButtonPath, e.offsetX * scale, e.offsetY * scale)){
        
        if(showEnharmonics){
            showEnharmonics = false;
        }else{
            showEnharmonics = true;
        }

        calcKey(keyIndex, true)
        
    }
    if(ctx.isPointInPath(clearButtonPath, e.offsetX * scale, e.offsetY * scale)){
        
        notes = []
        
    }


    if(hoveredNote){

        let dup = false

        let height = canvas.height/(2 * scale)
        noteY = (Math.floor(noteY / (height * 0.05)) * (height * 0.05))

        //make sure note isn't a duplicate
        for(let i = 0; i < notes.length; i++){
            if(Math.abs((notes[i].noteY) - noteY) < 1){
                dup = true
            }
        }

        if(!dup){
            notes.push({hoveredNoteName, noteY})
        }
        
        console.log(notes)
    }

});

//updates key based on given index
function calcKey(index, select){

    let sharps = 0;
    let flats = 0;

    switch(index){

        case 0:
            if(!showMinor){
                theKey = "C"
            }else{
                theKey = "Am"
            }
            
            sharps = 0;
            flats = 0;

            break;
        case 1:
            if(!showMinor){
                theKey = "G"
            }else{
                theKey = "Em"
            }

            sharps = 1;
            flats = 0;

            break;
        case 2:
            if(!showMinor){
                theKey = "D"
            }else{
                theKey = "Bm"
            }

            sharps = 2;
            flats = 0;

            break;
        case 3:
            if(!showMinor){
                theKey = "A"
            }else{
                theKey = "F#m"
            }

            sharps = 3;
            flats = 0;

            break;
        case 4:
            if(!showMinor){
                theKey = "E"
            }else{
                theKey = "C#m"
            }

            sharps = 4;
            flats = 0;

            break;
        case 5:
            if(!showMinor && !showEnharmonics){
                theKey = "B"

                sharps = 5;
                flats = 0;

            }else if(!showMinor && showEnharmonics){
                theKey = "Cb"

                sharps = 0;
                flats = 7;

            }else if(showMinor && !showEnharmonics){
                theKey = "G#m"

                sharps = 5
                flats = 0;

            }else{
                theKey = "Abm"

                sharps = 0;
                flats = 7;
            }
            
            break;
        case 6:
            if(!showMinor && !showEnharmonics){
                theKey = "Gb"

                sharps = 0;
                flats = 6;
            }else if(!showMinor && showEnharmonics){
                theKey = "F#"

                sharps = 6;
                flats = 0;
            }else if(showMinor && !showEnharmonics){
                theKey = "Ebm"

                sharps = 0;
                flats = 6;
            }else{
                theKey = "D#m"

                sharps = 6;
                flats = 0;
            }
            break;
        case 7:
            if(!showMinor && !showEnharmonics){
                theKey = "Db"

                sharps = 0;
                flats = 5;
            }else if(!showMinor && showEnharmonics){
                theKey = "C#"

                sharps = 7;
                flats = 0;
            }else if(showMinor && !showEnharmonics){
                theKey = "Bbm"

                sharps = 0;
                flats = 5;
                
            }else{
                theKey = "A#m"

                sharps = 7;
                flats = 0;
            }
            break;
        case 8:
            if(!showMinor){
                theKey = "Ab"
            }else{
                theKey = "Fm"
            }

            sharps = 0;
            flats = 4;

            break;
        case 9:
            if(!showMinor){
                theKey = "Eb"
            }else{
                theKey = "Cm"
            }

            sharps = 0;
            flats = 3;
            break;
        case 10:
            if(!showMinor){
                theKey = "Bb"
            }else{
                theKey = "Gm"
            }

            sharps = 0;
            flats = 2;
            break;
        case 11:
            if(!showMinor){
                theKey = "F"
            }else{
                theKey = "Dm"
            }

            sharps = 0;
            flats = 1;
            break;
        
        default:
            theKey = "C"

            sharps = 0;
            flats = 0;
            break;


    }
    if(select){
        key = theKey
        numSharps = sharps
        numFlats = flats

        console.log("sharps:" + numSharps + " Flats:" + numFlats)
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
    ctx.lineWidth = 0.2
    //draw each sector draw selected keys sector in red
    for(let i = 0; i < paths.length; i++){
        ctx.fillStyle = "white"

        if(keyIndex == i){
            ctx.fillStyle = "red"
        }else if(hovered == i){
            ctx.fillStyle = "#ffcccb"
        }

        ctx.stroke(paths[i])
        ctx.fill(paths[i])
    }

    //draw the names of keys
    let angle = 0 - 6 * Math.PI/12

    for(let i = 0; i < 12; i++){

        ctx.font = "30px Arial"

        let x = keyX + 160 * Math.cos(angle)
        let y = keyY + 160 * Math.sin(angle) + 10 

        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText(calcKey(i, false), x, y)

        angle += Math.PI/6
    }


}

//define paths for two buttons one for toggling minor keys and one for toggling enharmonic names for keys
function initButtons(){

    let x = keyX - 190
    let y = keyY + 230
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

    //clear button
    clearButtonPath = new Path2D()

    x = (canvas.width/(2.5 * scale))// + (canvas.width/scale - canvas.width/(8 * scale)))/2

    r = x + w;
    b = y + h;
    ctx.beginPath()
    clearButtonPath.moveTo(x+radius, y);
    clearButtonPath.lineTo(r-radius, y);
    clearButtonPath.quadraticCurveTo(r, y, r, y+radius);
    clearButtonPath.lineTo(r, y+h-radius);
    clearButtonPath.quadraticCurveTo(r, b, r-radius, b);
    clearButtonPath.lineTo(x+radius, b);
    clearButtonPath.quadraticCurveTo(x, b, x, b-radius);
    clearButtonPath.lineTo(x, y+radius);
    clearButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    clearButtonX = x + w/2
    clearButtonY = y + h/2
}

function drawButtons(){

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
    if(clearButtonHovered){
        ctx.fillStyle = hoveredFill
    }
    ctx.fill(clearButtonPath)

    ctx.fillStyle = "white"


    //button strokes
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

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke(clearButtonPath)

    //button text
    ctx.fillStyle = "black"
    ctx.font = "25px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Minor", minorButtonX, minorButtonY + 10)

    ctx.fillStyle = "black"
    ctx.font = "25px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Enharmonics", enharmonicButtonX, enharmonicButtonY + 10)
    
    ctx.fillStyle = "black"
    ctx.font = "25px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Clear Notes", clearButtonX, clearButtonY + 10)
}

function initNotesDisplay(){

    let x = canvas.width/(2.5 * scale)
    let y = 20
    let w = 300
    let h = 100
    let radius = 10

    noteDisplayPath = new Path2D()

    let r = x + w;
    let b = y + h;
    ctx.beginPath()
    noteDisplayPath.moveTo(x+radius, y);
    noteDisplayPath.lineTo(r-radius, y);
    noteDisplayPath.quadraticCurveTo(r, y, r, y+radius);
    noteDisplayPath.lineTo(r, y+h-radius);
    noteDisplayPath.quadraticCurveTo(r, b, r-radius, b);
    noteDisplayPath.lineTo(x+radius, b);
    noteDisplayPath.quadraticCurveTo(x, b, x, b-radius);
    noteDisplayPath.lineTo(x, y+radius);
    noteDisplayPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    noteDisplayX = x
    noteDisplayY = y
}

function drawNotesDisplay(){

    ctx.fillStyle = "white"
    ctx.fill(noteDisplayPath)

    ctx.strokeStyle = "black"
    ctx.lineWidth = 1
    ctx.stroke(noteDisplayPath)

    ctx.fillStyle = "black"
    ctx.font = "20px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Notes:", noteDisplayX + 150, noteDisplayY + 30)

    let notesAsString = "{"

    for(let i = 0; i < notes.length; i++){
        notesAsString += " " + notes[i].hoveredNoteName 
        if(i != notes.length){
            notesAsString += ","
        }
    }

    notesAsString += "}"

    ctx.textAlign = "left"
    ctx.fillText(notesAsString, noteDisplayX + 5, noteDisplayY + 70)

}

function drawStaff(){

    //define borders
    let startX = canvas.width/(2.5 * scale)
    let endX = canvas.width/scale - canvas.width/(50 * scale)
    let height = canvas.height/(2 * scale)
    let startY =  keyY - height/2
    let width = endX - startX;

    //make two white boxes behind staff
    ctx.fillStyle = "white"
    ctx.rect(startX, startY, width, height * .4)
    ctx.fill()

    ctx.rect(startX, startY + height * .6, width, height * .4)
    ctx.fill()


    //draw lines on top
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";

    //draw left side vertical line
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX, startY + height)

    //draw horizontal lines in staff
    for(let i = 0; i < 10; i++){
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, startY)

        startY += (height)/10
        if(i == 4){
            startY += (height)/10
        }
    }
    //reset startY
    startY -= 11 * (height)/10

    //draw vertical line on rightside of staff
    ctx.moveTo(endX, startY)
    ctx.lineTo(endX, startY + height)

    ctx.stroke()

    //draw clef images
    ctx.drawImage(images[0], canvas.width/(2.66 * scale), startY - 0.3 *  height/10, 200, 5 * height/10)
    ctx.drawImage(images[1], canvas.width/(2.4 * scale), startY + 6 * height/10, 100, 3 * height/10)


    //draw key signature
    sharpX = startX + width * .2;
    sharpY = startY - height * .11;

    //sharps
    for(let i = 0; i < numSharps; i++){
        ctx.drawImage(images[3], sharpX, sharpY, height * .07, height * .22)
        ctx.drawImage(images[3], sharpX, sharpY + height * .7, height * .07, height * .22)

        sharpX += height/20
        if(i == 0 || i == 2 || i == 3 || i == 5){
            sharpY += height * .15
        }else if(i == 1 || i == 3 || i == 4){
            sharpY -= height * .2
        }
    }

    flatX = startX + width * .2;
    flatY = startY + height * .05;

    //flats
    for(let i = 0; i < numFlats; i++){
        ctx.drawImage(images[2], flatX, flatY, height * .07, height * .22)
        ctx.drawImage(images[2], flatX, flatY + height * .7, height * .07, height * .22)

        flatX += height/20
        if(i % 2 == 0){
            flatY -= height * .15
        }else{
            flatY += height * .2
        }
    }   


    //draw notes in chord
    noteX = startX + width * .7

    if(hoveredNote){

        let noteName = "";

        if(!noteSnapped){
            noteY = (Math.floor(noteY / (height * 0.05)) * (height * 0.05))
            noteSnapped = true;

            let notePosition = Math.floor((startY + height * 1.2)/(height * 0.05) - noteY/(height * 0.05))
            notePosition = notePosition % 7
            notePosition -= 3
            if(notePosition <= 0){notePosition += 7}
            notePosition += 64
            // console.log(String.fromCharCode(notePosition))

            noteName = String.fromCharCode(notePosition)
            // console.log(notePosition)
            switch(noteName){

                case "F":
                    if(numSharps >= 1){
                        noteName += "#"
                    }
                    if(numFlats >= 7){
                        noteName += "b"
                    }
                    break;
                
                case "C":
                    if(numSharps >= 2){
                        noteName += "#"
                    }
                    if(numFlats >= 6){
                        noteName += "b"
                    }
                    break;
    
                case "G":
                    if(numSharps >= 3){
                        noteName += "#"
                    }
                    if(numFlats >= 5){
                        noteName += "b"
                    }
                    break;
    
                case "D":
                    if(numSharps >= 4){
                        noteName += "#"
                    }
                    if(numFlats >= 4){
                        noteName += "b"
                    }
                    break;
    
                case "A":
                    if(numSharps >= 5){
                        noteName += "#"
                    }
                    if(numFlats >= 3){
                        noteName += "b"
                    }
                    break;
    
                case "E":
                    if(numSharps >= 6){
                        noteName += "#"
                    }
                    if(numFlats >= 2){
                        noteName += "b"
                    }
                    break;
    
                case "B":
                    if(numSharps >= 7){
                        noteName += "#"
                    }
                    if(numFlats >= 1){
                        noteName += "b"
                    }
                    break;
            }
    
            console.log(noteName)

            hoveredNoteName = noteName
        }
        
        

        
    }

    noteInputPath = new Path2D();

    ctx.beginPath()
    noteInputPath.rect(startX + width/2, startY - height * .3, width * .4, height * 1.5)
    ctx.closePath()

    ctx.strokeStyle = "grey"
    ctx.stroke(noteInputPath)

    //draw notes
    for(let i = 0; i < notes.length; i++){

        //ledger lines if necesary
        if(Math.abs(notes[i].noteY - (startY + height/2)) < 1){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - 50, notes[i].noteY)
            ctx.lineTo(noteX + 50, notes[i].noteY)
            ctx.stroke()
            
        }
        if(notes[i].noteY <= startY - height * .09){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - 50, startY - height * .1)
            ctx.lineTo(noteX + 50, startY - height * .1)
            ctx.stroke()
        }
        if(notes[i].noteY <= startY - height * .19){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - 50, startY - height * .2)
            ctx.lineTo(noteX + 50, startY - height * .2)
            ctx.stroke()
        }
        if(notes[i].noteY >= startY + height * 1.09){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - 50, startY + height * 1.1)
            ctx.lineTo(noteX + 50, startY + height * 1.1)
            ctx.stroke()
        }


        // ctx.fillStyle = "black"
        // ctx.beginPath()
        // ctx.arc(noteX, notes[i].noteY, height * 0.05, 0, 2 * Math.PI, false)
        // ctx.fill()
        let notewidth = height * .15
        ctx.drawImage(images[5], noteX - notewidth/2, notes[i].noteY - height * .05, notewidth, height * .1)
    }

    if(hoveredNote){

        //ledger lines if necesary
        if(Math.abs(noteY - (startY + height/2)) < 1){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - 50, noteY)
            ctx.lineTo(noteX + 50, noteY)
            ctx.stroke()
            
        }
        if(noteY <= startY - height * .09){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - 50, startY - height * .1)
            ctx.lineTo(noteX + 50, startY - height * .1)
            ctx.stroke()
        }
        if(noteY <= startY - height * .19){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - 50, startY - height * .2)
            ctx.lineTo(noteX + 50, startY - height * .2)
            ctx.stroke()
        }
        if(noteY >= startY + height * 1.09){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - 50, startY + height * 1.1)
            ctx.lineTo(noteX + 50, startY + height * 1.1)
            ctx.stroke()
        }

        // ctx.fillStyle = "#ffcccb"
        //ctx.beginPath()
        //ctx.arc(noteX, noteY, height * 0.05, 0, 2 * Math.PI, false)
        let notewidth = height * .15
        ctx.drawImage(images[5], noteX - notewidth/2, noteY - height * .05, notewidth, height * .1)
        //ctx.fill()
    }
    

}

function drawCanvas(){
    ctx.fillStyle = "#F9F1F1"
    ctx.textAlign = "left"
    ctx.rect(0,0,canvas.width/scale, canvas.height/scale)
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.font = "45px Arial"
    ctx.fillText("Chord Identifier", 30, 60)
    
    let startX = canvas.width/(2.5 * scale)
    let endX = canvas.width/scale - canvas.width/(50 * scale)
    let width = endX - startX

    ctx.fillStyle = "grey"
    ctx.font = "15px Arial"
    ctx.fillText("By Paul", 30, 80)
    ctx.fillText("Select key using", 20, 150)
    ctx.fillText("wheel:", 20, 170)
    ctx.fillText("Hover over box to insert chord notes below:", startX + width/2, 30)

    drawKeyWheel()
    drawButtons()
    drawNotesDisplay()

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


