// taille de l'écran
let H = window.innerHeight;
let W = window.innerWidth;

// taille et selection des zones
let collisionZone = document.getElementById("collisionZone");
// let collisionZoneP = document.getElementById("collisionZoneP");
let playerZone = document.getElementById("playerZone");
let playZone = document.getElementById("playZone");
collisionZone.height = H;
collisionZone.width = W;
// collisionZoneP.height = H;
// collisionZoneP.width = W;
playerZone.height = H;
playerZone.width = W;
playZone.height = H;
playZone.width = W;

// variables de contexte
let ctxCollisionZone = collisionZone.getContext("2d");
// let ctxCollisionZoneP = collisionZoneP.getContext("2d");
let ctxPlayerZone = playerZone.getContext("2d");
let ctxPlayZone = playZone.getContext("2d");

// background sprite
const bgCollisions = new Image();
bgCollisions.src = "img/hitboxBackground.png";
let bgSpritex = 0;
let bgSpritey = 0;
let bgSpriteSizex = 2500;
let bgSpriteSizey = H;

// player
let pHeight = 55;
let pWidth = 45;
let px = 100;
let py = H - 100 - pHeight;

// pixels player
let ppx1 = 0;
let bottomLeftPx = 0;
let ppx2 = 0;
let bottomRightPx = 0;
let ppx3 = 0;
let middleLeftPx = 0;
let ppx4 = 0;
let middleRightPx = 0;
let ppx5 = 0;
let topLeftPx = 0;
let ppx6 = 0;
let topRightPx = 0;
let ppx7 = 0;
let bottomLeftSidePx = 0;
let ppx8 = 0;
let bottomRightSidePx = 0;
let ppx9 = 0;
let bottomLeftPx2 = 0;
let ppx10 = 0;
let bottomRightPx2 = 0;

let pvx = 350;
let pvy = 0;

let pay = 0;
let aJump = 1000;
let falling = false;

let moveRight = false;
let moveLeft = false;
let jumping = false;
let keys = [];

let gravity = 2600;

let bumpJump = 1700;

// box
let boxpx = 1520;
let boxpy = 50;
let boxHeight = 100;
let boxWidth = 150;
let boxvx = 0;
let boxvy = 0;

// pixels boite
let ppxBox1 = 0;
let bottomLeftBoxPx = 0;
let ppxBox2 = 0;
let bottomRightBoxPx = 0;
let ppxBox3 = 0;
let bottomLeftBoxPx2 = 0;
let ppxBox4 = 0;
let bottomRightBoxPx2 = 0;

let oldBgx = 0;
let newBgx = 0;
let boxdpx = 0;

let boxpay = 0;

let t0 = performance.now();
let t1 = 0;
let dt = 0;


function game() {

    variablesTemps();

    affichage();

    player();

    box();

    bumper();

    window.addEventListener("click", initJump);

    window.addEventListener("keydown", startMoving);
    window.addEventListener("keyup", stopMoving);

    window.requestAnimationFrame(game);
}

game();

function variablesTemps(){
    t1 = performance.now();
    dt = (t1 - t0) / 1000;
    t0 = performance.now();
}

function affichage()
{
    ctxCollisionZone.clearRect(0, 0, W, H);
    ctxPlayerZone.clearRect(0, 0, W, H);
    ctxPlayZone.clearRect(0, 0, W, H);

    // player
    ctxCollisionZone.fillStyle = "black";
    ctxCollisionZone.fillRect(px, py, pWidth, pHeight);

    // box
    ctxCollisionZone.fillStyle = "rgb(255, 126, 0)";
    ctxCollisionZone.fillRect(boxpx, boxpy, boxWidth, boxHeight);

    // fond
    ctxCollisionZone.drawImage(bgCollisions, bgSpritex, bgSpritey, bgSpriteSizex, bgSpriteSizey);
}

function initJump()
{
    if (pvy == 0)
        pvy = -aJump;  // Impulsion de saut fixe (indépendante du dt)
}

function bumper()
{
    if ((pvy == 0 &&
        bottomLeftPx[0]  == 255 && 
        bottomLeftPx[1]    == 255 && 
        bottomLeftPx[2]    == 0 ||
        bottomRightPx[0]   == 255 &&
        bottomRightPx[1]   == 255 && 
        bottomRightPx[2]   == 0) ||
        (pvy == 0 &&
        bottomLeftSidePx[0]  == 255 && 
        bottomLeftSidePx[1]    == 255 && 
        bottomLeftSidePx[2]    == 0 ||
        bottomRightSidePx[0]   == 255 &&
        bottomRightSidePx[1]   == 255 && 
        bottomRightSidePx[2]   == 0)
    )
        pvy = -bumpJump;
}

function player()
{
    ppx1 = ctxCollisionZone.getImageData((px + 1), (py + pHeight + 1), 1, 1);
    bottomLeftPx = ppx1.data;
    ppx2 = ctxCollisionZone.getImageData((px + pWidth - 1), (py + pHeight + 1), 1, 1);
    bottomRightPx = ppx2.data;

    ppx3 = ctxCollisionZone.getImageData((px - 1), (py + (pHeight / 2)), 1, 1);
    middleLeftPx = ppx3.data;
    ppx4 = ctxCollisionZone.getImageData((px + pWidth + 1), (py + (pHeight / 2)), 1, 1);
    middleRightPx = ppx4.data;

    ppx5 = ctxCollisionZone.getImageData(px, (py - 1), 1, 1);
    topLeftPx = ppx5.data;
    ppx6 = ctxCollisionZone.getImageData((px + pWidth), (py - 1), 1, 1);
    topRightPx = ppx6.data;

    ppx7 = ctxCollisionZone.getImageData((px - 1), (py + pHeight - 5), 1, 1);
    bottomLeftSidePx = ppx7.data;
    ppx8 = ctxCollisionZone.getImageData((px + pWidth + 1), (py + pHeight - 5), 1, 1);
    bottomRightSidePx = ppx8.data;

    // if (jumping){
        // pay = gravity - aJump;
    // }
    // else
        pay = gravity;

    if (!(bottomLeftPx[0]  == 255 && // vérification si sur du rouge (plateforme)
    bottomLeftPx[1]    == 0 && 
    bottomLeftPx[2]    == 0 ||
    bottomRightPx[0]   == 255 &&
    bottomRightPx[1]   == 0 && 
    bottomRightPx[2]   == 0 ||
    bottomLeftPx[0]  == 255 && // vérification si sur du jaune (jump)
    bottomLeftPx[1]    == 255 && 
    bottomLeftPx[2]    == 0 ||
    bottomRightPx[0]   == 255 &&
    bottomRightPx[1]   == 255 && 
    bottomRightPx[2]   == 0 ||
    bottomLeftPx[0]  == 255 && // vérification si sur du orange (box)
    bottomLeftPx[1]    == 126 && 
    bottomLeftPx[2]    == 0 ||
    bottomRightPx[0]   == 255 &&
    bottomRightPx[1]   == 126 && 
    bottomRightPx[2]   == 0)){
        if (py < 0)
            pvy = pay * dt;
        else
            pvy += pay * dt;
    }
    else if (pvy > 0){
        pvy = 0;

        // verification des pixels
        ppx9 = ctxCollisionZone.getImageData((px + 1), (py + pHeight), 1, 1);
        bottomLeftPx2 = ppx9.data;
        ppx10 = ctxCollisionZone.getImageData((px + pWidth - 1), (py + pHeight), 1, 1);
        bottomRightPx2 = ppx10.data;

        // remonte le personnage sur la plateforme
        while ((bottomLeftPx2[0]  == 255 && // vérification si sur du rouge (plateforme)
        bottomLeftPx2[1]    == 0 && 
        bottomLeftPx2[2]    == 0) ||
        (bottomRightPx2[0]   == 255 &&
        bottomRightPx2[1]   == 0 && 
        bottomRightPx2[2]   == 0) ||
        (bottomLeftPx2[0]  == 255 && // vérification si sur du orange (box)
        bottomLeftPx2[1]    == 126 && 
        bottomLeftPx2[2]    == 0) ||
        (bottomRightPx2[0]   == 255 &&
        bottomRightPx2[1]   == 126 && 
        bottomRightPx2[2]   == 0)){
            py -= 1;

            // reverifie les pixels
            ppx9 = ctxCollisionZone.getImageData((px + 1), (py + pHeight), 1, 1);
            bottomLeftPx2 = ppx9.data;
            ppx10 = ctxCollisionZone.getImageData((px + pWidth - 1), (py + pHeight), 1, 1);
            bottomRightPx2 = ppx10.data;
        }
    }

    py += pvy * dt;

    playerMove();
}

function box()
{
    ppxBox1 = ctxCollisionZone.getImageData(boxpx, (boxpy + boxHeight + 1), 1, 1);
    bottomLeftBoxPx = ppxBox1.data;
    ppxBox2 = ctxCollisionZone.getImageData((boxpx + boxWidth), (boxpy + boxHeight + 1), 1, 1);
    bottomRightBoxPx = ppxBox2.data;


    boxay = gravity;


    if (!(bottomLeftBoxPx[0]  == 255 && // vérification si sur du rouge (plateforme)
    bottomLeftBoxPx[1]    == 0 && 
    bottomLeftBoxPx[2]    == 0 ||
    bottomRightBoxPx[0]   == 255 &&
    bottomRightBoxPx[1]   == 0 && 
    bottomRightBoxPx[2]   == 0 || 
    boxpx > W || 
    boxpx < 0 || 
    (boxpy + boxHeight) >= H)){
        boxvy += boxay * dt;
    }
    else if (boxvy > 0){
        boxvy = 0;

        ppxBox3 = ctxCollisionZone.getImageData(boxpx, (boxpy + boxHeight), 1, 1);
        bottomLeftBoxPx2 = ppxBox3.data;
        ppxBox4 = ctxCollisionZone.getImageData((boxpx + boxWidth), (boxpy + boxHeight), 1, 1);
        bottomRightBoxPx2 = ppxBox4.data;

        while (bottomLeftBoxPx2[0]  == 255 && // vérification si sur du rouge (plateforme)
        bottomLeftBoxPx2[1]    == 0 && 
        bottomLeftBoxPx2[2]    == 0 ||
        bottomRightBoxPx2[0]   == 255 &&
        bottomRightBoxPx2[1]   == 0 && 
        bottomRightBoxPx2[2]   == 0 || 
        (boxpy + boxHeight) >= H){
            boxpy -= 1;

            ppxBox3 = ctxCollisionZone.getImageData(boxpx, (boxpy + boxHeight), 1, 1);
            bottomLeftBoxPx2 = ppxBox3.data;
            ppxBox4 = ctxCollisionZone.getImageData((boxpx + boxWidth), (boxpy + boxHeight), 1, 1);
            bottomRightBoxPx2 = ppxBox4.data;
        }
    }

    boxpy += boxvy * dt;

    if (moveRight == true && bgSpritex > -2500 + W + 10 && moveRight == true && px >= 100){
        // px += pvx * dt;
        boxpx -= pvx * dt;
    }
    else if (moveRight == true && bgSpritex <= -2500 + W + 10 || moveRight == true && px < 100){
        // px += pvx * dt;
    }

    if (moveLeft == true && bgSpritex < 0  && moveLeft == true && px <= 100){
        // px -= pvx * dt;
        boxpx += pvx * dt;
    }
}

function startMoving(event)
{
    let index = keys.indexOf(event.key);
    if (index > -1){
        return;
    }
    else {
        keys.push(event.keys);
        switch(event.key){
            case "ArrowRight":
                moveRight = true;
                break;
            case "ArrowLeft":
                moveLeft = true;
                break;
        }
    }   
}

function stopMoving(event)
{
    let index = keys.indexOf(event.key);
    if (index >= -1){
        keys.splice(index, 1);
    }

    switch(event.key){
        case "ArrowRight":
            moveRight = false;
            break;
        case "ArrowLeft":
            moveLeft = false;
            break;
    }
}

function playerMove()
{
    if (bottomLeftSidePx[0]  == 255 && // vérification si sur du rouge (plateforme)
        bottomLeftSidePx[1]    == 0 && 
        bottomLeftSidePx[2]    == 0 ||
        middleLeftPx[0]  == 255 &&
        middleLeftPx[1]    == 0 && 
        middleLeftPx[2]    == 0 ||
        topLeftPx[0]  == 255 &&
        topLeftPx[1]    == 0 && 
        topLeftPx[2]    == 0)
        moveLeft = false;
    else if (bottomLeftSidePx[0]  == 255 && // vérification si sur du orange (box)
        bottomLeftSidePx[1]    == 126 && 
        bottomLeftSidePx[2]    == 0 ||
        middleLeftPx[0]  == 255 &&
        middleLeftPx[1]    == 126 && 
        middleLeftPx[2]    == 0 ||
        topLeftPx[0]  == 255 &&
        topLeftPx[1]    == 126 && 
        topLeftPx[2]    == 0)
        moveLeft = false;

    if (bottomRightSidePx[0]  == 255 && // vérification si sur du rouge (plateforme)
        bottomRightSidePx[1]    == 0 && 
        bottomRightSidePx[2]    == 0 ||
        middleRightPx[0]  == 255 &&
        middleRightPx[1]    == 0 && 
        middleRightPx[2]    == 0 ||
        topRightPx[0]  == 255 &&
        topRightPx[1]    == 0 && 
        topRightPx[2]    == 0)
        moveRight = false;
    else if (bottomRightSidePx[0]  == 255 && // vérification si sur du orange (box)
        bottomRightSidePx[1]    == 126 && 
        bottomRightSidePx[2]    == 0 ||
        middleRightPx[0]  == 255 &&
        middleRightPx[1]    == 126 && 
        middleRightPx[2]    == 0 ||
        topRightPx[0]  == 255 &&
        topRightPx[1]    == 126 && 
        topRightPx[2]    == 0)
        if (moveRight == true){
            bgSpritex -= (pvx / 2) * dt;
            boxpx += (pvx / 2) * dt;
            moveRight = false;
        }
        else
            moveRight = false;

    if (moveRight == true && bgSpritex > -2500 + W + 10 && moveRight == true && px >= 100){
        // px += pvx * dt;
        bgSpritex -= pvx * dt;
    }
    else if (moveRight == true && bgSpritex <= -2500 + W + 10 || moveRight == true && px < 100){
        // console.log("tf", px, W - pWidth);
        if (px < W - pWidth)
            px += pvx * dt;
        else
            px += W - pWidth;
    }

    if (moveLeft == true && bgSpritex < 0  && moveLeft == true && px <= 100){
        // px -= pvx * dt;
        bgSpritex += pvx * dt;
    }
    else if (moveLeft == true && bgSpritex >= 0 || moveLeft == true && px > 100){
        if (px > 0)
            px -= pvx * dt;
        else
            px = 0;
    }
}


// données gyroscope et variables de mouvement
// function playerControl(event)
// {
//     let gamma = event.gamma;
//     let beta = event.beta;
//     // console.log(gamma, beta);
//     // activer mouvement
//     if (gamma > gammaMove)
//         moveRight = true;
//     if (gamma < -gammaMove)
//         moveLeft = true;
//     if (beta < betaForwMove)
//         moveForward = true;
//     if (beta > betaBackMove)
//         moveBack = true;
//     // desactiver mouvement
//     if (gamma < gammaMove)
//         moveRight = false;
//     if (gamma > -gammaMove)
//         moveLeft = false;
//     if (beta > betaForwMove)
//         moveForward = false;
//     if (beta < betaBackMove)
//         moveBack = false;
// }
