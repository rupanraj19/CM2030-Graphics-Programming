// <--------------------------------------------------- TABLE ------------------------------------------>
var tableWidth, tableHeight, ballDiameter, pocketSize;
var tableWalls = [];
var cushionWalls = [];
var holes;

function calculateTablesize()
{
    tableWidth = 600;
    tableHeight = tableWidth/2;
    ballDiameter = tableWidth/36;
    pocketSize = 1.5 * ballDiameter;
}

function tableWall(x,y,w,h,options)
{
  this.body = Bodies.rectangle(x,y,w,h,options);
  World.add(engine.world, this.body);
}

function setupTable()
{
    var options = { isStatic: true };
    var wall1 = new tableWall(width/2-tableWidth/4, height/2-tableHeight/2, tableWidth/2-25,tableHeight/18,options);
    var wall2 = new tableWall(width/2-tableWidth/4, height/2+tableHeight/2, tableWidth/2-25, tableHeight/18,options);
    var wall3 = new tableWall(width/2-tableWidth/2, height/2, tableHeight/18, tableHeight-25,options);
    var wall4 = new tableWall(width/2+tableWidth/2, height/2, tableHeight/18, tableHeight-25,options);
    var wall5 = new tableWall(width/2+tableWidth/4, height/2-tableHeight/2, tableWidth/2-25,tableHeight/18,options);
    var wall6 = new tableWall(width/2+tableWidth/4, height/2+tableHeight/2, tableWidth/2-25, tableHeight/18,options);
    tableWalls.push(wall1,wall2,wall3,wall4,wall5,wall6);
   
    var trapezoidOptions = { isStatic: true};
    var trapezoid1 = Bodies.trapezoid(width/2-tableWidth/4.1, height/2-tableHeight/2.15, tableWidth/2-67,tableHeight/38,-0.1, trapezoidOptions);
    var trapezoid2 = Bodies.trapezoid(width/2+tableWidth/4.1, height/2-tableHeight/2.15, tableWidth/2-67,tableHeight/38,-0.1, trapezoidOptions);
    var trapezoid3 = Bodies.trapezoid(width/2-tableWidth/4.1, height/2+tableHeight/2.15, tableWidth/2-47,tableHeight/38,0.1, trapezoidOptions);
    var trapezoid4 = Bodies.trapezoid(width/2+tableWidth/4.1, height/2+tableHeight/2.15, tableWidth/2-47,tableHeight/38,0.1, trapezoidOptions);     
    trapezoid5Vertices=[
      {x:width/2+tableWidth/2.05, y:height/2-tableHeight/2.35},
      {x:width/2+tableWidth/2, y:height/2-tableHeight/2.6},
      {x:width/2+tableWidth/2, y:height/2+tableHeight/2.6},
      {x:width/2+tableWidth/2.05, y:height/2+tableHeight/2.35}
    ]
    trapezoid6Vertices=[
      {x:width/2-tableWidth/2.05, y:height/2-tableHeight/2.35},
      {x:width/2-tableWidth/2, y:height/2-tableHeight/2.6},
      {x:width/2-tableWidth/2, y:height/2+tableHeight/2.6},
      {x:width/2-tableWidth/2.05, y:height/2+tableHeight/2.35}
    ]
    var trapezoid5 = Bodies.fromVertices(width / 2 - tableWidth / 2.09, height / 2, trapezoid5Vertices, trapezoidOptions);     
    var trapezoid6 = Bodies.fromVertices(width / 2 + tableWidth / 2.09, height / 2, trapezoid6Vertices, trapezoidOptions);
    cushionWalls.push(trapezoid1, trapezoid2, trapezoid3, trapezoid4, trapezoid5, trapezoid6);

    World.add(engine.world, cushionWalls);
}


function drawTable()
{
    push()
    // <-----------------------------GREEN CUSHION----------------------->
    fill("#1E5128");
    rect(width/2-tableWidth/2,height/2-tableHeight/2,tableWidth,tableHeight)
    
    // <--------------------------TABLE WALLS---------------------------->
    fill("#3D0000");  
    for(var i=0; i< tableWalls.length; i++)
    {
      drawVertices(tableWalls[i].body.vertices);
    }

    //<-------------------------------CUSHION BUMPERS-------------------------------->
    fill("#142116"); 
    for (var i = 0; i < cushionWalls.length; i++) {
      drawVertices(cushionWalls[i].vertices);
    }

    // <-------------------------------POCKETS BORDER----------------------------->
    fill("#FFFF00");
    rectMode(CENTER)
    rect(width/2+tableWidth/2, height/2+tableHeight/2,30,25);
    rect(width/2+tableWidth/2, height/2-tableHeight/2,25,25);
    rect(width/2, height/2+tableHeight/2,25,25);
    rect(width/2, height/2-tableHeight/2,25,25);
    rect(width/2-tableWidth/2, height/2+tableHeight/2,25,25);
    rect(width/2-tableWidth/2, height/2-tableHeight/2,25,25);

    // <----------------------------ARC & LINE-------------------------->
    stroke(255);
    noFill();
    line(width/2 - tableWidth/4, height/2 - tableHeight/2.2, width/2-tableWidth/4, height/2+tableHeight/2.2 )
    angleMode(DEGREES)
    arc(width/2 - tableWidth / 4, height/2, 120,120, 90,270);
    noStroke()
    pop()

    // <---------------------------------POCKETS------------------------->
    for (var i = 0; i < holes.length; i++) {
      pocket(holes[i].x, holes[i].y, pocketSize)
    }
}



function pocket(x,y,pocketSize) 
{
  fill(0);
  ellipse(x,y,pocketSize);
}

function setupPocket()
{
  holes = [
      {x:width/2 , y:height/2+tableHeight/2-5},
      {x:width/2 + tableWidth/2 -5 , y:height/2 + tableHeight/2-5},
      {x:width/2 - tableWidth / 2 + 5, y: height/2 + tableHeight/2 - 5},
      {x:width/2, y:height/2 - tableHeight/2+5},
      {x:width/2 - tableWidth/2+5, y:height/2 - tableHeight/2+5},
      {x:width/2 + tableWidth / 2 -5 , y:height/2 - tableHeight/2+5}

  ];
}

