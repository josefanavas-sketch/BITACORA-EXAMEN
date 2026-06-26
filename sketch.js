// VARIABLES GENERALES
let ImagenBosque;
let ImagenLaberinto;
let ImagenInstrucciones;

// Coordenadas fijas que da inicio al recorrido de la abeja
let x = 190;
let y = 710;

// Sistema de 4 Estados (0: Inicio, 1: Laberinto, 2: Instrucción Ojos, 3: Ojos)
let estado = 0; //significa que comienza en el 0

// Variables de color para el código de los ojos
let cafe, negro, blanco, verde, azul, yellow;

function preload() {
  ImagenBosque = loadImage("imagen.1.jpg"); // Imagen inicial
  ImagenLaberinto = loadImage("imagen.2.png"); // Imagen laberinto creada con IA

  ImagenInstrucciones = loadImage("imagen.3.jpg"); //imagen con movimiento
  ImagenPastel = loadImage("imagen.4.png"); //imagen fondo de ojos Pooh
}

function setup() {
  createCanvas(800, 800);

  //colores de los ojos
  negro = color(0); //pupilas 
  blanco = color(255); //borde externo fijo
  cafe = color(113, 97, 91); //colores que cambian 
  verde = color(75, 205, 91);
  azul = color(115, 165, 195);
  yellow = color(215, 165, 70);

}

function draw() {
  if (estado === 0) {
    //define la separacion de "escenas" y el triple signo es "solo pasa si..."

    // ESTADO 0: PANTALLA INICIAL
    image(ImagenBosque, 0, 0, width, height);

    let abejaX = random(10, width); //10 indica la base de donde comienza el movimiento para que sea en todo el lienzo desde el pixel 10 
    let abejaY = random(10, height); //height y width es el tamaño del lienzo 
    textSize(50); //tamaño de la abeja 
    text("🐝", abejaX, abejaY); //vertical y  horizontal

    fill(25);
    textSize(50);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("Haz click para comenzar", width / 2, height / 2);

    InfoPersonal(); 
  } else if (estado === 1) {
    // ESTADO 1: EL LABERINTO
    image(ImagenLaberinto, 0, 0, width, height);

    textSize(40); //tamaño de abeja
    textAlign(CENTER, CENTER);
    text("🐝", x, y);

    // Instrucciones inferiores
    textSize(18);
    rectMode(CENTER);
    fill(255, 255, 250, 210);
    rect(width / 2, height - 30, 520, 50, 40);
    fill(10);
    text(
      "usa las flechas para moverte | Haz CLICK para continuar",
      width / 2,
      height - 30
    );
  } else if (estado === 2) {
    // ESTADO 2: PANTALLA INSTRUCCIONES INTERACTIVA
    let offsetX = mouseX / 15; //desplazamientos
    let offsetY = mouseY / 15;

    tint(240, 100, 200, 200);
    image(ImagenInstrucciones, 0, 0, width, height);
    blendMode(ADD);
    tint(0, 230, 255, 120);
    image(ImagenInstrucciones, -offsetX, -offsetY, width, height);
    blendMode(BLEND);
    noTint(); //evita afectar a la proxima capa con el color celeste

    textSize(40);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    text(
      "Haz click para pasar a la proxima imagen",
      width / 2,
      height / 2 - 40
    );

    fill(214, 186, 242);
    stroke(40, 30, 25);
    strokeWeight(3);
    textStyle(BOLDITALIC);
    text("MUEVE EL MOUSE :)!!!", width / 2, height / 2 + 30);
  } else if (estado === 3) {
    // ESTADO 3: OJOS INTERACTIVOS
    background(ImagenPastel);

    // Cuadrícula de repetición
    for (let Yojo = 40; Yojo < height; Yojo += 80) {
      //X - Y son las filas y columnas para evitar repeticion.
      for (let Xojo = 40; Xojo < width; Xojo += 80) {
        //40 es el punto de partida, 80 es la distancia de separacion entre ojos.
        dibujarOjo(Yojo, Xojo); //contiene todos los ojos por completo
      }
    }
  }
}

function dibujarOjo(pos_x, pos_y) {
  //funcion para que el programa entienda que hablamos de los ojos.
  strokeWeight(0.2);

  // Capa blanca (fija)
  fill(blanco);
  ellipse(pos_x, pos_y, 67, 67);

  //  COLOR DEL IRIS
  let colorIris;

  // 400 como divicion del lienzo
  if (mouseX < 400 && mouseY < 400) {
    colorIris = verde;
  } else if (mouseX >= 400 && mouseY < 400) {
    colorIris = cafe;
  } else if (mouseX < 400 && mouseY >= 400) {
    //$ entiende que ambas cosas tienen que ser ciertas para ejecutarse.
    colorIris = azul;
  } else {
    colorIris = yellow;
  }

  // Iris dinamico por movimiento
  fill(colorIris);
  ellipse(pos_x, pos_y, 57, 57); //tamaño de elipse 

 
  let angulo = atan2(mouseY - pos_y, mouseX - pos_x); //atan maneja la mirada del cursor, resiviendo info por separado y logra mejor cohrdinacion de ubicacion.
  let distanciaMax = 8; //mantiene la pupila en el los circulos de los ojos.

  //angulos de la mirada.
  let pupilaX = pos_x + cos(angulo) * distanciaMax; //eje horizontal
  let pupilaY = pos_y + sin(angulo) * distanciaMax; //eje vertical

  let d = dist(mouseX, mouseY, pos_x, pos_y); //posicion del mouse y centro del ojo,
  let tamanoPupila = map(d, 0, 800, 10, 40, true);
  //0-800 valor minimo y maximo para movimiento
  //10-40 tamaño de pixeles de la pupila
  //true es pq si el valor es mayor a 800 no se deforme mas de 40

  // 3. Capa negra (Pupila móvil)
  fill(negro);
  ellipse(pupilaX, pupilaY, tamanoPupila, tamanoPupila);
}

function mousePressed() {
  // Avanza secuencialmente un estado por cada click realizado
  if (estado === 0) {
    //si estas en X cambia a Y (condicionales)
    estado = 1; // Pasa al laberinto
    console.log("Transición al Estado 1: Laberinto"); //indica comentarios de las paginas que cambian.
  } else if (estado === 1) {
    estado = 2; // Pasa a la imagen con texto
    console.log("Transición al Estado 2: Imagen e instrucciones del mouse");
  } else if (estado === 2) {
    estado = 3; // Pasa a los ojos interactivos
    console.log("Transición al Estado 3: Ojos dinámicos");
  }
}

function keyPressed() {
  //ORDENES 
  // Las flechas solo cambian coordenadas si el estado activo es el laberinto
  if (estado === 1) {
    if (keyCode === LEFT_ARROW) {
      x -= 20;
    }
    if (keyCode === RIGHT_ARROW) {
      x += 20;
    }
    if (keyCode === UP_ARROW) {
      y -= 20;
    }
    if (keyCode === DOWN_ARROW) {
      y += 20;
    }

    console.log("Posición Abeja -> X:", x, "Y:", y);
  }
}

function InfoPersonal() {
  rectMode(CENTER); //figura centrada
  fill(255, 255, 250, 210);
  rect(width / 2, height - 40, 320, 45, 40); //40 es radio de curvatura de bordes

  // Texto con datos dentro del letrero
  fill(40);
  textSize(16);
  textStyle(BOLDITALIC);
  textAlign(CENTER, CENTER);
  text("Examen Final - Josefa Navas", width / 2, height - 42);
}
