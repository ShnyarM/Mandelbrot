let pointA = [0, 0], selecting = false; //Für den Maus Zoom
let mbCanvas; //ein Graphicsobject um das Mandelbrot draufzuzeichnen, damit man das Programm loopen kann ohne das Mandelbrot jedes Frame ausrechnen zu müssen
let xmin = -2, xmax = 1, ymin = -1, ymax = 1; //Intervalle
let sizeX, sizeY; //Wie viel man vom Koordinatensystem sieht
let schwellenwert = 500, limit = 2; //Schwellenwert und limit für die Beschränktheit
let swInput, lInput, pInput; //Input für den schwellenwert, Beschränktheits Limit und Pfad Menge
let xminInput, xmaxInput, yminInput, ymaxInput; //Inputs um die Intervalle manuell zu ändern
let jrInput, jiInput; //Inputs für die 2 Parameter für Julia sets
let hSlider, sSlider, bSlider, fSlider; //Slider für die Farbenänderung
let colors = {h: 255, s: 100, b: 700, f: 0}; //Variablen für die Färbung
let hsbMode = false; //zeigt welche Farbmodell aktiv ist
const bLimit = 3000 //Limit für die Helligkeit
const zoomFactor = 5; //Stärke des Zooms für Knopf und Mausrad (je höher desto schwächer)
let pathLength = 15 //wie viel Punkte vom Pfad angezeigt werden sollen
let pathCB, coordinateCB, axesCB, juliaCB, rgbCB, hsbCB; //Checkboxes für den Pfad, die Koordinaten, den Achsen, Julia sets und den Farbmodus
let juliaSet = false, jrValue, jiValue; //speichert Werte für die Juliasets, da es sonst mehr performance braucht wenn man die Werte direkt von den Inputs nimmt
let div; //In diesem div sind alle DOMs, da man dann scrollen kann und somit das Mandelbrot immer sichtbar ist
let timeText; //Text rechts vom Canvas der anzeigt, wie lange ein Frame zum berechnen braucht
//Arrays um die Farben bei der rgb färbung zu bestimmen
//Die Liste von Zahlen ist von https://stackoverflow.com/questions/16500656/which-color-gradient-is-used-to-color-mandelbrot-in-wikipedia von user "Afr"
const rColor = [66, 25, 9, 4, 0, 12, 24, 57, 134, 211, 241, 248, 255, 204, 153, 206]
const gColor = [30, 7, 1, 4, 7, 44, 82, 125, 181, 236, 233, 201, 170, 128, 87, 52]
const bColor = [15, 26, 47, 73, 100, 138, 177, 209, 229, 248, 191, 95, 0, 0, 0, 3]

function setup() {
  createCanvas(700, 500);
  mbImg = createGraphics(700, 500) //Erklärung bei der Variablen deklarierung
  makeInput() //Macht die Inputfelder unter dem Canvas
  drawMandelBrot() //zeichnet das Mandelbrot
  strokeWeight(2)
  rectMode(CORNERS) //Für den Click and Drag Zoom
  //Damit man mit Rechtsklick bewegen kann ohne dass kontextmenü kommt
  //modifiziert, original: https://stackoverflow.com/questions/60853612/p5-js-on-right-mouse-click-shows-the-browser-context-menu-and-not-the-drawing-fu von user "bluelhf"
  document.getElementsByClassName("p5Canvas")[0].addEventListener("contextmenu", (e) => e.preventDefault());
}


function draw() {
	//Zeichnet das Mandelbrot Bild
  image(mbImg, 0, 0, width, height)
  //Falls die checkboxes angewählt sind, ruft es die Funktionen auf
  if(axesCB.checked()) drawAxes();
  if(pathCB.checked()) drawPath()
  if(coordinateCB.checked()) drawCoordinate()
  //Wenn click and drag zoom aktiv ist, wird die Funktion aufgerufen
  if(selecting) drawZoomBox();
}

function drawAxes() {
  //Rechnet verschiedenes aus um die Achsen korrekt anzuzeigen
  let distanceX = sizeX/7
  let distanceY = sizeY/7
  fill("black")
  //Zeichnet die Reelle Achse
  stroke("yellow")
  let yCoordinate = imToPixel(0) //Wird gebraucht um die Achse zu zeichnen auch wenn der Nullpunkt ausserhalb des Screens ist
  if(yCoordinate > height) yCoordinate = height
  else if(yCoordinate < 0) yCoordinate = 0
  line(0, yCoordinate, width, yCoordinate) //Strich der Achse
  textSize(9.5)
  for(let i = 1; i <= 6; i++){
  	line(realToPixel(xmin + distanceX*i), yCoordinate - 10, realToPixel(xmin + distanceX*i), yCoordinate + 10) //Linien von den einzelnen Markierungen
    //Nummer Text, Je nach dem wo die Achse ist, wird der Text an anderen Orten gezeichnet
    yCoordinate == 0 ? text(round(xmin + distanceX*i, 2), realToPixel(xmin + distanceX*i) - 20, yCoordinate + 10) : text(round(xmin + distanceX*i, 2), realToPixel(xmin + distanceX*i) - 20, yCoordinate - 10)
  }
  textSize(12)
  yCoordinate == 0 ? text("Re(z)", realToPixel(xmax) - 70, yCoordinate + 15) : text("Re(z)", realToPixel(xmax) - 70, yCoordinate - 10)

  //Zeichnet die Imaginäre Achse, das genau gleiche wie oben
  stroke("lightgreen")
  let xCoordinate = realToPixel(0) //Wird gebraucht um die Achse zu zeichnen auch wenn der Nullpunkt ausserhalb des Screens 2ist
  if(xCoordinate > width) xCoordinate = width
  else if(xCoordinate < 0) xCoordinate = 0
  line(xCoordinate, 0, xCoordinate, height) //Strich der Achse
  textSize(9.5)
  for(let i = 1; i <= 6; i++){
  	line(xCoordinate - 10, imToPixel(ymin + distanceY*i), xCoordinate + 10, imToPixel(ymin + distanceY*i)) //Linien von den einzelnen Markierungen
    //Nummer Text
    xCoordinate == 0 ? text(round(ymin + distanceY*i, 2), xCoordinate + 10, imToPixel(ymin + distanceY*i) - 10) : text(round(ymin + distanceY*i, 2), xCoordinate - 20, imToPixel(ymin + distanceY*i) - 10)
  }
  textSize(12)
  //"Im(z)" am Rand
  xCoordinate == 0 ? text("Im(z)", xCoordinate + 20, imToPixel(ymax) + 15) : text("Im(z)", xCoordinate - 30, imToPixel(ymax) + 15)
}

//Zeichnet das Mandelbrot
function drawMandelBrot() {
	let startTime = new Date().getTime() / 1000; //Anfangszeit in Sekunden um zu berechnen wie lange es dauert zum berechnen
  //ändert den Colormode je nach Farbmodus
  hsbMode ? colorMode(HSB) : colorMode(RGB)
  //Geht durch alle Pixel
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let re = pixelToRe(i) //Konvertiert die Pixelkoordinaten zu Komplexen Zahlen
      let im = pixelToIm(j)
      let data = isPartOfMandelbrotSet(new ComplexNumber(re, im)) //Anzahl Berechnungen um herauszufinden ob es in der Mandelbrot Menge ist + Endposition, gebraucht für rgb färbung

      //setzt den Pixel auf die Korrekte Farbe
      if(data[0] == schwellenwert){
      	mbImg.set(i, j, color(0, 0, 0)) //Schwarz wenn es zum Mandebrot gehört
      }else{
        if(hsbMode){ //HSB Färbung
          let hue = int(255 * data[0] / schwellenwert)
          mbImg.set(i, j, color(colors.h - hue, colors.s, data[0] / schwellenwert * colors.b))
        }else{ //rgb Färbung
          //Berechnet Zahl aus mit den Anzahl iterationen und den Endkoordinaten
          //modifiziert von https://stackoverflow.com/questions/16500656/which-color-gradient-is-used-to-color-mandelbrot-in-wikipedia von user "NightElfik"
          let smoothed = Math.log2(Math.log2(data[1] * data[1] + data[2] * data[2]) / 2);
          let colorValue = int((Math.sqrt(data[0] + 10 - smoothed) * 256) % (16*50));
          mbImg.set(i, j, colormapping(colorValue))
        }
      }
    }
  }
  mbImg.updatePixels()
  //Updated variablen die gebraucht werden
  sizeX = Math.abs(xmax-xmin)
  sizeY = Math.abs(ymin-ymax)
  //Aktualisiert die Inputfelder für die Intervalle
  xminInput.value(xmin)
  xmaxInput.value(xmax)
  yminInput.value(ymin)
  ymaxInput.value(ymax)
  let endTime = new Date().getTime() / 1000; //Endzeit in Sekunden
  timeText.html("Berechnungszeit: " + round(endTime - startTime, 4) + "s") //Rechnet aus wie lange es dauerte und zeigt es rechts an
}

function isPartOfMandelbrotSet(z) {
  //Rechnet aus ob eine Komplexe Zahl zum Mandelbrot set gehört
  let result = new ComplexNumber(z.re, z.im);
  for (let i = 1; i <= schwellenwert; i++) {
    if (result.abs() > limit) return [i, result.re, result.im];
    result.square();
    //Je nachdem ob julia sets aktiv ist werden andere Zahlen addiert
    juliaSet ? result.add(new ComplexNumber(jrValue, jiValue)) : result.add(z)
  }
  return [schwellenwert, result.re, result.im]; //Iterationen und Endkoordinaten werden zurückgegeben
}

function drawPath(){
  let z = new ComplexNumber(pixelToRe(mouseX), pixelToIm(mouseY)) //Komplexezahl mit den Koordinaten der Maus
  let path = []
  path.push([z.re, z.im])
  //Berechnet die verschiedenen Punkte aus
  let result = new ComplexNumber(z.re, z.im);
  for (let i = 1; i <= pathLength-1; i++) {
    result.square();
    //Je nachdem ob julia sets aktiv ist werden andere Zahlen addiert
    juliaSet ? result.add(new ComplexNumber(jrValue, jiValue)) : result.add(z)
    path.push([result.re, result.im])
  }
  //Zeichnet die verschiedenen Punkte
  fill("yellow")
  stroke("grey")
  ellipse(mouseX, mouseY, 12) //Erster Punkt wird seperat gemacht
  for (let i = 0; i < path.length - 1; i++){
    line(realToPixel(path[i][0]), imToPixel(path[i][1]), realToPixel(path[i + 1][0]), imToPixel(path[i + 1][1])) //Linien
    ellipse(realToPixel(path[i + 1][0]), imToPixel(path[i + 1][1]), 12) //Kreis
  }
}

//Schreibt die Koordinate des Mauspunktes unten rechts hin
function drawCoordinate(){
  //Wandelt Maus Koordinate in Komplexe Zahl um
  let re = round(pixelToRe(mouseX), 2)
  let im = round(pixelToIm(mouseY), 2)
  textSize(15)
  fill("yellow")
  stroke("grey")
  //Anderes Vorzeichen je nach Wert von im
  im >= 0 ? text(re + " + " + im + "i", 580, 450) : text(re + " - " + Math.abs(im) + "i", 580, 450)
}

//Zeichnet das rect für den click and drag zoom
function drawZoomBox(){
  fill("rgba(200, 200, 200, 0.25)")
  stroke("white")
  rect(pointA[0], pointA[1], mouseX, mouseY)
}

//Kreiert alle Inputs unterhalb des Canvas
function makeInput(){
  //In diesem div sind alle DOMs, da man dann scrollen kann und somit das Mandelbrot immer sichtbar ist
  div = createDiv()
  div.position(10, height + 10)
  div.style("overflow-y", "scroll")
  div.style("height", height > windowHeight - 310 ? "290px" : (windowHeight - height - 20) + "px")
  div.style("width", "690px")

  //Zoom
  htmlText("Zoom", 0, 0, true)
  htmlButton("+", 0, 40, function(){buttonZoom(1)})
  htmlButton("-", 40, 40, function(){buttonZoom(-1)})

  //Schwellenwert
  htmlText("Schwellenwert", 0, 60, true)
  swInput = htmlInput(schwellenwert, 0, 100)
  htmlButton("Schwellenwert ändern", 0, 130, swChange)

  //Farben
  htmlText("Farben", 0, 150, true)
  rgbCB = htmlCheck("RGB/Farbverlauf", true, 0, 185)
  rgbCB.input(function(){hsbMode = !rgbCB.checked(); hsbCB.checked(!rgbCB.checked()); drawMandelBrot();})
  fSlider = htmlSlider(0, 500, colors.f, 1, 10, 205)
  hsbCB = htmlCheck("HSB/Einfarbig", false, 0, 230)
  hsbCB.input(function(){hsbMode = hsbCB.checked(); rgbCB.checked(!hsbCB.checked()); drawMandelBrot();})
  hSlider = htmlSlider(0, 360, colors.h, 1, 10, 250)
  sSlider = htmlSlider(0, 100, colors.s, 1, 10, 270)
  bSlider = htmlSlider(0, bLimit, colors.b, 1, 10, 290)
  htmlText("Farbton", 150, 235)
  htmlText("Sättigung", 150, 255)
  htmlText("Helligkeit", 150, 275)
  htmlButton("Farben aktualisieren", 0, 315, drawMandelBrot)
  sliderChange() //aktualisiert die Sliderfarben

  //Funktionen
  htmlText("Funktionen", 0, 335, true)
  htmlButton("Zentrieren", 0, 375, center)
  htmlButton("Seitenverhältnisse korrigieren", 0, 405, fixRatio)
  htmlButton("Exportieren", 0, 435, function(){saveCanvas("Mandelbrot", "png")})

  //Pfad
  htmlText("Pfad", 0, 455, true)
  pInput = htmlInput(pathLength, 0, 495)
  htmlButton("Pfadmenge ändern", 0, 525, pChange)

  //Intervalle
  htmlText("Intervalle", 250, 0, true)
  htmlText("Re(z)", 250, 25)
  htmlText("Im(z)", 250, 50)
  xminInput = htmlInput(xmin, 300, 40)
  xmaxInput = htmlInput(xmax, 480, 40)
  yminInput = htmlInput(ymin, 300, 65)
  ymaxInput = htmlInput(ymax, 480, 65)
  htmlButton("Intervalle ändern", 250, 95, changeIntervals)

  //Beschränktheit
  htmlText("Beschränktheit", 250, 115, true)
  lInput = htmlInput(limit, 245, 155)
  htmlButton("Grenze ändern", 245, 185, lChange)

  //Interface
  htmlText("Interface", 250, 200, true)
  pathCB = htmlCheck("Pfad", true, 245, 240)
  coordinateCB = htmlCheck("Koordinaten", true, 245, 265)
  axesCB = htmlCheck("Achsen", true, 245, 290)

  //Julia sets
  htmlText("Julia Sets", 250, 300, true)
  juliaCB = htmlCheck("Julia Sets", false, 245, 335)
  juliaCB.input(juliaRefresh)
  htmlText("Re(z)", 250, 345)
  htmlText("Im(z)", 250, 370)
  jrInput = htmlInput(0.355, 300, 360)
  jiInput = htmlInput(0.355, 300, 385)
  htmlButton("Aktualisieren", 245, 415, juliaRefresh)

  //Berechnungszeit Text, htmlText() wird nicht gebraucht da der Text in einer Variable gespeichert werden muss
  timeText = createP("")
  timeText.position(width+10, 0)
  timeText.style("font-family", "Arial")

  htmlText("　", 0, 530, false) //Text mit unsichtbarem Charakter ganz unten, damit man alles sehen kann, sonst ist die Konsole im Weg
  //Für dieses Problem gibt es sicher eine bessere Lösung aber war zu faul um eine zu suchen
}

function mousePressed() {
  //Startet die Maus Funktion und schaut ob Maus im Bild, da es sonst aktiviert beim Knöpfe drücken
  if(!selecting && mouseX < width && mouseY < height){
    if(mouseButton === LEFT){ //startet click and drag zoom
      selecting = true;
      pointA = [mouseX, mouseY]
    }else if(mouseButton === RIGHT){ //Bewegt den Mittelpunkt des Bildes
      let x = pixelToRe(mouseX)
      let y = pixelToIm(mouseY)
      xmin = x - sizeX/2
      xmax = x + sizeX/2
      ymin = y - sizeY/2
      ymax = y + sizeY/2
      drawMandelBrot()
    }
  }
}

function mouseReleased(){
  if(selecting){ //Click and Drag Zoom
    let pointB = [mouseX, mouseY] //Die Zweite Ecke
    //Passt die Ecken an damit sich das Bild nicht dreht
    if (pointB[0] < pointA[0]) {
      pointB[0] = pointA[0];
      pointA[0] = mouseX;
    }
    if (pointB[1] < pointA[1]) {
      pointB[1] = pointA[1];
      pointA[1] = mouseY;
    }

    //Die neuen Intervalle werden nicht direkt auf die Variabeln getan, da es sonst die Konvertierungs Funktionen "kaputt" macht
    let newxmin = pixelToRe(pointA[0])
    let newxmax = pixelToRe(pointB[0])
    let newymax = pixelToIm(pointA[1])
    let newymin = pixelToIm(pointB[1])
    xmin = newxmin
    xmax = newxmax
    ymax = newymax
    ymin = newymin

    //Aktualisiert das Foto
    drawMandelBrot();
    selecting = false;
  }
}

function keyPressed(){
  //Die ersten 4 sind für die Verschiebungen mit den Pfeiltasten
  switch(keyCode){
    case 38: //Pfeiltaste nach oben
      ymax = ymax + sizeY / zoomFactor
      ymin = ymin + sizeY / zoomFactor
      drawMandelBrot()
      break;
    case 40: //Pfeiltaste nach unten
      ymax = ymax - sizeY / zoomFactor
      ymin = ymin - sizeY / zoomFactor
      drawMandelBrot()
      break;
    case 39: //Pfeiltaste nach rechts
      xmin = xmin + sizeX / zoomFactor
      xmax = xmax + sizeX / zoomFactor
      drawMandelBrot()
      break;
    case 37: //Pfeiltaste nach links
      xmin = xmin - sizeX / zoomFactor
      xmax = xmax - sizeX / zoomFactor
      drawMandelBrot()
      break;
    case 74: //J für die Julia Sets
      if(mouseX < width && mouseY < height){ //Ob maus im Canvas ist
        if(juliaSet){ //Tut wieder das Mandelbrot auf den Canvas
          juliaCB.checked(false)
          juliaRefresh()
        }else{ //Zeichnet das Juliaset mit Mauskoordinaten als values
          juliaCB.checked(true)
          jrInput.value(pixelToRe(mouseX))
          jiInput.value(pixelToIm(mouseY))
          juliaRefresh()
        }
      }
      break;
  }
}

//Zoom mit Mausrad
function mouseWheel(event){
  //schaut ob Maus im Canvas ist
  if(mouseX < width && mouseY < height){
    //Macht ein Verhöltnis aus der Mausposition um auf den richtigen Punkt zu zoomen
    let xRatio = mouseX / width
    let yRatio = mouseY / height
    //Zoomt rein, Math.sign damit es nicht zu stark auf einmal reinzoomt (führt zu Fehlern), multiplikation am Ende um es zu verschnellern
    xmin = xmin + sizeX / zoomFactor * xRatio * -Math.sign(event.delta) * 2
    xmax = xmax - sizeX / zoomFactor * (1-xRatio) * -Math.sign(event.delta) * 2
    ymin = ymin + sizeY / zoomFactor * (1-yRatio) * -Math.sign(event.delta) * 2
    ymax = ymax - sizeY / zoomFactor * yRatio * -Math.sign(event.delta) * 2
    drawMandelBrot()
  }
  return false; //Laut der P5 Documentation sollte das zur Sicherheit stehen
}

//Zentriert das Mandelbrot
function center(){
  //Juliaset sind standardmässig xmin und max anders als beim Mandelbrot
  xmin = juliaSet ? -1.5 : -2
  xmax = juliaSet ? 1.5 : 1
  ymin = -1;
  ymax = 1;
  drawMandelBrot()
}

//Zoomt mit den Knöpfen
function buttonZoom(direction){
  //direction = -1 bedeutet rauszoomen, = 1 bedeutet reinzoomen
  xmin = xmin + sizeX / zoomFactor * direction
  xmax = xmax - sizeX / zoomFactor * direction
  ymin = ymin + sizeY / zoomFactor * direction
  ymax = ymax - sizeY / zoomFactor * direction
  drawMandelBrot()
}

//Änderung des schwellenwerts
function swChange(){
  let newSw = Math.abs(int(swInput.value())) //damit negative Zahlen zu positive gemacht werden und keine Kommazahlen stehen
  schwellenwert = newSw;
  drawMandelBrot()
  swInput.value(newSw) //input wird aktualisiert mit der korrigierten Zahl
}

//Änderung der Grenze
function lChange(){
  let newL = Math.abs(lInput.value()) //damit negative Zahlen zu positive gemacht werden
  limit = newL;
  drawMandelBrot()
  lInput.value(newL) //input wird aktualisiert mit der korrigierten Zahl
}

//Änderung der Pfadmenge
function pChange(){
  let newP = Math.abs(int(pInput.value())) //damit negative Zahlen zu positive gemacht werden und keine Kommazahlen stehen
  if(newP == 0) newP = 1; //Die Zahl kann nicht 0 sein
  pathLength = newP;
  pInput.value(newP) //input wird aktualisiert mit der korrigierten Zahl
}

//ändert die Intervalle per Inputs
function changeIntervals(){
  //schaut ob die Zahlen in korrekter Reihenfolge sind, damit sich das Bild nicht dreht
  if(float(xminInput.value()) > float(xmaxInput.value())){
    let temp = xmaxInput.value() //speichert den Wert in einer temporären Variable, da der Wert sonst verloren geht wenn man value ändert
    xmaxInput.value(xminInput.value())
    xminInput.value(temp)
  }
  if(yminInput.value() > ymaxInput.value()){
    let temp = ymaxInput.value() //speichert den Wert in einer temporären Variable, da der Wert sonst verloren geht wenn man value ändert
    ymaxInput.value(yminInput.value())
    yminInput.value(temp)
  }
  //ändert die Intervalle
  xmin = float(xminInput.value())
  xmax = float(xmaxInput.value())
  ymin = float(yminInput.value())
  ymax = float(ymaxInput.value())
  drawMandelBrot()
}

//Korrigiert die Seitenverhältnisse
function fixRatio(){
  let cWidth = sizeY * 1.5; //Berechnet neuen width aus mit Hilfe der Höhe und des Verhältnis
  xmax = xmin + cWidth
  drawMandelBrot()
}

//Aktualisiert oder de/aktiviert die Julia sets
function juliaRefresh(){
  //Holt values von den Inputs und tuts in die Variablen
  juliaSet = juliaCB.checked()
  jrValue = float(jrInput.value())
  jiValue = float(jiInput.value())
  center() //Zentriert es wieder
}

//Berechnet die Farbveränderung durch den Slider bei der RGB Färbung
function calculateFadeColor(value){
	//value = Wert aus dem Array
  let calculation = 255 - (colors.f - (255 - value)) //Rechnung wird unten oft gebraucht, also wird es hier einmal ausgerechnet
  //Wenn value + f grösser als 255 ist, wird der Betrag, der über 255 ist, wieder subtrahiert. Sobald es null erreicht wird es wieder addiert.
  return value+colors.f > 255 ? calculation < 0 ? -calculation : calculation : value + colors.f
}

//gibt die Farbe zurück für die RGB Färbung, i wird bei drawMandelBrot() ausgerechnet
function colormapping(i){
  let converted = i/50 //i ist maximal 16*50, also verteilt es hier an 50 um eine Zahl zwischen 0 und 16 zu bekommen
  if(converted == int(converted)){
     //wenn die Zahl keine Kommazahlen hat wird es direkt zurückgegeben, da es sonst im Code unten zu Probleme führt
    return color(calculateFadeColor(rColor[converted]), calculateFadeColor(gColor[converted]), calculateFadeColor(bColor[converted]))
  }else{
    let lower = floor(converted) //runter gerundet
    let upper = ceil(converted) //auf gerundet
    //mapt die Zahl an den Werten in den Arrays
    let r = map(converted, lower, upper, calculateFadeColor(rColor[lower]), calculateFadeColor(rColor[upper%16]))
    let g = map(converted, lower, upper, calculateFadeColor(gColor[lower]), calculateFadeColor(gColor[upper%16]))
    let b = map(converted, lower, upper, calculateFadeColor(bColor[lower]), calculateFadeColor(bColor[upper%16]))
    return color(r, g, b)
  }
}

//Die Nächsten 4 Funktionen sind um Pixel in Komplexezahlen umzuwandeln und umgekehrt
//Realteil als parameter und Pixel wird returned
function realToPixel(r) {
  return map(r, xmin, xmax, 0, width)
}

//Imaginärteil als parameter und Pixel wird returned
function imToPixel(i) {
  return map(i, ymax, ymin, 0, height)
}

//Pixel als parameter und Realteil wird returned
function pixelToRe(p) {
  return map(p, 0, width, xmin, xmax)
}

//Pixel als parameter und Imaginärteil wird returned
function pixelToIm(p) {
  return map(p, 0, height, ymax, ymin)
}

//Funktion um einfacher ein html Text zu erstellen
function htmlText(text, xPos, yPos, bold = false){
  //text = anzuzeigender Text, Pos = position, bold = fettgeschrieben oder nicht
  let t = createP(text)
  div.child(t)
  t.position(xPos, yPos)
  t.style("font-family", "Arial")
  if(bold) t.style("font-weight", "bold")
}

//Funktion um einfacher ein html Button zu erstellen
function htmlButton(text, xPos, yPos, callFunction){
  //text = anzuzeigender Text, Pos = position, callFunction = zu aufrufende Funktion
  let b = createButton(text)
  div.child(b)
  b.position(xPos, yPos)
  b.mousePressed(callFunction)
  b.style("font-family", "Arial")
  b.style("cursor", "pointer")
}

//Funktion um einfacher ein html Input zu erstellen
function htmlInput(value, xPos, yPos){
  //input = Wert, Pos = position
  let i = createInput(value, "number")
  div.child(i)
  i.position(xPos, yPos)
  i.style("font-family", "Arial")
  return i;
}

//Funktion um einfacher ein html Slider zu erstellen
function htmlSlider(min, max, value, step, xPos, yPos){
  //min = minimal Wert, max = maximal Wert, value = Wert, step = Schritt, Pos = position
  let s = createSlider(min, max, value, step)
  div.child(s)
  s.position(xPos, yPos)
  s.style("-webkit-appearance", "none")
  s.style("border-radius", "10px")
  s.style("border", "1px solid black")
  s.input(sliderChange)
  return s;
}

//Funktion um einfacher eine html Checkbox zu erstellen
function htmlCheck(name, value, xPos, yPos){
  //name = name, value = Wert, Pos = position
  let c = createCheckbox(name, value)
  div.child(c)
  c.position(xPos, yPos)
  c.style("font-family", "Arial")
  return c;
}

//Aktualisiert die Sliderfarben bei veränderungen
function sliderChange(){
  //ändert Farben variablen
  colors.h = hSlider.value()
  colors.s = sSlider.value()
  colors.b = bSlider.value()
  colors.f = fSlider.value()
  //färbt die Slider
  //beim hue wird 20 abgezogen da bei der tatsächlichen Färbung meistens ca. 20 abgezogen wird
  hSlider.style("background", "hsl(" + (colors.h - 20) + ", 100%, 50%)")
  sSlider.style("background", "hsl(" + (colors.h - 20) + ", " + colors.s + "%, 50%)")
  let b = (colors.b/bLimit)*255; //b wird auf eine Zahl zwischen 0 und 255 gerechnet
  bSlider.style("background", "rgb("+b+","+b+","+b+")");
  //Für den Farbverlauf des Slider werden alle Farben in den 3 Arrays als Farbverläufe gebraucht, loop damit man nicht alles von Hand schreiben muss
  let gradientText = "linear-gradient(to right"
  for(let i = 0; i < rColor.length; i++){
    gradientText += ", rgb("+calculateFadeColor(rColor[i])+","+calculateFadeColor(gColor[i])+","+calculateFadeColor(bColor[i])+")"
  }
  gradientText += ")"
  fSlider.style("background", gradientText)
}

//Klasse für die Komplexenzahlen
class ComplexNumber {
  constructor(re, im) {
    //re = realteil, im = imaginärteil
    this.re = re;
    this.im = im;
  }

  //Gibt den Betrag zurück
  abs() {
    return Math.sqrt(this.re ** 2 + this.im ** 2)
  }

  //addiert eine Komplexe Zahl z zu der Komplexen Zahl
  add(z) {
    this.re += z.re;
    this.im += z.im;
  }

  //Multipliziert die Komplexe Zahl mit z
  multiply(z) {
    let x = this.re * z.re - this.im * z.im;
    let y = this.re * z.im + this.im * z.re;
    this.re = x;
    this.im = y;
  }

  //Quadriert
  square() {
    this.multiply(this);
  }
}

//Blockiert das Bewegen der Seite mit den Pfeiltasten damit man das Mandelbrot bewegen kann ohne dass die Seite sich bewegt
//https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser/8916697 , von user "Zeta"
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
