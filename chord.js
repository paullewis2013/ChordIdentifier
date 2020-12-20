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

var chordNames;

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

            for(let i = 0; i < notes.length; i++){
                notes[i].hoveredNoteName = determineNoteName(notes[i].hoveredNoteName)
            }

            chordNames = calcChordNames()
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

        for(let i = 0; i < notes.length; i++){
            notes[i].hoveredNoteName = determineNoteName(notes[i].hoveredNoteName)
        }

        chordNames = calcChordNames()
        
    }
    if(ctx.isPointInPath(clearButtonPath, e.offsetX * scale, e.offsetY * scale)){
        
        notes = []
        chordNames = []
        
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

        if(!dup && notes.length < 7){
            notes.push({hoveredNoteName, noteY})

            //every time a note is added resort the notes to be in acsending order
            notes.sort((a, b) => (a.noteY < b.noteY) ? 1 : -1)

            chordNames = calcChordNames()
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
        let innerR = (125/1440) * (canvas.width/scale)
        let outerR = (200/1440) * (canvas.width/scale)

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

        ctx.font = Math.floor(30/1440 * canvas.width/scale) + "px Arial"

        let x = keyX + ((160/1440) * (canvas.width/scale)) * Math.cos(angle)
        let y = keyY + ((160/1440) * (canvas.width/scale)) * Math.sin(angle) + 10 

        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText(calcKey(i, false), x, y)

        angle += Math.PI/6
    }


}

//define paths for buttons 
function initButtons(){

    let x = keyX - ((190/1440) * (canvas.width/scale))
    let y = keyY + ((230/798) * (canvas.height/scale))
    let w = ((180/1440) * (canvas.width/scale))
    let h = ((50/798) * (canvas.height/scale))
    let radius = ((10/1440) * (canvas.width/scale))

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

    x += ((200/1440) * (canvas.width/scale));

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
    ctx.font = Math.floor((25/1440) * canvas.width/scale) + "px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Minor", minorButtonX, minorButtonY + (10/798) * canvas.height/scale)

    ctx.fillStyle = "black"
    ctx.font = Math.floor((25/1440) * canvas.width/scale) + "px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Enharmonics", enharmonicButtonX, enharmonicButtonY + (10/798) * canvas.height/scale)
    
    ctx.fillStyle = "black"
    ctx.font = Math.floor((25/1440) * canvas.width/scale) + "px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Clear Notes", clearButtonX, clearButtonY + (10/798) * canvas.height/scale)
}

function initNotesDisplay(){

    let height = canvas.height/(2 * scale)
    let startY =  keyY - height/2

    let x = canvas.width/(2.5 * scale)
    let y = startY - height * .3
    let w = 300
    let h = 60
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
    ctx.fillText("Notes:", noteDisplayX + 150, noteDisplayY + 20)

    let notesAsString = ""

    for(let i = 0; i < notes.length; i++){
        notesAsString += " " + notes[i].hoveredNoteName 
        if(i != notes.length - 1){
            notesAsString += ","
        }else{
            notesAsString += " "
        }
    }

    notesAsString += ""

    ctx.textAlign = "center"
    ctx.fillText(notesAsString, noteDisplayX + 150, noteDisplayY + 50)

}

function determineNoteName(noteName){

    //cut off anything other than the letter
    noteName = noteName.substring(0,1)

    //apply sharps or flats based on key
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

    return noteName
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
    ctx.drawImage(images[0], canvas.width/(2.66 * scale), startY - 0.3 *  height/10, ((200/1440) * canvas.width/scale), 5 * height/10)
    ctx.drawImage(images[1], canvas.width/(2.4 * scale), startY + 6 * height/10, ((100/1440) * canvas.width/scale), 3 * height/10)


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

        //if(!noteSnapped){
            noteY = Math.floor(noteY / (height * 0.05)) * (height * 0.05)
            noteSnapped = true;

            let notePosition = Math.floor((startY + height * 1.55)/(height * 0.05) - noteY/(height * 0.05))
            notePosition = notePosition % 7
            notePosition -= 3
            if(notePosition <= 0){notePosition += 7}
            notePosition += 64
            // console.log(String.fromCharCode(notePosition))

            noteName = String.fromCharCode(notePosition)
            // console.log(notePosition)

            noteName = determineNoteName(noteName)
    
            // console.log(noteName)

            hoveredNoteName = noteName
        // }
        
        

        
    }

    noteInputPath = new Path2D();

    ctx.beginPath()
    noteInputPath.rect(startX + width/2, startY - height * .3, width * .4, height * 1.8)
    ctx.closePath()

    ctx.strokeStyle = "grey"
    ctx.stroke(noteInputPath)

    let lastNoteShifted = false;

    //draw notes
    for(let i = 0; i < notes.length; i++){

        //reset noteX in case necesary 
        noteX = startX + width * .7
        
        //draw ledger lines if necesary

        //middle c
        if(Math.abs(notes[i].noteY - (startY + height/2)) < 1){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, notes[i].noteY)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, notes[i].noteY)
            ctx.stroke()
            
        }

        //a above
        if(notes[i].noteY <= startY - height * .09){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY - height * .1)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY - height * .1)
            ctx.stroke()
        }

        //c above
        if(notes[i].noteY <= startY - height * .19){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY - height * .2)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY - height * .2)
            ctx.stroke()
        }

        //e below
        if(notes[i].noteY >= startY + height * 1.09){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY + height * 1.1)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY + height * 1.1)
            ctx.stroke()
        }

        //c below
        if(notes[i].noteY >= startY + height * 1.19){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY + height * 1.2)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY + height * 1.2)
            ctx.stroke()
        }

        //a below
        if(notes[i].noteY >= startY + height * 1.29){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY + height * 1.3)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY + height * 1.3)
            ctx.stroke()
        }

        //f below
        if(notes[i].noteY >= startY + height * 1.39){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY + height * 1.4)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY + height * 1.4)
            ctx.stroke()
        }



        // ctx.fillStyle = "black"
        // ctx.beginPath()
        // ctx.arc(noteX, notes[i].noteY, height * 0.05, 0, 2 * Math.PI, false)
        // ctx.fill()

        //check if note above or below would overlap
        if((i > 0 && notes[i - 1].noteY - notes[i].noteY < height * .06) && !lastNoteShifted){
            noteX += width * .07
            lastNoteShifted = true
        }else{
            lastNoteShifted = false
        }

        let notewidth = height * .15
        ctx.drawImage(images[5], noteX - notewidth/2, notes[i].noteY - height * .05, notewidth, height * .1)

        noteX = startX + width * .7
    }

    if(hoveredNote){

        //ledger lines if necesary

        //middle c
        if(Math.abs(noteY - (startY + height/2)) < 1){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, noteY)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, noteY)
            ctx.stroke()
            
        }

        //a above
        if(noteY <= startY - height * .09){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY - height * .1)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY - height * .1)
            ctx.stroke()
        }

        //c above
        if(noteY <= startY - height * .19){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY - height * .2)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY - height * .2)
            ctx.stroke()
        }

        //e below
        if(noteY >= startY + height * 1.09){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY + height * 1.1)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY + height * 1.1)
            ctx.stroke()
        }

        //c below
        if(noteY >= startY + height * 1.19){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY + height * 1.2)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY + height * 1.2)
            ctx.stroke()
        }

        //a below
        if(noteY >= startY + height * 1.29){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY + height * 1.3)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY + height * 1.3)
            ctx.stroke()
        }

        //f below
        if(noteY >= startY + height * 1.39){
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(noteX - (50/1440) * canvas.width/scale, startY + height * 1.4)
            ctx.lineTo(noteX + (50/1440) * canvas.width/scale, startY + height * 1.4)
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

//convert string to int where 0 = A up to 11 = G#
function noteToNum(note){

    let num = 0;

    switch(note){
        case "A":
            num = 0;
            break;

        case "A#":
        case "Bb":
            num = 1;
            break;

        case "B":
        case "Cb":
            num = 2;
            break;

        case "B#":
        case "C":
            num = 3;
            break;
        
        case "C#":
        case "Db":
            num = 4
            break;

        case "D":
            num = 5
            break;

        case "D#":
        case "Eb":
            num = 6
            break;

        case "E":
        case "Fb":
            num = 7
            break;

        case "E#":
        case "F":
            num = 8
            break;
        
        case "F#":
        case "Gb":
            num = 9
            break;

        case "G":
            num = 10
            break;

        case "G#":
        case "Ab":
            num = 11
            break;


    }
    return num

}

function calcChordNames(){

    let chordNames = []
    let root = ""
    let rootNum = 0
    let notesTonal = []

    // console.log(notes)

    //first convert all notes to 0-11 tonal representation
    for(let i = 0; i < notes.length; i++){

        //get note as string
        let note = notes[i].hoveredNoteName;
        let num = noteToNum(note)

        //add note to notesTonal if it is not already contained in notesTonal
        if(!notesTonal.includes(num)){
            notesTonal.push(num)
        }

    }

    // console.log(notesTonal)

    //loop through all notes and consider each as root notes
    //note this will fail to recognize rootless chords
    for(let i = 0; i < notes.length; i++){

        //store letter name of note as string for later
        root = notes[i].hoveredNoteName;

        //get tone number of note
        rootNum = noteToNum(root)

        //transpose other notes relative to current root
        let currNotesTonal = notesTonal.slice()
        for(let i = 0; i < currNotesTonal.length; i++){
            currNotesTonal[i] -= rootNum
            if(currNotesTonal[i] < 0){
                currNotesTonal[i] += 12
            }
        }

        //sort the new array
        currNotesTonal.sort((a,b) => a - b)

        let chordType = determineChordType(root, currNotesTonal)

        //add the new name to the array to return
        if(chordType != "Unrecognized" && !chordNames.includes(chordType)){
            chordNames.push(chordType)
        }
        
    }

    return chordNames

}

//passed an array of (unique) number values (in ascending order) representing the distance from the root in semi tones
function determineChordType(root, currNotesTonal){

    //turn the array into a string
    let checkString = ""
    for(let i = 0; i < currNotesTonal.length; i++){
        checkString += currNotesTonal[i] + ","
    }

    let chordType = root;

    console.log(checkString)

    //match the pattern
    switch(checkString){

        //intervals
        // case "0,":
        //     chordType += "(unison)"
        //     break;
        
        case "0,1,":
            chordType += " (w/ minor second interval)"
            break;

        case "0,2,":
            chordType += " (w/ major second interval)"
            break;

        case "0,3,":
            chordType += " (w/ minor third interval)"
            break;

        case "0,4,":
            chordType += " (w/ major third interval)"
            break;

        case "0,5,":
            chordType += " (w/ perfect fourth interval)"
            break;

        case "0,6,":
            chordType += " (w/ tritone interval)"
            break;

        case "0,7,":
            chordType += " (w/ perfect fifth interval)"
            break;

        case "0,8,":
            chordType += " (w/ minor sixth interval)"
            break;

        case "0,9,":
            chordType += " (w/ major sixth interval)"
            break;

        case "0,10,":
            chordType += " (w/ minor seventh interval)"
            break;

        case "0,11,":
            chordType += " (w/ major seventh interval)"
            break;

        //triads
        case "0,3,7,":
        case "3,7,0,":
        case "7,0,3,":
            chordType += " Minor"
            break;

        case "0,4,7,":
        case "4,7,0,":
        case "7,4,0,":
            chordType += " Major"
            break;

        case "0,4,8,":
            chordType += " Augmented"
            break;
    
        case "0,3,6,":
            chordType += " Diminished"
            break;

        case "0,5,7,":
            chordType += " Suspended Fourth"
            break;

        case "0,2,7,":
            chordType += " Suspended Second"
            break;

        //sixth chords
        case "0,3,7,9,":
            chordType += " Minor Sixth"
            break;

        case "0,4,7,9,":
            chordType += " Major Sixth"
            break;

        //seventh chords
        case "0,3,6,9,":
            chordType += " Diminished Seventh"
            break;

        case "0,4,7,10,":
        case "0,4,10,":
            chordType += " Dominant Seventh"
            break;

        case "0,4,7,11,":
        case "0,4,11,":
            chordType += " Major Seventh"
            break;

        case "0,3,7,10,":
        case "0,3,10,":
            chordType += " Minor Seventh"
            break;

        case "0,3,7,11,":
        case "0,3,11,":
            chordType += " Minor Major Seventh"
            break;

        case "0,3,6,10,":
            chordType += " Half Diminished Seventh"
            break;

        default:
            chordType = "Unrecognized"
            break;

    }

    return chordType;

}

function drawOutput(){

    let x = keyX - ((190/1440) * (canvas.width/scale))
    let y = keyY + ((300/798) * (canvas.height/scale))
    let w = ((710/1440) * (canvas.width/scale))
    let h = ((120/798) * (canvas.height/scale))
    let radius = ((10/1440) * (canvas.width/scale))

    outputPath = new Path2D()

    let r = x + w;
    let b = y + h;
    ctx.beginPath()
    outputPath.moveTo(x+radius, y);
    outputPath.lineTo(r-radius, y);
    outputPath.quadraticCurveTo(r, y, r, y+radius);
    outputPath.lineTo(r, y+h-radius);
    outputPath.quadraticCurveTo(r, b, r-radius, b);
    outputPath.lineTo(x+radius, b);
    outputPath.quadraticCurveTo(x, b, x, b-radius);
    outputPath.lineTo(x, y+radius);
    outputPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    ctx.strokeStyle = "black"
    ctx.lineWidth = "2"
    ctx.stroke(outputPath)
    ctx.fillStyle = "#ffffff"
    ctx.fill(outputPath)

    ctx.font = Math.floor((30/1440) * (canvas.width/scale)) + "px Arial"
    ctx.fillStyle = "black"
    ctx.textAlign = "left"
    if(notes.length == 0){
        ctx.fillText("Input notes on the staff to calculate a chord", ((100/1440) * (canvas.width/scale)), y + h/2)
    }else if(notes.length == 1){
        ctx.fillText("Input more notes on the staff to calculate a chord", ((80/1440) * (canvas.width/scale)), y + h/2)
    }
    else{
        ctx.font = Math.floor(h/5) + "px Arial"
        let printX = ((70/1440) * (canvas.width/scale))
        let printY = ((700/798) * (canvas.height/scale))
        ctx.fillText("Possible names:", printX, printY - h/10)
        
        let fontH = Math.floor(h/(chordNames.length + 2))
        ctx.font = fontH + "px Arial"
        
        printY += h/4
        
        for(let i = 0; i < chordNames.length; i++){
            ctx.fillText(chordNames[i], printX * 4, printY + i * h/(chordNames.length + 2))
        }
    }
    

}

function drawCanvas(){
    ctx.fillStyle = "#F9F1F1"
    ctx.textAlign = "left"
    ctx.rect(0,0,canvas.width/scale, canvas.height/scale)
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.font = Math.floor((45/1440) * (canvas.width/scale)) + "px Arial"
    ctx.fillText("Chord Identifier", ((20/1440) * (canvas.width/scale)), ((60/798) * (canvas.height/scale)))
    
    let startX = canvas.width/(2.5 * scale)
    let endX = canvas.width/scale - canvas.width/(50 * scale)
    let width = endX - startX

    ctx.fillStyle = "grey"
    ctx.font = Math.floor((15/1440) * (canvas.width/scale)) + "px Arial"
    ctx.fillText("By Paul", ((20/1440) * (canvas.width/scale)), ((80/798) * (canvas.height/scale)))
    ctx.fillText("Select key using", ((20/1440) * (canvas.width/scale)), ((150/798) * (canvas.height/scale)))
    ctx.fillText("wheel:", ((20/1440) * (canvas.width/scale)), ((170/798) * (canvas.height/scale)))
    ctx.fillText("Hover over box to insert chord notes below:", startX + width/2, ((30/798) * canvas.height/scale))

    drawKeyWheel()
    drawButtons()
    drawNotesDisplay()

    ctx.fillStyle = "black"
    ctx.font = Math.floor((30/1440) * (canvas.width/scale)) + "px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Key: " + key, keyX, keyY + (15/798) * canvas.height/scale)

    drawStaff()
    drawOutput()
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


