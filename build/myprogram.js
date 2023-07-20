"use strict";
// Programmer's Name: Bilal Ahmed
// Program Name: Ghosts N Aliens
//////////////////////////////////////////////////////////////////////////
/*
 * Copyright 2012, 2016, 2019, 2020 Cheng
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     https://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//import { newGQAnimation, createGroupInPlayground, createSpriteInGroup, spriteSetX, spriteSetY, spriteGetWidth, spriteGetHeight, PLAYGROUND_HEIGHT, PLAYGROUND_WIDTH, getKeyState, spriteSetAnimation, ANIMATION_HORIZONTAL, spriteSetXY, createTextSpriteInGroup, when2SpritesHit, sprite, currentDate, spriteRotate, consolePrint, } from "./libs/lib-gqguardrail-exports.ts";
//import "./libs/lib-gqguardrail-exports.ts";
// Don't edit the import lines above, or you won't be able to write your program!
// Also, do not use the following variable and function names in your own code below:
//    setup, draw, Fn
// and the other imported names above.
// Write your program below this line:
// ***********************************
let hidingSpot = 3333;
let skullHidingSpot = 1111;
let enemyGroup = "enemies";
let powerUpGroup = "powerups";
let backgrounds = {
    1: true,
    2: false,
    3: false,
    desert1: false,
    desert2: false,
    desert3: false,
    gameOver: false
};
// Characters
let playerInfo = {
    "id": "ghost",
    "height": 64,
    "width": 64,
    "xSpeed": 5,
    "ySpeed": 0,
    "xPos": PLAYGROUND_WIDTH - 64,
    "yPos": 200,
    "anim": newGQAnimation("img/ghost64by128.png", 2, 64, 500, ANIMATION_HORIZONTAL),
    "leftAnim": newGQAnimation("img/ghost-left.png"),
    "isLeft": false,
    "health": 10,
    "score": 0,
    "kills": 0,
    "timeSkullWasFired": 0,
    "timeShurikenWasFired": 0,
    "timeSinceSpecial": 0,
    "timeSinceHealthTaken": 0
};
let alienBossInfo = {
    "id": "alienBoss",
    "height": 80,
    "width": 80,
    "xSpeed": 3,
    "ySpeed": 0,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
    "anim": newGQAnimation("img/AlienBoss80by560.png", 7, 80, 142.8, ANIMATION_HORIZONTAL),
    "health": 10,
    "visible": false
};
// Clouds
let cloud1 = {
    "id": "cloud1",
    "height": 80,
    "width": 100,
    "xSpeed": 3,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
    "anim": newGQAnimation("img/cloud1.png")
};
let cloud2 = {
    "id": "cloud2",
    "height": 60,
    "width": 91,
    "xSpeed": -4.5,
    "ySpeed": 0,
    "xPos": 640,
    "yPos": 0,
    "anim": newGQAnimation("img/cloud2.png")
};
// Platforms
let platform1 = {
    "id": "platform1",
    "height": 4,
    "width": 50,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 100,
    "yPos": 320,
    "anim": newGQAnimation("img/platform1Gap.png")
};
// Powerups
let heart = {
    "id": "heart",
    "height": 40,
    "width": 40,
    "xSpeed": 4,
    "ySpeed": 3,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
    "anim": newGQAnimation("img/heartPowerup.png"),
    "timeLastSpawned": 0
};
let coin = {
    "id": "coin",
    "height": 9,
    "width": 9,
    "xSpeed": 4,
    "ySpeed": -3,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
    "anim": newGQAnimation("img/coinPowerup.png"),
    "timeLastSpawned": 0
};
// Backgrounds
let background1Info = {
    "id": "background1",
    "height": 480,
    "width": 640,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
    "anim": newGQAnimation("img/background1.png")
};
let background2Info = {
    "id": "background2",
    "height": 480,
    "width": 640,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
    "anim": newGQAnimation("img/background2.png")
};
let background3Info = {
    "id": "background3",
    "height": 480,
    "width": 640,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
    "anim": newGQAnimation("img/background3.png")
};
let splashScreenInfo = {
    "id": "splashScreen",
    "height": 480,
    "width": 640,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
    "anim": newGQAnimation("img/splashScreen.png"),
    "visible": true
};
let gameOverInfo = {
    "id": "gameOverScreen",
    "width": 640,
    "height": 480,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
};
let scoreBoardInfo = {
    "id": "scoreboard",
    "width": 102,
    "height": 50,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
};
let transparentScreenInfo = {
    "id": "transparent",
    "width": 640,
    "height": 480,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
};
let skullInfo = {
    "id": "skull",
    "width": 13,
    "height": 16,
    "xSpeed": 4,
    "ySpeed": 2,
    "xPos": skullHidingSpot,
    "yPos": skullHidingSpot,
    "anim": newGQAnimation("img/skullShoot.png"),
    "fired": false,
    "dir": ""
};
let shurikenInfo = {
    "id": "shuriken",
    "width": 13,
    "height": 12,
    "xSpeed": 4,
    "ySpeed": 2,
    "xPos": skullHidingSpot,
    "yPos": skullHidingSpot,
    "anim": newGQAnimation("img/shurikenThing.png"),
    "fired": false,
    "dir": ""
};
let aliens = [];
let typeOfEnemy = "";
let createEnemy = function () {
    let decider = Math.floor(Math.random() * 2);
    let index = aliens.length;
    let newAlienInfo = {
        "id": `xalien${index}`,
        "height": 55,
        "width": 58,
        "xSpeed": getRandomInt(2, 7),
        "ySpeed": 0,
        "xPos": 0,
        "yPos": getRandomInt(100, 350),
        "anim": newGQAnimation("img/alienSpriteSheet60by180.png", 3, 58, 333.3, ANIMATION_HORIZONTAL),
        "health": getRandomInt(2, 6)
    };
    if (decider == 1) {
        newAlienInfo["anim"] = newGQAnimation("img/Fox60by360.png");
        typeOfEnemy = "fox";
    }
    if (decider == 2) {
        newAlienInfo["anim"] = newGQAnimation("img/alienSpriteSheet60by180.png", 3, 58, 333.3, ANIMATION_HORIZONTAL);
        typeOfEnemy = "alien";
    }
    aliens[index] = newAlienInfo;
    let xalienInfo = newAlienInfo;
    createSpriteInGroup(enemyGroup, xalienInfo["id"], xalienInfo["anim"], xalienInfo["width"], xalienInfo["height"]);
    spriteSetXY(xalienInfo["id"], xalienInfo["xPos"], xalienInfo["yPos"]);
};
let alienBosses = [];
let createBoss = function () {
    let index = alienBosses.length;
    let newAlienInfo = {
        "id": `boss${index}`,
        "height": 80,
        "width": 80,
        "xSpeed": getRandomInt(2, 6),
        "ySpeed": 3,
        "xPos": getRandomInt(150, 400),
        "yPos": getRandomInt(100, 350),
        "anim": newGQAnimation("img/alienBoss80by560.png", 7, 80, 166.67, ANIMATION_HORIZONTAL),
        "health": 10
    };
    alienBosses[index] = newAlienInfo;
    let xalienInfo = newAlienInfo;
    createSpriteInGroup(enemyGroup, xalienInfo["id"], xalienInfo["anim"], xalienInfo["width"], xalienInfo["height"]);
    spriteSetX(xalienInfo["id"], xalienInfo["xPos"]);
    spriteSetY(xalienInfo["id"], xalienInfo["yPos"]);
};
let foxes = [];
let createFox = function () {
    let index = foxes.length;
    let newFoxInfo = {
        "id": `afox${index}`,
        "height": 55,
        "width": 58,
        "xSpeed": getRandomInt(3, 6),
        "ySpeed": getRandomInt(2, 6),
        "xPos": getRandomInt(100, 150),
        "yPos": getRandomInt(125, 346),
        "anim": newGQAnimation("img/Fox60by360.png"),
        "health": getRandomInt(2, 5)
    };
    foxes[index] = newFoxInfo;
    let afoxInfo = newFoxInfo;
    createSpriteInGroup(enemyGroup, afoxInfo["id"], afoxInfo["anim"], afoxInfo["width"], afoxInfo["height"]);
    spriteSetX(afoxInfo["id"], afoxInfo["xPos"]);
    spriteSetY(afoxInfo["id"], afoxInfo["yPos"]);
};
let coins = [];
let createCoin = function () {
    let index = coins.length;
    let newCoinInfo = {
        "id": `aCoin${index}`,
        "height": 9,
        "width": 9,
        "xSpeed": 4,
        "ySpeed": -3,
        "xPos": 10 + Math.random() * 60,
        "yPos": 100 + Math.random() * 200,
        "anim": newGQAnimation("img/coinPowerup.png"),
    };
    coins[index] = newCoinInfo;
    let aCoinInfo = newCoinInfo;
    createSpriteInGroup(powerUpGroup, aCoinInfo["id"], aCoinInfo["anim"], aCoinInfo["width"], aCoinInfo["height"]);
    spriteSetX(aCoinInfo["id"], aCoinInfo["xPos"]);
    spriteSetY(aCoinInfo["id"], aCoinInfo["yPos"]);
};
let hearts = [];
let createHeart = function () {
    let index = hearts.length;
    let newHeartInfo = {
        "id": `heart${index}`,
        "height": 40,
        "width": 40,
        "xSpeed": 4,
        "ySpeed": 3,
        "xPos": 100 + Math.random() * 250,
        "yPos": 100 + Math.random() * 200,
        "anim": newGQAnimation("img/heartPowerup.png"),
    };
    hearts[index] = newHeartInfo;
    let aHeartInfo = newHeartInfo;
    createSpriteInGroup(powerUpGroup, aHeartInfo["id"], aHeartInfo["anim"], aHeartInfo["width"], aHeartInfo["height"]);
    spriteSetX(aHeartInfo["id"], aHeartInfo["xPos"]);
    spriteSetY(aHeartInfo["id"], aHeartInfo["yPos"]);
};
let setup = function () {
    // Create Groups
    let bossGroup = "boss";
    let playerGroup = "ghostPlayer";
    let backgroundGroup = "backgrounds";
    let cloudGroup = "clouds";
    let platformGroup = "platform";
    let hudGroupName = "hudGroup";
    let laserGroupName = "laserGroup";
    createGroupInPlayground(backgroundGroup);
    createGroupInPlayground(laserGroupName);
    createGroupInPlayground(cloudGroup);
    createGroupInPlayground(enemyGroup);
    createGroupInPlayground(bossGroup);
    createGroupInPlayground(powerUpGroup);
    createGroupInPlayground(playerGroup);
    createGroupInPlayground(platformGroup);
    createGroupInPlayground(hudGroupName);
    // Create Sprites
    createTextSpriteInGroup(hudGroupName, scoreBoardInfo["id"], scoreBoardInfo["width"], scoreBoardInfo["height"], scoreBoardInfo["xPos"], scoreBoardInfo["yPos"]);
    createSpriteInGroup(hudGroupName, splashScreenInfo["id"], splashScreenInfo["anim"], splashScreenInfo["width"], splashScreenInfo["height"], splashScreenInfo["xPos"], splashScreenInfo["yPos"]);
    createTextSpriteInGroup(hudGroupName, gameOverInfo["id"], gameOverInfo["width"], gameOverInfo["height"], gameOverInfo["xPos"], gameOverInfo["yPos"]);
    createTextSpriteInGroup(hudGroupName, transparentScreenInfo["id"], transparentScreenInfo["width"], transparentScreenInfo["height"], transparentScreenInfo["xPos"], transparentScreenInfo["yPos"]);
    sprite(transparentScreenInfo["id"]).css("opacity", "0.0");
    sprite(transparentScreenInfo["id"]).css("font-size", "20px");
    createSpriteInGroup(backgroundGroup, background1Info["id"], background1Info["anim"], background1Info["width"], background1Info["height"], background1Info["xPos"], background1Info["yPos"]);
    createSpriteInGroup(backgroundGroup, background2Info["id"], background2Info["anim"], background2Info["width"], background2Info["height"], background2Info["xPos"], background2Info["yPos"]);
    createSpriteInGroup(backgroundGroup, background3Info["id"], background3Info["anim"], background3Info["width"], background3Info["height"], background3Info["xPos"], background3Info["yPos"]);
    createSpriteInGroup(playerGroup, playerInfo["id"], playerInfo["anim"], playerInfo["width"], playerInfo["height"], playerInfo["xPos"], playerInfo["yPos"]);
    createSpriteInGroup(laserGroupName, skullInfo["id"], skullInfo["anim"], skullInfo["width"], skullInfo["height"]);
    createSpriteInGroup(laserGroupName, shurikenInfo["id"], shurikenInfo["anim"], shurikenInfo["width"], shurikenInfo["height"]);
    createSpriteInGroup(bossGroup, alienBossInfo["id"], alienBossInfo["anim"], alienBossInfo["width"], alienBossInfo["height"], alienBossInfo["xPos"], alienBossInfo["yPos"]);
    createSpriteInGroup(powerUpGroup, heart["id"], heart["anim"], heart["width"], heart["height"], heart["xPos"], heart["yPos"]);
    createSpriteInGroup(powerUpGroup, coin["id"], coin["anim"], coin["width"], coin["height"], coin["xPos"], coin["yPos"]);
    createSpriteInGroup(cloudGroup, cloud1["id"], cloud1["anim"], cloud1["width"], cloud1["height"], cloud1["xPos"], cloud1["yPos"]);
    createSpriteInGroup(cloudGroup, cloud2["id"], cloud2["anim"], cloud2["width"], cloud2["height"], cloud2["xPos"], cloud2["yPos"]);
}; // end of setup() function. Notice the braces match!
let moveSprite = function (sprite) {
    sprite["xPos"] = sprite["xPos"] + sprite["xSpeed"];
    if (sprite["xPos"] < -1 * spriteGetWidth(sprite["id"])) {
        sprite["xPos"] = PLAYGROUND_WIDTH;
    }
    if (sprite["xPos"] > PLAYGROUND_WIDTH) {
        sprite["xPos"] = -1 * spriteGetWidth(sprite["id"]);
    }
    spriteSetX(sprite["id"], sprite["xPos"]);
    sprite["yPos"] = sprite["yPos"] + sprite["ySpeed"];
    if (sprite["yPos"] < -1 * spriteGetWidth(sprite["id"])) {
        sprite["yPos"] = PLAYGROUND_HEIGHT;
    }
    if (sprite["yPos"] > 480) {
        sprite["yPos"] = -1 * spriteGetWidth(sprite["id"]);
    }
    spriteSetY(sprite["id"], sprite["yPos"]);
};
let moveAlien = function (sprite) {
    sprite["xPos"] = sprite["xPos"] + sprite["xSpeed"];
    if (sprite["xPos"] > PLAYGROUND_WIDTH) {
        sprite["xPos"] = -1 * spriteGetWidth(sprite["id"]);
    }
    spriteSetX(sprite["id"], sprite["xPos"]);
    sprite["yPos"] = sprite["yPos"] + sprite["ySpeed"];
    if (sprite["yPos"] < -1 * spriteGetHeight(sprite["id"])) {
        sprite["yPos"] = PLAYGROUND_HEIGHT;
    }
    if (sprite["yPos"] > 480) {
        sprite["yPos"] = -1 * spriteGetHeight(sprite["id"]);
    }
    spriteSetY(sprite["id"], sprite["yPos"]);
};
let decayBounceSprite = function (info) {
    let decayRate = 0.6;
    info["xPos"] = info["xPos"] + info["xSpeed"];
    if (info["xPos"] < 0) {
        info["xSpeed"] = -1 * info["xSpeed"] * decayRate;
        info["xPos"] = 0;
    }
    if (info["xPos"] > PLAYGROUND_WIDTH - info["width"]) {
        info["xSpeed"] = -1 * info["xSpeed"] * decayRate;
        info["xPos"] = PLAYGROUND_WIDTH - info["width"];
    }
    spriteSetX(info["id"], info["xPos"]);
    info["yPos"] = info["yPos"] + info["ySpeed"];
    if (info["yPos"] < 0) {
        info["ySpeed"] = -1 * info["ySpeed"] * decayRate;
        info["yPos"] = 0;
    }
    if (info["yPos"] > PLAYGROUND_HEIGHT - info["height"]) {
        info["ySpeed"] = -1 * info["ySpeed"] * decayRate;
        info["yPos"] = PLAYGROUND_HEIGHT - info["height"];
        if (Math.abs(info["ySpeed"]) < 1) {
            info["movementState"] = "standing";
        }
    }
    spriteSetY(info["id"], info["yPos"]);
};
let resetScene = function () {
    alienBossInfo["xPos"] = hidingSpot;
    alienBossInfo["yPos"] = hidingSpot;
    alienBossInfo["visible"] = false;
    skullInfo["xPos"] = skullHidingSpot;
    skullInfo["yPos"] = skullHidingSpot;
};
let moveGhost = function () {
    playerInfo["xPos"] = playerInfo["xPos"] + playerInfo["xSpeed"];
    if (playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"] && scene1EnemiesDeafeated == false) {
        playerInfo["xPos"] = 575;
    }
    if (backgrounds[2] == true && playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"] && scene2EnemiesDeafeated == false) {
        playerInfo["xPos"] = 575;
    }
    if (backgrounds[3] == true && playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"]) {
        playerInfo["xPos"] = 575;
    }
    if (scene1EnemiesDeafeated == true) {
        sprite(transparentScreenInfo["id"]).html("Stage Cleared");
    }
    if (playerInfo["xPos"] >= PLAYGROUND_WIDTH && backgrounds[1] == true && scene1EnemiesDeafeated) {
        backgrounds[2] = true;
        backgrounds[1] = false;
        background2Info["xPos"] = 0;
        background2Info["yPos"] = 0;
        spriteSetXY(background2Info["id"], background2Info["xPos"], background2Info["yPos"]);
        background1Info["xPos"] = hidingSpot;
        background1Info["yPos"] = hidingSpot;
        spriteSetXY(background1Info["id"], background1Info["xPos"], background1Info["yPos"]);
        playerInfo["xPos"] = 0;
        consolePrint("right 1 to 2");
        resetScene();
        scene1EnemiesDeafeated = false;
    }
    else if (playerInfo["xPos"] < 1 && backgrounds[1] == true) {
        playerInfo["xPos"] = 1;
    }
    else if (playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"] && backgrounds["desert3"] == true) {
        playerInfo["xPos"] = PLAYGROUND_WIDTH - playerInfo["width"];
    }
    else if (playerInfo["xPos"] < 1 && backgrounds[2] == true) {
        playerInfo["xPos"] = 1;
    }
    if (playerInfo["xPos"] >= PLAYGROUND_WIDTH && backgrounds[2] == true) {
        backgrounds[2] = false;
        backgrounds[3] = true;
        background3Info["xPos"] = 0;
        background3Info["yPos"] = 0;
        background2Info["xPos"] = hidingSpot;
        background2Info["yPos"] = hidingSpot;
        spriteSetXY(background3Info["id"], background3Info["xPos"], background3Info["yPos"]);
        spriteSetXY(background2Info["id"], background2Info["xPos"], background2Info["yPos"]);
        playerInfo["xPos"] = 0;
        consolePrint("right 2 to 3");
        resetScene();
    }
    else if (playerInfo["xPos"] < 1 && backgrounds[3] == true) {
        playerInfo["xPos"] = 1;
    }
    if (playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"] && backgrounds[3] == true) {
        playerInfo["xPos"] = 575;
    }
    spriteSetX(playerInfo["id"], playerInfo["xPos"]);
    playerInfo["yPos"] = playerInfo["yPos"] + playerInfo["ySpeed"];
    if (playerInfo["yPos"] < -1 * spriteGetWidth(playerInfo["id"])) {
        playerInfo["yPos"] = PLAYGROUND_HEIGHT;
    }
    if (playerInfo["yPos"] > 480) {
        playerInfo["yPos"] = -1 * spriteGetWidth(playerInfo["id"]);
    }
    spriteSetY(playerInfo["id"], playerInfo["yPos"]);
};
let bounceSprite = function (aSpriteInfo) {
    aSpriteInfo["xPos"] = aSpriteInfo["xPos"] + aSpriteInfo["xSpeed"];
    if (aSpriteInfo["xPos"] < 0) {
        aSpriteInfo["xSpeed"] = -1 * aSpriteInfo["xSpeed"];
    }
    if (aSpriteInfo["xPos"] > PLAYGROUND_WIDTH - aSpriteInfo["width"]) {
        aSpriteInfo["xSpeed"] = -1 * aSpriteInfo["xSpeed"];
    }
    spriteSetX(aSpriteInfo["id"], aSpriteInfo["xPos"]);
    aSpriteInfo["yPos"] = aSpriteInfo["yPos"] + aSpriteInfo["ySpeed"];
    if (aSpriteInfo["yPos"] < 0) {
        aSpriteInfo["ySpeed"] = -1 * aSpriteInfo["ySpeed"];
    }
    if (aSpriteInfo["yPos"] > PLAYGROUND_HEIGHT - aSpriteInfo["height"]) {
        aSpriteInfo["ySpeed"] = -1 * aSpriteInfo["ySpeed"];
    }
    spriteSetY(aSpriteInfo["id"], aSpriteInfo["yPos"]);
};
let moveSkull = function () {
    let stdLaserXSpeed = 7;
    let skullCooldown = 1000;
    let timeSincePlayerFired = currentDate() - playerInfo["timeSkullWasFired"];
    if (getKeyState(32) && skullInfo["fired"] == false && !playerInfo["isLeft"] && timeSincePlayerFired > skullCooldown) {
        skullInfo["xPos"] = playerInfo["xPos"] + playerInfo["width"];
        skullInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2;
        skullInfo["xSpeed"] = stdLaserXSpeed;
        skullInfo["fired"] = true;
        skullInfo["dir"] = "right";
        playerInfo["timeSkullWasFired"] = currentDate();
    }
    if (getKeyState(32) && skullInfo["fired"] == false && playerInfo["isLeft"] && timeSincePlayerFired > skullCooldown) {
        skullInfo["xPos"] = playerInfo["xPos"] - skullInfo["width"] + skullInfo["xSpeed"];
        skullInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2;
        skullInfo["xSpeed"] = stdLaserXSpeed;
        skullInfo["fired"] = true;
        skullInfo["dir"] = "left";
        playerInfo["timeSkullWasFired"] = currentDate();
    }
    if (skullInfo["xPos"] > PLAYGROUND_WIDTH || skullInfo["xPos"] < 0 || skullInfo["yPos"] >= PLAYGROUND_HEIGHT || skullInfo["yPos"] <= 0) {
        skullInfo["fired"] = false;
        skullInfo["xPos"] = skullHidingSpot;
        skullInfo["yPos"] = skullHidingSpot;
        skullInfo["xSpeed"] = 0;
    }
    if (skullInfo["dir"] == "right") {
        skullInfo["xPos"] = skullInfo["xPos"] + skullInfo["xSpeed"];
        skullInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2;
        spriteSetX(skullInfo["id"], skullInfo["xPos"]);
        spriteSetY(skullInfo["id"], skullInfo["yPos"]);
    }
    if (skullInfo["dir"] == "left") {
        skullInfo["xPos"] = skullInfo["xPos"] + -skullInfo["xSpeed"];
        spriteSetX(skullInfo["id"], skullInfo["xPos"]);
        skullInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2;
        spriteSetY(skullInfo["id"], skullInfo["yPos"]);
    }
    if (skullInfo["dir"] == "down") {
        skullInfo["yPos"] = skullInfo["yPos"] + skullInfo["ySpeed"];
        spriteSetY(skullInfo["id"], skullInfo["yPos"]);
    }
};
let moveShuriken = function () {
    let stdLaserXSpeed = 30;
    let shurikenCooldown = 0;
    let timeSincePlayerFired = currentDate() - playerInfo["timeShurikenWasFired"];
    if (getKeyState(90) && shurikenInfo["fired"] == false && !playerInfo["isLeft"] && timeSincePlayerFired > shurikenCooldown) {
        shurikenInfo["xPos"] = playerInfo["xPos"] + playerInfo["width"];
        shurikenInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2;
        shurikenInfo["xSpeed"] = stdLaserXSpeed;
        shurikenInfo["fired"] = true;
        shurikenInfo["dir"] = "right";
        shurikenInfo["timeSkullWasFired"] = currentDate();
    }
    if (shurikenInfo["xPos"] != hidingSpot && shurikenInfo["yPos"] != hidingSpot) {
        setTimeout(() => {
            spriteRotate(shurikenInfo["id"], 90);
        }, 500);
    }
    if (getKeyState(90) && shurikenInfo["fired"] == false && playerInfo["isLeft"] && timeSincePlayerFired > shurikenCooldown) {
        shurikenInfo["xPos"] = playerInfo["xPos"] - shurikenInfo["width"] + shurikenInfo["xSpeed"];
        shurikenInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2;
        shurikenInfo["xSpeed"] = stdLaserXSpeed;
        shurikenInfo["fired"] = true;
        shurikenInfo["dir"] = "left";
        playerInfo["timeSkullWasFired"] = currentDate();
    }
    if (shurikenInfo["xPos"] > PLAYGROUND_WIDTH || shurikenInfo["xPos"] < 0 || shurikenInfo["yPos"] >= PLAYGROUND_HEIGHT || shurikenInfo["yPos"] <= 0) {
        shurikenInfo["fired"] = false;
        shurikenInfo["xPos"] = skullHidingSpot;
        shurikenInfo["yPos"] = skullHidingSpot;
        shurikenInfo["xSpeed"] = 0;
    }
    if (shurikenInfo["dir"] == "right") {
        shurikenInfo["xPos"] = shurikenInfo["xPos"] + shurikenInfo["xSpeed"];
        shurikenInfo["yPos"] = playerInfo["yPos"] + playerInfo["ySpeed"];
        spriteSetX(shurikenInfo["id"], shurikenInfo["xPos"]);
        spriteSetY(shurikenInfo["id"], shurikenInfo["yPos"]);
    }
    if (shurikenInfo["dir"] == "left") {
        shurikenInfo["xPos"] = shurikenInfo["xPos"] + -shurikenInfo["xSpeed"];
        spriteSetX(shurikenInfo["id"], shurikenInfo["xPos"]);
        shurikenInfo["yPos"] = playerInfo["yPos"] + playerInfo["ySpeed"];
        spriteSetY(shurikenInfo["id"], shurikenInfo["yPos"]);
    }
    if (shurikenInfo["dir"] == "down") {
        shurikenInfo["yPos"] = shurikenInfo["yPos"] + shurikenInfo["ySpeed"];
        spriteSetY(shurikenInfo["id"], shurikenInfo["yPos"]);
    }
};
let keyMovesSkull = function () {
    let maxSpeed = 6;
    if (getKeyState(40)) {
        skullInfo["dir"] = "down";
        skullInfo["ySpeed"] = skullInfo["ySpeed"] + 1;
        if (skullInfo["ySpeed"] > maxSpeed) {
            skullInfo["ySpeed"] = maxSpeed;
        }
    }
};
// Move Ghost Player
let timeSinceLastDash = currentDate() - playerInfo["timeSinceLastDash"];
let keyMovesPlayer = function () {
    let maxSpeed = 6;
    if (getKeyState(90) && getKeyState(65) && timeSinceLastDash > 5000) {
        playerInfo["xSpeed"] = playerInfo["xSpeed"] + -1.5;
        spriteSetAnimation(playerInfo["id"], playerInfo["leftAnim"]);
        playerInfo["isLeft"] = true;
        playerInfo["timeSinceLastDash"] = currentDate();
    }
    if (getKeyState(65)) {
        playerInfo["xSpeed"] = playerInfo["xSpeed"] + -1;
        spriteSetAnimation(playerInfo["id"], playerInfo["leftAnim"]);
        playerInfo["isLeft"] = true;
    }
    if (getKeyState(68)) {
        playerInfo["xSpeed"] = playerInfo["xSpeed"] + 1;
        spriteSetAnimation(playerInfo["id"], playerInfo["anim"]);
        playerInfo["isLeft"] = false;
    }
    if (!getKeyState(65) && !getKeyState(68)) {
        playerInfo["xSpeed"] = 0;
    }
    if (getKeyState(87)) {
        playerInfo["ySpeed"] = playerInfo["ySpeed"] + -1;
    }
    if (getKeyState(83)) {
        playerInfo["ySpeed"] = playerInfo["ySpeed"] + 1;
    }
    if (!getKeyState(87) && !getKeyState(83)) {
        playerInfo["ySpeed"] = 0;
    }
    let xSquared = playerInfo["xSpeed"] * playerInfo["xSpeed"];
    let ySquared = playerInfo["ySpeed"] * playerInfo["ySpeed"];
    let hypSquared = xSquared + ySquared;
    let combinedSpeed = Math.sqrt(hypSquared);
    if (combinedSpeed > maxSpeed) {
        let factor = combinedSpeed / maxSpeed;
        let maxXSpeed = playerInfo["xSpeed"] / factor;
        let maxYSpeed = playerInfo["ySpeed"] / factor;
        playerInfo["xSpeed"] = maxXSpeed;
        playerInfo["ySpeed"] = maxYSpeed;
    }
    moveGhost();
};
let playerHitsCactus = function () {
    playerInfo["health"] = playerInfo["health"] - 1;
};
let playerHitFoxParam;
let coinHitPlayerParam;
let heartHitPlayerParam;
let playerHitAlienParam;
let playerHitBossParam;
let timeGameStarted = currentDate();
let enemyDisappear = function () {
    if (alienBossInfo["health"] <= 0) {
        alienBossInfo["xPos"] = hidingSpot;
        alienBossInfo["yPos"] = hidingSpot;
        spriteSetXY(alienBossInfo["id"], alienBossInfo["xPos"], alienBossInfo["yPos"]);
    }
};
let boundaries = function (aSpriteInfo) {
    let upYBoundary = 50;
    let downYBoundary = 347;
    if (aSpriteInfo["yPos"] >= downYBoundary) {
        aSpriteInfo["yPos"] = downYBoundary;
    }
    if (playerInfo["yPos"] <= upYBoundary) {
        playerInfo["yPos"] = upYBoundary;
    }
};
let bouncyBoundaries = function (aSpriteInfo, downYBoundary, upYBoundary) {
    if (aSpriteInfo["yPos"] >= downYBoundary) {
        aSpriteInfo["ySpeed"] = -1 * aSpriteInfo["ySpeed"];
    }
    if (aSpriteInfo["yPos"] <= 0) {
        aSpriteInfo["ySpeed"] = -1 * aSpriteInfo["ySpeed"];
    }
};
let getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};
let collisions = function () {
    when2SpritesHit(playerInfo["id"], heart["id"], () => {
        playerInfo["health"] = playerInfo["health"] + (1 + Math.floor(Math.random() * 3));
        heart["xPos"] = hidingSpot;
        heart["yPos"] = hidingSpot;
    });
    when2SpritesHit(playerInfo["id"], coin["id"], () => {
        playerInfo["score"] = playerInfo["score"] + getRandomInt(100, 250);
        coin["xPos"] = hidingSpot;
        coin["yPos"] = hidingSpot;
    });
    when2SpritesHit(playerInfo["id"], alienBossInfo["id"], () => {
        playerInfo["health"] = playerInfo["health"] - 2;
    });
    when2SpritesHit(skullInfo["id"], alienBossInfo["id"], () => {
        alienBossInfo["health"] = alienBossInfo["health"] - 1;
        skullInfo["xPos"] = skullHidingSpot;
        skullInfo["yPos"] = skullHidingSpot;
    });
};
let scene1EnemiesDeafeated = false, scene2EnemiesDeafeated = false, scene3EnemiesDeafeated = false;
let stageMove = function () {
    if (playerInfo["kills"] >= aliens.length && playerInfo["score"] >= 950) {
        scene1EnemiesDeafeated = true;
    }
    if (playerInfo["kills"] >= foxes.length + aliens.length && playerInfo["score"] >= 1700) {
        scene2EnemiesDeafeated = true;
    }
    if (playerInfo["kills"] >= foxes.length + alienBosses.length + aliens.length && playerInfo["score"] >= 2750) {
        scene3EnemiesDeafeated = true;
    }
};
let skullPush = function (sprite, min, max) {
    if (skullInfo["dir"] == "down") {
        sprite["yPos"] = sprite["yPos"] + getRandomInt(min, max);
    }
    if (skullInfo["dir"] == "left") {
        sprite["xPos"] = sprite["xPos"] - getRandomInt(min, max);
    }
    if (skullInfo["dir"] == "right") {
        sprite["xPos"] = sprite["xPos"] + getRandomInt(min, max);
    }
};
let gameEnd = function () {
    if (playerInfo["health"] <= 0) {
        backgrounds["gameOver"] = true;
        gameOverInfo["xPos"] = 0;
        gameOverInfo["yPos"] = 0;
        spriteSetXY(gameOverInfo["id"], gameOverInfo["xPos"], gameOverInfo["yPos"]);
        sprite(scoreBoardInfo["id"]).html("<b> You died </b>");
        sprite(gameOverInfo["id"]).css("text-align", "center");
        sprite(gameOverInfo["id"]).css("font-size", "40px");
        sprite(gameOverInfo["id"]).css("font-family", "Verdana");
        sprite(gameOverInfo["id"]).css("color", "black");
        sprite(gameOverInfo["id"]).css("background-color", "turquoise");
        sprite(gameOverInfo["id"]).html("<b> You Died </b>" + "<br>" + "<br>" + `Your Final Score was: ${playerInfo["score"]}` + "<br>" + "<br>" + `You had ${playerInfo["kills"]} kills` + "<br>" + "<br>" + "Thank you for playing!");
    }
    if (scene3EnemiesDeafeated) {
        backgrounds["gameOver"] = true;
        gameOverInfo["xPos"] = 0;
        gameOverInfo["yPos"] = 0;
        spriteSetXY(gameOverInfo["id"], gameOverInfo["xPos"], gameOverInfo["yPos"]);
        background3Info["xPos"] = hidingSpot;
        background3Info["yPos"] = hidingSpot;
        spriteSetXY(background3Info["id"], background3Info["xPos"], background3Info["yPos"]);
        sprite(gameOverInfo["id"]).css("text-align", "center");
        sprite(gameOverInfo["id"]).css("font-size", "40px");
        sprite(gameOverInfo["id"]).css("font-family", "Verdana");
        sprite(gameOverInfo["id"]).css("color", "black");
        sprite(gameOverInfo["id"]).css("background-color", "turquoise");
        sprite(gameOverInfo["id"]).html("<b> You Won!! </b>" + "<br>" + "<br>" + `Your Final Score was: ${playerInfo["score"]}` + "<br>" + "<br>" + `You had ${playerInfo["kills"]} kills` + "<br>" + "<br>" + "Thank you for playing!");
    }
};
let timeLastCoinMade = 0;
let timeLastHeartMade = 0;
let runGame = function () {
    moveSprite(alienBossInfo);
    moveSkull();
    moveShuriken();
    keyMovesPlayer();
    keyMovesSkull();
    moveSprite(cloud1);
    moveSprite(cloud2);
    bounceSprite(heart);
    bounceSprite(coin);
    enemyDisappear();
    gameEnd();
    stageMove();
    boundaries(playerInfo);
    collisions();
    if (foxes.length < 7 && (backgrounds[2] || backgrounds[3])) {
        createFox();
    }
    if (aliens.length < getRandomInt(6, 10) && (backgrounds[1] || backgrounds[3])) {
        createEnemy();
    }
    if (alienBosses.length < 2) {
        createBoss();
    }
    if (currentDate() - timeLastCoinMade > getRandomInt(27000, 40000)) {
        createCoin();
        timeLastCoinMade = currentDate();
    }
    if (currentDate() - timeLastHeartMade > getRandomInt(32000, 40000)) {
        createHeart();
        timeLastHeartMade = currentDate();
    }
    let timeSinceHealthTaken = currentDate() - playerInfo["timeSinceHealthTaken"];
    let healthTakenCooldown = 1750;
    for (let index = 0; index < aliens.length; index = index + 1) {
        let theAlienDict = aliens[index];
        if (backgrounds[1]) {
            moveAlien(theAlienDict);
        }
        if (backgrounds[2]) {
            theAlienDict["xPos"] = hidingSpot;
            theAlienDict["yPos"] = hidingSpot;
            spriteSetXY(theAlienDict["id"], theAlienDict["xPos"], theAlienDict["yPos"]);
        }
        boundaries(theAlienDict);
        playerHitAlienParam = theAlienDict;
        when2SpritesHit(playerInfo["id"], theAlienDict["id"], () => {
            if (timeSinceHealthTaken > healthTakenCooldown) {
                playerInfo["timeSinceHealthTaken"] = currentDate();
                playerInfo["health"] = playerInfo["health"] - 1;
            }
        });
        when2SpritesHit(skullInfo["id"], theAlienDict["id"], () => {
            theAlienDict["health"] = theAlienDict["health"] - 1;
            if (theAlienDict["health"] > 1) {
                skullPush(theAlienDict, 6, 8);
            }
            skullInfo["xPos"] = skullHidingSpot;
            skullInfo["yPos"] = skullHidingSpot;
        });
        when2SpritesHit(shurikenInfo["id"], theAlienDict["id"], () => {
            theAlienDict["health"] = theAlienDict["health"] - 0.25;
            if (theAlienDict["health"] > 1) {
                skullPush(theAlienDict, 3, 5);
            }
            shurikenInfo["xPos"] = skullHidingSpot;
            shurikenInfo["yPos"] = skullHidingSpot;
        });
        if (theAlienDict["health"] <= 0) {
            theAlienDict["xPos"] = hidingSpot;
            theAlienDict["yPos"] = hidingSpot;
            theAlienDict["health"] = 2;
            theAlienDict["xSpeed"] = 0;
            theAlienDict["ySpeed"] = 0;
            spriteSetXY(theAlienDict["id"], theAlienDict["xPos"], theAlienDict["yPos"]);
            playerInfo["score"] = playerInfo["score"] + getRandomInt(100, 200);
            playerInfo["kills"] = playerInfo["kills"] + 1;
        }
    }
    // Boss Aliens
    for (let index = 0; index < alienBosses.length; index = index + 1) {
        let theBossAlienDict = alienBosses[index];
        if (backgrounds[3]) {
            moveSprite(theBossAlienDict);
            spriteSetXY(theBossAlienDict["id"], theBossAlienDict["xPos"], theBossAlienDict["yPos"]);
        }
        if (backgrounds[1] || backgrounds[2]) {
            theBossAlienDict["xPos"] = hidingSpot;
            theBossAlienDict["yPos"] = hidingSpot;
            spriteSetXY(theBossAlienDict["id"], theBossAlienDict["xPos"], theBossAlienDict["yPos"]);
        }
        playerHitBossParam = theBossAlienDict;
        when2SpritesHit(playerInfo["id"], theBossAlienDict["id"], () => {
            if (timeSinceHealthTaken > healthTakenCooldown) {
                playerInfo["timeSinceHealthTaken"] = currentDate();
                playerInfo["health"] = playerInfo["health"] - 2;
            }
        });
        when2SpritesHit(skullInfo["id"], theBossAlienDict["id"], () => {
            theBossAlienDict["health"] = theBossAlienDict["health"] - 1;
            skullPush(theBossAlienDict, 6, 8);
            skullInfo["xPos"] = skullHidingSpot;
            skullInfo["yPos"] = skullHidingSpot;
        });
        when2SpritesHit(shurikenInfo["id"], theBossAlienDict["id"], () => {
            theBossAlienDict["health"] = theBossAlienDict["health"] - 0.25;
            skullPush(theBossAlienDict, 3, 5);
            shurikenInfo["xPos"] = skullHidingSpot;
            shurikenInfo["yPos"] = skullHidingSpot;
        });
        if (theBossAlienDict["health"] <= 0) {
            theBossAlienDict["xPos"] = hidingSpot;
            theBossAlienDict["yPos"] = hidingSpot;
            theBossAlienDict["health"] = 2;
            theBossAlienDict["xSpeed"] = 0;
            theBossAlienDict["ySpeed"] = 0;
            spriteSetXY(theBossAlienDict["id"], theBossAlienDict["xPos"], theBossAlienDict["yPos"]);
            playerInfo["score"] = playerInfo["score"] + getRandomInt(250, 400);
            playerInfo["kills"] = playerInfo["kills"] + 1;
        }
    }
    for (let index = 0; index < foxes.length; index = index + 1) {
        let theFoxDict = foxes[index];
        if (backgrounds[2]) {
            bouncyBoundaries(theFoxDict, 346, 0);
            moveAlien(theFoxDict);
        }
        playerHitFoxParam = theFoxDict;
        when2SpritesHit(playerInfo["id"], theFoxDict["id"], () => {
            if (timeSinceHealthTaken > healthTakenCooldown) {
                playerInfo["timeSinceHealthTaken"] = currentDate();
                playerInfo["health"] = playerInfo["health"] - 1;
            }
        });
        when2SpritesHit(skullInfo["id"], theFoxDict["id"], () => {
            theFoxDict["health"] = theFoxDict["health"] - 1;
            skullPush(theFoxDict, 6, 8);
            skullInfo["xPos"] = skullHidingSpot;
            skullInfo["yPos"] = skullHidingSpot;
        });
        when2SpritesHit(shurikenInfo["id"], theFoxDict["id"], () => {
            theFoxDict["health"] = theFoxDict["health"] - 0.25;
            skullPush(theFoxDict, 3, 5);
            shurikenInfo["xPos"] = skullHidingSpot;
            shurikenInfo["yPos"] = skullHidingSpot;
        });
        if (theFoxDict["health"] <= 0) {
            theFoxDict["xPos"] = hidingSpot;
            theFoxDict["yPos"] = hidingSpot;
            playerInfo["score"] = playerInfo["score"] + Math.floor((100 + Math.random() * 100));
            theFoxDict["xSpeed"] = 0;
            theFoxDict["ySpeed"] = 0;
            theFoxDict["xPos"] = hidingSpot;
            theFoxDict["yPos"] = hidingSpot;
            spriteSetXY(theFoxDict["id"], theFoxDict["xPos"], theFoxDict["yPos"]);
            playerInfo["kills"] = playerInfo["kills"] + 1;
            theFoxDict["health"] = 2;
        }
    }
    for (let index = 0; index < coins.length; index = index + 1) {
        let theCoinDict = coins[index];
        bounceSprite(theCoinDict);
        coinHitPlayerParam = theCoinDict;
        when2SpritesHit(theCoinDict["id"], playerInfo["id"], () => {
            playerInfo["score"] = playerInfo["score"] + getRandomInt(100, 250);
            theCoinDict["xPos"] = hidingSpot;
            theCoinDict["yPos"] = hidingSpot;
        });
    }
    for (let index = 0; index < hearts.length; index = index + 1) {
        let theHeartDict = hearts[index];
        bounceSprite(theHeartDict);
        heartHitPlayerParam = theHeartDict;
        when2SpritesHit(theHeartDict["id"], playerInfo["id"], () => {
            playerInfo["health"] = playerInfo["health"] + getRandomInt(2, 6);
            theHeartDict["xPos"] = hidingSpot;
            theHeartDict["yPos"] = hidingSpot;
        });
    }
};
let gameStart = false;
let gamePause = false;
let draw = function () {
    sprite(scoreBoardInfo["id"]).html("Health:" + playerInfo["health"] + "<br>" + "Score:" + playerInfo["score"] + "<br>" + "Time:" + `${(currentDate() - timeGameStarted) / 1000}`);
    sprite(scoreBoardInfo["id"]).css("font-family", "Verdana");
    sprite(scoreBoardInfo["id"]).css("background-color", "turquoise");
    sprite(scoreBoardInfo["id"]).css("font-size", "16px");
    if (gameStart == false) {
        if (getKeyState(68)) {
            splashScreenInfo["xPos"] = hidingSpot;
            splashScreenInfo["yPos"] = hidingSpot;
            spriteSetY(splashScreenInfo["id"], splashScreenInfo["yPos"]);
            spriteSetX(splashScreenInfo["id"], splashScreenInfo["xPos"]);
            gameStart = true;
            timeGameStarted = currentDate();
        }
    }
    else if (gamePause == false) {
        runGame();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlwcm9ncmFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibXlwcm9ncmFtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLGlDQUFpQztBQUNqQyxnQ0FBZ0M7QUFDaEMsMEVBQTBFO0FBQzFFOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsT0FBTyxFQUNILGNBQWMsRUFDZCx1QkFBdUIsRUFDdkIsbUJBQW1CLEVBQ25CLFVBQVUsRUFDVixVQUFVLEVBQ1YsY0FBYyxFQUNkLGVBQWUsRUFDZixpQkFBaUIsRUFDakIsZ0JBQWdCLEVBQ2hCLFdBQVcsRUFDWCxrQkFBa0IsRUFDbEIsb0JBQW9CLEVBRXBCLFdBQVcsRUFFWCx1QkFBdUIsRUFDdkIsZUFBZSxFQUVmLE1BQU0sRUFDTixXQUFXLEVBQ1gsWUFBWSxFQUNaLFlBQVksR0FHZixNQUFNLG1DQUFtQyxDQUFDO0FBQzNDLE9BQW9CLG1DQUFtQyxDQUFDO0FBQ3hELGlGQUFpRjtBQUVqRixxRkFBcUY7QUFDckYscUJBQXFCO0FBQ3JCLHNDQUFzQztBQUV0QyxzQ0FBc0M7QUFDdEMsc0NBQXNDO0FBQ3RDLElBQUksVUFBVSxHQUFXLElBQUksQ0FBQTtBQUM3QixJQUFJLGVBQWUsR0FBVyxJQUFJLENBQUE7QUFDbEMsSUFBSSxVQUFVLEdBQVcsU0FBUyxDQUFBO0FBQ2xDLElBQUksWUFBWSxHQUFXLFVBQVUsQ0FBQTtBQUNyQyxJQUFJLFdBQVcsR0FBRztJQUNkLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLEtBQUs7SUFDUixDQUFDLEVBQUUsS0FBSztJQUNSLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFLEtBQUs7SUFDZCxPQUFPLEVBQUUsS0FBSztJQUNkLFFBQVEsRUFBRSxLQUFLO0NBQ2xCLENBQUE7QUFDRCxhQUFhO0FBQ2IsSUFBSSxVQUFVLEdBQWU7SUFDekIsSUFBSSxFQUFFLE9BQU87SUFDYixRQUFRLEVBQUUsRUFBRTtJQUNaLE9BQU8sRUFB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QUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQy9JLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUE7UUFDN0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGVBQWUsQ0FBQTtRQUN0QyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsZUFBZSxDQUFBO1FBQ3RDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDN0I7SUFDRCxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLEVBQUU7UUFDaEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDcEUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDaEUsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUNwRCxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0tBQ3ZEO0lBQ0QsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxFQUFFO1FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDckUsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUNwRCxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRSxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FB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LENBQUMsa0JBQWtCLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDakUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDckQsSUFBSSxTQUFTLElBQUksS0FBSyxFQUFFO1FBQ3BCLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2pCLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQTtZQUNyQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUE7WUFDckMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDNUQsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDNUQsU0FBUyxHQUFHLElBQUksQ0FBQTtZQUNoQixlQUFlLEdBQUcsV0FBVyxFQUFFLENBQUE7U0FDbEM7S0FDSjtTQUFNLElBQUksU0FBUyxJQUFJLEtBQUssRUFBRTtRQUMzQixPQUFPLEVBQUUsQ0FBQTtLQUNaO0FBQ0wsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBQcm9ncmFtbWVyJ3MgTmFtZTogQmlsYWwgQWhtZWRcbi8vIFByb2dyYW0gTmFtZTogR2hvc3RzIE4gQWxpZW5zXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyogXG4gKiBDb3B5cmlnaHQgMjAxMiwgMjAxNiwgMjAxOSwgMjAyMCBDaGVuZ1xuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogICAgIGh0dHBzOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmltcG9ydCB7XG4gICAgbmV3R1FBbmltYXRpb24sXG4gICAgY3JlYXRlR3JvdXBJblBsYXlncm91bmQsXG4gICAgY3JlYXRlU3ByaXRlSW5Hcm91cCxcbiAgICBzcHJpdGVTZXRYLFxuICAgIHNwcml0ZVNldFksXG4gICAgc3ByaXRlR2V0V2lkdGgsXG4gICAgc3ByaXRlR2V0SGVpZ2h0LFxuICAgIFBMQVlHUk9VTkRfSEVJR0hULFxuICAgIFBMQVlHUk9VTkRfV0lEVEgsXG4gICAgZ2V0S2V5U3RhdGUsXG4gICAgc3ByaXRlU2V0QW5pbWF0aW9uLFxuICAgIEFOSU1BVElPTl9IT1JJWk9OVEFMLFxuICAgIFNwcml0ZURpY3QsXG4gICAgc3ByaXRlU2V0WFksXG4gICAgc3ByaXRlUGF1c2VBbmltYXRpb24sXG4gICAgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAsXG4gICAgd2hlbjJTcHJpdGVzSGl0LFxuICAgIGZvckVhY2hTcHJpdGVHcm91cEhpdCxcbiAgICBzcHJpdGUsXG4gICAgY3VycmVudERhdGUsXG4gICAgc3ByaXRlUm90YXRlLFxuICAgIGNvbnNvbGVQcmludCxcbiAgICByZW1vdmVTcHJpdGUsXG4gICAgc3ByaXRlRXhpc3RzLFxufSBmcm9tIFwiLi9saWJzL2xpYi1ncWd1YXJkcmFpbC1leHBvcnRzLnRzXCI7XG5pbXBvcnQgKiBhcyBGbiBmcm9tIFwiLi9saWJzL2xpYi1ncWd1YXJkcmFpbC1leHBvcnRzLnRzXCI7XG4vLyBEb24ndCBlZGl0IHRoZSBpbXBvcnQgbGluZXMgYWJvdmUsIG9yIHlvdSB3b24ndCBiZSBhYmxlIHRvIHdyaXRlIHlvdXIgcHJvZ3JhbSFcblxuLy8gQWxzbywgZG8gbm90IHVzZSB0aGUgZm9sbG93aW5nIHZhcmlhYmxlIGFuZCBmdW5jdGlvbiBuYW1lcyBpbiB5b3VyIG93biBjb2RlIGJlbG93OlxuLy8gICAgc2V0dXAsIGRyYXcsIEZuXG4vLyBhbmQgdGhlIG90aGVyIGltcG9ydGVkIG5hbWVzIGFib3ZlLlxuXG4vLyBXcml0ZSB5b3VyIHByb2dyYW0gYmVsb3cgdGhpcyBsaW5lOlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmxldCBoaWRpbmdTcG90OiBudW1iZXIgPSAzMzMzXG5sZXQgc2t1bGxIaWRpbmdTcG90OiBudW1iZXIgPSAxMTExXG5sZXQgZW5lbXlHcm91cDogc3RyaW5nID0gXCJlbmVtaWVzXCJcbmxldCBwb3dlclVwR3JvdXA6IHN0cmluZyA9IFwicG93ZXJ1cHNcIlxubGV0IGJhY2tncm91bmRzID0ge1xuICAgIDE6IHRydWUsXG4gICAgMjogZmFsc2UsXG4gICAgMzogZmFsc2UsXG4gICAgZGVzZXJ0MTogZmFsc2UsXG4gICAgZGVzZXJ0MjogZmFsc2UsXG4gICAgZGVzZXJ0MzogZmFsc2UsXG4gICAgZ2FtZU92ZXI6IGZhbHNlXG59XG4vLyBDaGFyYWN0ZXJzXG5sZXQgcGxheWVySW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICBcImlkXCI6IFwiZ2hvc3RcIixcbiAgICBcImhlaWdodFwiOiA2NCxcbiAgICBcIndpZHRoXCI6IDY0LFxuICAgIFwieFNwZWVkXCI6IDUsXG4gICAgXCJ5U3BlZWRcIjogMCxcbiAgICBcInhQb3NcIjogUExBWUdST1VORF9XSURUSCAtIDY0LFxuICAgIFwieVBvc1wiOiAyMDAsXG4gICAgXCJhbmltXCI6IG5ld0dRQW5pbWF0aW9uKFwiaW1nL2dob3N0NjRieTEyOC5wbmdcIiwgMiwgNjQsIDUwMCwgQU5JTUFUSU9OX0hPUklaT05UQUwpLFxuICAgIFwibGVmdEFuaW1cIjogbmV3R1FBbmltYXRpb24oXCJpbWcvZ2hvc3QtbGVmdC5wbmdcIiksXG4gICAgXCJpc0xlZnRcIjogZmFsc2UsXG4gICAgXCJoZWFsdGhcIjogMTAsXG4gICAgXCJzY29yZVwiOiAwLFxuICAgIFwia2lsbHNcIjogMCxcbiAgICBcInRpbWVTa3VsbFdhc0ZpcmVkXCI6IDAsXG4gICAgXCJ0aW1lU2h1cmlrZW5XYXNGaXJlZFwiOiAwLFxuICAgIFwidGltZVNpbmNlU3BlY2lhbFwiOiAwLFxuICAgIFwidGltZVNpbmNlSGVhbHRoVGFrZW5cIjogMFxufVxubGV0IGFsaWVuQm9zc0luZm86IFNwcml0ZURpY3QgPSB7XG4gICAgXCJpZFwiOiBcImFsaWVuQm9zc1wiLFxuICAgIFwiaGVpZ2h0XCI6IDgwLFxuICAgIFwid2lkdGhcIjogODAsXG4gICAgXCJ4U3BlZWRcIjogMyxcbiAgICBcInlTcGVlZFwiOiAwLFxuICAgIFwieFBvc1wiOiBoaWRpbmdTcG90LFxuICAgIFwieVBvc1wiOiBoaWRpbmdTcG90LFxuICAgIFwiYW5pbVwiOiBuZXdHUUFuaW1hdGlvbihcImltZy9BbGllbkJvc3M4MGJ5NTYwLnBuZ1wiLCA3LCA4MCwgMTQyLjgsIEFOSU1BVElPTl9IT1JJWk9OVEFMKSxcbiAgICBcImhlYWx0aFwiOiAxMCxcbiAgICBcInZpc2libGVcIjogZmFsc2Vcbn1cbi8vIENsb3Vkc1xubGV0IGNsb3VkMTogU3ByaXRlRGljdCA9IHtcbiAgICBcImlkXCI6IFwiY2xvdWQxXCIsXG4gICAgXCJoZWlnaHRcIjogODAsXG4gICAgXCJ3aWR0aFwiOiAxMDAsXG4gICAgXCJ4U3BlZWRcIjogMyxcbiAgICBcInlTcGVlZFwiOiAwLFxuICAgIFwieFBvc1wiOiAwLFxuICAgIFwieVBvc1wiOiAwLFxuICAgIFwiYW5pbVwiOiBuZXdHUUFuaW1hdGlvbihcImltZy9jbG91ZDEucG5nXCIpXG59XG5sZXQgY2xvdWQyOiBTcHJpdGVEaWN0ID0ge1xuICAgIFwiaWRcIjogXCJjbG91ZDJcIixcbiAgICBcImhlaWdodFwiOiA2MCxcbiAgICBcIndpZHRoXCI6IDkxLFxuICAgIFwieFNwZWVkXCI6IC00LjUsXG4gICAgXCJ5U3BlZWRcIjogMCxcbiAgICBcInhQb3NcIjogNjQwLFxuICAgIFwieVBvc1wiOiAwLFxuICAgIFwiYW5pbVwiOiBuZXdHUUFuaW1hdGlvbihcImltZy9jbG91ZDIucG5nXCIpXG59XG4vLyBQbGF0Zm9ybXNcbmxldCBwbGF0Zm9ybTE6IFNwcml0ZURpY3QgPSB7XG4gICAgXCJpZFwiOiBcInBsYXRmb3JtMVwiLFxuICAgIFwiaGVpZ2h0XCI6IDQsXG4gICAgXCJ3aWR0aFwiOiA1MCxcbiAgICBcInhTcGVlZFwiOiAwLFxuICAgIFwieVNwZWVkXCI6IDAsXG4gICAgXCJ4UG9zXCI6IDEwMCxcbiAgICBcInlQb3NcIjogMzIwLFxuICAgIFwiYW5pbVwiOiBuZXdHUUFuaW1hdGlvbihcImltZy9wbGF0Zm9ybTFHYXAucG5nXCIpXG59XG4vLyBQb3dlcnVwc1xubGV0IGhlYXJ0OiBTcHJpdGVEaWN0ID0ge1xuICAgIFwiaWRcIjogXCJoZWFydFwiLFxuICAgIFwiaGVpZ2h0XCI6IDQwLFxuICAgIFwid2lkdGhcIjogNDAsXG4gICAgXCJ4U3BlZWRcIjogNCxcbiAgICBcInlTcGVlZFwiOiAzLFxuICAgIFwieFBvc1wiOiBoaWRpbmdTcG90LFxuICAgIFwieVBvc1wiOiBoaWRpbmdTcG90LFxuICAgIFwiYW5pbVwiOiBuZXdHUUFuaW1hdGlvbihcImltZy9oZWFydFBvd2VydXAucG5nXCIpLFxuICAgIFwidGltZUxhc3RTcGF3bmVkXCI6IDBcbn1cbmxldCBjb2luOiBTcHJpdGVEaWN0ID0ge1xuICAgIFwiaWRcIjogXCJjb2luXCIsXG4gICAgXCJoZWlnaHRcIjogOSxcbiAgICBcIndpZHRoXCI6IDksXG4gICAgXCJ4U3BlZWRcIjogNCxcbiAgICBcInlTcGVlZFwiOiAtMyxcbiAgICBcInhQb3NcIjogaGlkaW5nU3BvdCxcbiAgICBcInlQb3NcIjogaGlkaW5nU3BvdCxcbiAgICBcImFuaW1cIjogbmV3R1FBbmltYXRpb24oXCJpbWcvY29pblBvd2VydXAucG5nXCIpLFxuICAgIFwidGltZUxhc3RTcGF3bmVkXCI6IDBcbn1cbi8vIEJhY2tncm91bmRzXG5sZXQgYmFja2dyb3VuZDFJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgIFwiaWRcIjogXCJiYWNrZ3JvdW5kMVwiLFxuICAgIFwiaGVpZ2h0XCI6IDQ4MCxcbiAgICBcIndpZHRoXCI6IDY0MCxcbiAgICBcInhTcGVlZFwiOiAwLFxuICAgIFwieVNwZWVkXCI6IDAsXG4gICAgXCJ4UG9zXCI6IDAsXG4gICAgXCJ5UG9zXCI6IDAsXG4gICAgXCJhbmltXCI6IG5ld0dRQW5pbWF0aW9uKFwiaW1nL2JhY2tncm91bmQxLnBuZ1wiKVxufVxubGV0IGJhY2tncm91bmQySW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICBcImlkXCI6IFwiYmFja2dyb3VuZDJcIixcbiAgICBcImhlaWdodFwiOiA0ODAsXG4gICAgXCJ3aWR0aFwiOiA2NDAsXG4gICAgXCJ4U3BlZWRcIjogMCxcbiAgICBcInlTcGVlZFwiOiAwLFxuICAgIFwieFBvc1wiOiBoaWRpbmdTcG90LFxuICAgIFwieVBvc1wiOiBoaWRpbmdTcG90LFxuICAgIFwiYW5pbVwiOiBuZXdHUUFuaW1hdGlvbihcImltZy9iYWNrZ3JvdW5kMi5wbmdcIilcbn1cbmxldCBiYWNrZ3JvdW5kM0luZm86IFNwcml0ZURpY3QgPSB7XG4gICAgXCJpZFwiOiBcImJhY2tncm91bmQzXCIsXG4gICAgXCJoZWlnaHRcIjogNDgwLFxuICAgIFwid2lkdGhcIjogNjQwLFxuICAgIFwieFNwZWVkXCI6IDAsXG4gICAgXCJ5U3BlZWRcIjogMCxcbiAgICBcInhQb3NcIjogaGlkaW5nU3BvdCxcbiAgICBcInlQb3NcIjogaGlkaW5nU3BvdCxcbiAgICBcImFuaW1cIjogbmV3R1FBbmltYXRpb24oXCJpbWcvYmFja2dyb3VuZDMucG5nXCIpXG59XG5sZXQgc3BsYXNoU2NyZWVuSW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICBcImlkXCI6IFwic3BsYXNoU2NyZWVuXCIsXG4gICAgXCJoZWlnaHRcIjogNDgwLFxuICAgIFwid2lkdGhcIjogNjQwLFxuICAgIFwieFNwZWVkXCI6IDAsXG4gICAgXCJ5U3BlZWRcIjogMCxcbiAgICBcInhQb3NcIjogMCxcbiAgICBcInlQb3NcIjogMCxcbiAgICBcImFuaW1cIjogbmV3R1FBbmltYXRpb24oXCJpbWcvc3BsYXNoU2NyZWVuLnBuZ1wiKSxcbiAgICBcInZpc2libGVcIjogdHJ1ZVxufVxubGV0IGdhbWVPdmVySW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICBcImlkXCI6IFwiZ2FtZU92ZXJTY3JlZW5cIixcbiAgICBcIndpZHRoXCI6IDY0MCxcbiAgICBcImhlaWdodFwiOiA0ODAsXG4gICAgXCJ4U3BlZWRcIjogMCxcbiAgICBcInlTcGVlZFwiOiAwLFxuICAgIFwieFBvc1wiOiBoaWRpbmdTcG90LFxuICAgIFwieVBvc1wiOiBoaWRpbmdTcG90LFxufVxubGV0IHNjb3JlQm9hcmRJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgIFwiaWRcIjogXCJzY29yZWJvYXJkXCIsXG4gICAgXCJ3aWR0aFwiOiAxMDIsXG4gICAgXCJoZWlnaHRcIjogNTAsXG4gICAgXCJ4U3BlZWRcIjogMCxcbiAgICBcInlTcGVlZFwiOiAwLFxuICAgIFwieFBvc1wiOiAwLFxuICAgIFwieVBvc1wiOiAwLFxufVxubGV0IHRyYW5zcGFyZW50U2NyZWVuSW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICBcImlkXCI6IFwidHJhbnNwYXJlbnRcIixcbiAgICBcIndpZHRoXCI6IDY0MCxcbiAgICBcImhlaWdodFwiOiA0ODAsXG4gICAgXCJ4U3BlZWRcIjogMCxcbiAgICBcInlTcGVlZFwiOiAwLFxuICAgIFwieFBvc1wiOiAwLFxuICAgIFwieVBvc1wiOiAwLFxufVxubGV0IHNrdWxsSW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICBcImlkXCI6IFwic2t1bGxcIixcbiAgICBcIndpZHRoXCI6IDEzLFxuICAgIFwiaGVpZ2h0XCI6IDE2LFxuICAgIFwieFNwZWVkXCI6IDQsXG4gICAgXCJ5U3BlZWRcIjogMixcbiAgICBcInhQb3NcIjogc2t1bGxIaWRpbmdTcG90LFxuICAgIFwieVBvc1wiOiBza3VsbEhpZGluZ1Nwb3QsXG4gICAgXCJhbmltXCI6IG5ld0dRQW5pbWF0aW9uKFwiaW1nL3NrdWxsU2hvb3QucG5nXCIpLFxuICAgIFwiZmlyZWRcIjogZmFsc2UsXG4gICAgXCJkaXJcIjogXCJcIlxufVxubGV0IHNodXJpa2VuSW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICBcImlkXCI6IFwic2h1cmlrZW5cIixcbiAgICBcIndpZHRoXCI6IDEzLFxuICAgIFwiaGVpZ2h0XCI6IDEyLFxuICAgIFwieFNwZWVkXCI6IDQsXG4gICAgXCJ5U3BlZWRcIjogMixcbiAgICBcInhQb3NcIjogc2t1bGxIaWRpbmdTcG90LFxuICAgIFwieVBvc1wiOiBza3VsbEhpZGluZ1Nwb3QsXG4gICAgXCJhbmltXCI6IG5ld0dRQW5pbWF0aW9uKFwiaW1nL3NodXJpa2VuVGhpbmcucG5nXCIpLFxuICAgIFwiZmlyZWRcIjogZmFsc2UsXG4gICAgXCJkaXJcIjogXCJcIlxufVxubGV0IGFsaWVuczogU3ByaXRlRGljdFtdID0gW11cbmxldCB0eXBlT2ZFbmVteTogc3RyaW5nID0gXCJcIlxubGV0IGNyZWF0ZUVuZW15ID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBkZWNpZGVyOiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKVxuICAgIGxldCBpbmRleDogbnVtYmVyID0gYWxpZW5zLmxlbmd0aFxuICAgIGxldCBuZXdBbGllbkluZm86IFNwcml0ZURpY3QgPSB7XG4gICAgICAgIFwiaWRcIjogYHhhbGllbiR7aW5kZXh9YCxcbiAgICAgICAgXCJoZWlnaHRcIjogNTUsXG4gICAgICAgIFwid2lkdGhcIjogNTgsXG4gICAgICAgIFwieFNwZWVkXCI6IGdldFJhbmRvbUludCgyLCA3KSxcbiAgICAgICAgXCJ5U3BlZWRcIjogMCxcbiAgICAgICAgXCJ4UG9zXCI6IDAsXG4gICAgICAgIFwieVBvc1wiOiBnZXRSYW5kb21JbnQoMTAwLCAzNTApLFxuICAgICAgICBcImFuaW1cIjogbmV3R1FBbmltYXRpb24oXCJpbWcvYWxpZW5TcHJpdGVTaGVldDYwYnkxODAucG5nXCIsIDMsIDU4LCAzMzMuMywgQU5JTUFUSU9OX0hPUklaT05UQUwpLFxuICAgICAgICBcImhlYWx0aFwiOiBnZXRSYW5kb21JbnQoMiwgNilcbiAgICB9XG4gICAgaWYgKGRlY2lkZXIgPT0gMSkge1xuICAgICAgICBuZXdBbGllbkluZm9bXCJhbmltXCJdID0gbmV3R1FBbmltYXRpb24oXCJpbWcvRm94NjBieTM2MC5wbmdcIilcbiAgICAgICAgdHlwZU9mRW5lbXkgPSBcImZveFwiXG4gICAgfVxuICAgIGlmIChkZWNpZGVyID09IDIpIHtcbiAgICAgICAgbmV3QWxpZW5JbmZvW1wiYW5pbVwiXSA9IG5ld0dRQW5pbWF0aW9uKFwiaW1nL2FsaWVuU3ByaXRlU2hlZXQ2MGJ5MTgwLnBuZ1wiLCAzLCA1OCwgMzMzLjMsIEFOSU1BVElPTl9IT1JJWk9OVEFMKVxuICAgICAgICB0eXBlT2ZFbmVteSA9IFwiYWxpZW5cIlxuICAgIH1cbiAgICBhbGllbnNbaW5kZXhdID0gbmV3QWxpZW5JbmZvXG5cbiAgICBsZXQgeGFsaWVuSW5mbzogU3ByaXRlRGljdCA9IG5ld0FsaWVuSW5mb1xuICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZW5lbXlHcm91cCwgeGFsaWVuSW5mb1tcImlkXCJdLCB4YWxpZW5JbmZvW1wiYW5pbVwiXSwgeGFsaWVuSW5mb1tcIndpZHRoXCJdLCB4YWxpZW5JbmZvW1wiaGVpZ2h0XCJdKTtcblxuICAgIHNwcml0ZVNldFhZKHhhbGllbkluZm9bXCJpZFwiXSwgeGFsaWVuSW5mb1tcInhQb3NcIl0sIHhhbGllbkluZm9bXCJ5UG9zXCJdKVxufVxubGV0IGFsaWVuQm9zc2VzOiBTcHJpdGVEaWN0W10gPSBbXVxubGV0IGNyZWF0ZUJvc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGluZGV4OiBudW1iZXIgPSBhbGllbkJvc3Nlcy5sZW5ndGhcbiAgICBsZXQgbmV3QWxpZW5JbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IGBib3NzJHtpbmRleH1gLFxuICAgICAgICBcImhlaWdodFwiOiA4MCxcbiAgICAgICAgXCJ3aWR0aFwiOiA4MCxcbiAgICAgICAgXCJ4U3BlZWRcIjogZ2V0UmFuZG9tSW50KDIsIDYpLFxuICAgICAgICBcInlTcGVlZFwiOiAzLFxuICAgICAgICBcInhQb3NcIjogZ2V0UmFuZG9tSW50KDE1MCwgNDAwKSxcbiAgICAgICAgXCJ5UG9zXCI6IGdldFJhbmRvbUludCgxMDAsIDM1MCksXG4gICAgICAgIFwiYW5pbVwiOiBuZXdHUUFuaW1hdGlvbihcImltZy9hbGllbkJvc3M4MGJ5NTYwLnBuZ1wiLCA3LCA4MCwgMTY2LjY3LCBBTklNQVRJT05fSE9SSVpPTlRBTCksXG4gICAgICAgIFwiaGVhbHRoXCI6IDEwXG4gICAgfVxuICAgIGFsaWVuQm9zc2VzW2luZGV4XSA9IG5ld0FsaWVuSW5mb1xuXG4gICAgbGV0IHhhbGllbkluZm86IFNwcml0ZURpY3QgPSBuZXdBbGllbkluZm9cbiAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGVuZW15R3JvdXAsIHhhbGllbkluZm9bXCJpZFwiXSwgeGFsaWVuSW5mb1tcImFuaW1cIl0sIHhhbGllbkluZm9bXCJ3aWR0aFwiXSwgeGFsaWVuSW5mb1tcImhlaWdodFwiXSk7XG5cbiAgICBzcHJpdGVTZXRYKHhhbGllbkluZm9bXCJpZFwiXSwgeGFsaWVuSW5mb1tcInhQb3NcIl0pXG4gICAgc3ByaXRlU2V0WSh4YWxpZW5JbmZvW1wiaWRcIl0sIHhhbGllbkluZm9bXCJ5UG9zXCJdKVxufVxubGV0IGZveGVzOiBTcHJpdGVEaWN0W10gPSBbXVxubGV0IGNyZWF0ZUZveCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgaW5kZXg6IG51bWJlciA9IGZveGVzLmxlbmd0aFxuICAgIGxldCBuZXdGb3hJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IGBhZm94JHtpbmRleH1gLFxuICAgICAgICBcImhlaWdodFwiOiA1NSxcbiAgICAgICAgXCJ3aWR0aFwiOiA1OCxcbiAgICAgICAgXCJ4U3BlZWRcIjogZ2V0UmFuZG9tSW50KDMsIDYpLFxuICAgICAgICBcInlTcGVlZFwiOiBnZXRSYW5kb21JbnQoMiwgNiksXG4gICAgICAgIFwieFBvc1wiOiBnZXRSYW5kb21JbnQoMTAwLCAxNTApLFxuICAgICAgICBcInlQb3NcIjogZ2V0UmFuZG9tSW50KDEyNSwgMzQ2KSxcbiAgICAgICAgXCJhbmltXCI6IG5ld0dRQW5pbWF0aW9uKFwiaW1nL0ZveDYwYnkzNjAucG5nXCIpLFxuICAgICAgICBcImhlYWx0aFwiOiBnZXRSYW5kb21JbnQoMiwgNSlcbiAgICB9XG4gICAgZm94ZXNbaW5kZXhdID0gbmV3Rm94SW5mb1xuXG4gICAgbGV0IGFmb3hJbmZvOiBTcHJpdGVEaWN0ID0gbmV3Rm94SW5mb1xuICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZW5lbXlHcm91cCwgYWZveEluZm9bXCJpZFwiXSwgYWZveEluZm9bXCJhbmltXCJdLCBhZm94SW5mb1tcIndpZHRoXCJdLCBhZm94SW5mb1tcImhlaWdodFwiXSk7XG5cbiAgICBzcHJpdGVTZXRYKGFmb3hJbmZvW1wiaWRcIl0sIGFmb3hJbmZvW1wieFBvc1wiXSlcbiAgICBzcHJpdGVTZXRZKGFmb3hJbmZvW1wiaWRcIl0sIGFmb3hJbmZvW1wieVBvc1wiXSlcbn1cbmxldCBjb2luczogU3ByaXRlRGljdFtdID0gW11cbmxldCBjcmVhdGVDb2luID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBpbmRleDogbnVtYmVyID0gY29pbnMubGVuZ3RoXG4gICAgbGV0IG5ld0NvaW5JbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IGBhQ29pbiR7aW5kZXh9YCxcbiAgICAgICAgXCJoZWlnaHRcIjogOSxcbiAgICAgICAgXCJ3aWR0aFwiOiA5LFxuICAgICAgICBcInhTcGVlZFwiOiA0LFxuICAgICAgICBcInlTcGVlZFwiOiAtMyxcbiAgICAgICAgXCJ4UG9zXCI6IDEwICsgTWF0aC5yYW5kb20oKSAqIDYwLFxuICAgICAgICBcInlQb3NcIjogMTAwICsgTWF0aC5yYW5kb20oKSAqIDIwMCxcbiAgICAgICAgXCJhbmltXCI6IG5ld0dRQW5pbWF0aW9uKFwiaW1nL2NvaW5Qb3dlcnVwLnBuZ1wiKSxcbiAgICB9XG4gICAgY29pbnNbaW5kZXhdID0gbmV3Q29pbkluZm9cblxuICAgIGxldCBhQ29pbkluZm86IFNwcml0ZURpY3QgPSBuZXdDb2luSW5mb1xuICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAocG93ZXJVcEdyb3VwLCBhQ29pbkluZm9bXCJpZFwiXSwgYUNvaW5JbmZvW1wiYW5pbVwiXSwgYUNvaW5JbmZvW1wid2lkdGhcIl0sIGFDb2luSW5mb1tcImhlaWdodFwiXSk7XG5cbiAgICBzcHJpdGVTZXRYKGFDb2luSW5mb1tcImlkXCJdLCBhQ29pbkluZm9bXCJ4UG9zXCJdKVxuICAgIHNwcml0ZVNldFkoYUNvaW5JbmZvW1wiaWRcIl0sIGFDb2luSW5mb1tcInlQb3NcIl0pXG59XG5sZXQgaGVhcnRzOiBTcHJpdGVEaWN0W10gPSBbXVxubGV0IGNyZWF0ZUhlYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBpbmRleDogbnVtYmVyID0gaGVhcnRzLmxlbmd0aFxuICAgIGxldCBuZXdIZWFydEluZm86IFNwcml0ZURpY3QgPSB7XG4gICAgICAgIFwiaWRcIjogYGhlYXJ0JHtpbmRleH1gLFxuICAgICAgICBcImhlaWdodFwiOiA0MCxcbiAgICAgICAgXCJ3aWR0aFwiOiA0MCxcbiAgICAgICAgXCJ4U3BlZWRcIjogNCxcbiAgICAgICAgXCJ5U3BlZWRcIjogMyxcbiAgICAgICAgXCJ4UG9zXCI6IDEwMCArIE1hdGgucmFuZG9tKCkgKiAyNTAsXG4gICAgICAgIFwieVBvc1wiOiAxMDAgKyBNYXRoLnJhbmRvbSgpICogMjAwLFxuICAgICAgICBcImFuaW1cIjogbmV3R1FBbmltYXRpb24oXCJpbWcvaGVhcnRQb3dlcnVwLnBuZ1wiKSxcbiAgICB9XG4gICAgaGVhcnRzW2luZGV4XSA9IG5ld0hlYXJ0SW5mb1xuXG4gICAgbGV0IGFIZWFydEluZm86IFNwcml0ZURpY3QgPSBuZXdIZWFydEluZm9cbiAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKHBvd2VyVXBHcm91cCwgYUhlYXJ0SW5mb1tcImlkXCJdLCBhSGVhcnRJbmZvW1wiYW5pbVwiXSwgYUhlYXJ0SW5mb1tcIndpZHRoXCJdLCBhSGVhcnRJbmZvW1wiaGVpZ2h0XCJdKTtcblxuICAgIHNwcml0ZVNldFgoYUhlYXJ0SW5mb1tcImlkXCJdLCBhSGVhcnRJbmZvW1wieFBvc1wiXSlcbiAgICBzcHJpdGVTZXRZKGFIZWFydEluZm9bXCJpZFwiXSwgYUhlYXJ0SW5mb1tcInlQb3NcIl0pXG59XG5sZXQgc2V0dXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQ3JlYXRlIEdyb3Vwc1xuICAgIGxldCBib3NzR3JvdXA6IHN0cmluZyA9IFwiYm9zc1wiXG4gICAgbGV0IHBsYXllckdyb3VwOiBzdHJpbmcgPSBcImdob3N0UGxheWVyXCJcbiAgICBsZXQgYmFja2dyb3VuZEdyb3VwOiBzdHJpbmcgPSBcImJhY2tncm91bmRzXCJcbiAgICBsZXQgY2xvdWRHcm91cDogc3RyaW5nID0gXCJjbG91ZHNcIlxuICAgIGxldCBwbGF0Zm9ybUdyb3VwOiBzdHJpbmcgPSBcInBsYXRmb3JtXCJcbiAgICBsZXQgaHVkR3JvdXBOYW1lOiBzdHJpbmcgPSBcImh1ZEdyb3VwXCJcbiAgICBsZXQgbGFzZXJHcm91cE5hbWU6IHN0cmluZyA9IFwibGFzZXJHcm91cFwiXG4gICAgY3JlYXRlR3JvdXBJblBsYXlncm91bmQoYmFja2dyb3VuZEdyb3VwKVxuICAgIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kKGxhc2VyR3JvdXBOYW1lKVxuICAgIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kKGNsb3VkR3JvdXApXG4gICAgY3JlYXRlR3JvdXBJblBsYXlncm91bmQoZW5lbXlHcm91cClcbiAgICBjcmVhdGVHcm91cEluUGxheWdyb3VuZChib3NzR3JvdXApXG4gICAgY3JlYXRlR3JvdXBJblBsYXlncm91bmQocG93ZXJVcEdyb3VwKVxuICAgIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kKHBsYXllckdyb3VwKVxuICAgIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kKHBsYXRmb3JtR3JvdXApXG4gICAgY3JlYXRlR3JvdXBJblBsYXlncm91bmQoaHVkR3JvdXBOYW1lKVxuICAgIC8vIENyZWF0ZSBTcHJpdGVzXG4gICAgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAoaHVkR3JvdXBOYW1lLCBzY29yZUJvYXJkSW5mb1tcImlkXCJdLCBzY29yZUJvYXJkSW5mb1tcIndpZHRoXCJdLCBzY29yZUJvYXJkSW5mb1tcImhlaWdodFwiXSwgc2NvcmVCb2FyZEluZm9bXCJ4UG9zXCJdLCBzY29yZUJvYXJkSW5mb1tcInlQb3NcIl0pXG4gICAgY3JlYXRlU3ByaXRlSW5Hcm91cChodWRHcm91cE5hbWUsIHNwbGFzaFNjcmVlbkluZm9bXCJpZFwiXSwgc3BsYXNoU2NyZWVuSW5mb1tcImFuaW1cIl0sIHNwbGFzaFNjcmVlbkluZm9bXCJ3aWR0aFwiXSxcbiAgICAgICAgc3BsYXNoU2NyZWVuSW5mb1tcImhlaWdodFwiXSwgc3BsYXNoU2NyZWVuSW5mb1tcInhQb3NcIl0sIHNwbGFzaFNjcmVlbkluZm9bXCJ5UG9zXCJdKTtcbiAgICBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cChodWRHcm91cE5hbWUsIGdhbWVPdmVySW5mb1tcImlkXCJdLCBnYW1lT3ZlckluZm9bXCJ3aWR0aFwiXSxcbiAgICAgICAgZ2FtZU92ZXJJbmZvW1wiaGVpZ2h0XCJdLCBnYW1lT3ZlckluZm9bXCJ4UG9zXCJdLCBnYW1lT3ZlckluZm9bXCJ5UG9zXCJdKTtcbiAgICBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cChodWRHcm91cE5hbWUsIHRyYW5zcGFyZW50U2NyZWVuSW5mb1tcImlkXCJdLCB0cmFuc3BhcmVudFNjcmVlbkluZm9bXCJ3aWR0aFwiXSxcbiAgICAgICAgdHJhbnNwYXJlbnRTY3JlZW5JbmZvW1wiaGVpZ2h0XCJdLCB0cmFuc3BhcmVudFNjcmVlbkluZm9bXCJ4UG9zXCJdLCB0cmFuc3BhcmVudFNjcmVlbkluZm9bXCJ5UG9zXCJdKTtcbiAgICBzcHJpdGUodHJhbnNwYXJlbnRTY3JlZW5JbmZvW1wiaWRcIl0pLmNzcyhcIm9wYWNpdHlcIiwgXCIwLjBcIilcbiAgICBzcHJpdGUodHJhbnNwYXJlbnRTY3JlZW5JbmZvW1wiaWRcIl0pLmNzcyhcImZvbnQtc2l6ZVwiLCBcIjIwcHhcIilcbiAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGJhY2tncm91bmRHcm91cCwgYmFja2dyb3VuZDFJbmZvW1wiaWRcIl0sIGJhY2tncm91bmQxSW5mb1tcImFuaW1cIl0sIGJhY2tncm91bmQxSW5mb1tcIndpZHRoXCJdLCBiYWNrZ3JvdW5kMUluZm9bXCJoZWlnaHRcIl0sIGJhY2tncm91bmQxSW5mb1tcInhQb3NcIl0sIGJhY2tncm91bmQxSW5mb1tcInlQb3NcIl0pO1xuICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoYmFja2dyb3VuZEdyb3VwLCBiYWNrZ3JvdW5kMkluZm9bXCJpZFwiXSwgYmFja2dyb3VuZDJJbmZvW1wiYW5pbVwiXSwgYmFja2dyb3VuZDJJbmZvW1wid2lkdGhcIl0sIGJhY2tncm91bmQySW5mb1tcImhlaWdodFwiXSwgYmFja2dyb3VuZDJJbmZvW1wieFBvc1wiXSwgYmFja2dyb3VuZDJJbmZvW1wieVBvc1wiXSk7XG4gICAgY3JlYXRlU3ByaXRlSW5Hcm91cChiYWNrZ3JvdW5kR3JvdXAsIGJhY2tncm91bmQzSW5mb1tcImlkXCJdLCBiYWNrZ3JvdW5kM0luZm9bXCJhbmltXCJdLCBiYWNrZ3JvdW5kM0luZm9bXCJ3aWR0aFwiXSwgYmFja2dyb3VuZDNJbmZvW1wiaGVpZ2h0XCJdLCBiYWNrZ3JvdW5kM0luZm9bXCJ4UG9zXCJdLCBiYWNrZ3JvdW5kM0luZm9bXCJ5UG9zXCJdKTtcblxuICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAocGxheWVyR3JvdXAsIHBsYXllckluZm9bXCJpZFwiXSwgcGxheWVySW5mb1tcImFuaW1cIl0sIHBsYXllckluZm9bXCJ3aWR0aFwiXSwgcGxheWVySW5mb1tcImhlaWdodFwiXSwgcGxheWVySW5mb1tcInhQb3NcIl0sIHBsYXllckluZm9bXCJ5UG9zXCJdKTtcblxuICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAobGFzZXJHcm91cE5hbWUsIHNrdWxsSW5mb1tcImlkXCJdLCBza3VsbEluZm9bXCJhbmltXCJdLCBza3VsbEluZm9bXCJ3aWR0aFwiXSwgc2t1bGxJbmZvW1wiaGVpZ2h0XCJdKTtcbiAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGxhc2VyR3JvdXBOYW1lLCBzaHVyaWtlbkluZm9bXCJpZFwiXSwgc2h1cmlrZW5JbmZvW1wiYW5pbVwiXSwgc2h1cmlrZW5JbmZvW1wid2lkdGhcIl0sIHNodXJpa2VuSW5mb1tcImhlaWdodFwiXSk7XG5cbiAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGJvc3NHcm91cCwgYWxpZW5Cb3NzSW5mb1tcImlkXCJdLCBhbGllbkJvc3NJbmZvW1wiYW5pbVwiXSwgYWxpZW5Cb3NzSW5mb1tcIndpZHRoXCJdLCBhbGllbkJvc3NJbmZvW1wiaGVpZ2h0XCJdLCBhbGllbkJvc3NJbmZvW1wieFBvc1wiXSwgYWxpZW5Cb3NzSW5mb1tcInlQb3NcIl0pO1xuXG4gICAgY3JlYXRlU3ByaXRlSW5Hcm91cChwb3dlclVwR3JvdXAsIGhlYXJ0W1wiaWRcIl0sIGhlYXJ0W1wiYW5pbVwiXSwgaGVhcnRbXCJ3aWR0aFwiXSwgaGVhcnRbXCJoZWlnaHRcIl0sIGhlYXJ0W1wieFBvc1wiXSwgaGVhcnRbXCJ5UG9zXCJdKTtcbiAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKHBvd2VyVXBHcm91cCwgY29pbltcImlkXCJdLCBjb2luW1wiYW5pbVwiXSwgY29pbltcIndpZHRoXCJdLCBjb2luW1wiaGVpZ2h0XCJdLCBjb2luW1wieFBvc1wiXSwgY29pbltcInlQb3NcIl0pO1xuXG4gICAgY3JlYXRlU3ByaXRlSW5Hcm91cChjbG91ZEdyb3VwLCBjbG91ZDFbXCJpZFwiXSwgY2xvdWQxW1wiYW5pbVwiXSwgY2xvdWQxW1wid2lkdGhcIl0sIGNsb3VkMVtcImhlaWdodFwiXSwgY2xvdWQxW1wieFBvc1wiXSwgY2xvdWQxW1wieVBvc1wiXSk7XG4gICAgY3JlYXRlU3ByaXRlSW5Hcm91cChjbG91ZEdyb3VwLCBjbG91ZDJbXCJpZFwiXSwgY2xvdWQyW1wiYW5pbVwiXSwgY2xvdWQyW1wid2lkdGhcIl0sIGNsb3VkMltcImhlaWdodFwiXSwgY2xvdWQyW1wieFBvc1wiXSwgY2xvdWQyW1wieVBvc1wiXSk7XG5cbn07IC8vIGVuZCBvZiBzZXR1cCgpIGZ1bmN0aW9uLiBOb3RpY2UgdGhlIGJyYWNlcyBtYXRjaCFcbmxldCBtb3ZlU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZTogU3ByaXRlRGljdCkge1xuICAgIHNwcml0ZVtcInhQb3NcIl0gPSBzcHJpdGVbXCJ4UG9zXCJdICsgc3ByaXRlW1wieFNwZWVkXCJdXG4gICAgaWYgKHNwcml0ZVtcInhQb3NcIl0gPCAtMSAqIHNwcml0ZUdldFdpZHRoKHNwcml0ZVtcImlkXCJdKSkge1xuICAgICAgICBzcHJpdGVbXCJ4UG9zXCJdID0gUExBWUdST1VORF9XSURUSFxuICAgIH1cbiAgICBpZiAoc3ByaXRlW1wieFBvc1wiXSA+IFBMQVlHUk9VTkRfV0lEVEgpIHtcbiAgICAgICAgc3ByaXRlW1wieFBvc1wiXSA9IC0xICogc3ByaXRlR2V0V2lkdGgoc3ByaXRlW1wiaWRcIl0pXG4gICAgfVxuICAgIHNwcml0ZVNldFgoc3ByaXRlW1wiaWRcIl0sIHNwcml0ZVtcInhQb3NcIl0pXG4gICAgc3ByaXRlW1wieVBvc1wiXSA9IHNwcml0ZVtcInlQb3NcIl0gKyBzcHJpdGVbXCJ5U3BlZWRcIl1cbiAgICBpZiAoc3ByaXRlW1wieVBvc1wiXSA8IC0xICogc3ByaXRlR2V0V2lkdGgoc3ByaXRlW1wiaWRcIl0pKSB7XG4gICAgICAgIHNwcml0ZVtcInlQb3NcIl0gPSBQTEFZR1JPVU5EX0hFSUdIVFxuICAgIH1cbiAgICBpZiAoc3ByaXRlW1wieVBvc1wiXSA+IDQ4MCkge1xuICAgICAgICBzcHJpdGVbXCJ5UG9zXCJdID0gLTEgKiBzcHJpdGVHZXRXaWR0aChzcHJpdGVbXCJpZFwiXSlcbiAgICB9XG4gICAgc3ByaXRlU2V0WShzcHJpdGVbXCJpZFwiXSwgc3ByaXRlW1wieVBvc1wiXSlcbn1cbmxldCBtb3ZlQWxpZW4gPSBmdW5jdGlvbiAoc3ByaXRlOiBTcHJpdGVEaWN0KSB7XG4gICAgc3ByaXRlW1wieFBvc1wiXSA9IHNwcml0ZVtcInhQb3NcIl0gKyBzcHJpdGVbXCJ4U3BlZWRcIl1cbiAgICBpZiAoc3ByaXRlW1wieFBvc1wiXSA+IFBMQVlHUk9VTkRfV0lEVEgpIHtcbiAgICAgICAgc3ByaXRlW1wieFBvc1wiXSA9IC0xICogc3ByaXRlR2V0V2lkdGgoc3ByaXRlW1wiaWRcIl0pXG4gICAgfVxuICAgIHNwcml0ZVNldFgoc3ByaXRlW1wiaWRcIl0sIHNwcml0ZVtcInhQb3NcIl0pXG4gICAgc3ByaXRlW1wieVBvc1wiXSA9IHNwcml0ZVtcInlQb3NcIl0gKyBzcHJpdGVbXCJ5U3BlZWRcIl1cbiAgICBpZiAoc3ByaXRlW1wieVBvc1wiXSA8IC0xICogc3ByaXRlR2V0SGVpZ2h0KHNwcml0ZVtcImlkXCJdKSkge1xuICAgICAgICBzcHJpdGVbXCJ5UG9zXCJdID0gUExBWUdST1VORF9IRUlHSFRcbiAgICB9XG4gICAgaWYgKHNwcml0ZVtcInlQb3NcIl0gPiA0ODApIHtcbiAgICAgICAgc3ByaXRlW1wieVBvc1wiXSA9IC0xICogc3ByaXRlR2V0SGVpZ2h0KHNwcml0ZVtcImlkXCJdKVxuICAgIH1cbiAgICBzcHJpdGVTZXRZKHNwcml0ZVtcImlkXCJdLCBzcHJpdGVbXCJ5UG9zXCJdKVxufVxubGV0IGRlY2F5Qm91bmNlU3ByaXRlID0gZnVuY3Rpb24gKGluZm86IFNwcml0ZURpY3QpIHtcbiAgICBsZXQgZGVjYXlSYXRlOiBudW1iZXIgPSAwLjZcblxuICAgIGluZm9bXCJ4UG9zXCJdID0gaW5mb1tcInhQb3NcIl0gKyBpbmZvW1wieFNwZWVkXCJdXG4gICAgaWYgKGluZm9bXCJ4UG9zXCJdIDwgMCkge1xuICAgICAgICBpbmZvW1wieFNwZWVkXCJdID0gLTEgKiBpbmZvW1wieFNwZWVkXCJdICogZGVjYXlSYXRlXG4gICAgICAgIGluZm9bXCJ4UG9zXCJdID0gMFxuICAgIH1cbiAgICBpZiAoaW5mb1tcInhQb3NcIl0gPiBQTEFZR1JPVU5EX1dJRFRIIC0gaW5mb1tcIndpZHRoXCJdKSB7XG4gICAgICAgIGluZm9bXCJ4U3BlZWRcIl0gPSAtMSAqIGluZm9bXCJ4U3BlZWRcIl0gKiBkZWNheVJhdGVcbiAgICAgICAgaW5mb1tcInhQb3NcIl0gPSBQTEFZR1JPVU5EX1dJRFRIIC0gaW5mb1tcIndpZHRoXCJdXG4gICAgfVxuICAgIHNwcml0ZVNldFgoaW5mb1tcImlkXCJdLCBpbmZvW1wieFBvc1wiXSlcblxuICAgIGluZm9bXCJ5UG9zXCJdID0gaW5mb1tcInlQb3NcIl0gKyBpbmZvW1wieVNwZWVkXCJdXG4gICAgaWYgKGluZm9bXCJ5UG9zXCJdIDwgMCkge1xuICAgICAgICBpbmZvW1wieVNwZWVkXCJdID0gLTEgKiBpbmZvW1wieVNwZWVkXCJdICogZGVjYXlSYXRlXG4gICAgICAgIGluZm9bXCJ5UG9zXCJdID0gMFxuICAgIH1cbiAgICBpZiAoaW5mb1tcInlQb3NcIl0gPiBQTEFZR1JPVU5EX0hFSUdIVCAtIGluZm9bXCJoZWlnaHRcIl0pIHtcbiAgICAgICAgaW5mb1tcInlTcGVlZFwiXSA9IC0xICogaW5mb1tcInlTcGVlZFwiXSAqIGRlY2F5UmF0ZVxuICAgICAgICBpbmZvW1wieVBvc1wiXSA9IFBMQVlHUk9VTkRfSEVJR0hUIC0gaW5mb1tcImhlaWdodFwiXVxuICAgICAgICBpZiAoTWF0aC5hYnMoaW5mb1tcInlTcGVlZFwiXSkgPCAxKSB7XG4gICAgICAgICAgICBpbmZvW1wibW92ZW1lbnRTdGF0ZVwiXSA9IFwic3RhbmRpbmdcIlxuICAgICAgICB9XG4gICAgfVxuICAgIHNwcml0ZVNldFkoaW5mb1tcImlkXCJdLCBpbmZvW1wieVBvc1wiXSlcbn1cbmxldCByZXNldFNjZW5lID0gZnVuY3Rpb24gKCkge1xuXG4gICAgYWxpZW5Cb3NzSW5mb1tcInhQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgYWxpZW5Cb3NzSW5mb1tcInlQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgYWxpZW5Cb3NzSW5mb1tcInZpc2libGVcIl0gPSBmYWxzZVxuXG4gICAgc2t1bGxJbmZvW1wieFBvc1wiXSA9IHNrdWxsSGlkaW5nU3BvdFxuICAgIHNrdWxsSW5mb1tcInlQb3NcIl0gPSBza3VsbEhpZGluZ1Nwb3RcblxufVxubGV0IG1vdmVHaG9zdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBwbGF5ZXJJbmZvW1wieFBvc1wiXSA9IHBsYXllckluZm9bXCJ4UG9zXCJdICsgcGxheWVySW5mb1tcInhTcGVlZFwiXVxuICAgIGlmIChwbGF5ZXJJbmZvW1wieFBvc1wiXSA+PSBQTEFZR1JPVU5EX1dJRFRIIC0gcGxheWVySW5mb1tcIndpZHRoXCJdICYmIHNjZW5lMUVuZW1pZXNEZWFmZWF0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgcGxheWVySW5mb1tcInhQb3NcIl0gPSA1NzVcbiAgICB9XG4gICAgaWYgKGJhY2tncm91bmRzWzJdID09IHRydWUgJiYgcGxheWVySW5mb1tcInhQb3NcIl0gPj0gUExBWUdST1VORF9XSURUSCAtIHBsYXllckluZm9bXCJ3aWR0aFwiXSAmJiBzY2VuZTJFbmVtaWVzRGVhZmVhdGVkID09IGZhbHNlKSB7XG4gICAgICAgIHBsYXllckluZm9bXCJ4UG9zXCJdID0gNTc1XG4gICAgfVxuICAgIGlmIChiYWNrZ3JvdW5kc1szXSA9PSB0cnVlICYmIHBsYXllckluZm9bXCJ4UG9zXCJdID49IFBMQVlHUk9VTkRfV0lEVEggLSBwbGF5ZXJJbmZvW1wid2lkdGhcIl0pIHtcbiAgICAgICAgcGxheWVySW5mb1tcInhQb3NcIl0gPSA1NzVcbiAgICB9XG4gICAgaWYgKHNjZW5lMUVuZW1pZXNEZWFmZWF0ZWQgPT0gdHJ1ZSkge1xuICAgICAgICBzcHJpdGUodHJhbnNwYXJlbnRTY3JlZW5JbmZvW1wiaWRcIl0pLmh0bWwoXCJTdGFnZSBDbGVhcmVkXCIpXG4gICAgfVxuICAgIGlmIChwbGF5ZXJJbmZvW1wieFBvc1wiXSA+PSBQTEFZR1JPVU5EX1dJRFRIICYmIGJhY2tncm91bmRzWzFdID09IHRydWUgJiYgc2NlbmUxRW5lbWllc0RlYWZlYXRlZCkge1xuICAgICAgICBiYWNrZ3JvdW5kc1syXSA9IHRydWVcbiAgICAgICAgYmFja2dyb3VuZHNbMV0gPSBmYWxzZVxuICAgICAgICBiYWNrZ3JvdW5kMkluZm9bXCJ4UG9zXCJdID0gMFxuICAgICAgICBiYWNrZ3JvdW5kMkluZm9bXCJ5UG9zXCJdID0gMFxuICAgICAgICBzcHJpdGVTZXRYWShiYWNrZ3JvdW5kMkluZm9bXCJpZFwiXSwgYmFja2dyb3VuZDJJbmZvW1wieFBvc1wiXSwgYmFja2dyb3VuZDJJbmZvW1wieVBvc1wiXSlcbiAgICAgICAgYmFja2dyb3VuZDFJbmZvW1wieFBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgYmFja2dyb3VuZDFJbmZvW1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgc3ByaXRlU2V0WFkoYmFja2dyb3VuZDFJbmZvW1wiaWRcIl0sIGJhY2tncm91bmQxSW5mb1tcInhQb3NcIl0sIGJhY2tncm91bmQxSW5mb1tcInlQb3NcIl0pXG4gICAgICAgIHBsYXllckluZm9bXCJ4UG9zXCJdID0gMFxuICAgICAgICBjb25zb2xlUHJpbnQoXCJyaWdodCAxIHRvIDJcIilcbiAgICAgICAgcmVzZXRTY2VuZSgpXG4gICAgICAgIHNjZW5lMUVuZW1pZXNEZWFmZWF0ZWQgPSBmYWxzZVxuICAgIH1cbiAgICBlbHNlIGlmIChwbGF5ZXJJbmZvW1wieFBvc1wiXSA8IDEgJiYgYmFja2dyb3VuZHNbMV0gPT0gdHJ1ZSkge1xuICAgICAgICBwbGF5ZXJJbmZvW1wieFBvc1wiXSA9IDFcbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVySW5mb1tcInhQb3NcIl0gPj0gUExBWUdST1VORF9XSURUSCAtIHBsYXllckluZm9bXCJ3aWR0aFwiXSAmJiBiYWNrZ3JvdW5kc1tcImRlc2VydDNcIl0gPT0gdHJ1ZSkge1xuICAgICAgICBwbGF5ZXJJbmZvW1wieFBvc1wiXSA9IFBMQVlHUk9VTkRfV0lEVEggLSBwbGF5ZXJJbmZvW1wid2lkdGhcIl1cbiAgICB9XG4gICAgZWxzZSBpZiAocGxheWVySW5mb1tcInhQb3NcIl0gPCAxICYmIGJhY2tncm91bmRzWzJdID09IHRydWUpIHtcbiAgICAgICAgcGxheWVySW5mb1tcInhQb3NcIl0gPSAxXG4gICAgfVxuICAgIGlmIChwbGF5ZXJJbmZvW1wieFBvc1wiXSA+PSBQTEFZR1JPVU5EX1dJRFRIICYmIGJhY2tncm91bmRzWzJdID09IHRydWUpIHtcbiAgICAgICAgYmFja2dyb3VuZHNbMl0gPSBmYWxzZVxuICAgICAgICBiYWNrZ3JvdW5kc1szXSA9IHRydWVcbiAgICAgICAgYmFja2dyb3VuZDNJbmZvW1wieFBvc1wiXSA9IDBcbiAgICAgICAgYmFja2dyb3VuZDNJbmZvW1wieVBvc1wiXSA9IDBcbiAgICAgICAgYmFja2dyb3VuZDJJbmZvW1wieFBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgYmFja2dyb3VuZDJJbmZvW1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgc3ByaXRlU2V0WFkoYmFja2dyb3VuZDNJbmZvW1wiaWRcIl0sIGJhY2tncm91bmQzSW5mb1tcInhQb3NcIl0sIGJhY2tncm91bmQzSW5mb1tcInlQb3NcIl0pXG4gICAgICAgIHNwcml0ZVNldFhZKGJhY2tncm91bmQySW5mb1tcImlkXCJdLCBiYWNrZ3JvdW5kMkluZm9bXCJ4UG9zXCJdLCBiYWNrZ3JvdW5kMkluZm9bXCJ5UG9zXCJdKVxuICAgICAgICBwbGF5ZXJJbmZvW1wieFBvc1wiXSA9IDBcbiAgICAgICAgY29uc29sZVByaW50KFwicmlnaHQgMiB0byAzXCIpXG4gICAgICAgIHJlc2V0U2NlbmUoKVxuICAgIH1cbiAgICBlbHNlIGlmIChwbGF5ZXJJbmZvW1wieFBvc1wiXSA8IDEgJiYgYmFja2dyb3VuZHNbM10gPT0gdHJ1ZSkge1xuICAgICAgICBwbGF5ZXJJbmZvW1wieFBvc1wiXSA9IDFcbiAgICB9XG4gICAgaWYgKHBsYXllckluZm9bXCJ4UG9zXCJdID49IFBMQVlHUk9VTkRfV0lEVEggLSBwbGF5ZXJJbmZvW1wid2lkdGhcIl0gJiYgYmFja2dyb3VuZHNbM10gPT0gdHJ1ZSkge1xuICAgICAgICBwbGF5ZXJJbmZvW1wieFBvc1wiXSA9IDU3NVxuICAgIH1cbiAgICBzcHJpdGVTZXRYKHBsYXllckluZm9bXCJpZFwiXSwgcGxheWVySW5mb1tcInhQb3NcIl0pXG4gICAgcGxheWVySW5mb1tcInlQb3NcIl0gPSBwbGF5ZXJJbmZvW1wieVBvc1wiXSArIHBsYXllckluZm9bXCJ5U3BlZWRcIl1cbiAgICBpZiAocGxheWVySW5mb1tcInlQb3NcIl0gPCAtMSAqIHNwcml0ZUdldFdpZHRoKHBsYXllckluZm9bXCJpZFwiXSkpIHtcbiAgICAgICAgcGxheWVySW5mb1tcInlQb3NcIl0gPSBQTEFZR1JPVU5EX0hFSUdIVFxuICAgIH1cbiAgICBpZiAocGxheWVySW5mb1tcInlQb3NcIl0gPiA0ODApIHtcbiAgICAgICAgcGxheWVySW5mb1tcInlQb3NcIl0gPSAtMSAqIHNwcml0ZUdldFdpZHRoKHBsYXllckluZm9bXCJpZFwiXSlcbiAgICB9XG4gICAgc3ByaXRlU2V0WShwbGF5ZXJJbmZvW1wiaWRcIl0sIHBsYXllckluZm9bXCJ5UG9zXCJdKVxufVxubGV0IGJvdW5jZVNwcml0ZSA9IGZ1bmN0aW9uIChhU3ByaXRlSW5mbzogU3ByaXRlRGljdCkge1xuICAgIGFTcHJpdGVJbmZvW1wieFBvc1wiXSA9IGFTcHJpdGVJbmZvW1wieFBvc1wiXSArIGFTcHJpdGVJbmZvW1wieFNwZWVkXCJdXG4gICAgaWYgKGFTcHJpdGVJbmZvW1wieFBvc1wiXSA8IDApIHtcbiAgICAgICAgYVNwcml0ZUluZm9bXCJ4U3BlZWRcIl0gPSAtMSAqIGFTcHJpdGVJbmZvW1wieFNwZWVkXCJdXG4gICAgfVxuICAgIGlmIChhU3ByaXRlSW5mb1tcInhQb3NcIl0gPiBQTEFZR1JPVU5EX1dJRFRIIC0gYVNwcml0ZUluZm9bXCJ3aWR0aFwiXSkge1xuICAgICAgICBhU3ByaXRlSW5mb1tcInhTcGVlZFwiXSA9IC0xICogYVNwcml0ZUluZm9bXCJ4U3BlZWRcIl1cbiAgICB9XG4gICAgc3ByaXRlU2V0WChhU3ByaXRlSW5mb1tcImlkXCJdLCBhU3ByaXRlSW5mb1tcInhQb3NcIl0pXG4gICAgYVNwcml0ZUluZm9bXCJ5UG9zXCJdID0gYVNwcml0ZUluZm9bXCJ5UG9zXCJdICsgYVNwcml0ZUluZm9bXCJ5U3BlZWRcIl1cbiAgICBpZiAoYVNwcml0ZUluZm9bXCJ5UG9zXCJdIDwgMCkge1xuICAgICAgICBhU3ByaXRlSW5mb1tcInlTcGVlZFwiXSA9IC0xICogYVNwcml0ZUluZm9bXCJ5U3BlZWRcIl1cbiAgICB9XG4gICAgaWYgKGFTcHJpdGVJbmZvW1wieVBvc1wiXSA+IFBMQVlHUk9VTkRfSEVJR0hUIC0gYVNwcml0ZUluZm9bXCJoZWlnaHRcIl0pIHtcbiAgICAgICAgYVNwcml0ZUluZm9bXCJ5U3BlZWRcIl0gPSAtMSAqIGFTcHJpdGVJbmZvW1wieVNwZWVkXCJdXG4gICAgfVxuICAgIHNwcml0ZVNldFkoYVNwcml0ZUluZm9bXCJpZFwiXSwgYVNwcml0ZUluZm9bXCJ5UG9zXCJdKVxufVxubGV0IG1vdmVTa3VsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc3RkTGFzZXJYU3BlZWQ6IG51bWJlciA9IDdcbiAgICBsZXQgc2t1bGxDb29sZG93bjogbnVtYmVyID0gMTAwMFxuICAgIGxldCB0aW1lU2luY2VQbGF5ZXJGaXJlZDogbnVtYmVyID0gY3VycmVudERhdGUoKSAtIHBsYXllckluZm9bXCJ0aW1lU2t1bGxXYXNGaXJlZFwiXVxuICAgIGlmIChnZXRLZXlTdGF0ZSgzMikgJiYgc2t1bGxJbmZvW1wiZmlyZWRcIl0gPT0gZmFsc2UgJiYgIXBsYXllckluZm9bXCJpc0xlZnRcIl0gJiYgdGltZVNpbmNlUGxheWVyRmlyZWQgPiBza3VsbENvb2xkb3duKSB7XG4gICAgICAgIHNrdWxsSW5mb1tcInhQb3NcIl0gPSBwbGF5ZXJJbmZvW1wieFBvc1wiXSArIHBsYXllckluZm9bXCJ3aWR0aFwiXVxuICAgICAgICBza3VsbEluZm9bXCJ5UG9zXCJdID0gcGxheWVySW5mb1tcInlQb3NcIl0gKyBwbGF5ZXJJbmZvW1wiaGVpZ2h0XCJdIC8gMlxuICAgICAgICBza3VsbEluZm9bXCJ4U3BlZWRcIl0gPSBzdGRMYXNlclhTcGVlZFxuICAgICAgICBza3VsbEluZm9bXCJmaXJlZFwiXSA9IHRydWVcbiAgICAgICAgc2t1bGxJbmZvW1wiZGlyXCJdID0gXCJyaWdodFwiXG4gICAgICAgIHBsYXllckluZm9bXCJ0aW1lU2t1bGxXYXNGaXJlZFwiXSA9IGN1cnJlbnREYXRlKClcbiAgICB9XG4gICAgaWYgKGdldEtleVN0YXRlKDMyKSAmJiBza3VsbEluZm9bXCJmaXJlZFwiXSA9PSBmYWxzZSAmJiBwbGF5ZXJJbmZvW1wiaXNMZWZ0XCJdICYmIHRpbWVTaW5jZVBsYXllckZpcmVkID4gc2t1bGxDb29sZG93bikge1xuICAgICAgICBza3VsbEluZm9bXCJ4UG9zXCJdID0gcGxheWVySW5mb1tcInhQb3NcIl0gLSBza3VsbEluZm9bXCJ3aWR0aFwiXSArIHNrdWxsSW5mb1tcInhTcGVlZFwiXVxuICAgICAgICBza3VsbEluZm9bXCJ5UG9zXCJdID0gcGxheWVySW5mb1tcInlQb3NcIl0gKyBwbGF5ZXJJbmZvW1wiaGVpZ2h0XCJdIC8gMlxuICAgICAgICBza3VsbEluZm9bXCJ4U3BlZWRcIl0gPSBzdGRMYXNlclhTcGVlZFxuICAgICAgICBza3VsbEluZm9bXCJmaXJlZFwiXSA9IHRydWVcbiAgICAgICAgc2t1bGxJbmZvW1wiZGlyXCJdID0gXCJsZWZ0XCJcbiAgICAgICAgcGxheWVySW5mb1tcInRpbWVTa3VsbFdhc0ZpcmVkXCJdID0gY3VycmVudERhdGUoKVxuICAgIH1cbiAgICBpZiAoc2t1bGxJbmZvW1wieFBvc1wiXSA+IFBMQVlHUk9VTkRfV0lEVEggfHwgc2t1bGxJbmZvW1wieFBvc1wiXSA8IDAgfHwgc2t1bGxJbmZvW1wieVBvc1wiXSA+PSBQTEFZR1JPVU5EX0hFSUdIVCB8fCBza3VsbEluZm9bXCJ5UG9zXCJdIDw9IDApIHtcbiAgICAgICAgc2t1bGxJbmZvW1wiZmlyZWRcIl0gPSBmYWxzZVxuICAgICAgICBza3VsbEluZm9bXCJ4UG9zXCJdID0gc2t1bGxIaWRpbmdTcG90XG4gICAgICAgIHNrdWxsSW5mb1tcInlQb3NcIl0gPSBza3VsbEhpZGluZ1Nwb3RcbiAgICAgICAgc2t1bGxJbmZvW1wieFNwZWVkXCJdID0gMFxuICAgIH1cbiAgICBpZiAoc2t1bGxJbmZvW1wiZGlyXCJdID09IFwicmlnaHRcIikge1xuICAgICAgICBza3VsbEluZm9bXCJ4UG9zXCJdID0gc2t1bGxJbmZvW1wieFBvc1wiXSArIHNrdWxsSW5mb1tcInhTcGVlZFwiXVxuICAgICAgICBza3VsbEluZm9bXCJ5UG9zXCJdID0gcGxheWVySW5mb1tcInlQb3NcIl0gKyBwbGF5ZXJJbmZvW1wiaGVpZ2h0XCJdIC8gMlxuICAgICAgICBzcHJpdGVTZXRYKHNrdWxsSW5mb1tcImlkXCJdLCBza3VsbEluZm9bXCJ4UG9zXCJdKVxuICAgICAgICBzcHJpdGVTZXRZKHNrdWxsSW5mb1tcImlkXCJdLCBza3VsbEluZm9bXCJ5UG9zXCJdKVxuICAgIH1cbiAgICBpZiAoc2t1bGxJbmZvW1wiZGlyXCJdID09IFwibGVmdFwiKSB7XG4gICAgICAgIHNrdWxsSW5mb1tcInhQb3NcIl0gPSBza3VsbEluZm9bXCJ4UG9zXCJdICsgLXNrdWxsSW5mb1tcInhTcGVlZFwiXVxuICAgICAgICBzcHJpdGVTZXRYKHNrdWxsSW5mb1tcImlkXCJdLCBza3VsbEluZm9bXCJ4UG9zXCJdKVxuICAgICAgICBza3VsbEluZm9bXCJ5UG9zXCJdID0gcGxheWVySW5mb1tcInlQb3NcIl0gKyBwbGF5ZXJJbmZvW1wiaGVpZ2h0XCJdIC8gMlxuICAgICAgICBzcHJpdGVTZXRZKHNrdWxsSW5mb1tcImlkXCJdLCBza3VsbEluZm9bXCJ5UG9zXCJdKVxuICAgIH1cbiAgICBpZiAoc2t1bGxJbmZvW1wiZGlyXCJdID09IFwiZG93blwiKSB7XG4gICAgICAgIHNrdWxsSW5mb1tcInlQb3NcIl0gPSBza3VsbEluZm9bXCJ5UG9zXCJdICsgc2t1bGxJbmZvW1wieVNwZWVkXCJdXG4gICAgICAgIHNwcml0ZVNldFkoc2t1bGxJbmZvW1wiaWRcIl0sIHNrdWxsSW5mb1tcInlQb3NcIl0pXG4gICAgfVxufVxubGV0IG1vdmVTaHVyaWtlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc3RkTGFzZXJYU3BlZWQ6IG51bWJlciA9IDMwXG4gICAgbGV0IHNodXJpa2VuQ29vbGRvd246IG51bWJlciA9IDBcbiAgICBsZXQgdGltZVNpbmNlUGxheWVyRmlyZWQ6IG51bWJlciA9IGN1cnJlbnREYXRlKCkgLSBwbGF5ZXJJbmZvW1widGltZVNodXJpa2VuV2FzRmlyZWRcIl1cbiAgICBpZiAoZ2V0S2V5U3RhdGUoOTApICYmIHNodXJpa2VuSW5mb1tcImZpcmVkXCJdID09IGZhbHNlICYmICFwbGF5ZXJJbmZvW1wiaXNMZWZ0XCJdICYmIHRpbWVTaW5jZVBsYXllckZpcmVkID4gc2h1cmlrZW5Db29sZG93bikge1xuICAgICAgICBzaHVyaWtlbkluZm9bXCJ4UG9zXCJdID0gcGxheWVySW5mb1tcInhQb3NcIl0gKyBwbGF5ZXJJbmZvW1wid2lkdGhcIl1cbiAgICAgICAgc2h1cmlrZW5JbmZvW1wieVBvc1wiXSA9IHBsYXllckluZm9bXCJ5UG9zXCJdICsgcGxheWVySW5mb1tcImhlaWdodFwiXSAvIDJcbiAgICAgICAgc2h1cmlrZW5JbmZvW1wieFNwZWVkXCJdID0gc3RkTGFzZXJYU3BlZWRcbiAgICAgICAgc2h1cmlrZW5JbmZvW1wiZmlyZWRcIl0gPSB0cnVlXG4gICAgICAgIHNodXJpa2VuSW5mb1tcImRpclwiXSA9IFwicmlnaHRcIlxuICAgICAgICBzaHVyaWtlbkluZm9bXCJ0aW1lU2t1bGxXYXNGaXJlZFwiXSA9IGN1cnJlbnREYXRlKClcbiAgICB9XG4gICAgaWYgKHNodXJpa2VuSW5mb1tcInhQb3NcIl0gIT0gaGlkaW5nU3BvdCAmJiBzaHVyaWtlbkluZm9bXCJ5UG9zXCJdICE9IGhpZGluZ1Nwb3QpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzcHJpdGVSb3RhdGUoc2h1cmlrZW5JbmZvW1wiaWRcIl0sIDkwKVxuICAgICAgICB9LCA1MDApXG4gICAgfVxuICAgIGlmIChnZXRLZXlTdGF0ZSg5MCkgJiYgc2h1cmlrZW5JbmZvW1wiZmlyZWRcIl0gPT0gZmFsc2UgJiYgcGxheWVySW5mb1tcImlzTGVmdFwiXSAmJiB0aW1lU2luY2VQbGF5ZXJGaXJlZCA+IHNodXJpa2VuQ29vbGRvd24pIHtcbiAgICAgICAgc2h1cmlrZW5JbmZvW1wieFBvc1wiXSA9IHBsYXllckluZm9bXCJ4UG9zXCJdIC0gc2h1cmlrZW5JbmZvW1wid2lkdGhcIl0gKyBzaHVyaWtlbkluZm9bXCJ4U3BlZWRcIl1cbiAgICAgICAgc2h1cmlrZW5JbmZvW1wieVBvc1wiXSA9IHBsYXllckluZm9bXCJ5UG9zXCJdICsgcGxheWVySW5mb1tcImhlaWdodFwiXSAvIDJcbiAgICAgICAgc2h1cmlrZW5JbmZvW1wieFNwZWVkXCJdID0gc3RkTGFzZXJYU3BlZWRcbiAgICAgICAgc2h1cmlrZW5JbmZvW1wiZmlyZWRcIl0gPSB0cnVlXG4gICAgICAgIHNodXJpa2VuSW5mb1tcImRpclwiXSA9IFwibGVmdFwiXG4gICAgICAgIHBsYXllckluZm9bXCJ0aW1lU2t1bGxXYXNGaXJlZFwiXSA9IGN1cnJlbnREYXRlKClcbiAgICB9XG4gICAgaWYgKHNodXJpa2VuSW5mb1tcInhQb3NcIl0gPiBQTEFZR1JPVU5EX1dJRFRIIHx8IHNodXJpa2VuSW5mb1tcInhQb3NcIl0gPCAwIHx8IHNodXJpa2VuSW5mb1tcInlQb3NcIl0gPj0gUExBWUdST1VORF9IRUlHSFQgfHwgc2h1cmlrZW5JbmZvW1wieVBvc1wiXSA8PSAwKSB7XG4gICAgICAgIHNodXJpa2VuSW5mb1tcImZpcmVkXCJdID0gZmFsc2VcbiAgICAgICAgc2h1cmlrZW5JbmZvW1wieFBvc1wiXSA9IHNrdWxsSGlkaW5nU3BvdFxuICAgICAgICBzaHVyaWtlbkluZm9bXCJ5UG9zXCJdID0gc2t1bGxIaWRpbmdTcG90XG4gICAgICAgIHNodXJpa2VuSW5mb1tcInhTcGVlZFwiXSA9IDBcbiAgICB9XG4gICAgaWYgKHNodXJpa2VuSW5mb1tcImRpclwiXSA9PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgc2h1cmlrZW5JbmZvW1wieFBvc1wiXSA9IHNodXJpa2VuSW5mb1tcInhQb3NcIl0gKyBzaHVyaWtlbkluZm9bXCJ4U3BlZWRcIl1cbiAgICAgICAgc2h1cmlrZW5JbmZvW1wieVBvc1wiXSA9IHBsYXllckluZm9bXCJ5UG9zXCJdICsgcGxheWVySW5mb1tcInlTcGVlZFwiXVxuICAgICAgICBzcHJpdGVTZXRYKHNodXJpa2VuSW5mb1tcImlkXCJdLCBzaHVyaWtlbkluZm9bXCJ4UG9zXCJdKVxuICAgICAgICBzcHJpdGVTZXRZKHNodXJpa2VuSW5mb1tcImlkXCJdLCBzaHVyaWtlbkluZm9bXCJ5UG9zXCJdKVxuICAgIH1cbiAgICBpZiAoc2h1cmlrZW5JbmZvW1wiZGlyXCJdID09IFwibGVmdFwiKSB7XG4gICAgICAgIHNodXJpa2VuSW5mb1tcInhQb3NcIl0gPSBzaHVyaWtlbkluZm9bXCJ4UG9zXCJdICsgLXNodXJpa2VuSW5mb1tcInhTcGVlZFwiXVxuICAgICAgICBzcHJpdGVTZXRYKHNodXJpa2VuSW5mb1tcImlkXCJdLCBzaHVyaWtlbkluZm9bXCJ4UG9zXCJdKVxuICAgICAgICBzaHVyaWtlbkluZm9bXCJ5UG9zXCJdID0gcGxheWVySW5mb1tcInlQb3NcIl0gKyBwbGF5ZXJJbmZvW1wieVNwZWVkXCJdXG4gICAgICAgIHNwcml0ZVNldFkoc2h1cmlrZW5JbmZvW1wiaWRcIl0sIHNodXJpa2VuSW5mb1tcInlQb3NcIl0pXG4gICAgfVxuICAgIGlmIChzaHVyaWtlbkluZm9bXCJkaXJcIl0gPT0gXCJkb3duXCIpIHtcbiAgICAgICAgc2h1cmlrZW5JbmZvW1wieVBvc1wiXSA9IHNodXJpa2VuSW5mb1tcInlQb3NcIl0gKyBzaHVyaWtlbkluZm9bXCJ5U3BlZWRcIl1cbiAgICAgICAgc3ByaXRlU2V0WShzaHVyaWtlbkluZm9bXCJpZFwiXSwgc2h1cmlrZW5JbmZvW1wieVBvc1wiXSlcbiAgICB9XG59XG5sZXQga2V5TW92ZXNTa3VsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgbWF4U3BlZWQ6IG51bWJlciA9IDZcbiAgICBpZiAoZ2V0S2V5U3RhdGUoNDApKSB7XG4gICAgICAgIHNrdWxsSW5mb1tcImRpclwiXSA9IFwiZG93blwiXG4gICAgICAgIHNrdWxsSW5mb1tcInlTcGVlZFwiXSA9IHNrdWxsSW5mb1tcInlTcGVlZFwiXSArIDFcbiAgICAgICAgaWYgKHNrdWxsSW5mb1tcInlTcGVlZFwiXSA+IG1heFNwZWVkKSB7XG4gICAgICAgICAgICBza3VsbEluZm9bXCJ5U3BlZWRcIl0gPSBtYXhTcGVlZFxuICAgICAgICB9XG4gICAgfVxufVxuLy8gTW92ZSBHaG9zdCBQbGF5ZXJcbmxldCB0aW1lU2luY2VMYXN0RGFzaDogbnVtYmVyID0gY3VycmVudERhdGUoKSAtIHBsYXllckluZm9bXCJ0aW1lU2luY2VMYXN0RGFzaFwiXVxubGV0IGtleU1vdmVzUGxheWVyID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBtYXhTcGVlZCA9IDZcbiAgICBpZiAoZ2V0S2V5U3RhdGUoOTApICYmIGdldEtleVN0YXRlKDY1KSAmJiB0aW1lU2luY2VMYXN0RGFzaCA+IDUwMDApIHtcbiAgICAgICAgcGxheWVySW5mb1tcInhTcGVlZFwiXSA9IHBsYXllckluZm9bXCJ4U3BlZWRcIl0gKyAtMS41XG4gICAgICAgIHNwcml0ZVNldEFuaW1hdGlvbihwbGF5ZXJJbmZvW1wiaWRcIl0sIHBsYXllckluZm9bXCJsZWZ0QW5pbVwiXSlcbiAgICAgICAgcGxheWVySW5mb1tcImlzTGVmdFwiXSA9IHRydWVcbiAgICAgICAgcGxheWVySW5mb1tcInRpbWVTaW5jZUxhc3REYXNoXCJdID0gY3VycmVudERhdGUoKVxuICAgIH1cbiAgICBpZiAoZ2V0S2V5U3RhdGUoNjUpKSB7XG4gICAgICAgIHBsYXllckluZm9bXCJ4U3BlZWRcIl0gPSBwbGF5ZXJJbmZvW1wieFNwZWVkXCJdICsgLTFcbiAgICAgICAgc3ByaXRlU2V0QW5pbWF0aW9uKHBsYXllckluZm9bXCJpZFwiXSwgcGxheWVySW5mb1tcImxlZnRBbmltXCJdKVxuICAgICAgICBwbGF5ZXJJbmZvW1wiaXNMZWZ0XCJdID0gdHJ1ZVxuICAgIH1cbiAgICBpZiAoZ2V0S2V5U3RhdGUoNjgpKSB7XG4gICAgICAgIHBsYXllckluZm9bXCJ4U3BlZWRcIl0gPSBwbGF5ZXJJbmZvW1wieFNwZWVkXCJdICsgMVxuICAgICAgICBzcHJpdGVTZXRBbmltYXRpb24ocGxheWVySW5mb1tcImlkXCJdLCBwbGF5ZXJJbmZvW1wiYW5pbVwiXSlcbiAgICAgICAgcGxheWVySW5mb1tcImlzTGVmdFwiXSA9IGZhbHNlXG4gICAgfVxuICAgIGlmICghZ2V0S2V5U3RhdGUoNjUpICYmICFnZXRLZXlTdGF0ZSg2OCkpIHtcbiAgICAgICAgcGxheWVySW5mb1tcInhTcGVlZFwiXSA9IDBcbiAgICB9XG4gICAgaWYgKGdldEtleVN0YXRlKDg3KSkge1xuICAgICAgICBwbGF5ZXJJbmZvW1wieVNwZWVkXCJdID0gcGxheWVySW5mb1tcInlTcGVlZFwiXSArIC0xXG4gICAgfVxuICAgIGlmIChnZXRLZXlTdGF0ZSg4MykpIHtcbiAgICAgICAgcGxheWVySW5mb1tcInlTcGVlZFwiXSA9IHBsYXllckluZm9bXCJ5U3BlZWRcIl0gKyAxXG4gICAgfVxuICAgIGlmICghZ2V0S2V5U3RhdGUoODcpICYmICFnZXRLZXlTdGF0ZSg4MykpIHtcbiAgICAgICAgcGxheWVySW5mb1tcInlTcGVlZFwiXSA9IDBcbiAgICB9XG4gICAgbGV0IHhTcXVhcmVkID0gcGxheWVySW5mb1tcInhTcGVlZFwiXSAqIHBsYXllckluZm9bXCJ4U3BlZWRcIl1cbiAgICBsZXQgeVNxdWFyZWQgPSBwbGF5ZXJJbmZvW1wieVNwZWVkXCJdICogcGxheWVySW5mb1tcInlTcGVlZFwiXVxuICAgIGxldCBoeXBTcXVhcmVkID0geFNxdWFyZWQgKyB5U3F1YXJlZFxuICAgIGxldCBjb21iaW5lZFNwZWVkID0gTWF0aC5zcXJ0KGh5cFNxdWFyZWQpXG4gICAgaWYgKGNvbWJpbmVkU3BlZWQgPiBtYXhTcGVlZCkge1xuICAgICAgICBsZXQgZmFjdG9yID0gY29tYmluZWRTcGVlZCAvIG1heFNwZWVkXG4gICAgICAgIGxldCBtYXhYU3BlZWQgPSBwbGF5ZXJJbmZvW1wieFNwZWVkXCJdIC8gZmFjdG9yXG4gICAgICAgIGxldCBtYXhZU3BlZWQgPSBwbGF5ZXJJbmZvW1wieVNwZWVkXCJdIC8gZmFjdG9yXG4gICAgICAgIHBsYXllckluZm9bXCJ4U3BlZWRcIl0gPSBtYXhYU3BlZWRcbiAgICAgICAgcGxheWVySW5mb1tcInlTcGVlZFwiXSA9IG1heFlTcGVlZFxuICAgIH1cbiAgICBtb3ZlR2hvc3QoKVxufVxubGV0IHBsYXllckhpdHNDYWN0dXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcGxheWVySW5mb1tcImhlYWx0aFwiXSA9IHBsYXllckluZm9bXCJoZWFsdGhcIl0gLSAxXG59XG5sZXQgcGxheWVySGl0Rm94UGFyYW06IFNwcml0ZURpY3RcbmxldCBjb2luSGl0UGxheWVyUGFyYW06IFNwcml0ZURpY3RcbmxldCBoZWFydEhpdFBsYXllclBhcmFtOiBTcHJpdGVEaWN0XG5sZXQgcGxheWVySGl0QWxpZW5QYXJhbTogU3ByaXRlRGljdFxubGV0IHBsYXllckhpdEJvc3NQYXJhbTogU3ByaXRlRGljdFxubGV0IHRpbWVHYW1lU3RhcnRlZDogbnVtYmVyID0gY3VycmVudERhdGUoKVxuXG5sZXQgZW5lbXlEaXNhcHBlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFsaWVuQm9zc0luZm9bXCJoZWFsdGhcIl0gPD0gMCkge1xuICAgICAgICBhbGllbkJvc3NJbmZvW1wieFBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgYWxpZW5Cb3NzSW5mb1tcInlQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgICAgIHNwcml0ZVNldFhZKGFsaWVuQm9zc0luZm9bXCJpZFwiXSwgYWxpZW5Cb3NzSW5mb1tcInhQb3NcIl0sIGFsaWVuQm9zc0luZm9bXCJ5UG9zXCJdKVxuICAgIH1cbn1cbmxldCBib3VuZGFyaWVzID0gZnVuY3Rpb24gKGFTcHJpdGVJbmZvOiBTcHJpdGVEaWN0KSB7XG4gICAgbGV0IHVwWUJvdW5kYXJ5OiBudW1iZXIgPSA1MFxuICAgIGxldCBkb3duWUJvdW5kYXJ5OiBudW1iZXIgPSAzNDdcbiAgICBpZiAoYVNwcml0ZUluZm9bXCJ5UG9zXCJdID49IGRvd25ZQm91bmRhcnkpIHtcbiAgICAgICAgYVNwcml0ZUluZm9bXCJ5UG9zXCJdID0gZG93bllCb3VuZGFyeVxuICAgIH1cbiAgICBpZiAocGxheWVySW5mb1tcInlQb3NcIl0gPD0gdXBZQm91bmRhcnkpIHtcbiAgICAgICAgcGxheWVySW5mb1tcInlQb3NcIl0gPSB1cFlCb3VuZGFyeVxuICAgIH1cbn1cbmxldCBib3VuY3lCb3VuZGFyaWVzID0gZnVuY3Rpb24gKGFTcHJpdGVJbmZvOiBTcHJpdGVEaWN0LCBkb3duWUJvdW5kYXJ5OiBudW1iZXIsIHVwWUJvdW5kYXJ5OiBudW1iZXIsKSB7XG4gICAgaWYgKGFTcHJpdGVJbmZvW1wieVBvc1wiXSA+PSBkb3duWUJvdW5kYXJ5KSB7XG4gICAgICAgIGFTcHJpdGVJbmZvW1wieVNwZWVkXCJdID0gLTEgKiBhU3ByaXRlSW5mb1tcInlTcGVlZFwiXVxuICAgIH1cbiAgICBpZiAoYVNwcml0ZUluZm9bXCJ5UG9zXCJdIDw9IDApIHtcbiAgICAgICAgYVNwcml0ZUluZm9bXCJ5U3BlZWRcIl0gPSAtMSAqIGFTcHJpdGVJbmZvW1wieVNwZWVkXCJdXG4gICAgfVxufVxubGV0IGdldFJhbmRvbUludCA9IGZ1bmN0aW9uIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcbiAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcbiAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbn1cbmxldCBjb2xsaXNpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHdoZW4yU3ByaXRlc0hpdChwbGF5ZXJJbmZvW1wiaWRcIl0sIGhlYXJ0W1wiaWRcIl0sICgpID0+IHtcbiAgICAgICAgcGxheWVySW5mb1tcImhlYWx0aFwiXSA9IHBsYXllckluZm9bXCJoZWFsdGhcIl0gKyAoMSArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpKVxuICAgICAgICBoZWFydFtcInhQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgICAgIGhlYXJ0W1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICB9KVxuICAgIHdoZW4yU3ByaXRlc0hpdChwbGF5ZXJJbmZvW1wiaWRcIl0sIGNvaW5bXCJpZFwiXSwgKCkgPT4ge1xuICAgICAgICBwbGF5ZXJJbmZvW1wic2NvcmVcIl0gPSBwbGF5ZXJJbmZvW1wic2NvcmVcIl0gKyBnZXRSYW5kb21JbnQoMTAwLCAyNTApXG4gICAgICAgIGNvaW5bXCJ4UG9zXCJdID0gaGlkaW5nU3BvdFxuICAgICAgICBjb2luW1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICB9KVxuICAgIHdoZW4yU3ByaXRlc0hpdChwbGF5ZXJJbmZvW1wiaWRcIl0sIGFsaWVuQm9zc0luZm9bXCJpZFwiXSwgKCkgPT4ge1xuICAgICAgICBwbGF5ZXJJbmZvW1wiaGVhbHRoXCJdID0gcGxheWVySW5mb1tcImhlYWx0aFwiXSAtIDJcbiAgICB9KVxuICAgIHdoZW4yU3ByaXRlc0hpdChza3VsbEluZm9bXCJpZFwiXSwgYWxpZW5Cb3NzSW5mb1tcImlkXCJdLCAoKSA9PiB7XG4gICAgICAgIGFsaWVuQm9zc0luZm9bXCJoZWFsdGhcIl0gPSBhbGllbkJvc3NJbmZvW1wiaGVhbHRoXCJdIC0gMVxuICAgICAgICBza3VsbEluZm9bXCJ4UG9zXCJdID0gc2t1bGxIaWRpbmdTcG90XG4gICAgICAgIHNrdWxsSW5mb1tcInlQb3NcIl0gPSBza3VsbEhpZGluZ1Nwb3RcbiAgICB9KVxufVxubGV0IHNjZW5lMUVuZW1pZXNEZWFmZWF0ZWQ6IGJvb2xlYW4gPSBmYWxzZSwgc2NlbmUyRW5lbWllc0RlYWZlYXRlZDogYm9vbGVhbiA9IGZhbHNlLCBzY2VuZTNFbmVtaWVzRGVhZmVhdGVkOiBib29sZWFuID0gZmFsc2VcbmxldCBzdGFnZU1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHBsYXllckluZm9bXCJraWxsc1wiXSA+PSBhbGllbnMubGVuZ3RoICYmIHBsYXllckluZm9bXCJzY29yZVwiXSA+PSA5NTApIHtcbiAgICAgICAgc2NlbmUxRW5lbWllc0RlYWZlYXRlZCA9IHRydWVcbiAgICB9XG4gICAgaWYgKHBsYXllckluZm9bXCJraWxsc1wiXSA+PSBmb3hlcy5sZW5ndGggKyBhbGllbnMubGVuZ3RoICYmIHBsYXllckluZm9bXCJzY29yZVwiXSA+PSAxNzAwKSB7XG4gICAgICAgIHNjZW5lMkVuZW1pZXNEZWFmZWF0ZWQgPSB0cnVlXG4gICAgfVxuICAgIGlmIChwbGF5ZXJJbmZvW1wia2lsbHNcIl0gPj0gZm94ZXMubGVuZ3RoICsgYWxpZW5Cb3NzZXMubGVuZ3RoICsgYWxpZW5zLmxlbmd0aCAmJiBwbGF5ZXJJbmZvW1wic2NvcmVcIl0gPj0gMjc1MCkge1xuICAgICAgICBzY2VuZTNFbmVtaWVzRGVhZmVhdGVkID0gdHJ1ZVxuICAgIH1cbn1cbmxldCBza3VsbFB1c2ggPSBmdW5jdGlvbiAoc3ByaXRlOiBTcHJpdGVEaWN0LCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcbiAgICBpZiAoc2t1bGxJbmZvW1wiZGlyXCJdID09IFwiZG93blwiKSB7XG4gICAgICAgIHNwcml0ZVtcInlQb3NcIl0gPSBzcHJpdGVbXCJ5UG9zXCJdICsgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KVxuICAgIH1cbiAgICBpZiAoc2t1bGxJbmZvW1wiZGlyXCJdID09IFwibGVmdFwiKSB7XG4gICAgICAgIHNwcml0ZVtcInhQb3NcIl0gPSBzcHJpdGVbXCJ4UG9zXCJdIC0gZ2V0UmFuZG9tSW50KG1pbiwgbWF4KVxuICAgIH1cbiAgICBpZiAoc2t1bGxJbmZvW1wiZGlyXCJdID09IFwicmlnaHRcIikge1xuICAgICAgICBzcHJpdGVbXCJ4UG9zXCJdID0gc3ByaXRlW1wieFBvc1wiXSArIGdldFJhbmRvbUludChtaW4sIG1heClcbiAgICB9XG59XG5sZXQgZ2FtZUVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocGxheWVySW5mb1tcImhlYWx0aFwiXSA8PSAwKSB7XG4gICAgICAgIGJhY2tncm91bmRzW1wiZ2FtZU92ZXJcIl0gPSB0cnVlXG4gICAgICAgIGdhbWVPdmVySW5mb1tcInhQb3NcIl0gPSAwXG4gICAgICAgIGdhbWVPdmVySW5mb1tcInlQb3NcIl0gPSAwXG4gICAgICAgIHNwcml0ZVNldFhZKGdhbWVPdmVySW5mb1tcImlkXCJdLCBnYW1lT3ZlckluZm9bXCJ4UG9zXCJdLCBnYW1lT3ZlckluZm9bXCJ5UG9zXCJdKVxuICAgICAgICBzcHJpdGUoc2NvcmVCb2FyZEluZm9bXCJpZFwiXSkuaHRtbChcIjxiPiBZb3UgZGllZCA8L2I+XCIpXG4gICAgICAgIHNwcml0ZShnYW1lT3ZlckluZm9bXCJpZFwiXSkuY3NzKFwidGV4dC1hbGlnblwiLCBcImNlbnRlclwiKVxuICAgICAgICBzcHJpdGUoZ2FtZU92ZXJJbmZvW1wiaWRcIl0pLmNzcyhcImZvbnQtc2l6ZVwiLCBcIjQwcHhcIilcbiAgICAgICAgc3ByaXRlKGdhbWVPdmVySW5mb1tcImlkXCJdKS5jc3MoXCJmb250LWZhbWlseVwiLCBcIlZlcmRhbmFcIilcbiAgICAgICAgc3ByaXRlKGdhbWVPdmVySW5mb1tcImlkXCJdKS5jc3MoXCJjb2xvclwiLCBcImJsYWNrXCIpXG4gICAgICAgIHNwcml0ZShnYW1lT3ZlckluZm9bXCJpZFwiXSkuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBcInR1cnF1b2lzZVwiKVxuICAgICAgICBzcHJpdGUoZ2FtZU92ZXJJbmZvW1wiaWRcIl0pLmh0bWwoXCI8Yj4gWW91IERpZWQgPC9iPlwiICsgXCI8YnI+XCIgKyBcIjxicj5cIiArIGBZb3VyIEZpbmFsIFNjb3JlIHdhczogJHtwbGF5ZXJJbmZvW1wic2NvcmVcIl19YCArIFwiPGJyPlwiICsgXCI8YnI+XCIgKyBgWW91IGhhZCAke3BsYXllckluZm9bXCJraWxsc1wiXX0ga2lsbHNgICsgXCI8YnI+XCIgKyBcIjxicj5cIiArIFwiVGhhbmsgeW91IGZvciBwbGF5aW5nIVwiKVxuICAgIH1cbiAgICBpZiAoc2NlbmUzRW5lbWllc0RlYWZlYXRlZCkge1xuICAgICAgICBiYWNrZ3JvdW5kc1tcImdhbWVPdmVyXCJdID0gdHJ1ZVxuICAgICAgICBnYW1lT3ZlckluZm9bXCJ4UG9zXCJdID0gMFxuICAgICAgICBnYW1lT3ZlckluZm9bXCJ5UG9zXCJdID0gMFxuICAgICAgICBzcHJpdGVTZXRYWShnYW1lT3ZlckluZm9bXCJpZFwiXSwgZ2FtZU92ZXJJbmZvW1wieFBvc1wiXSwgZ2FtZU92ZXJJbmZvW1wieVBvc1wiXSlcbiAgICAgICAgYmFja2dyb3VuZDNJbmZvW1wieFBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgYmFja2dyb3VuZDNJbmZvW1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgc3ByaXRlU2V0WFkoYmFja2dyb3VuZDNJbmZvW1wiaWRcIl0sIGJhY2tncm91bmQzSW5mb1tcInhQb3NcIl0sIGJhY2tncm91bmQzSW5mb1tcInlQb3NcIl0pXG4gICAgICAgIHNwcml0ZShnYW1lT3ZlckluZm9bXCJpZFwiXSkuY3NzKFwidGV4dC1hbGlnblwiLCBcImNlbnRlclwiKVxuICAgICAgICBzcHJpdGUoZ2FtZU92ZXJJbmZvW1wiaWRcIl0pLmNzcyhcImZvbnQtc2l6ZVwiLCBcIjQwcHhcIilcbiAgICAgICAgc3ByaXRlKGdhbWVPdmVySW5mb1tcImlkXCJdKS5jc3MoXCJmb250LWZhbWlseVwiLCBcIlZlcmRhbmFcIilcbiAgICAgICAgc3ByaXRlKGdhbWVPdmVySW5mb1tcImlkXCJdKS5jc3MoXCJjb2xvclwiLCBcImJsYWNrXCIpXG4gICAgICAgIHNwcml0ZShnYW1lT3ZlckluZm9bXCJpZFwiXSkuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBcInR1cnF1b2lzZVwiKVxuICAgICAgICBzcHJpdGUoZ2FtZU92ZXJJbmZvW1wiaWRcIl0pLmh0bWwoXCI8Yj4gWW91IFdvbiEhIDwvYj5cIiArIFwiPGJyPlwiICsgXCI8YnI+XCIgKyBgWW91ciBGaW5hbCBTY29yZSB3YXM6ICR7cGxheWVySW5mb1tcInNjb3JlXCJdfWAgKyBcIjxicj5cIiArIFwiPGJyPlwiICsgYFlvdSBoYWQgJHtwbGF5ZXJJbmZvW1wia2lsbHNcIl19IGtpbGxzYCArIFwiPGJyPlwiICsgXCI8YnI+XCIgKyBcIlRoYW5rIHlvdSBmb3IgcGxheWluZyFcIilcbiAgICB9XG59XG5cbmxldCB0aW1lTGFzdENvaW5NYWRlOiBudW1iZXIgPSAwXG5sZXQgdGltZUxhc3RIZWFydE1hZGU6IG51bWJlciA9IDBcbmxldCBydW5HYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIG1vdmVTcHJpdGUoYWxpZW5Cb3NzSW5mbylcbiAgICBtb3ZlU2t1bGwoKVxuICAgIG1vdmVTaHVyaWtlbigpXG4gICAga2V5TW92ZXNQbGF5ZXIoKVxuICAgIGtleU1vdmVzU2t1bGwoKVxuICAgIG1vdmVTcHJpdGUoY2xvdWQxKVxuICAgIG1vdmVTcHJpdGUoY2xvdWQyKVxuICAgIGJvdW5jZVNwcml0ZShoZWFydClcbiAgICBib3VuY2VTcHJpdGUoY29pbilcbiAgICBlbmVteURpc2FwcGVhcigpXG4gICAgZ2FtZUVuZCgpXG4gICAgc3RhZ2VNb3ZlKClcbiAgICBib3VuZGFyaWVzKHBsYXllckluZm8pXG4gICAgY29sbGlzaW9ucygpXG4gICAgaWYgKGZveGVzLmxlbmd0aCA8IDcgJiYgKGJhY2tncm91bmRzWzJdIHx8IGJhY2tncm91bmRzWzNdKSkge1xuICAgICAgICBjcmVhdGVGb3goKVxuICAgIH1cbiAgICBpZiAoYWxpZW5zLmxlbmd0aCA8IGdldFJhbmRvbUludCg2LCAxMCkgJiYgKGJhY2tncm91bmRzWzFdIHx8IGJhY2tncm91bmRzWzNdKSkge1xuICAgICAgICBjcmVhdGVFbmVteSgpXG4gICAgfVxuICAgIGlmIChhbGllbkJvc3Nlcy5sZW5ndGggPCAyKSB7XG4gICAgICAgIGNyZWF0ZUJvc3MoKVxuICAgIH1cbiAgICBpZiAoY3VycmVudERhdGUoKSAtIHRpbWVMYXN0Q29pbk1hZGUgPiBnZXRSYW5kb21JbnQoMjcwMDAsIDQwMDAwKSkge1xuICAgICAgICBjcmVhdGVDb2luKClcbiAgICAgICAgdGltZUxhc3RDb2luTWFkZSA9IGN1cnJlbnREYXRlKClcbiAgICB9XG4gICAgaWYgKGN1cnJlbnREYXRlKCkgLSB0aW1lTGFzdEhlYXJ0TWFkZSA+IGdldFJhbmRvbUludCgzMjAwMCwgNDAwMDApKSB7XG4gICAgICAgIGNyZWF0ZUhlYXJ0KClcbiAgICAgICAgdGltZUxhc3RIZWFydE1hZGUgPSBjdXJyZW50RGF0ZSgpXG4gICAgfVxuICAgIGxldCB0aW1lU2luY2VIZWFsdGhUYWtlbjogbnVtYmVyID0gY3VycmVudERhdGUoKSAtIHBsYXllckluZm9bXCJ0aW1lU2luY2VIZWFsdGhUYWtlblwiXVxuICAgIGxldCBoZWFsdGhUYWtlbkNvb2xkb3duOiBudW1iZXIgPSAxNzUwXG4gICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgYWxpZW5zLmxlbmd0aDsgaW5kZXggPSBpbmRleCArIDEpIHtcbiAgICAgICAgbGV0IHRoZUFsaWVuRGljdCA9IGFsaWVuc1tpbmRleF1cbiAgICAgICAgaWYgKGJhY2tncm91bmRzWzFdKSB7XG4gICAgICAgICAgICBtb3ZlQWxpZW4odGhlQWxpZW5EaWN0KVxuICAgICAgICB9XG4gICAgICAgIGlmIChiYWNrZ3JvdW5kc1syXSkge1xuICAgICAgICAgICAgdGhlQWxpZW5EaWN0W1wieFBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgICAgIHRoZUFsaWVuRGljdFtcInlQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgICAgICAgICBzcHJpdGVTZXRYWSh0aGVBbGllbkRpY3RbXCJpZFwiXSwgdGhlQWxpZW5EaWN0W1wieFBvc1wiXSwgdGhlQWxpZW5EaWN0W1wieVBvc1wiXSlcbiAgICAgICAgfVxuICAgICAgICBib3VuZGFyaWVzKHRoZUFsaWVuRGljdClcbiAgICAgICAgcGxheWVySGl0QWxpZW5QYXJhbSA9IHRoZUFsaWVuRGljdFxuICAgICAgICB3aGVuMlNwcml0ZXNIaXQocGxheWVySW5mb1tcImlkXCJdLCB0aGVBbGllbkRpY3RbXCJpZFwiXSwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRpbWVTaW5jZUhlYWx0aFRha2VuID4gaGVhbHRoVGFrZW5Db29sZG93bikge1xuICAgICAgICAgICAgICAgIHBsYXllckluZm9bXCJ0aW1lU2luY2VIZWFsdGhUYWtlblwiXSA9IGN1cnJlbnREYXRlKClcbiAgICAgICAgICAgICAgICBwbGF5ZXJJbmZvW1wiaGVhbHRoXCJdID0gcGxheWVySW5mb1tcImhlYWx0aFwiXSAtIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgd2hlbjJTcHJpdGVzSGl0KHNrdWxsSW5mb1tcImlkXCJdLCB0aGVBbGllbkRpY3RbXCJpZFwiXSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhlQWxpZW5EaWN0W1wiaGVhbHRoXCJdID0gdGhlQWxpZW5EaWN0W1wiaGVhbHRoXCJdIC0gMVxuICAgICAgICAgICAgaWYgKHRoZUFsaWVuRGljdFtcImhlYWx0aFwiXSA+IDEpIHtcbiAgICAgICAgICAgICAgICBza3VsbFB1c2godGhlQWxpZW5EaWN0LCA2LCA4KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2t1bGxJbmZvW1wieFBvc1wiXSA9IHNrdWxsSGlkaW5nU3BvdFxuICAgICAgICAgICAgc2t1bGxJbmZvW1wieVBvc1wiXSA9IHNrdWxsSGlkaW5nU3BvdFxuICAgICAgICB9KVxuICAgICAgICB3aGVuMlNwcml0ZXNIaXQoc2h1cmlrZW5JbmZvW1wiaWRcIl0sIHRoZUFsaWVuRGljdFtcImlkXCJdLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGVBbGllbkRpY3RbXCJoZWFsdGhcIl0gPSB0aGVBbGllbkRpY3RbXCJoZWFsdGhcIl0gLSAwLjI1XG4gICAgICAgICAgICBpZiAodGhlQWxpZW5EaWN0W1wiaGVhbHRoXCJdID4gMSkge1xuICAgICAgICAgICAgICAgIHNrdWxsUHVzaCh0aGVBbGllbkRpY3QsIDMsIDUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaHVyaWtlbkluZm9bXCJ4UG9zXCJdID0gc2t1bGxIaWRpbmdTcG90XG4gICAgICAgICAgICBzaHVyaWtlbkluZm9bXCJ5UG9zXCJdID0gc2t1bGxIaWRpbmdTcG90XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHRoZUFsaWVuRGljdFtcImhlYWx0aFwiXSA8PSAwKSB7XG4gICAgICAgICAgICB0aGVBbGllbkRpY3RbXCJ4UG9zXCJdID0gaGlkaW5nU3BvdFxuICAgICAgICAgICAgdGhlQWxpZW5EaWN0W1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgICAgIHRoZUFsaWVuRGljdFtcImhlYWx0aFwiXSA9IDJcbiAgICAgICAgICAgIHRoZUFsaWVuRGljdFtcInhTcGVlZFwiXSA9IDBcbiAgICAgICAgICAgIHRoZUFsaWVuRGljdFtcInlTcGVlZFwiXSA9IDBcbiAgICAgICAgICAgIHNwcml0ZVNldFhZKHRoZUFsaWVuRGljdFtcImlkXCJdLCB0aGVBbGllbkRpY3RbXCJ4UG9zXCJdLCB0aGVBbGllbkRpY3RbXCJ5UG9zXCJdKVxuICAgICAgICAgICAgcGxheWVySW5mb1tcInNjb3JlXCJdID0gcGxheWVySW5mb1tcInNjb3JlXCJdICsgZ2V0UmFuZG9tSW50KDEwMCwgMjAwKVxuICAgICAgICAgICAgcGxheWVySW5mb1tcImtpbGxzXCJdID0gcGxheWVySW5mb1tcImtpbGxzXCJdICsgMVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEJvc3MgQWxpZW5zXG4gICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgYWxpZW5Cb3NzZXMubGVuZ3RoOyBpbmRleCA9IGluZGV4ICsgMSkge1xuICAgICAgICBsZXQgdGhlQm9zc0FsaWVuRGljdCA9IGFsaWVuQm9zc2VzW2luZGV4XVxuICAgICAgICBpZiAoYmFja2dyb3VuZHNbM10pIHtcbiAgICAgICAgICAgIG1vdmVTcHJpdGUodGhlQm9zc0FsaWVuRGljdClcbiAgICAgICAgICAgIHNwcml0ZVNldFhZKHRoZUJvc3NBbGllbkRpY3RbXCJpZFwiXSwgdGhlQm9zc0FsaWVuRGljdFtcInhQb3NcIl0sIHRoZUJvc3NBbGllbkRpY3RbXCJ5UG9zXCJdKVxuICAgICAgICB9XG4gICAgICAgIGlmIChiYWNrZ3JvdW5kc1sxXSB8fCBiYWNrZ3JvdW5kc1syXSkge1xuICAgICAgICAgICAgdGhlQm9zc0FsaWVuRGljdFtcInhQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgICAgICAgICB0aGVCb3NzQWxpZW5EaWN0W1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgICAgIHNwcml0ZVNldFhZKHRoZUJvc3NBbGllbkRpY3RbXCJpZFwiXSwgdGhlQm9zc0FsaWVuRGljdFtcInhQb3NcIl0sIHRoZUJvc3NBbGllbkRpY3RbXCJ5UG9zXCJdKVxuICAgICAgICB9XG4gICAgICAgIHBsYXllckhpdEJvc3NQYXJhbSA9IHRoZUJvc3NBbGllbkRpY3RcbiAgICAgICAgd2hlbjJTcHJpdGVzSGl0KHBsYXllckluZm9bXCJpZFwiXSwgdGhlQm9zc0FsaWVuRGljdFtcImlkXCJdLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGltZVNpbmNlSGVhbHRoVGFrZW4gPiBoZWFsdGhUYWtlbkNvb2xkb3duKSB7XG4gICAgICAgICAgICAgICAgcGxheWVySW5mb1tcInRpbWVTaW5jZUhlYWx0aFRha2VuXCJdID0gY3VycmVudERhdGUoKVxuICAgICAgICAgICAgICAgIHBsYXllckluZm9bXCJoZWFsdGhcIl0gPSBwbGF5ZXJJbmZvW1wiaGVhbHRoXCJdIC0gMlxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB3aGVuMlNwcml0ZXNIaXQoc2t1bGxJbmZvW1wiaWRcIl0sIHRoZUJvc3NBbGllbkRpY3RbXCJpZFwiXSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhlQm9zc0FsaWVuRGljdFtcImhlYWx0aFwiXSA9IHRoZUJvc3NBbGllbkRpY3RbXCJoZWFsdGhcIl0gLSAxXG4gICAgICAgICAgICBza3VsbFB1c2godGhlQm9zc0FsaWVuRGljdCwgNiwgOClcbiAgICAgICAgICAgIHNrdWxsSW5mb1tcInhQb3NcIl0gPSBza3VsbEhpZGluZ1Nwb3RcbiAgICAgICAgICAgIHNrdWxsSW5mb1tcInlQb3NcIl0gPSBza3VsbEhpZGluZ1Nwb3RcbiAgICAgICAgfSlcbiAgICAgICAgd2hlbjJTcHJpdGVzSGl0KHNodXJpa2VuSW5mb1tcImlkXCJdLCB0aGVCb3NzQWxpZW5EaWN0W1wiaWRcIl0sICgpID0+IHtcbiAgICAgICAgICAgIHRoZUJvc3NBbGllbkRpY3RbXCJoZWFsdGhcIl0gPSB0aGVCb3NzQWxpZW5EaWN0W1wiaGVhbHRoXCJdIC0gMC4yNVxuICAgICAgICAgICAgc2t1bGxQdXNoKHRoZUJvc3NBbGllbkRpY3QsIDMsIDUpXG4gICAgICAgICAgICBzaHVyaWtlbkluZm9bXCJ4UG9zXCJdID0gc2t1bGxIaWRpbmdTcG90XG4gICAgICAgICAgICBzaHVyaWtlbkluZm9bXCJ5UG9zXCJdID0gc2t1bGxIaWRpbmdTcG90XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHRoZUJvc3NBbGllbkRpY3RbXCJoZWFsdGhcIl0gPD0gMCkge1xuICAgICAgICAgICAgdGhlQm9zc0FsaWVuRGljdFtcInhQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgICAgICAgICB0aGVCb3NzQWxpZW5EaWN0W1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgICAgIHRoZUJvc3NBbGllbkRpY3RbXCJoZWFsdGhcIl0gPSAyXG4gICAgICAgICAgICB0aGVCb3NzQWxpZW5EaWN0W1wieFNwZWVkXCJdID0gMFxuICAgICAgICAgICAgdGhlQm9zc0FsaWVuRGljdFtcInlTcGVlZFwiXSA9IDBcbiAgICAgICAgICAgIHNwcml0ZVNldFhZKHRoZUJvc3NBbGllbkRpY3RbXCJpZFwiXSwgdGhlQm9zc0FsaWVuRGljdFtcInhQb3NcIl0sIHRoZUJvc3NBbGllbkRpY3RbXCJ5UG9zXCJdKVxuICAgICAgICAgICAgcGxheWVySW5mb1tcInNjb3JlXCJdID0gcGxheWVySW5mb1tcInNjb3JlXCJdICsgZ2V0UmFuZG9tSW50KDI1MCwgNDAwKVxuICAgICAgICAgICAgcGxheWVySW5mb1tcImtpbGxzXCJdID0gcGxheWVySW5mb1tcImtpbGxzXCJdICsgMVxuICAgICAgICB9XG5cbiAgICB9XG4gICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgZm94ZXMubGVuZ3RoOyBpbmRleCA9IGluZGV4ICsgMSkge1xuICAgICAgICBsZXQgdGhlRm94RGljdCA9IGZveGVzW2luZGV4XVxuICAgICAgICBpZiAoYmFja2dyb3VuZHNbMl0pIHtcbiAgICAgICAgICAgIGJvdW5jeUJvdW5kYXJpZXModGhlRm94RGljdCwgMzQ2LCAwKVxuICAgICAgICAgICAgbW92ZUFsaWVuKHRoZUZveERpY3QpXG4gICAgICAgIH1cbiAgICAgICAgcGxheWVySGl0Rm94UGFyYW0gPSB0aGVGb3hEaWN0XG4gICAgICAgIHdoZW4yU3ByaXRlc0hpdChwbGF5ZXJJbmZvW1wiaWRcIl0sIHRoZUZveERpY3RbXCJpZFwiXSwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRpbWVTaW5jZUhlYWx0aFRha2VuID4gaGVhbHRoVGFrZW5Db29sZG93bikge1xuICAgICAgICAgICAgICAgIHBsYXllckluZm9bXCJ0aW1lU2luY2VIZWFsdGhUYWtlblwiXSA9IGN1cnJlbnREYXRlKClcbiAgICAgICAgICAgICAgICBwbGF5ZXJJbmZvW1wiaGVhbHRoXCJdID0gcGxheWVySW5mb1tcImhlYWx0aFwiXSAtIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgd2hlbjJTcHJpdGVzSGl0KHNrdWxsSW5mb1tcImlkXCJdLCB0aGVGb3hEaWN0W1wiaWRcIl0sICgpID0+IHtcbiAgICAgICAgICAgIHRoZUZveERpY3RbXCJoZWFsdGhcIl0gPSB0aGVGb3hEaWN0W1wiaGVhbHRoXCJdIC0gMVxuICAgICAgICAgICAgc2t1bGxQdXNoKHRoZUZveERpY3QsIDYsIDgpXG4gICAgICAgICAgICBza3VsbEluZm9bXCJ4UG9zXCJdID0gc2t1bGxIaWRpbmdTcG90XG4gICAgICAgICAgICBza3VsbEluZm9bXCJ5UG9zXCJdID0gc2t1bGxIaWRpbmdTcG90XG4gICAgICAgIH0pXG4gICAgICAgIHdoZW4yU3ByaXRlc0hpdChzaHVyaWtlbkluZm9bXCJpZFwiXSwgdGhlRm94RGljdFtcImlkXCJdLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGVGb3hEaWN0W1wiaGVhbHRoXCJdID0gdGhlRm94RGljdFtcImhlYWx0aFwiXSAtIDAuMjVcbiAgICAgICAgICAgIHNrdWxsUHVzaCh0aGVGb3hEaWN0LCAzLCA1KVxuICAgICAgICAgICAgc2h1cmlrZW5JbmZvW1wieFBvc1wiXSA9IHNrdWxsSGlkaW5nU3BvdFxuICAgICAgICAgICAgc2h1cmlrZW5JbmZvW1wieVBvc1wiXSA9IHNrdWxsSGlkaW5nU3BvdFxuICAgICAgICB9KVxuICAgICAgICBpZiAodGhlRm94RGljdFtcImhlYWx0aFwiXSA8PSAwKSB7XG4gICAgICAgICAgICB0aGVGb3hEaWN0W1wieFBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgICAgIHRoZUZveERpY3RbXCJ5UG9zXCJdID0gaGlkaW5nU3BvdFxuICAgICAgICAgICAgcGxheWVySW5mb1tcInNjb3JlXCJdID0gcGxheWVySW5mb1tcInNjb3JlXCJdICsgTWF0aC5mbG9vcigoMTAwICsgTWF0aC5yYW5kb20oKSAqIDEwMCkpXG4gICAgICAgICAgICB0aGVGb3hEaWN0W1wieFNwZWVkXCJdID0gMFxuICAgICAgICAgICAgdGhlRm94RGljdFtcInlTcGVlZFwiXSA9IDBcbiAgICAgICAgICAgIHRoZUZveERpY3RbXCJ4UG9zXCJdID0gaGlkaW5nU3BvdFxuICAgICAgICAgICAgdGhlRm94RGljdFtcInlQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgICAgICAgICBzcHJpdGVTZXRYWSh0aGVGb3hEaWN0W1wiaWRcIl0sIHRoZUZveERpY3RbXCJ4UG9zXCJdLCB0aGVGb3hEaWN0W1wieVBvc1wiXSlcbiAgICAgICAgICAgIHBsYXllckluZm9bXCJraWxsc1wiXSA9IHBsYXllckluZm9bXCJraWxsc1wiXSArIDFcbiAgICAgICAgICAgIHRoZUZveERpY3RbXCJoZWFsdGhcIl0gPSAyXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpbmRleDogbnVtYmVyID0gMDsgaW5kZXggPCBjb2lucy5sZW5ndGg7IGluZGV4ID0gaW5kZXggKyAxKSB7XG4gICAgICAgIGxldCB0aGVDb2luRGljdCA9IGNvaW5zW2luZGV4XVxuICAgICAgICBib3VuY2VTcHJpdGUodGhlQ29pbkRpY3QpXG4gICAgICAgIGNvaW5IaXRQbGF5ZXJQYXJhbSA9IHRoZUNvaW5EaWN0XG4gICAgICAgIHdoZW4yU3ByaXRlc0hpdCh0aGVDb2luRGljdFtcImlkXCJdLCBwbGF5ZXJJbmZvW1wiaWRcIl0sICgpID0+IHtcbiAgICAgICAgICAgIHBsYXllckluZm9bXCJzY29yZVwiXSA9IHBsYXllckluZm9bXCJzY29yZVwiXSArIGdldFJhbmRvbUludCgxMDAsIDI1MClcbiAgICAgICAgICAgIHRoZUNvaW5EaWN0W1wieFBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgICAgIHRoZUNvaW5EaWN0W1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgfSlcbiAgICB9XG4gICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgaGVhcnRzLmxlbmd0aDsgaW5kZXggPSBpbmRleCArIDEpIHtcbiAgICAgICAgbGV0IHRoZUhlYXJ0RGljdCA9IGhlYXJ0c1tpbmRleF1cbiAgICAgICAgYm91bmNlU3ByaXRlKHRoZUhlYXJ0RGljdClcbiAgICAgICAgaGVhcnRIaXRQbGF5ZXJQYXJhbSA9IHRoZUhlYXJ0RGljdFxuICAgICAgICB3aGVuMlNwcml0ZXNIaXQodGhlSGVhcnREaWN0W1wiaWRcIl0sIHBsYXllckluZm9bXCJpZFwiXSwgKCkgPT4ge1xuICAgICAgICAgICAgcGxheWVySW5mb1tcImhlYWx0aFwiXSA9IHBsYXllckluZm9bXCJoZWFsdGhcIl0gKyBnZXRSYW5kb21JbnQoMiwgNilcbiAgICAgICAgICAgIHRoZUhlYXJ0RGljdFtcInhQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgICAgICAgICB0aGVIZWFydERpY3RbXCJ5UG9zXCJdID0gaGlkaW5nU3BvdFxuICAgICAgICB9KVxuICAgIH1cbn1cbmxldCBnYW1lU3RhcnQ6IGJvb2xlYW4gPSBmYWxzZVxubGV0IGdhbWVQYXVzZTogYm9vbGVhbiA9IGZhbHNlXG5sZXQgZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBzcHJpdGUoc2NvcmVCb2FyZEluZm9bXCJpZFwiXSkuaHRtbChcIkhlYWx0aDpcIiArIHBsYXllckluZm9bXCJoZWFsdGhcIl0gKyBcIjxicj5cIiArIFwiU2NvcmU6XCIgKyBwbGF5ZXJJbmZvW1wic2NvcmVcIl0gKyBcIjxicj5cIiArIFwiVGltZTpcIiArIGAkeyhjdXJyZW50RGF0ZSgpIC0gdGltZUdhbWVTdGFydGVkKSAvIDEwMDB9YClcbiAgICBzcHJpdGUoc2NvcmVCb2FyZEluZm9bXCJpZFwiXSkuY3NzKFwiZm9udC1mYW1pbHlcIiwgXCJWZXJkYW5hXCIpXG4gICAgc3ByaXRlKHNjb3JlQm9hcmRJbmZvW1wiaWRcIl0pLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgXCJ0dXJxdW9pc2VcIilcbiAgICBzcHJpdGUoc2NvcmVCb2FyZEluZm9bXCJpZFwiXSkuY3NzKFwiZm9udC1zaXplXCIsIFwiMTZweFwiKVxuICAgIGlmIChnYW1lU3RhcnQgPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGdldEtleVN0YXRlKDY4KSkge1xuICAgICAgICAgICAgc3BsYXNoU2NyZWVuSW5mb1tcInhQb3NcIl0gPSBoaWRpbmdTcG90XG4gICAgICAgICAgICBzcGxhc2hTY3JlZW5JbmZvW1wieVBvc1wiXSA9IGhpZGluZ1Nwb3RcbiAgICAgICAgICAgIHNwcml0ZVNldFkoc3BsYXNoU2NyZWVuSW5mb1tcImlkXCJdLCBzcGxhc2hTY3JlZW5JbmZvW1wieVBvc1wiXSlcbiAgICAgICAgICAgIHNwcml0ZVNldFgoc3BsYXNoU2NyZWVuSW5mb1tcImlkXCJdLCBzcGxhc2hTY3JlZW5JbmZvW1wieFBvc1wiXSlcbiAgICAgICAgICAgIGdhbWVTdGFydCA9IHRydWVcbiAgICAgICAgICAgIHRpbWVHYW1lU3RhcnRlZCA9IGN1cnJlbnREYXRlKClcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZ2FtZVBhdXNlID09IGZhbHNlKSB7XG4gICAgICAgIHJ1bkdhbWUoKVxuICAgIH1cbn1cblxuIl19