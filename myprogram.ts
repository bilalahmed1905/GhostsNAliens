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
import {
    newGQAnimation,
    createGroupInPlayground,
    createSpriteInGroup,
    spriteSetX,
    spriteSetY,
    spriteGetWidth,
    spriteGetHeight,
    PLAYGROUND_HEIGHT,
    PLAYGROUND_WIDTH,
    getKeyState,
    spriteSetAnimation,
    ANIMATION_HORIZONTAL,
    SpriteDict,
    spriteSetXY,
    spritePauseAnimation,
    createTextSpriteInGroup,
    when2SpritesHit,
    forEachSpriteGroupHit,
    sprite,
    currentDate,
    spriteRotate,
    consolePrint,
    removeSprite,
    spriteExists,
} from "./libs/lib-gqguardrail-exports.ts";
import * as Fn from "./libs/lib-gqguardrail-exports.ts";
// Don't edit the import lines above, or you won't be able to write your program!

// Also, do not use the following variable and function names in your own code below:
//    setup, draw, Fn
// and the other imported names above.

// Write your program below this line:
// ***********************************
let hidingSpot: number = 3333
let skullHidingSpot: number = 1111
let enemyGroup: string = "enemies"
let powerUpGroup: string = "powerups"
let backgrounds = {
    1: true,
    2: false,
    3: false,
    desert1: false,
    desert2: false,
    desert3: false,
    gameOver: false
}
// Characters
let playerInfo: SpriteDict = {
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
}
let alienBossInfo: SpriteDict = {
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
}
// Clouds
let cloud1: SpriteDict = {
    "id": "cloud1",
    "height": 80,
    "width": 100,
    "xSpeed": 3,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
    "anim": newGQAnimation("img/cloud1.png")
}
let cloud2: SpriteDict = {
    "id": "cloud2",
    "height": 60,
    "width": 91,
    "xSpeed": -4.5,
    "ySpeed": 0,
    "xPos": 640,
    "yPos": 0,
    "anim": newGQAnimation("img/cloud2.png")
}
// Platforms
let platform1: SpriteDict = {
    "id": "platform1",
    "height": 4,
    "width": 50,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 100,
    "yPos": 320,
    "anim": newGQAnimation("img/platform1Gap.png")
}
// Powerups
let heart: SpriteDict = {
    "id": "heart",
    "height": 40,
    "width": 40,
    "xSpeed": 4,
    "ySpeed": 3,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
    "anim": newGQAnimation("img/heartPowerup.png"),
    "timeLastSpawned": 0
}
let coin: SpriteDict = {
    "id": "coin",
    "height": 9,
    "width": 9,
    "xSpeed": 4,
    "ySpeed": -3,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
    "anim": newGQAnimation("img/coinPowerup.png"),
    "timeLastSpawned": 0
}
// Backgrounds
let background1Info: SpriteDict = {
    "id": "background1",
    "height": 480,
    "width": 640,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
    "anim": newGQAnimation("img/background1.png")
}
let background2Info: SpriteDict = {
    "id": "background2",
    "height": 480,
    "width": 640,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
    "anim": newGQAnimation("img/background2.png")
}
let background3Info: SpriteDict = {
    "id": "background3",
    "height": 480,
    "width": 640,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
    "anim": newGQAnimation("img/background3.png")
}
let splashScreenInfo: SpriteDict = {
    "id": "splashScreen",
    "height": 480,
    "width": 640,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
    "anim": newGQAnimation("img/splashScreen.png"),
    "visible": true
}
let gameOverInfo: SpriteDict = {
    "id": "gameOverScreen",
    "width": 640,
    "height": 480,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": hidingSpot,
    "yPos": hidingSpot,
}
let scoreBoardInfo: SpriteDict = {
    "id": "scoreboard",
    "width": 102,
    "height": 50,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
}
let transparentScreenInfo: SpriteDict = {
    "id": "transparent",
    "width": 640,
    "height": 480,
    "xSpeed": 0,
    "ySpeed": 0,
    "xPos": 0,
    "yPos": 0,
}
let skullInfo: SpriteDict = {
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
}
let shurikenInfo: SpriteDict = {
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
}
let aliens: SpriteDict[] = []
let typeOfEnemy: string = ""
let createEnemy = function () {
    let decider: number = Math.floor(Math.random() * 2)
    let index: number = aliens.length
    let newAlienInfo: SpriteDict = {
        "id": `xalien${index}`,
        "height": 55,
        "width": 58,
        "xSpeed": getRandomInt(2, 7),
        "ySpeed": 0,
        "xPos": 0,
        "yPos": getRandomInt(100, 350),
        "anim": newGQAnimation("img/alienSpriteSheet60by180.png", 3, 58, 333.3, ANIMATION_HORIZONTAL),
        "health": getRandomInt(2, 6)
    }
    if (decider == 1) {
        newAlienInfo["anim"] = newGQAnimation("img/Fox60by360.png")
        typeOfEnemy = "fox"
    }
    if (decider == 2) {
        newAlienInfo["anim"] = newGQAnimation("img/alienSpriteSheet60by180.png", 3, 58, 333.3, ANIMATION_HORIZONTAL)
        typeOfEnemy = "alien"
    }
    aliens[index] = newAlienInfo

    let xalienInfo: SpriteDict = newAlienInfo
    createSpriteInGroup(enemyGroup, xalienInfo["id"], xalienInfo["anim"], xalienInfo["width"], xalienInfo["height"]);

    spriteSetXY(xalienInfo["id"], xalienInfo["xPos"], xalienInfo["yPos"])
}
let alienBosses: SpriteDict[] = []
let createBoss = function () {
    let index: number = alienBosses.length
    let newAlienInfo: SpriteDict = {
        "id": `boss${index}`,
        "height": 80,
        "width": 80,
        "xSpeed": getRandomInt(2, 6),
        "ySpeed": 3,
        "xPos": getRandomInt(150, 400),
        "yPos": getRandomInt(100, 350),
        "anim": newGQAnimation("img/alienBoss80by560.png", 7, 80, 166.67, ANIMATION_HORIZONTAL),
        "health": 10
    }
    alienBosses[index] = newAlienInfo

    let xalienInfo: SpriteDict = newAlienInfo
    createSpriteInGroup(enemyGroup, xalienInfo["id"], xalienInfo["anim"], xalienInfo["width"], xalienInfo["height"]);

    spriteSetX(xalienInfo["id"], xalienInfo["xPos"])
    spriteSetY(xalienInfo["id"], xalienInfo["yPos"])
}
let foxes: SpriteDict[] = []
let createFox = function () {
    let index: number = foxes.length
    let newFoxInfo: SpriteDict = {
        "id": `afox${index}`,
        "height": 55,
        "width": 58,
        "xSpeed": getRandomInt(3, 6),
        "ySpeed": getRandomInt(2, 6),
        "xPos": getRandomInt(100, 150),
        "yPos": getRandomInt(125, 346),
        "anim": newGQAnimation("img/Fox60by360.png"),
        "health": getRandomInt(2, 5)
    }
    foxes[index] = newFoxInfo

    let afoxInfo: SpriteDict = newFoxInfo
    createSpriteInGroup(enemyGroup, afoxInfo["id"], afoxInfo["anim"], afoxInfo["width"], afoxInfo["height"]);

    spriteSetX(afoxInfo["id"], afoxInfo["xPos"])
    spriteSetY(afoxInfo["id"], afoxInfo["yPos"])
}
let coins: SpriteDict[] = []
let createCoin = function () {
    let index: number = coins.length
    let newCoinInfo: SpriteDict = {
        "id": `aCoin${index}`,
        "height": 9,
        "width": 9,
        "xSpeed": 4,
        "ySpeed": -3,
        "xPos": 10 + Math.random() * 60,
        "yPos": 100 + Math.random() * 200,
        "anim": newGQAnimation("img/coinPowerup.png"),
    }
    coins[index] = newCoinInfo

    let aCoinInfo: SpriteDict = newCoinInfo
    createSpriteInGroup(powerUpGroup, aCoinInfo["id"], aCoinInfo["anim"], aCoinInfo["width"], aCoinInfo["height"]);

    spriteSetX(aCoinInfo["id"], aCoinInfo["xPos"])
    spriteSetY(aCoinInfo["id"], aCoinInfo["yPos"])
}
let hearts: SpriteDict[] = []
let createHeart = function () {
    let index: number = hearts.length
    let newHeartInfo: SpriteDict = {
        "id": `heart${index}`,
        "height": 40,
        "width": 40,
        "xSpeed": 4,
        "ySpeed": 3,
        "xPos": 100 + Math.random() * 250,
        "yPos": 100 + Math.random() * 200,
        "anim": newGQAnimation("img/heartPowerup.png"),
    }
    hearts[index] = newHeartInfo

    let aHeartInfo: SpriteDict = newHeartInfo
    createSpriteInGroup(powerUpGroup, aHeartInfo["id"], aHeartInfo["anim"], aHeartInfo["width"], aHeartInfo["height"]);

    spriteSetX(aHeartInfo["id"], aHeartInfo["xPos"])
    spriteSetY(aHeartInfo["id"], aHeartInfo["yPos"])
}
let setup = function () {
    // Create Groups
    let bossGroup: string = "boss"
    let playerGroup: string = "ghostPlayer"
    let backgroundGroup: string = "backgrounds"
    let cloudGroup: string = "clouds"
    let platformGroup: string = "platform"
    let hudGroupName: string = "hudGroup"
    let laserGroupName: string = "laserGroup"
    createGroupInPlayground(backgroundGroup)
    createGroupInPlayground(laserGroupName)
    createGroupInPlayground(cloudGroup)
    createGroupInPlayground(enemyGroup)
    createGroupInPlayground(bossGroup)
    createGroupInPlayground(powerUpGroup)
    createGroupInPlayground(playerGroup)
    createGroupInPlayground(platformGroup)
    createGroupInPlayground(hudGroupName)
    // Create Sprites
    createTextSpriteInGroup(hudGroupName, scoreBoardInfo["id"], scoreBoardInfo["width"], scoreBoardInfo["height"], scoreBoardInfo["xPos"], scoreBoardInfo["yPos"])
    createSpriteInGroup(hudGroupName, splashScreenInfo["id"], splashScreenInfo["anim"], splashScreenInfo["width"],
        splashScreenInfo["height"], splashScreenInfo["xPos"], splashScreenInfo["yPos"]);
    createTextSpriteInGroup(hudGroupName, gameOverInfo["id"], gameOverInfo["width"],
        gameOverInfo["height"], gameOverInfo["xPos"], gameOverInfo["yPos"]);
    createTextSpriteInGroup(hudGroupName, transparentScreenInfo["id"], transparentScreenInfo["width"],
        transparentScreenInfo["height"], transparentScreenInfo["xPos"], transparentScreenInfo["yPos"]);
    sprite(transparentScreenInfo["id"]).css("opacity", "0.0")
    sprite(transparentScreenInfo["id"]).css("font-size", "20px")
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
let moveSprite = function (sprite: SpriteDict) {
    sprite["xPos"] = sprite["xPos"] + sprite["xSpeed"]
    if (sprite["xPos"] < -1 * spriteGetWidth(sprite["id"])) {
        sprite["xPos"] = PLAYGROUND_WIDTH
    }
    if (sprite["xPos"] > PLAYGROUND_WIDTH) {
        sprite["xPos"] = -1 * spriteGetWidth(sprite["id"])
    }
    spriteSetX(sprite["id"], sprite["xPos"])
    sprite["yPos"] = sprite["yPos"] + sprite["ySpeed"]
    if (sprite["yPos"] < -1 * spriteGetWidth(sprite["id"])) {
        sprite["yPos"] = PLAYGROUND_HEIGHT
    }
    if (sprite["yPos"] > 480) {
        sprite["yPos"] = -1 * spriteGetWidth(sprite["id"])
    }
    spriteSetY(sprite["id"], sprite["yPos"])
}
let moveAlien = function (sprite: SpriteDict) {
    sprite["xPos"] = sprite["xPos"] + sprite["xSpeed"]
    if (sprite["xPos"] > PLAYGROUND_WIDTH) {
        sprite["xPos"] = -1 * spriteGetWidth(sprite["id"])
    }
    spriteSetX(sprite["id"], sprite["xPos"])
    sprite["yPos"] = sprite["yPos"] + sprite["ySpeed"]
    if (sprite["yPos"] < -1 * spriteGetHeight(sprite["id"])) {
        sprite["yPos"] = PLAYGROUND_HEIGHT
    }
    if (sprite["yPos"] > 480) {
        sprite["yPos"] = -1 * spriteGetHeight(sprite["id"])
    }
    spriteSetY(sprite["id"], sprite["yPos"])
}
let decayBounceSprite = function (info: SpriteDict) {
    let decayRate: number = 0.6

    info["xPos"] = info["xPos"] + info["xSpeed"]
    if (info["xPos"] < 0) {
        info["xSpeed"] = -1 * info["xSpeed"] * decayRate
        info["xPos"] = 0
    }
    if (info["xPos"] > PLAYGROUND_WIDTH - info["width"]) {
        info["xSpeed"] = -1 * info["xSpeed"] * decayRate
        info["xPos"] = PLAYGROUND_WIDTH - info["width"]
    }
    spriteSetX(info["id"], info["xPos"])

    info["yPos"] = info["yPos"] + info["ySpeed"]
    if (info["yPos"] < 0) {
        info["ySpeed"] = -1 * info["ySpeed"] * decayRate
        info["yPos"] = 0
    }
    if (info["yPos"] > PLAYGROUND_HEIGHT - info["height"]) {
        info["ySpeed"] = -1 * info["ySpeed"] * decayRate
        info["yPos"] = PLAYGROUND_HEIGHT - info["height"]
        if (Math.abs(info["ySpeed"]) < 1) {
            info["movementState"] = "standing"
        }
    }
    spriteSetY(info["id"], info["yPos"])
}
let resetScene = function () {

    alienBossInfo["xPos"] = hidingSpot
    alienBossInfo["yPos"] = hidingSpot
    alienBossInfo["visible"] = false

    skullInfo["xPos"] = skullHidingSpot
    skullInfo["yPos"] = skullHidingSpot

}
let moveGhost = function () {
    playerInfo["xPos"] = playerInfo["xPos"] + playerInfo["xSpeed"]
    if (playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"] && scene1EnemiesDeafeated == false) {
        playerInfo["xPos"] = 575
    }
    if (backgrounds[2] == true && playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"] && scene2EnemiesDeafeated == false) {
        playerInfo["xPos"] = 575
    }
    if (backgrounds[3] == true && playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"]) {
        playerInfo["xPos"] = 575
    }
    if (scene1EnemiesDeafeated == true) {
        sprite(transparentScreenInfo["id"]).html("Stage Cleared")
    }
    if (playerInfo["xPos"] >= PLAYGROUND_WIDTH && backgrounds[1] == true && scene1EnemiesDeafeated) {
        backgrounds[2] = true
        backgrounds[1] = false
        background2Info["xPos"] = 0
        background2Info["yPos"] = 0
        spriteSetXY(background2Info["id"], background2Info["xPos"], background2Info["yPos"])
        background1Info["xPos"] = hidingSpot
        background1Info["yPos"] = hidingSpot
        spriteSetXY(background1Info["id"], background1Info["xPos"], background1Info["yPos"])
        playerInfo["xPos"] = 0
        consolePrint("right 1 to 2")
        resetScene()
        scene1EnemiesDeafeated = false
    }
    else if (playerInfo["xPos"] < 1 && backgrounds[1] == true) {
        playerInfo["xPos"] = 1
    }
    else if (playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"] && backgrounds["desert3"] == true) {
        playerInfo["xPos"] = PLAYGROUND_WIDTH - playerInfo["width"]
    }
    else if (playerInfo["xPos"] < 1 && backgrounds[2] == true) {
        playerInfo["xPos"] = 1
    }
    if (playerInfo["xPos"] >= PLAYGROUND_WIDTH && backgrounds[2] == true) {
        backgrounds[2] = false
        backgrounds[3] = true
        background3Info["xPos"] = 0
        background3Info["yPos"] = 0
        background2Info["xPos"] = hidingSpot
        background2Info["yPos"] = hidingSpot
        spriteSetXY(background3Info["id"], background3Info["xPos"], background3Info["yPos"])
        spriteSetXY(background2Info["id"], background2Info["xPos"], background2Info["yPos"])
        playerInfo["xPos"] = 0
        consolePrint("right 2 to 3")
        resetScene()
    }
    else if (playerInfo["xPos"] < 1 && backgrounds[3] == true) {
        playerInfo["xPos"] = 1
    }
    if (playerInfo["xPos"] >= PLAYGROUND_WIDTH - playerInfo["width"] && backgrounds[3] == true) {
        playerInfo["xPos"] = 575
    }
    spriteSetX(playerInfo["id"], playerInfo["xPos"])
    playerInfo["yPos"] = playerInfo["yPos"] + playerInfo["ySpeed"]
    if (playerInfo["yPos"] < -1 * spriteGetWidth(playerInfo["id"])) {
        playerInfo["yPos"] = PLAYGROUND_HEIGHT
    }
    if (playerInfo["yPos"] > 480) {
        playerInfo["yPos"] = -1 * spriteGetWidth(playerInfo["id"])
    }
    spriteSetY(playerInfo["id"], playerInfo["yPos"])
}
let bounceSprite = function (aSpriteInfo: SpriteDict) {
    aSpriteInfo["xPos"] = aSpriteInfo["xPos"] + aSpriteInfo["xSpeed"]
    if (aSpriteInfo["xPos"] < 0) {
        aSpriteInfo["xSpeed"] = -1 * aSpriteInfo["xSpeed"]
    }
    if (aSpriteInfo["xPos"] > PLAYGROUND_WIDTH - aSpriteInfo["width"]) {
        aSpriteInfo["xSpeed"] = -1 * aSpriteInfo["xSpeed"]
    }
    spriteSetX(aSpriteInfo["id"], aSpriteInfo["xPos"])
    aSpriteInfo["yPos"] = aSpriteInfo["yPos"] + aSpriteInfo["ySpeed"]
    if (aSpriteInfo["yPos"] < 0) {
        aSpriteInfo["ySpeed"] = -1 * aSpriteInfo["ySpeed"]
    }
    if (aSpriteInfo["yPos"] > PLAYGROUND_HEIGHT - aSpriteInfo["height"]) {
        aSpriteInfo["ySpeed"] = -1 * aSpriteInfo["ySpeed"]
    }
    spriteSetY(aSpriteInfo["id"], aSpriteInfo["yPos"])
}
let moveSkull = function () {
    let stdLaserXSpeed: number = 7
    let skullCooldown: number = 1000
    let timeSincePlayerFired: number = currentDate() - playerInfo["timeSkullWasFired"]
    if (getKeyState(32) && skullInfo["fired"] == false && !playerInfo["isLeft"] && timeSincePlayerFired > skullCooldown) {
        skullInfo["xPos"] = playerInfo["xPos"] + playerInfo["width"]
        skullInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2
        skullInfo["xSpeed"] = stdLaserXSpeed
        skullInfo["fired"] = true
        skullInfo["dir"] = "right"
        playerInfo["timeSkullWasFired"] = currentDate()
    }
    if (getKeyState(32) && skullInfo["fired"] == false && playerInfo["isLeft"] && timeSincePlayerFired > skullCooldown) {
        skullInfo["xPos"] = playerInfo["xPos"] - skullInfo["width"] + skullInfo["xSpeed"]
        skullInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2
        skullInfo["xSpeed"] = stdLaserXSpeed
        skullInfo["fired"] = true
        skullInfo["dir"] = "left"
        playerInfo["timeSkullWasFired"] = currentDate()
    }
    if (skullInfo["xPos"] > PLAYGROUND_WIDTH || skullInfo["xPos"] < 0 || skullInfo["yPos"] >= PLAYGROUND_HEIGHT || skullInfo["yPos"] <= 0) {
        skullInfo["fired"] = false
        skullInfo["xPos"] = skullHidingSpot
        skullInfo["yPos"] = skullHidingSpot
        skullInfo["xSpeed"] = 0
    }
    if (skullInfo["dir"] == "right") {
        skullInfo["xPos"] = skullInfo["xPos"] + skullInfo["xSpeed"]
        skullInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2
        spriteSetX(skullInfo["id"], skullInfo["xPos"])
        spriteSetY(skullInfo["id"], skullInfo["yPos"])
    }
    if (skullInfo["dir"] == "left") {
        skullInfo["xPos"] = skullInfo["xPos"] + -skullInfo["xSpeed"]
        spriteSetX(skullInfo["id"], skullInfo["xPos"])
        skullInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2
        spriteSetY(skullInfo["id"], skullInfo["yPos"])
    }
    if (skullInfo["dir"] == "down") {
        skullInfo["yPos"] = skullInfo["yPos"] + skullInfo["ySpeed"]
        spriteSetY(skullInfo["id"], skullInfo["yPos"])
    }
}
let moveShuriken = function () {
    let stdLaserXSpeed: number = 30
    let shurikenCooldown: number = 0
    let timeSincePlayerFired: number = currentDate() - playerInfo["timeShurikenWasFired"]
    if (getKeyState(90) && shurikenInfo["fired"] == false && !playerInfo["isLeft"] && timeSincePlayerFired > shurikenCooldown) {
        shurikenInfo["xPos"] = playerInfo["xPos"] + playerInfo["width"]
        shurikenInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2
        shurikenInfo["xSpeed"] = stdLaserXSpeed
        shurikenInfo["fired"] = true
        shurikenInfo["dir"] = "right"
        shurikenInfo["timeSkullWasFired"] = currentDate()
    }
    if (shurikenInfo["xPos"] != hidingSpot && shurikenInfo["yPos"] != hidingSpot) {
        setTimeout(() => {
            spriteRotate(shurikenInfo["id"], 90)
        }, 500)
    }
    if (getKeyState(90) && shurikenInfo["fired"] == false && playerInfo["isLeft"] && timeSincePlayerFired > shurikenCooldown) {
        shurikenInfo["xPos"] = playerInfo["xPos"] - shurikenInfo["width"] + shurikenInfo["xSpeed"]
        shurikenInfo["yPos"] = playerInfo["yPos"] + playerInfo["height"] / 2
        shurikenInfo["xSpeed"] = stdLaserXSpeed
        shurikenInfo["fired"] = true
        shurikenInfo["dir"] = "left"
        playerInfo["timeSkullWasFired"] = currentDate()
    }
    if (shurikenInfo["xPos"] > PLAYGROUND_WIDTH || shurikenInfo["xPos"] < 0 || shurikenInfo["yPos"] >= PLAYGROUND_HEIGHT || shurikenInfo["yPos"] <= 0) {
        shurikenInfo["fired"] = false
        shurikenInfo["xPos"] = skullHidingSpot
        shurikenInfo["yPos"] = skullHidingSpot
        shurikenInfo["xSpeed"] = 0
    }
    if (shurikenInfo["dir"] == "right") {
        shurikenInfo["xPos"] = shurikenInfo["xPos"] + shurikenInfo["xSpeed"]
        shurikenInfo["yPos"] = playerInfo["yPos"] + playerInfo["ySpeed"]
        spriteSetX(shurikenInfo["id"], shurikenInfo["xPos"])
        spriteSetY(shurikenInfo["id"], shurikenInfo["yPos"])
    }
    if (shurikenInfo["dir"] == "left") {
        shurikenInfo["xPos"] = shurikenInfo["xPos"] + -shurikenInfo["xSpeed"]
        spriteSetX(shurikenInfo["id"], shurikenInfo["xPos"])
        shurikenInfo["yPos"] = playerInfo["yPos"] + playerInfo["ySpeed"]
        spriteSetY(shurikenInfo["id"], shurikenInfo["yPos"])
    }
    if (shurikenInfo["dir"] == "down") {
        shurikenInfo["yPos"] = shurikenInfo["yPos"] + shurikenInfo["ySpeed"]
        spriteSetY(shurikenInfo["id"], shurikenInfo["yPos"])
    }
}
let keyMovesSkull = function () {
    let maxSpeed: number = 6
    if (getKeyState(40)) {
        skullInfo["dir"] = "down"
        skullInfo["ySpeed"] = skullInfo["ySpeed"] + 1
        if (skullInfo["ySpeed"] > maxSpeed) {
            skullInfo["ySpeed"] = maxSpeed
        }
    }
}
// Move Ghost Player
let timeSinceLastDash: number = currentDate() - playerInfo["timeSinceLastDash"]
let keyMovesPlayer = function () {
    let maxSpeed = 6
    if (getKeyState(90) && getKeyState(65) && timeSinceLastDash > 5000) {
        playerInfo["xSpeed"] = playerInfo["xSpeed"] + -1.5
        spriteSetAnimation(playerInfo["id"], playerInfo["leftAnim"])
        playerInfo["isLeft"] = true
        playerInfo["timeSinceLastDash"] = currentDate()
    }
    if (getKeyState(65)) {
        playerInfo["xSpeed"] = playerInfo["xSpeed"] + -1
        spriteSetAnimation(playerInfo["id"], playerInfo["leftAnim"])
        playerInfo["isLeft"] = true
    }
    if (getKeyState(68)) {
        playerInfo["xSpeed"] = playerInfo["xSpeed"] + 1
        spriteSetAnimation(playerInfo["id"], playerInfo["anim"])
        playerInfo["isLeft"] = false
    }
    if (!getKeyState(65) && !getKeyState(68)) {
        playerInfo["xSpeed"] = 0
    }
    if (getKeyState(87)) {
        playerInfo["ySpeed"] = playerInfo["ySpeed"] + -1
    }
    if (getKeyState(83)) {
        playerInfo["ySpeed"] = playerInfo["ySpeed"] + 1
    }
    if (!getKeyState(87) && !getKeyState(83)) {
        playerInfo["ySpeed"] = 0
    }
    let xSquared = playerInfo["xSpeed"] * playerInfo["xSpeed"]
    let ySquared = playerInfo["ySpeed"] * playerInfo["ySpeed"]
    let hypSquared = xSquared + ySquared
    let combinedSpeed = Math.sqrt(hypSquared)
    if (combinedSpeed > maxSpeed) {
        let factor = combinedSpeed / maxSpeed
        let maxXSpeed = playerInfo["xSpeed"] / factor
        let maxYSpeed = playerInfo["ySpeed"] / factor
        playerInfo["xSpeed"] = maxXSpeed
        playerInfo["ySpeed"] = maxYSpeed
    }
    moveGhost()
}
let playerHitsCactus = function () {
    playerInfo["health"] = playerInfo["health"] - 1
}
let playerHitFoxParam: SpriteDict
let coinHitPlayerParam: SpriteDict
let heartHitPlayerParam: SpriteDict
let playerHitAlienParam: SpriteDict
let playerHitBossParam: SpriteDict
let timeGameStarted: number = currentDate()

let enemyDisappear = function () {
    if (alienBossInfo["health"] <= 0) {
        alienBossInfo["xPos"] = hidingSpot
        alienBossInfo["yPos"] = hidingSpot
        spriteSetXY(alienBossInfo["id"], alienBossInfo["xPos"], alienBossInfo["yPos"])
    }
}
let boundaries = function (aSpriteInfo: SpriteDict) {
    let upYBoundary: number = 50
    let downYBoundary: number = 347
    if (aSpriteInfo["yPos"] >= downYBoundary) {
        aSpriteInfo["yPos"] = downYBoundary
    }
    if (playerInfo["yPos"] <= upYBoundary) {
        playerInfo["yPos"] = upYBoundary
    }
}
let bouncyBoundaries = function (aSpriteInfo: SpriteDict, downYBoundary: number, upYBoundary: number,) {
    if (aSpriteInfo["yPos"] >= downYBoundary) {
        aSpriteInfo["ySpeed"] = -1 * aSpriteInfo["ySpeed"]
    }
    if (aSpriteInfo["yPos"] <= 0) {
        aSpriteInfo["ySpeed"] = -1 * aSpriteInfo["ySpeed"]
    }
}
let getRandomInt = function (min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
let collisions = function () {
    when2SpritesHit(playerInfo["id"], heart["id"], () => {
        playerInfo["health"] = playerInfo["health"] + (1 + Math.floor(Math.random() * 3))
        heart["xPos"] = hidingSpot
        heart["yPos"] = hidingSpot
    })
    when2SpritesHit(playerInfo["id"], coin["id"], () => {
        playerInfo["score"] = playerInfo["score"] + getRandomInt(100, 250)
        coin["xPos"] = hidingSpot
        coin["yPos"] = hidingSpot
    })
    when2SpritesHit(playerInfo["id"], alienBossInfo["id"], () => {
        playerInfo["health"] = playerInfo["health"] - 2
    })
    when2SpritesHit(skullInfo["id"], alienBossInfo["id"], () => {
        alienBossInfo["health"] = alienBossInfo["health"] - 1
        skullInfo["xPos"] = skullHidingSpot
        skullInfo["yPos"] = skullHidingSpot
    })
}
let scene1EnemiesDeafeated: boolean = false, scene2EnemiesDeafeated: boolean = false, scene3EnemiesDeafeated: boolean = false
let stageMove = function () {
    if (playerInfo["kills"] >= aliens.length && playerInfo["score"] >= 950) {
        scene1EnemiesDeafeated = true
    }
    if (playerInfo["kills"] >= foxes.length + aliens.length && playerInfo["score"] >= 1700) {
        scene2EnemiesDeafeated = true
    }
    if (playerInfo["kills"] >= foxes.length + alienBosses.length + aliens.length && playerInfo["score"] >= 2750) {
        scene3EnemiesDeafeated = true
    }
}
let skullPush = function (sprite: SpriteDict, min: number, max: number) {
    if (skullInfo["dir"] == "down") {
        sprite["yPos"] = sprite["yPos"] + getRandomInt(min, max)
    }
    if (skullInfo["dir"] == "left") {
        sprite["xPos"] = sprite["xPos"] - getRandomInt(min, max)
    }
    if (skullInfo["dir"] == "right") {
        sprite["xPos"] = sprite["xPos"] + getRandomInt(min, max)
    }
}
let gameEnd = function () {
    if (playerInfo["health"] <= 0) {
        backgrounds["gameOver"] = true
        gameOverInfo["xPos"] = 0
        gameOverInfo["yPos"] = 0
        spriteSetXY(gameOverInfo["id"], gameOverInfo["xPos"], gameOverInfo["yPos"])
        sprite(scoreBoardInfo["id"]).html("<b> You died </b>")
        sprite(gameOverInfo["id"]).css("text-align", "center")
        sprite(gameOverInfo["id"]).css("font-size", "40px")
        sprite(gameOverInfo["id"]).css("font-family", "Verdana")
        sprite(gameOverInfo["id"]).css("color", "black")
        sprite(gameOverInfo["id"]).css("background-color", "turquoise")
        sprite(gameOverInfo["id"]).html("<b> You Died </b>" + "<br>" + "<br>" + `Your Final Score was: ${playerInfo["score"]}` + "<br>" + "<br>" + `You had ${playerInfo["kills"]} kills` + "<br>" + "<br>" + "Thank you for playing!")
    }
    if (scene3EnemiesDeafeated) {
        backgrounds["gameOver"] = true
        gameOverInfo["xPos"] = 0
        gameOverInfo["yPos"] = 0
        spriteSetXY(gameOverInfo["id"], gameOverInfo["xPos"], gameOverInfo["yPos"])
        background3Info["xPos"] = hidingSpot
        background3Info["yPos"] = hidingSpot
        spriteSetXY(background3Info["id"], background3Info["xPos"], background3Info["yPos"])
        sprite(gameOverInfo["id"]).css("text-align", "center")
        sprite(gameOverInfo["id"]).css("font-size", "40px")
        sprite(gameOverInfo["id"]).css("font-family", "Verdana")
        sprite(gameOverInfo["id"]).css("color", "black")
        sprite(gameOverInfo["id"]).css("background-color", "turquoise")
        sprite(gameOverInfo["id"]).html("<b> You Won!! </b>" + "<br>" + "<br>" + `Your Final Score was: ${playerInfo["score"]}` + "<br>" + "<br>" + `You had ${playerInfo["kills"]} kills` + "<br>" + "<br>" + "Thank you for playing!")
    }
}

let timeLastCoinMade: number = 0
let timeLastHeartMade: number = 0
let runGame = function () {
    moveSprite(alienBossInfo)
    moveSkull()
    moveShuriken()
    keyMovesPlayer()
    keyMovesSkull()
    moveSprite(cloud1)
    moveSprite(cloud2)
    bounceSprite(heart)
    bounceSprite(coin)
    enemyDisappear()
    gameEnd()
    stageMove()
    boundaries(playerInfo)
    collisions()
    if (foxes.length < 7 && (backgrounds[2] || backgrounds[3])) {
        createFox()
    }
    if (aliens.length < getRandomInt(6, 10) && (backgrounds[1] || backgrounds[3])) {
        createEnemy()
    }
    if (alienBosses.length < 2) {
        createBoss()
    }
    if (currentDate() - timeLastCoinMade > getRandomInt(27000, 40000)) {
        createCoin()
        timeLastCoinMade = currentDate()
    }
    if (currentDate() - timeLastHeartMade > getRandomInt(32000, 40000)) {
        createHeart()
        timeLastHeartMade = currentDate()
    }
    let timeSinceHealthTaken: number = currentDate() - playerInfo["timeSinceHealthTaken"]
    let healthTakenCooldown: number = 1750
    for (let index: number = 0; index < aliens.length; index = index + 1) {
        let theAlienDict = aliens[index]
        if (backgrounds[1]) {
            moveAlien(theAlienDict)
        }
        if (backgrounds[2]) {
            theAlienDict["xPos"] = hidingSpot
            theAlienDict["yPos"] = hidingSpot
            spriteSetXY(theAlienDict["id"], theAlienDict["xPos"], theAlienDict["yPos"])
        }
        boundaries(theAlienDict)
        playerHitAlienParam = theAlienDict
        when2SpritesHit(playerInfo["id"], theAlienDict["id"], () => {
            if (timeSinceHealthTaken > healthTakenCooldown) {
                playerInfo["timeSinceHealthTaken"] = currentDate()
                playerInfo["health"] = playerInfo["health"] - 1
            }
        })
        when2SpritesHit(skullInfo["id"], theAlienDict["id"], () => {
            theAlienDict["health"] = theAlienDict["health"] - 1
            if (theAlienDict["health"] > 1) {
                skullPush(theAlienDict, 6, 8)
            }
            skullInfo["xPos"] = skullHidingSpot
            skullInfo["yPos"] = skullHidingSpot
        })
        when2SpritesHit(shurikenInfo["id"], theAlienDict["id"], () => {
            theAlienDict["health"] = theAlienDict["health"] - 0.25
            if (theAlienDict["health"] > 1) {
                skullPush(theAlienDict, 3, 5)
            }
            shurikenInfo["xPos"] = skullHidingSpot
            shurikenInfo["yPos"] = skullHidingSpot
        })

        if (theAlienDict["health"] <= 0) {
            theAlienDict["xPos"] = hidingSpot
            theAlienDict["yPos"] = hidingSpot
            theAlienDict["health"] = 2
            theAlienDict["xSpeed"] = 0
            theAlienDict["ySpeed"] = 0
            spriteSetXY(theAlienDict["id"], theAlienDict["xPos"], theAlienDict["yPos"])
            playerInfo["score"] = playerInfo["score"] + getRandomInt(100, 200)
            playerInfo["kills"] = playerInfo["kills"] + 1
        }
    }
    // Boss Aliens
    for (let index: number = 0; index < alienBosses.length; index = index + 1) {
        let theBossAlienDict = alienBosses[index]
        if (backgrounds[3]) {
            moveSprite(theBossAlienDict)
            spriteSetXY(theBossAlienDict["id"], theBossAlienDict["xPos"], theBossAlienDict["yPos"])
        }
        if (backgrounds[1] || backgrounds[2]) {
            theBossAlienDict["xPos"] = hidingSpot
            theBossAlienDict["yPos"] = hidingSpot
            spriteSetXY(theBossAlienDict["id"], theBossAlienDict["xPos"], theBossAlienDict["yPos"])
        }
        playerHitBossParam = theBossAlienDict
        when2SpritesHit(playerInfo["id"], theBossAlienDict["id"], () => {
            if (timeSinceHealthTaken > healthTakenCooldown) {
                playerInfo["timeSinceHealthTaken"] = currentDate()
                playerInfo["health"] = playerInfo["health"] - 2
            }
        })
        when2SpritesHit(skullInfo["id"], theBossAlienDict["id"], () => {
            theBossAlienDict["health"] = theBossAlienDict["health"] - 1
            skullPush(theBossAlienDict, 6, 8)
            skullInfo["xPos"] = skullHidingSpot
            skullInfo["yPos"] = skullHidingSpot
        })
        when2SpritesHit(shurikenInfo["id"], theBossAlienDict["id"], () => {
            theBossAlienDict["health"] = theBossAlienDict["health"] - 0.25
            skullPush(theBossAlienDict, 3, 5)
            shurikenInfo["xPos"] = skullHidingSpot
            shurikenInfo["yPos"] = skullHidingSpot
        })

        if (theBossAlienDict["health"] <= 0) {
            theBossAlienDict["xPos"] = hidingSpot
            theBossAlienDict["yPos"] = hidingSpot
            theBossAlienDict["health"] = 2
            theBossAlienDict["xSpeed"] = 0
            theBossAlienDict["ySpeed"] = 0
            spriteSetXY(theBossAlienDict["id"], theBossAlienDict["xPos"], theBossAlienDict["yPos"])
            playerInfo["score"] = playerInfo["score"] + getRandomInt(250, 400)
            playerInfo["kills"] = playerInfo["kills"] + 1
        }

    }
    for (let index: number = 0; index < foxes.length; index = index + 1) {
        let theFoxDict = foxes[index]
        if (backgrounds[2]) {
            bouncyBoundaries(theFoxDict, 346, 0)
            moveAlien(theFoxDict)
        }
        playerHitFoxParam = theFoxDict
        when2SpritesHit(playerInfo["id"], theFoxDict["id"], () => {
            if (timeSinceHealthTaken > healthTakenCooldown) {
                playerInfo["timeSinceHealthTaken"] = currentDate()
                playerInfo["health"] = playerInfo["health"] - 1
            }
        })
        when2SpritesHit(skullInfo["id"], theFoxDict["id"], () => {
            theFoxDict["health"] = theFoxDict["health"] - 1
            skullPush(theFoxDict, 6, 8)
            skullInfo["xPos"] = skullHidingSpot
            skullInfo["yPos"] = skullHidingSpot
        })
        when2SpritesHit(shurikenInfo["id"], theFoxDict["id"], () => {
            theFoxDict["health"] = theFoxDict["health"] - 0.25
            skullPush(theFoxDict, 3, 5)
            shurikenInfo["xPos"] = skullHidingSpot
            shurikenInfo["yPos"] = skullHidingSpot
        })
        if (theFoxDict["health"] <= 0) {
            theFoxDict["xPos"] = hidingSpot
            theFoxDict["yPos"] = hidingSpot
            playerInfo["score"] = playerInfo["score"] + Math.floor((100 + Math.random() * 100))
            theFoxDict["xSpeed"] = 0
            theFoxDict["ySpeed"] = 0
            theFoxDict["xPos"] = hidingSpot
            theFoxDict["yPos"] = hidingSpot
            spriteSetXY(theFoxDict["id"], theFoxDict["xPos"], theFoxDict["yPos"])
            playerInfo["kills"] = playerInfo["kills"] + 1
            theFoxDict["health"] = 2
        }
    }

    for (let index: number = 0; index < coins.length; index = index + 1) {
        let theCoinDict = coins[index]
        bounceSprite(theCoinDict)
        coinHitPlayerParam = theCoinDict
        when2SpritesHit(theCoinDict["id"], playerInfo["id"], () => {
            playerInfo["score"] = playerInfo["score"] + getRandomInt(100, 250)
            theCoinDict["xPos"] = hidingSpot
            theCoinDict["yPos"] = hidingSpot
        })
    }
    for (let index: number = 0; index < hearts.length; index = index + 1) {
        let theHeartDict = hearts[index]
        bounceSprite(theHeartDict)
        heartHitPlayerParam = theHeartDict
        when2SpritesHit(theHeartDict["id"], playerInfo["id"], () => {
            playerInfo["health"] = playerInfo["health"] + getRandomInt(2, 6)
            theHeartDict["xPos"] = hidingSpot
            theHeartDict["yPos"] = hidingSpot
        })
    }
}
let gameStart: boolean = false
let gamePause: boolean = false
let draw = function () {
    sprite(scoreBoardInfo["id"]).html("Health:" + playerInfo["health"] + "<br>" + "Score:" + playerInfo["score"] + "<br>" + "Time:" + `${(currentDate() - timeGameStarted) / 1000}`)
    sprite(scoreBoardInfo["id"]).css("font-family", "Verdana")
    sprite(scoreBoardInfo["id"]).css("background-color", "turquoise")
    sprite(scoreBoardInfo["id"]).css("font-size", "16px")
    if (gameStart == false) {
        if (getKeyState(68)) {
            splashScreenInfo["xPos"] = hidingSpot
            splashScreenInfo["yPos"] = hidingSpot
            spriteSetY(splashScreenInfo["id"], splashScreenInfo["yPos"])
            spriteSetX(splashScreenInfo["id"], splashScreenInfo["xPos"])
            gameStart = true
            timeGameStarted = currentDate()
        }
    } else if (gamePause == false) {
        runGame()
    }
}

