"use strict";
// students are not supposed to use GQG_ variables
let GQG_DEBUG = true;
       const setGqDebugFlag = (debug) => {
    if (debug) {
        GQG_DEBUG = true;
    }
    else {
        console.log(GQG_WARNING_IN_MYPROGRAM_MSG + "debug mode disabled and your code is now running in unsafe mode.");
        GQG_DEBUG = false;
    }
};
const GQG_SPRITE_GROUP_NAME_FORMAT_REGEX = /[a-zA-Z0-9_]+[a-zA-Z0-9_-]*/;
       const spriteGroupNameFormatIsValid = (spriteOrGroupName) => {
    if (typeof spriteOrGroupName !== "string" &&
        typeof spriteOrGroupName !== "number") {
        return false;
    }
    spriteOrGroupName = spriteOrGroupName.toString();
    let nameMatches = spriteOrGroupName.match(GQG_SPRITE_GROUP_NAME_FORMAT_REGEX);
    nameMatches = (nameMatches ? nameMatches : []);
    if (nameMatches.length === 0) {
        return false;
    }
    return (spriteOrGroupName === nameMatches[0]);
};
const GQG_SIGNALS = {};
let GQG_UNIQUE_ID_COUNTER = 0;
let GQG_PLAYGROUND_WIDTH = 640;
let GQG_PLAYGROUND_HEIGHT = 480;
       let PLAYGROUND_WIDTH = GQG_PLAYGROUND_WIDTH; // students are not supposed to use GQG_ variables
       let PLAYGROUND_HEIGHT = GQG_PLAYGROUND_HEIGHT;
       const ANIMATION_HORIZONTAL = $.gQ.ANIMATION_HORIZONTAL;
       const ANIMATION_VERTICAL = $.gQ.ANIMATION_VERTICAL;
       const ANIMATION_ONCE = $.gQ.ANIMATION_ONCE;
       const ANIMATION_PINGPONG = $.gQ.ANIMATION_PINGPONG;
       const ANIMATION_CALLBACK = $.gQ.ANIMATION_CALLBACK;
       const ANIMATION_MULTI = $.gQ.ANIMATION_MULTI;
// Max/Min Safe Playground Integers found by experimenting with GQ 0.7.1 in Firefox 41.0.2 on Mac OS X 10.10.5
const GQG_MIN_SAFE_PLAYGROUND_INTEGER = -(Math.pow(2, 24) - 1); // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
const GQG_MAX_SAFE_PLAYGROUND_INTEGER = (Math.pow(2, 24) - 1); // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
const GQG_getUniqueId = () => {
    return Date.now() + "_" + GQG_UNIQUE_ID_COUNTER++;
};
       const setGqPlaygroundDimensions = (width, height) => {
    // this must be executed outside of setup and draw functions
    GQG_PLAYGROUND_HEIGHT = height;
    PLAYGROUND_HEIGHT = height;
    GQG_PLAYGROUND_WIDTH = width;
    PLAYGROUND_WIDTH = width;
    sprite("playground").width(width).height(height);
};
       const currentDate = () => {
    return Date.now();
};
       const consolePrint = (...txt) => {
    // might work only in Chrome or if some development add-ons are installed
    console.log(...txt);
};
const GQG_IN_MYPROGRAM_MSG = 'in "myprogram.ts"- ';
const GQG_ERROR_IN_MYPROGRAM_MSG = "Error " + GQG_IN_MYPROGRAM_MSG;
const GQG_WARNING_IN_MYPROGRAM_MSG = 'Warning ' + GQG_IN_MYPROGRAM_MSG;
const printErrorToConsoleOnce = (() => {
    var throwConsoleError_printed = {};
    return (msg) => {
        // Firefox wouldn't print uncaught exceptions with file name/line number
        // but adding "new Error()" to the throw below fixed it...
        if (!throwConsoleError_printed[msg]) {
            console.error("Error: " + msg);
            throwConsoleError_printed[msg] = true;
        }
    };
})();
const throwConsoleErrorInMyprogram = (msg) => {
    // Firefox wouldn't print uncaught exceptions with file name/line number
    // but adding "new Error()" to the throw below fixed it...
    throw new Error(GQG_IN_MYPROGRAM_MSG + msg);
};
const throwIfSpriteNameInvalid = (spriteName) => {
    if (typeof spriteName !== "string") {
        throwConsoleErrorInMyprogram("Sprite name must be a String, not: " + spriteName);
    }
    else if (!spriteExists(spriteName)) {
        throwConsoleErrorInMyprogram("Sprite doesn't exist: " + spriteName);
    }
};
Number.isFinite = Number.isFinite || function (value) {
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
    return typeof value === 'number' && isFinite(value);
};
const throwIfNotFiniteNumber = (msg, val) => {
    if (!Number.isFinite(val)) {
        msg = msg || "Expected a number.";
        msg += " You used";
        if (typeof val === "string") {
            msg += " the String: \"" + val + "\"";
        }
        else {
            msg += ": " + val;
        }
        throwConsoleErrorInMyprogram(msg);
    }
};
       const throwOnImgLoadError = (imgUrl) => {
    // what this function throws must not be caught by caller tho...
    if (imgUrl.substring(imgUrl.length - ".gif".length).toLowerCase() === ".gif") {
        throwConsoleErrorInMyprogram("image file format not supported: GIF");
    }
    let throwableErr = new Error("image file not found: " + imgUrl);
    $("<img/>").on("error", function () {
        if (!!throwableErr && throwableErr.stack &&
            throwableErr.stack.toString().indexOf("myprogram.js") >= 0) {
            throwableErr.message = GQG_ERROR_IN_MYPROGRAM_MSG + throwableErr.message;
        }
        throw throwableErr;
    }).attr("src", imgUrl);
};
       const newGQAnimation = (() => {
    let memoAnims = new Map();
    return function (urlOrMap, numberOfFrame, delta, rate, type) {
        if (GQG_DEBUG) {
            if (arguments.length === 5) {
                if (typeof (urlOrMap) !== "string") {
                    throwConsoleErrorInMyprogram("First argument for newGQAnimation must be a String. Instead found: " + urlOrMap);
                }
                if (typeof urlOrMap === "string")
                    throwOnImgLoadError(urlOrMap);
                throwIfNotFiniteNumber("Number of frame argument for newGQAnimation must be numeric. ", numberOfFrame);
                throwIfNotFiniteNumber("Delta argument for newGQAnimation must be numeric. ", delta);
                throwIfNotFiniteNumber("Rate argument for newGQAnimation must be numeric. ", rate);
                if (type != null && (type & ANIMATION_VERTICAL) && (type & ANIMATION_HORIZONTAL)) {
                    throwConsoleErrorInMyprogram("Type argument for newGQAnimation cannot be both ANIMATION_VERTICAL and ANIMATION_HORIZONTAL - use one or the other but not both!");
                }
                else if (type != null && !(type & ANIMATION_VERTICAL) && !(type & ANIMATION_HORIZONTAL)) {
                    throwConsoleErrorInMyprogram("Type argument for newGQAnimation is missing both ANIMATION_VERTICAL and ANIMATION_HORIZONTAL - must use one or the other!");
                }
            }
            else if (arguments.length === 1) {
                if (typeof (urlOrMap) === "string") {
                    throwOnImgLoadError(urlOrMap);
                } // else hope it's a proper options map to pass on to GameQuery directly
            }
            else {
                throwConsoleErrorInMyprogram("Wrong number of arguments used for newGQAnimation. Check API documentation for details of parameters.");
            }
        }
        if (arguments.length === 5) {
            let key = [urlOrMap, numberOfFrame, delta, rate, type];
            let multiframeAnim = memoAnims.get(key);
            if (multiframeAnim != null) {
                return multiframeAnim;
            }
            else {
                let multiframeAnim = new $.gQ.Animation({
                    imageURL: urlOrMap,
                    numberOfFrame: numberOfFrame,
                    delta: delta,
                    rate: rate,
                    type: type
                });
                memoAnims.set(key, multiframeAnim);
                return multiframeAnim;
            }
        }
        else if (arguments.length === 1) {
            let singleframeAnim = memoAnims.get(urlOrMap);
            if (singleframeAnim != null) {
                return singleframeAnim;
            }
            else {
                let singleframeAnim;
                if (typeof (urlOrMap) === "string") {
                    singleframeAnim = new $.gQ.Animation({ imageURL: urlOrMap });
                }
                else {
                    singleframeAnim = new $.gQ.Animation(urlOrMap);
                }
                memoAnims.set(urlOrMap, singleframeAnim);
                return singleframeAnim;
            }
        }
        else {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for newGQAnimation. Check API documentation for details of parameters.");
            return new $.gQ.Animation({ imageURL: "" });
        }
    };
})();
       const createGroupInPlayground = function (groupName, theWidth, theHeight, thePosx, thePosy) {
    if (GQG_DEBUG) {
        if (typeof (groupName) !== "string") {
            throwConsoleErrorInMyprogram("First argument for createGroupInPlayground must be a String. Instead found: " + groupName);
        }
        if (!spriteGroupNameFormatIsValid(groupName)) {
            throwConsoleErrorInMyprogram("Group name given to createGroupInPlayground is in wrong format: " + groupName);
        }
        if (spriteExists(groupName)) {
            throwConsoleErrorInMyprogram("createGroupInPlayground cannot create duplicate group with name: " + groupName);
        }
        if (arguments.length === 3) {
            throwIfNotFiniteNumber("Width argument for createGroupInPlayground must be numeric. ", theWidth);
            throwIfNotFiniteNumber("Height argument for createGroupInPlayground must be numeric. ", theHeight);
        }
        else if (arguments.length === 5) {
            throwIfNotFiniteNumber("Width argument for createGroupInPlayground must be numeric. ", theWidth);
            throwIfNotFiniteNumber("Height argument for createGroupInPlayground must be numeric. ", theHeight);
            throwIfNotFiniteNumber("X location argument for createGroupInPlayground must be numeric. ", thePosx);
            throwIfNotFiniteNumber("Y location argument for createGroupInPlayground must be numeric. ", thePosy);
        }
        else if (arguments.length === 2) { // treats arguments[1] as a standard options map
            if (typeof arguments[1] !== "object") {
                throwConsoleErrorInMyprogram("Second argument for createGroupInPlayground expected to be a dictionary. Instead found: " + arguments[1]);
            } // else hope it's a proper standard options map
        }
        else if (arguments.length !== 1) {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for createGroupInPlayground. Check API documentation for details of parameters.");
        }
    }
    if (arguments.length === 1) {
        $.playground().addGroup(groupName, { width: $.playground().width(), height: $.playground().height() });
    }
    else if (arguments.length === 3) {
        if (typeof theWidth !== "number") {
            throwConsoleErrorInMyprogram("theWidth must be a number but instead got: " + theWidth);
        }
        $.playground().addGroup(groupName, { width: theWidth, height: theHeight });
    }
    else if (arguments.length === 5) {
        if (typeof theWidth !== "number") {
            throwConsoleErrorInMyprogram("theWidth must be a number but instead got: " + theWidth);
        }
        $.playground().addGroup(groupName, { width: theWidth, height: theHeight, posx: thePosx, posy: thePosy });
    }
    else if (arguments.length === 2) { // treats arguments[1] as a standard options map
        if (typeof theWidth !== "object") {
            throwConsoleErrorInMyprogram("Second argument must be a number but instead got: " + theWidth);
        }
        $.playground().addGroup(groupName, arguments[1]);
    }
};
       const createSpriteInGroup = function (groupName, spriteName, theAnimation, theWidth, theHeight, thePosx, thePosy) {
    if (GQG_DEBUG) {
        if (typeof (groupName) !== "string") {
            throwConsoleErrorInMyprogram("First argument for createSpriteInGroup must be a String. Instead found: " + groupName);
        }
        if (!spriteExists(groupName)) {
            throwConsoleErrorInMyprogram("createSpriteInGroup cannot find group (doesn't exist?): " + groupName);
        }
        if (typeof (spriteName) !== "string") {
            throwConsoleErrorInMyprogram("Second argument for createSpriteInGroup must be a String. Instead found: " + spriteName);
        }
        if (!spriteGroupNameFormatIsValid(spriteName)) {
            throwConsoleErrorInMyprogram("Sprite name given to createSpriteInGroup is in wrong format: " + spriteName);
        }
        if (spriteExists(spriteName)) {
            throwConsoleErrorInMyprogram("createSpriteInGroup cannot create duplicate sprite with name: " + spriteName);
        }
        if (arguments.length === 5 || arguments.length === 7) {
            if (typeof (theAnimation) !== "object" || (theAnimation instanceof Object
                && (!("imageURL" in theAnimation) || typeof (theAnimation["imageURL"]) !== "string"))) {
                throwConsoleErrorInMyprogram("createSpriteInGroup cannot use this as an animation: " + theAnimation
                    + "\nAnimation must be of type SpriteAnimation but you provided a: " + typeof (theAnimation));
            }
            throwIfNotFiniteNumber("Width argument for createSpriteInGroup must be numeric. ", theWidth);
            throwIfNotFiniteNumber("Height argument for createSpriteInGroup must be numeric. ", theHeight);
            if (arguments.length === 7) {
                throwIfNotFiniteNumber("X location argument for createSpriteInGroup must be numeric. ", thePosx);
                throwIfNotFiniteNumber("Y location argument for createSpriteInGroup must be numeric. ", thePosy);
            }
        }
        else if (arguments.length === 3) {
            if (typeof arguments[2] !== "object") {
                throwConsoleErrorInMyprogram("Third argument for createSpriteInGroup expected to be a dictionary. Instead found: " + arguments[2]);
            }
            else if (theAnimation instanceof Object && (!("imageURL" in theAnimation) || typeof (theAnimation["imageURL"]) !== "string")) {
                throwConsoleErrorInMyprogram("Third argument for createSpriteInGroup expected to be a dictionary. Instead found this animation: " + theAnimation + ". Maybe wrong number of arguments provided? Check API documentation for details of parameters.");
            } // else hope it's a proper standard options map
        }
        else {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for createSpriteInGroup. Check API documentation for details of parameters.");
        }
    }
    if (arguments.length === 5) {
        $("#" + groupName).addSprite(spriteName, { animation: theAnimation, width: theWidth, height: theHeight });
    }
    else if (arguments.length === 7) {
        $("#" + groupName).addSprite(spriteName, {
            animation: theAnimation,
            width: theWidth,
            height: theHeight,
            posx: thePosx,
            posy: thePosy
        });
    }
    else if (arguments.length === 3) { // treats arguments[2] as a standard options map
        $("#" + groupName).addSprite(spriteName, arguments[2]);
    }
};
       const createTextSpriteInGroup = function (groupName, spriteName, theWidth, theHeight, thePosx, thePosy) {
    // to be used like sprite("textBox").text("hi"); // or .html("<b>hi</b>");
    if (GQG_DEBUG) {
        if (typeof (groupName) !== "string") {
            throwConsoleErrorInMyprogram("First argument for createTextSpriteInGroup must be a String. Instead found: " + groupName);
        }
        if (!spriteExists(groupName)) {
            throwConsoleErrorInMyprogram("createTextSpriteInGroup cannot find group (doesn't exist?): " + groupName);
        }
        if (typeof (spriteName) !== "string") {
            throwConsoleErrorInMyprogram("Second argument for createTextSpriteInGroup must be a String. Instead found: " + spriteName);
        }
        if (!spriteGroupNameFormatIsValid(spriteName)) {
            throwConsoleErrorInMyprogram("Sprite name given to createTextSpriteInGroup is in wrong format: " + spriteName);
        }
        if (spriteExists(spriteName)) {
            throwConsoleErrorInMyprogram("createTextSpriteInGroup cannot create duplicate sprite with name: " + spriteName);
        }
        if (arguments.length === 4 || arguments.length === 6) {
            throwIfNotFiniteNumber("Width argument for createTextSpriteInGroup must be numeric. ", theWidth);
            throwIfNotFiniteNumber("Height argument for createTextSpriteInGroup must be numeric. ", theHeight);
            if (arguments.length === 6) {
                throwIfNotFiniteNumber("X location argument for createTextSpriteInGroup must be numeric. ", thePosx);
                throwIfNotFiniteNumber("Y location argument for createTextSpriteInGroup must be numeric. ", thePosy);
            }
        }
        else {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for createTextSpriteInGroup. Check API documentation for details of parameters.");
        }
    }
    if (arguments.length === 4) {
        $("#" + groupName).addSprite(spriteName, {
            width: theWidth,
            height: theHeight
        });
    }
    else if (arguments.length === 6) {
        $("#" + groupName).addSprite(spriteName, {
            width: theWidth,
            height: theHeight,
            posx: thePosx,
            posy: thePosy
        });
    }
    if (arguments.length === 4 || arguments.length === 6) {
        $("#" + spriteName).css("background-color", "white") // default to white background for ease of use
            .css("user-select", "none");
    }
};
const textInputSpriteTextAreaId = (spriteName) => {
    return spriteName + "-textarea";
};
const textInputSpriteSubmitButtonId = (spriteName) => {
    return spriteName + "-button";
};
const textInputSpriteGQG_SIGNALS_Id = (spriteName) => {
    return spriteName + "-submitted";
};
       const createTextInputSpriteInGroup = function (groupName, spriteName, theWidth, theHeight, rows, cols, thePosx, thePosy, submitHandler) {
    if (arguments.length === 6) {
        createTextSpriteInGroup(groupName, spriteName, theWidth, theHeight);
    }
    else if ((arguments.length === 8 || arguments.length === 9) && thePosx &&
        thePosy) {
        createTextSpriteInGroup(groupName, spriteName, theWidth, theHeight, thePosx, thePosy);
    }
    if (arguments.length === 6 || arguments.length === 8 ||
        arguments.length === 9) {
        $("#" + spriteName).css("background-color", "white"); // default to white background for ease of use
        var textareaHtml = '<textarea id="' +
            textInputSpriteTextAreaId(spriteName) + '" rows="' + rows +
            '" cols="' + cols + '">hi</textarea>';
        $("#" + spriteName).append(textareaHtml);
        var buttonId = textInputSpriteSubmitButtonId(spriteName);
        var buttonHtml = '<button id="' + buttonId +
            '" type="button">Submit</button>';
        $("#" + spriteName).append(buttonHtml);
    }
    if (arguments.length === 9) {
        textInputSpriteSetHandler(spriteName, submitHandler);
    }
    else {
        textInputSpriteSetHandler(spriteName);
    }
};
       const textInputSpriteSetHandler = function (spriteName, submitHandler) {
    var realSubmitHandler;
    if (arguments.length === 2) {
        realSubmitHandler = function () {
            if (submitHandler)
                submitHandler(textInputSpriteString(spriteName));
            GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] = true;
        };
    }
    else {
        realSubmitHandler = function () {
            GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] = true;
        };
    }
    $("#" + textInputSpriteSubmitButtonId(spriteName)).click(realSubmitHandler);
};
       const textInputSpriteString = (spriteName) => {
    return String($("#" + textInputSpriteTextAreaId(spriteName))[0].value);
};
       const textInputSpriteSetString = (spriteName, str) => {
    $("#" + textInputSpriteTextAreaId(spriteName))[0].value = str;
};
       const textInputSpriteReset = function (spriteName, textPrompt) {
    if (arguments.length === 1) {
        textInputSpriteSetString(spriteName, "");
    }
    else if (arguments.length === 2 && textPrompt) {
        textInputSpriteSetString(spriteName, textPrompt);
    }
    GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] = false;
};
       const textInputSpriteSubmitted = (spriteName) => {
    if (GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] === true) {
        return true;
    }
    return false;
};
       const removeSprite = (spriteNameOrObj) => {
    if (typeof (spriteNameOrObj) !== "object") {
        if (GQG_DEBUG) {
            throwIfSpriteNameInvalid(spriteNameOrObj);
        }
        ;
        $("#" + spriteNameOrObj).remove();
    }
    else {
        $(spriteNameOrObj).remove();
    }
};
       const sprite = (spriteName) => {
    return $("#" + spriteName);
};
       const spriteExists = (spriteName) => {
    return (spriteName == $("#" + spriteName).attr("id")); // spriteName could be given as an int by a student
};
       const spriteObject = (spriteNameOrObj) => {
    if (typeof (spriteNameOrObj) !== "object") {
        return $("#" + spriteNameOrObj);
    }
    else {
        return $(spriteNameOrObj);
    }
};
       const spriteId = (spriteNameOrObj) => {
    if (typeof (spriteNameOrObj) !== "object") {
        return String($("#" + spriteNameOrObj).attr("id"));
    }
    else {
        return String($(spriteNameOrObj).attr("id"));
    }
};
       const spriteGetX = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    ;
    return $("#" + spriteName).x();
};
       const spriteGetY = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    ;
    return $("#" + spriteName).y();
};
       const spriteGetZ = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    ;
    return $("#" + spriteName).z();
};
       const spriteSetX = (spriteName, xval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("X location must be a number.", xval);
    }
    ;
    $("#" + spriteName).x(xval);
};
       const spriteSetY = (spriteName, yval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Y location must be a number.", yval);
    }
    ;
    $("#" + spriteName).y(yval);
};
       const spriteSetZ = (spriteName, zval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Z location must be a number.", zval);
    }
    ;
    $("#" + spriteName).z(zval);
};
       const spriteSetXY = (spriteName, xval, yval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("X location must be a number.", xval);
        throwIfNotFiniteNumber("Y location must be a number.", yval);
    }
    ;
    $("#" + spriteName).xy(xval, yval);
};
       const spriteSetXYZ = (spriteName, xval, yval, zval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("X location must be a number.", xval);
        throwIfNotFiniteNumber("Y location must be a number.", yval);
        throwIfNotFiniteNumber("Z location must be a number.", zval);
    }
    ;
    $("#" + spriteName).xyz(xval, yval, zval);
};
       const spriteGetWidth = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    ;
    return $("#" + spriteName).w();
};
       const spriteGetHeight = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    ;
    return $("#" + spriteName).h();
};
       const spriteSetWidth = (spriteName, wval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Width must be a number.", wval);
    }
    $("#" + spriteName).w(wval);
};
       const spriteSetHeight = (spriteName, hval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Height must be a number.", hval);
    }
    $("#" + spriteName).h(hval);
};
       const spriteSetWidthHeight = (spriteName, wval, hval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Width must be a number.", wval);
        throwIfNotFiniteNumber("Height must be a number.", hval);
    }
    $("#" + spriteName).wh(wval, hval);
};
       const spriteRotate = (spriteName, angleDegrees) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Angle must be a number.", angleDegrees);
    }
    $("#" + spriteName).rotate(angleDegrees);
};
       const spriteScale = (spriteName, ratio) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Ratio must be a number.", ratio);
    }
    $("#" + spriteName).scale(ratio);
};
       const spriteSetAnimation = function (spriteNameOrObj, aGQAnimation, callbackFunction) {
    if (arguments.length === 2 && aGQAnimation != null) {
        spriteObject(spriteNameOrObj).setAnimation(aGQAnimation);
    }
    else if (arguments.length === 3 && aGQAnimation != null && typeof callbackFunction === "function") {
        spriteObject(spriteNameOrObj).setAnimation(aGQAnimation, callbackFunction);
    }
    else if (arguments.length === 1) {
        spriteObject(spriteNameOrObj).setAnimation();
    }
};
       const spritePauseAnimation = (spriteName) => {
    $("#" + spriteName).pauseAnimation();
};
       const spriteResumeAnimation = (spriteName) => {
    $("#" + spriteName).resumeAnimation();
};
       const forEachSpriteSpriteCollisionDo = (sprite1Name, sprite2Name, collisionHandlingFunction) => {
    $("#" + sprite1Name).collision(".gQ_group, #" + sprite2Name).each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEach2SpritesHit = (() => {
    var printed = false;
    return (sprite1Name, sprite2Name, collisionHandlingFunction) => {
        if (!printed) {
            printed = true;
            throwConsoleErrorInMyprogram("Deprecated function used: forEach2SpritesHit.  Use when2SpritesHit instead for better performance.");
        }
        forEachSpriteSpriteCollisionDo(sprite1Name, sprite2Name, collisionHandlingFunction);
    };
})();
       const when2SpritesHit = forEachSpriteSpriteCollisionDo; // NEW
       const forEachSpriteGroupCollisionDo = (sprite1Name, groupName, collisionHandlingFunction) => {
    $("#" + sprite1Name).collision("#" + groupName + ", .gQ_sprite").each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEachSpriteGroupHit = forEachSpriteGroupCollisionDo;
       const forEachSpriteFilteredCollisionDo = (sprite1Name, filterStr, collisionHandlingFunction) => {
    $("#" + sprite1Name).collision(filterStr).each(collisionHandlingFunction);
    // see http://gamequeryjs.com/documentation/api/#collision for filterStr spec
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEachSpriteFilteredHit = forEachSpriteFilteredCollisionDo;
       const spriteHitDirection = (sprite1Id, sprite1X, sprite1Y, sprite1XSpeed, sprite1YSpeed, sprite1Width, sprite1Height, sprite2Id, sprite2X, sprite2Y, sprite2XSpeed, sprite2YSpeed, sprite2Width, sprite2Height) => {
    var sprite1Info = {
        "id": sprite1Id,
        "xPos": sprite1X,
        "yPos": sprite1Y,
        "xSpeed": sprite1XSpeed,
        "ySpeed": sprite1YSpeed,
        "height": sprite1Height,
        "width": sprite1Width
    };
    var sprite2Info = {
        "id": sprite2Id,
        "xPos": sprite2X,
        "yPos": sprite2Y,
        "xSpeed": sprite2XSpeed,
        "ySpeed": sprite2YSpeed,
        "height": sprite2Height,
        "width": sprite2Width
    };
    return spriteHitDir(sprite1Info, sprite2Info);
};
const spritesSpeedSamples = {};
const checkSpriteSpeedUsageCommonErrors = (spriteInfo) => {
    // A heuristic check for common errors from learners.
    // Check if sprite speeds ever change.  If not, probably doing it wrong.
    if (!spritesSpeedSamples[spriteInfo["id"]]) {
        spritesSpeedSamples[spriteInfo["id"]] = {
            sampleSize: 0,
            xSpeedSamples: [],
            ySpeedSamples: [],
            checked: false
        };
    }
    else {
        const sprite1Sampling = spritesSpeedSamples[spriteInfo["id"]];
        const maxSampleSize = 10;
        if (sprite1Sampling.sampleSize < maxSampleSize) {
            ++sprite1Sampling.sampleSize;
            sprite1Sampling.xSpeedSamples.push(spriteInfo["xSpeed"]);
            sprite1Sampling.ySpeedSamples.push(spriteInfo["ySpeed"]);
        }
        else if (!sprite1Sampling.checked) {
            sprite1Sampling.checked = true;
            const ss = sprite1Sampling.sampleSize;
            const sxSamples = sprite1Sampling.xSpeedSamples;
            const sySamples = sprite1Sampling.ySpeedSamples;
            let sameXspeed = true;
            for (let i = 1; i < ss; ++i) {
                if (sxSamples[i] !== sxSamples[i - 1]) {
                    sameXspeed = false;
                    break;
                }
            }
            if (sameXspeed && sxSamples[0] !== 0) {
                console.log(GQG_WARNING_IN_MYPROGRAM_MSG
                    + "sprite hit direction functionality- possibly wrong xPos calculation for sprite: "
                    + spriteInfo["id"]
                    + ".  Ensure xSpeed used validly if sprite hit directionality seems wrong.");
            }
            let sameYspeed = true;
            for (let i = 1; i < ss; ++i) {
                if (sySamples[i] !== sySamples[i - 1]) {
                    sameYspeed = false;
                    break;
                }
            }
            if (sameYspeed && sySamples[0] !== 0) {
                console.log(GQG_WARNING_IN_MYPROGRAM_MSG
                    + "sprite hit direction functionality- possibly wrong yPos calculation for sprite: "
                    + spriteInfo["id"]
                    + ".  Ensure ySpeed used validly if sprite hit directionality seems wrong.");
            }
        }
    }
};
       const spriteHitDir = (sprite1Info, sprite2Info) => {
    if (GQG_DEBUG) {
        checkSpriteSpeedUsageCommonErrors(sprite1Info);
        checkSpriteSpeedUsageCommonErrors(sprite2Info);
    }
    return spriteHitDirImpl(sprite1Info, sprite2Info);
};
const spriteHitDirImpl = (sprite1Info, sprite2Info) => {
    /*
       Returns the direction that sprite 1 hits sprite 2 from.
       sprite 1 is relatively left/right/up/down of sprite 2
       
       Hit direction returned could be multiple values (e.g. left and up),
       and is returned by this function as a dictionary as, e.g.
       {
       "left": false,
       "right": false,
       "up": false,
       "down": false
       }
       
       Parameters sprite{1,2}Info are dictionaries with at least these keys:
       {
       "id": "actualSpriteName",
       "xPos": 500,
       "yPos": 200,
       "xSpeed": -8,  // movement must be by dictionary,
       "ySpeed": 0,   // with something like x = x + xSpeed
       "height": 74,
       "width": 75
       }
       */
    var percentMargin = 1.1; // positive percent in decimal
    var dir = {
        "left": false,
        "right": false,
        "up": false,
        "down": false
    };
    // current horizontal position
    var s1left = sprite1Info["xPos"];
    var s1right = s1left + sprite1Info["width"];
    var s2left = sprite2Info["xPos"];
    var s2right = s2left + sprite2Info["width"];
    // reverse horizontal position by xSpeed with percent margin
    var sprite1XSpeed = sprite1Info["xSpeed"] * percentMargin;
    s1left = s1left - sprite1XSpeed;
    s1right = s1right - sprite1XSpeed;
    var sprite2XSpeed = sprite2Info["xSpeed"] * percentMargin;
    s2left = s2left - sprite2XSpeed;
    s2right = s2right - sprite2XSpeed;
    if (s1right <= s2left) {
        dir["left"] = true;
    }
    if (s2right <= s1left) {
        dir["right"] = true;
    }
    // current vertical position
    var s1top = sprite1Info["yPos"];
    var s1bottom = s1top + sprite1Info["height"];
    var s2top = sprite2Info["yPos"];
    var s2bottom = s2top + sprite2Info["height"];
    // reverse vertical position by ySpeed with percent margin
    var sprite1YSpeed = sprite1Info["ySpeed"] * percentMargin;
    s1top = s1top - sprite1YSpeed;
    s1bottom = s1bottom - sprite1YSpeed;
    var sprite2YSpeed = sprite2Info["ySpeed"] * percentMargin;
    s2top = s2top - sprite2YSpeed;
    s2bottom = s2bottom - sprite2YSpeed;
    if (s1bottom <= s2top) {
        dir["up"] = true;
    }
    if (s2bottom <= s1top) {
        dir["down"] = true;
    }
    return dir;
};
       const getKeyState = (key) => {
    return !!$.gQ.keyTracker[key];
};
       const getMouseX = () => {
    return $.gQ.mouseTracker.x;
};
       const getMouseY = () => {
    return $.gQ.mouseTracker.y;
};
       const getMouseButton1 = () => {
    return !!$.gQ.mouseTracker[1];
};
       const getMouseButton2 = () => {
    return !!$.gQ.mouseTracker[2];
};
       const getMouseButton3 = () => {
    return !!$.gQ.mouseTracker[3];
};
       const disableContextMenu = () => {
    // see also: https://stackoverflow.com/questions/4920221/jquery-js-prevent-right-click-menu-in-browsers
    // $("#playground").contextmenu(function(){return false;});
    $("#playground").on("contextmenu", function () {
        return false;
    });
};
       const enableContextMenu = () => {
    // see also: https://stackoverflow.com/questions/4920221/jquery-js-prevent-right-click-menu-in-browsers
    $("#playground").off("contextmenu");
};
       const hideMouseCursor = () => {
    $("#playground").css("cursor", "none");
};
       const showMouseCursor = () => {
    $("#playground").css("cursor", "default");
};
       const saveDictionaryAs = (saveAs, dictionary) => {
    // requires js-cookie: https://github.com/js-cookie/js-cookie/tree/v2.0.4
    Cookies.set("GQG_" + saveAs, dictionary);
};
       const getSavedDictionary = (savedAs) => {
    return Cookies.getJSON("GQG_" + savedAs);
};
       const deleteSavedDictionary = (savedAs) => {
    Cookies.remove("GQG_" + savedAs);
};
       const createOvalInGroup = (groupName, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    // rotdeg in degrees clockwise on screen (recall y-axis points downwards!)
    if (!color) {
        color = "gray";
    }
    if (!groupName) {
        $.playground().addSprite(id, { width: 1, height: 1 });
    }
    else {
        createSpriteInGroup(groupName, id, { width: 1, height: 1 });
    }
    var border_radius = (w / 2 + "px / " + h / 2 + "px");
    sprite(id)
        .css("background", color)
        .css("border-radius", border_radius)
        .css("-moz-border-radius", border_radius)
        .css("-webkit-border-radius", border_radius);
    spriteSetWidthHeight(id, w, h);
    spriteSetXY(id, x, y);
    if (rotdeg) {
        if (rotOriginX && rotOriginY) {
            var rotOrigin = rotOriginX + "px " + rotOriginY + "px";
            sprite(id)
                .css("-webkit-transform-origin", rotOrigin)
                .css("-moz-transform-origin", rotOrigin)
                .css("-ms-transform-origin", rotOrigin)
                .css("-o-transform-origin", rotOrigin)
                .css("transform-origin", rotOrigin);
        }
        spriteRotate(id, rotdeg);
    }
};
       const createOval = (id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    createOvalInGroup(null, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
       const drawOval = (x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    createOval("GQG_oval_" + GQG_getUniqueId(), x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
       const createCircleInGroup = (groupName, id, x, y, r, color, rotdeg, rotOriginX, rotOriginY) => {
    createOvalInGroup(groupName, id, x, y, r, r, color, rotdeg, rotOriginX, rotOriginY);
};
       const createCircle = (id, x, y, r, color, rotdeg, rotOriginX, rotOriginY) => {
    createCircleInGroup(null, id, x, y, r, color, rotdeg, rotOriginX, rotOriginY);
};
       const drawCircle = (x, y, r, color, rotdeg, rotOriginX, rotOriginY) => {
    createCircle("GQG_circle_" + GQG_getUniqueId(), x, y, r, color, rotdeg, rotOriginX, rotOriginY);
};
       const createRectInGroup = (groupName, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    // rotdeg in degrees clockwise on screen (recall y-axis points downwards!)
    // rotOrigin{X,Y} must be within range of wide w and height h, and relative to coordinate (x,y).
    if (!color) {
        color = "gray";
    }
    if (!groupName) {
        $.playground().addSprite(id, { width: 1, height: 1 });
    }
    else {
        createSpriteInGroup(groupName, id, { width: 1, height: 1 });
    }
    sprite(id).css("background", color);
    spriteSetWidthHeight(id, w, h);
    spriteSetXY(id, x, y);
    if (rotdeg) {
        if (rotOriginX && rotOriginY) {
            var rotOrigin = rotOriginX + "px " + rotOriginY + "px";
            sprite(id)
                .css("-webkit-transform-origin", rotOrigin)
                .css("-moz-transform-origin", rotOrigin)
                .css("-ms-transform-origin", rotOrigin)
                .css("-o-transform-origin", rotOrigin)
                .css("transform-origin", rotOrigin);
        }
        spriteRotate(id, rotdeg);
    }
};
       const createRect = (id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    createRectInGroup(null, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
       const drawRect = (x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    createRect("GQG_rect_" + GQG_getUniqueId(), x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
       const createLineInGroup = (groupName, id, x1, y1, x2, y2, color, thickness) => {
    if (!color) {
        color = "gray";
    }
    if (!thickness) {
        thickness = 2;
    }
    var xd = x2 - x1;
    var yd = y2 - y1;
    var dist = Math.sqrt(xd * xd + yd * yd);
    var arcCos = Math.acos(xd / dist);
    if (y2 < y1) {
        arcCos *= -1;
    }
    var rotdeg = arcCos * 180 / Math.PI;
    var halfThick = thickness / 2;
    var drawY1 = y1 - halfThick;
    createRectInGroup(groupName, id, x1, drawY1, dist, thickness, color, rotdeg, 0, halfThick);
};
       const createLine = (id, x1, y1, x2, y2, color, thickness) => {
    createLineInGroup(null, id, x1, y1, x2, y2, color, thickness);
};
       const drawLine = (x1, y1, x2, y2, color, thickness) => {
    createLine("GQG_line_" + GQG_getUniqueId(), x1, y1, x2, y2, color, thickness);
};
       const createContainerIterator = function (f, start, end, stepsize) {
    if (arguments.length === 1 && typeof f === "object") {
        const fOwnPropNames = Object.getOwnPropertyNames(f);
        const it = {
            current: 0,
            end: fOwnPropNames.length,
            _keys: fOwnPropNames,
            next: function () {
                const itemIdx = this._keys[this.current];
                const item = [Number(itemIdx), f[itemIdx]];
                this.current++;
                return item;
            },
            hasNext: function () {
                return (this.current < this.end);
            }
        };
        return it;
    }
    else {
        throwIfNotFiniteNumber("start must be a number.", start);
        throwIfNotFiniteNumber("end must be a number.", end);
        throwIfNotFiniteNumber("stepsize must be a number.", stepsize);
        if (start == null || end == null || stepsize == null) {
            throw "TS type hint";
        }
        const fx = (typeof f === "function"
            ? f
            : (x) => {
                return Number(f[x]);
            });
        const it = {
            next: function () {
                const item = [this.current, fx(this.current)];
                this.current += stepsize;
                return item;
            },
            hasNext: function () {
                return (this.current < this.end);
            },
            current: start,
            end: end,
            _keys: typeof f !== "function" ? Object.getOwnPropertyNames(f) : (() => {
                let k = [];
                for (let i = start; i < end; i += stepsize) {
                    k.push(String(i));
                }
                return k;
            })()
        };
        return it;
    }
};
       const createGraphWithOptions = function (groupName, id, f, moreOpts) {
    // fn signature: (groupName, id, f, moreOpts, start, end, stepsize, color, radius_thickness)
    // fn signature: (groupName, id, f, moreOpts, start, end, stepsize, color)
    // fn signature: (groupName, id, f, moreOpts, start, end, stepsize)
    // fn signature: (groupName, id, f, moreOpts, color, radius_thickness)
    // fn signature: (groupName, id, f, moreOpts, color)
    // fn signature: (groupName, id, f, moreOpts)
    // moreOpts = {"interpolated": trueOrFalse}
    var interpolated = moreOpts["interpolated"];
    if (!id) {
        id = "GQG_graph_" + GQG_getUniqueId();
    }
    if (!groupName) {
        groupName = id + "_group";
        createGroupInPlayground(groupName);
    }
    var group_id = {
        "id": id,
        "group": groupName
    };
    var color;
    var radius_thickness;
    let iter;
    if (arguments.length >= 4 && arguments.length <= 6 &&
        "object" === typeof (f)) {
        color = arguments[4];
        radius_thickness = arguments[5];
        iter = createContainerIterator(f);
    }
    else if (arguments.length >= 7 && arguments.length <= 9) {
        var start = arguments[4];
        var end = arguments[5];
        var stepsize = arguments[6];
        color = arguments[7];
        radius_thickness = arguments[8];
        iter = createContainerIterator(f, start, end, stepsize);
    }
    else {
        throwConsoleErrorInMyprogram("Function used with wrong number of arguments");
        throw "TS type hint";
    }
    if (color == undefined) {
        color = "gray";
    }
    if (radius_thickness == undefined) {
        radius_thickness = 2;
    }
    var currX = null;
    var currY = null;
    while (iter.hasNext()) {
        var item = iter.next();
        var i = item[0];
        var fxi = item[1];
        if (fxi === Infinity) {
            fxi = GQG_MAX_SAFE_PLAYGROUND_INTEGER;
        }
        else if (fxi === -Infinity) {
            fxi = GQG_MIN_SAFE_PLAYGROUND_INTEGER;
        }
        if (currY === null && fxi != undefined) {
            currX = i;
            currY = fxi;
            if (!interpolated) {
                createCircleInGroup(group_id["group"], group_id["id"] + "_graph_pt_" + i, i, fxi, radius_thickness, color);
            }
        }
        else if (fxi != undefined) {
            if (!interpolated) {
                createCircleInGroup(group_id["group"], group_id["id"] + "_graph_pt_" + i, i, fxi, radius_thickness, color);
            }
            else {
                createLineInGroup(group_id["group"], group_id["id"] + "_graph_line_" + currX + "-" + i, currX, currY, i, fxi, color, radius_thickness);
            }
            currX = i;
            currY = fxi;
        }
    }
    return group_id;
};
       const createGraphInGroup = function (groupName, id, f) {
    // fn signature: (groupName, id, f, start, end, stepsize, color, dotRadius)
    // fn signature: (groupName, id, f, start, end, stepsize, color)
    // fn signature: (groupName, id, f, start, end, stepsize)
    // fn signature: (groupName, id, f, color, dotRadius)
    // fn signature: (groupName, id, f, color)
    // fn signature: (groupName, id, f)
    var args = Array.prototype.slice.call(arguments);
    args.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(this, args);
};
       const createGraph = function () {
    // fn signature: (id, f, start, end, stepsize, color, dotRadius)
    // fn signature: (id, f, start, end, stepsize, color)
    // fn signature: (id, f, start, end, stepsize)
    // fn signature: (id, f, color, dotRadius)
    // fn signature: (id, f, color)
    // fn signature: (id, f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(this, opts);
};
       const drawGraph = function drawGraph() {
    // fn signature: (f, start, end, stepsize, color, dotRadius)
    // fn signature: (f, start, end, stepsize, color)
    // fn signature: (f, start, end, stepsize)
    // fn signature: (f, color, dotRadius)
    // fn signature: (f, color)
    // fn signature: (f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(this, opts);
};
       const createInterpolatedGraphInGroup = function (groupName, id, f) {
    // fn signature: (groupName, id, f, start, end, stepsize, color, thickness)
    // fn signature: (groupName, id, f, start, end, stepsize, color)
    // fn signature: (groupName, id, f, start, end, stepsize)
    // fn signature: (groupName, id, f, color, thickness)
    // fn signature: (groupName, id, f, color)
    // fn signature: (groupName, id, f)
    var args = Array.prototype.slice.call(arguments);
    args.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(this, args);
};
       const createInterpolatedGraph = function () {
    // fn signature: (id, f, start, end, stepsize, color, thickness)
    // fn signature: (id, f, start, end, stepsize, color)
    // fn signature: (id, f, start, end, stepsize)
    // fn signature: (id, f, color, thickness)
    // fn signature: (id, f, color)
    // fn signature: (id, f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(this, opts);
    // return createInterpolatedGraphInGroup.apply(this, opts);
};
       const drawInterpolatedGraph = function () {
    // fn signature: (f, start, end, stepsize, color, thickness)
    // fn signature: (f, start, end, stepsize, color)
    // fn signature: (f, start, end, stepsize)
    // fn signature: (f, color, thickness)
    // fn signature: (f, color)
    // fn signature: (f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(this, opts);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3FnLW1vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdxZy1tb2QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBOEJiLGtEQUFrRDtBQUNsRCxJQUFJLFNBQVMsR0FBWSxJQUFJLENBQUM7QUFDOUIsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLENBQUMsS0FBYyxFQUFRLEVBQUU7SUFDbkQsSUFBSSxLQUFLLEVBQUU7UUFDUCxTQUFTLEdBQUcsSUFBSSxDQUFDO0tBQ3BCO1NBQU07UUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixHQUFHLGtFQUFrRSxDQUFDLENBQUM7UUFDL0csU0FBUyxHQUFHLEtBQUssQ0FBQztLQUNyQjtBQUNMLENBQUMsQ0FBQztBQUVGLE1BQU0sa0NBQWtDLEdBQUcsNkJBQTZCLENBQUM7QUFDekUsTUFBTSxDQUFDLE1BQU0sNEJBQTRCLEdBQUcsQ0FDeEMsaUJBQWtDLEVBQzNCLEVBQUU7SUFDVCxJQUFJLE9BQU8saUJBQWlCLEtBQUssUUFBUTtRQUNyQyxPQUFPLGlCQUFpQixLQUFLLFFBQVEsRUFBRTtRQUN2QyxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUNELGlCQUFpQixHQUFHLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pELElBQUksV0FBVyxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQzlFLFdBQVcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzFCLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBRUQsT0FBTyxDQUFDLGlCQUFpQixLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUMsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUE0QixFQUFFLENBQUM7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QUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1QyxPQUFPLHNCQUFzQixDQUFDLEtBQUssQ0FDL0IsSUFBSSxFQUNKLElBQTBDLENBQzdDLENBQUM7SUFDRiwyREFBMkQ7QUFDL0QsQ0FBQyxDQUFDO0FBd0NGLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUE0QjtJQUcxRCw0REFBNEQ7SUFDNUQsaURBQWlEO0lBQ2pELDBDQUEwQztJQUMxQyxzQ0FBc0M7SUFDdEMsMkJBQTJCO0lBQzNCLG9CQUFvQjtJQUNwQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1QyxPQUFPLHNCQUFzQixDQUFDLEtBQUssQ0FDL0IsSUFBSSxFQUNKLElBQTBDLENBQzdDLENBQUM7QUFDTixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8qXG4gKiBDb3B5cmlnaHQgMjAxMiwgMjAxNiwgMjAxNywgMjAxOSwgMjAyMCBDYXJzb24gQ2hlbmdcbiAqIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAqIExpY2Vuc2UsIHYuIDIuMC4gSWYgYSBjb3B5IG9mIHRoZSBNUEwgd2FzIG5vdCBkaXN0cmlidXRlZCB3aXRoIHRoaXNcbiAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwczovL21vemlsbGEub3JnL01QTC8yLjAvLlxuICovXG4vKlxuICogR1FHdWFyZHJhaWwgdjAuOC4wIGlzIGEgd3JhcHBlciBhcm91bmQgZ2FtZVF1ZXJ5IHJldi4gMC43LjEuXG4gKiBNYWtlcyB0aGluZ3MgbW9yZSBwcm9jZWR1cmFsLCB3aXRoIGEgYml0IG9mIGZ1bmN0aW9uYWwuXG4gKiBBZGRzIGluIGhlbHBmdWwgZXJyb3IgbWVzc2FnZXMgZm9yIHN0dWRlbnRzLlxuICogbG9hZCB0aGlzIGFmdGVyIGdhbWVRdWVyeS5cbiAqL1xuXG5leHBvcnQgdHlwZSBzcHJpdGVEb21PYmplY3QgPSB7XG4gICAgd2lkdGg6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBoZWlnaHQ6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBzZXRBbmltYXRpb246IChvPzogb2JqZWN0LCBmPzogRnVuY3Rpb24pID0+IGFueTtcbiAgICBjc3M6IChhdHRyOiBzdHJpbmcsIHZhbDogc3RyaW5nIHwgbnVtYmVyKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgcGxheWdyb3VuZDogKG86IG9iamVjdCkgPT4gYW55O1xuICAgIGh0bWw6IChodG1sVGV4dDogc3RyaW5nKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgdGV4dDogKHRleHQ6IHN0cmluZykgPT4gc3ByaXRlRG9tT2JqZWN0O1xufTtcbmRlY2xhcmUgdmFyICQ6IGFueTtcbmRlY2xhcmUgdmFyIENvb2tpZXM6IHtcbiAgICBzZXQ6IChhcmcwOiBzdHJpbmcsIGFyZzE6IG9iamVjdCkgPT4gdm9pZDtcbiAgICBnZXRKU09OOiAoYXJnMDogc3RyaW5nKSA9PiBvYmplY3Q7XG4gICAgcmVtb3ZlOiAoYXJnMDogc3RyaW5nKSA9PiB2b2lkO1xufTtcblxuLy8gc3R1ZGVudHMgYXJlIG5vdCBzdXBwb3NlZCB0byB1c2UgR1FHXyB2YXJpYWJsZXNcbmxldCBHUUdfREVCVUc6IGJvb2xlYW4gPSB0cnVlO1xuZXhwb3J0IGNvbnN0IHNldEdxRGVidWdGbGFnID0gKGRlYnVnOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgaWYgKGRlYnVnKSB7XG4gICAgICAgIEdRR19ERUJVRyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TRyArIFwiZGVidWcgbW9kZSBkaXNhYmxlZCBhbmQgeW91ciBjb2RlIGlzIG5vdyBydW5uaW5nIGluIHVuc2FmZSBtb2RlLlwiKTtcbiAgICAgICAgR1FHX0RFQlVHID0gZmFsc2U7XG4gICAgfVxufTtcblxuY29uc3QgR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCA9IC9bYS16QS1aMC05X10rW2EtekEtWjAtOV8tXSovO1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQgPSAoXG4gICAgc3ByaXRlT3JHcm91cE5hbWU6IHN0cmluZyB8IG51bWJlclxuKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHR5cGVvZiBzcHJpdGVPckdyb3VwTmFtZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICB0eXBlb2Ygc3ByaXRlT3JHcm91cE5hbWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcHJpdGVPckdyb3VwTmFtZSA9IHNwcml0ZU9yR3JvdXBOYW1lLnRvU3RyaW5nKCk7XG4gICAgbGV0IG5hbWVNYXRjaGVzID0gc3ByaXRlT3JHcm91cE5hbWUubWF0Y2goR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCk7XG4gICAgbmFtZU1hdGNoZXMgPSAobmFtZU1hdGNoZXMgPyBuYW1lTWF0Y2hlcyA6IFtdKTtcbiAgICBpZiAobmFtZU1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHNwcml0ZU9yR3JvdXBOYW1lID09PSBuYW1lTWF0Y2hlc1swXSk7XG59O1xuXG5jb25zdCBHUUdfU0lHTkFMUzogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbmxldCBHUUdfVU5JUVVFX0lEX0NPVU5URVIgPSAwO1xuXG5sZXQgR1FHX1BMQVlHUk9VTkRfV0lEVEggPSA2NDA7XG5sZXQgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gNDgwO1xuZXhwb3J0IGxldCBQTEFZR1JPVU5EX1dJRFRIID0gR1FHX1BMQVlHUk9VTkRfV0lEVEg7IC8vIHN0dWRlbnRzIGFyZSBub3Qgc3VwcG9zZWQgdG8gdXNlIEdRR18gdmFyaWFibGVzXG5leHBvcnQgbGV0IFBMQVlHUk9VTkRfSEVJR0hUID0gR1FHX1BMQVlHUk9VTkRfSEVJR0hUO1xuXG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX0hPUklaT05UQUw6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX0hPUklaT05UQUw7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX1ZFUlRJQ0FMOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9WRVJUSUNBTDtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fT05DRTogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fT05DRTtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fUElOR1BPTkc6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX1BJTkdQT05HO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9DQUxMQkFDSzogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fQ0FMTEJBQ0s7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX01VTFRJOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9NVUxUSTtcblxuXG4vLyBNYXgvTWluIFNhZmUgUGxheWdyb3VuZCBJbnRlZ2VycyBmb3VuZCBieSBleHBlcmltZW50aW5nIHdpdGggR1EgMC43LjEgaW4gRmlyZWZveCA0MS4wLjIgb24gTWFjIE9TIFggMTAuMTAuNVxuY29uc3QgR1FHX01JTl9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IC0oTWF0aC5wb3coMiwgMjQpIC0gMSk7IC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvTUlOX1NBRkVfSU5URUdFUlxuY29uc3QgR1FHX01BWF9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IChNYXRoLnBvdygyLCAyNCkgLSAxKTsgLy8gY2YuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9NQVhfU0FGRV9JTlRFR0VSXG5cblxuY29uc3QgR1FHX2dldFVuaXF1ZUlkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCkgKyBcIl9cIiArIEdRR19VTklRVUVfSURfQ09VTlRFUisrO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldEdxUGxheWdyb3VuZERpbWVuc2lvbnMgPSAoXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gdGhpcyBtdXN0IGJlIGV4ZWN1dGVkIG91dHNpZGUgb2Ygc2V0dXAgYW5kIGRyYXcgZnVuY3Rpb25zXG4gICAgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIFBMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIEdRR19QTEFZR1JPVU5EX1dJRFRIID0gd2lkdGg7XG4gICAgUExBWUdST1VORF9XSURUSCA9IHdpZHRoO1xuICAgIHNwcml0ZShcInBsYXlncm91bmRcIikud2lkdGgod2lkdGgpLmhlaWdodChoZWlnaHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGN1cnJlbnREYXRlID0gKCk6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc29sZVByaW50ID0gKC4uLnR4dDogYW55KTogdm9pZCA9PiB7XG4gICAgLy8gbWlnaHQgd29yayBvbmx5IGluIENocm9tZSBvciBpZiBzb21lIGRldmVsb3BtZW50IGFkZC1vbnMgYXJlIGluc3RhbGxlZFxuICAgIGNvbnNvbGUubG9nKC4uLnR4dCk7XG59O1xuXG5cbmNvbnN0IEdRR19JTl9NWVBST0dSQU1fTVNHID0gJ2luIFwibXlwcm9ncmFtLnRzXCItICc7XG5jb25zdCBHUUdfRVJST1JfSU5fTVlQUk9HUkFNX01TRyA9IFwiRXJyb3IgXCIgKyBHUUdfSU5fTVlQUk9HUkFNX01TRztcbmNvbnN0IEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0cgPSAnV2FybmluZyAnICsgR1FHX0lOX01ZUFJPR1JBTV9NU0c7XG5cbmNvbnN0IHByaW50RXJyb3JUb0NvbnNvbGVPbmNlID0gKCgpID0+IHtcbiAgICB2YXIgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZDogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbiAgICByZXR1cm4gKG1zZzogc3RyaW5nKSA9PiB7XG4gICAgICAgIC8vIEZpcmVmb3ggd291bGRuJ3QgcHJpbnQgdW5jYXVnaHQgZXhjZXB0aW9ucyB3aXRoIGZpbGUgbmFtZS9saW5lIG51bWJlclxuICAgICAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICAgICAgaWYgKCF0aHJvd0NvbnNvbGVFcnJvcl9wcmludGVkW21zZ10pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIgKyBtc2cpO1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZFttc2ddID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuY29uc3QgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbSA9IChtc2c6IHN0cmluZyk6IG5ldmVyID0+IHtcbiAgICAvLyBGaXJlZm94IHdvdWxkbid0IHByaW50IHVuY2F1Z2h0IGV4Y2VwdGlvbnMgd2l0aCBmaWxlIG5hbWUvbGluZSBudW1iZXJcbiAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICB0aHJvdyBuZXcgRXJyb3IoR1FHX0lOX01ZUFJPR1JBTV9NU0cgKyBtc2cpO1xufTtcblxuY29uc3QgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICh0eXBlb2Ygc3ByaXRlTmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgbXVzdCBiZSBhIFN0cmluZywgbm90OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgIH0gZWxzZSBpZiAoIXNwcml0ZUV4aXN0cyhzcHJpdGVOYW1lKSkge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIGRvZXNuJ3QgZXhpc3Q6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgfVxufTtcbk51bWJlci5pc0Zpbml0ZSA9IE51bWJlci5pc0Zpbml0ZSB8fCBmdW5jdGlvbiAodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIC8vIHNlZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL2lzRmluaXRlXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpO1xufTtcbmNvbnN0IHRocm93SWZOb3RGaW5pdGVOdW1iZXIgPSAobXNnOiBzdHJpbmcsIHZhbDogYW55KTogdm9pZCA9PiB7IC8vIGUuZy4gdGhyb3cgaWYgTmFOLCBJbmZpbml0eSwgbnVsbFxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHZhbCkpIHtcbiAgICAgICAgbXNnID0gbXNnIHx8IFwiRXhwZWN0ZWQgYSBudW1iZXIuXCI7XG4gICAgICAgIG1zZyArPSBcIiBZb3UgdXNlZFwiO1xuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbXNnICs9IFwiIHRoZSBTdHJpbmc6IFxcXCJcIiArIHZhbCArIFwiXFxcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXNnICs9IFwiOiBcIiArIHZhbDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKG1zZyk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHRocm93T25JbWdMb2FkRXJyb3IgPSAoaW1nVXJsOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAvLyB3aGF0IHRoaXMgZnVuY3Rpb24gdGhyb3dzIG11c3Qgbm90IGJlIGNhdWdodCBieSBjYWxsZXIgdGhvLi4uXG4gICAgaWYgKGltZ1VybC5zdWJzdHJpbmcoaW1nVXJsLmxlbmd0aCAtIFwiLmdpZlwiLmxlbmd0aCkudG9Mb3dlckNhc2UoKSA9PT0gXCIuZ2lmXCIpIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImltYWdlIGZpbGUgZm9ybWF0IG5vdCBzdXBwb3J0ZWQ6IEdJRlwiKTtcbiAgICB9XG4gICAgbGV0IHRocm93YWJsZUVyciA9IG5ldyBFcnJvcihcImltYWdlIGZpbGUgbm90IGZvdW5kOiBcIiArIGltZ1VybCk7XG4gICAgJChcIjxpbWcvPlwiKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCEhdGhyb3dhYmxlRXJyICYmIHRocm93YWJsZUVyci5zdGFjayAmJlxuICAgICAgICAgICAgdGhyb3dhYmxlRXJyLnN0YWNrLnRvU3RyaW5nKCkuaW5kZXhPZihcIm15cHJvZ3JhbS5qc1wiKSA+PSAwKSB7XG4gICAgICAgICAgICB0aHJvd2FibGVFcnIubWVzc2FnZSA9IEdRR19FUlJPUl9JTl9NWVBST0dSQU1fTVNHICsgdGhyb3dhYmxlRXJyLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgdGhyb3dhYmxlRXJyO1xuICAgIH0pLmF0dHIoXCJzcmNcIiwgaW1nVXJsKTtcbn07XG5cblxuXG50eXBlIE5ld0dRQW5pbWF0aW9uRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICB1cmxPck1hcDogc3RyaW5nLFxuICAgICAgICBudW1iZXJPZkZyYW1lOiBudW1iZXIsXG4gICAgICAgIGRlbHRhOiBudW1iZXIsXG4gICAgICAgIHJhdGU6IG51bWJlcixcbiAgICAgICAgdHlwZTogbnVtYmVyXG4gICAgKTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICh0aGlzOiB2b2lkLCB1cmxPck1hcDogc3RyaW5nKTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICh0aGlzOiB2b2lkLCB1cmxPck1hcDogb2JqZWN0KTogU3ByaXRlQW5pbWF0aW9uO1xufTtcbmV4cG9ydCBjb25zdCBuZXdHUUFuaW1hdGlvbjogTmV3R1FBbmltYXRpb25GbiA9ICgoKSA9PiB7XG4gICAgbGV0IG1lbW9BbmltczogTWFwPHN0cmluZyB8IG9iamVjdCwgU3ByaXRlQW5pbWF0aW9uPiA9IG5ldyBNYXA8b2JqZWN0LCBTcHJpdGVBbmltYXRpb24+KCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgdXJsT3JNYXA6IHN0cmluZyB8IG9iamVjdCxcbiAgICAgICAgbnVtYmVyT2ZGcmFtZT86IG51bWJlcixcbiAgICAgICAgZGVsdGE/OiBudW1iZXIsXG4gICAgICAgIHJhdGU/OiBudW1iZXIsXG4gICAgICAgIHR5cGU/OiBudW1iZXJcbiAgICApOiBTcHJpdGVBbmltYXRpb24ge1xuICAgICAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgdXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHVybE9yTWFwID09PSBcInN0cmluZ1wiKSB0aHJvd09uSW1nTG9hZEVycm9yKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiTnVtYmVyIG9mIGZyYW1lIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBtdXN0IGJlIG51bWVyaWMuIFwiLCBudW1iZXJPZkZyYW1lKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiRGVsdGEgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgbnVtZXJpYy4gXCIsIGRlbHRhKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiUmF0ZSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBudW1lcmljLiBcIiwgcmF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgIT0gbnVsbCAmJiAodHlwZSAmIEFOSU1BVElPTl9WRVJUSUNBTCkgJiYgKHR5cGUgJiBBTklNQVRJT05fSE9SSVpPTlRBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlR5cGUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIGNhbm5vdCBiZSBib3RoIEFOSU1BVElPTl9WRVJUSUNBTCBhbmQgQU5JTUFUSU9OX0hPUklaT05UQUwgLSB1c2Ugb25lIG9yIHRoZSBvdGhlciBidXQgbm90IGJvdGghXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSAhPSBudWxsICYmICEodHlwZSAmIEFOSU1BVElPTl9WRVJUSUNBTCkgJiYgISh0eXBlICYgQU5JTUFUSU9OX0hPUklaT05UQUwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUeXBlIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBpcyBtaXNzaW5nIGJvdGggQU5JTUFUSU9OX1ZFUlRJQ0FMIGFuZCBBTklNQVRJT05fSE9SSVpPTlRBTCAtIG11c3QgdXNlIG9uZSBvciB0aGUgb3RoZXIhXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd09uSW1nTG9hZEVycm9yKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB9IC8vIGVsc2UgaG9wZSBpdCdzIGEgcHJvcGVyIG9wdGlvbnMgbWFwIHRvIHBhc3Mgb24gdG8gR2FtZVF1ZXJ5IGRpcmVjdGx5XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIG5ld0dRQW5pbWF0aW9uLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBbdXJsT3JNYXAsIG51bWJlck9mRnJhbWUsIGRlbHRhLCByYXRlLCB0eXBlXTtcbiAgICAgICAgICAgIGxldCBtdWx0aWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uIHwgdW5kZWZpbmVkID0gbWVtb0FuaW1zLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKG11bHRpZnJhbWVBbmltICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXVsdGlmcmFtZUFuaW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBtdWx0aWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVUkw6IHVybE9yTWFwLFxuICAgICAgICAgICAgICAgICAgICBudW1iZXJPZkZyYW1lOiBudW1iZXJPZkZyYW1lLFxuICAgICAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGEsXG4gICAgICAgICAgICAgICAgICAgIHJhdGU6IHJhdGUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtZW1vQW5pbXMuc2V0KGtleSwgbXVsdGlmcmFtZUFuaW0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBsZXQgc2luZ2xlZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gfCB1bmRlZmluZWQgPSBtZW1vQW5pbXMuZ2V0KHVybE9yTWFwKTtcbiAgICAgICAgICAgIGlmIChzaW5nbGVmcmFtZUFuaW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzaW5nbGVmcmFtZUFuaW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBzaW5nbGVmcmFtZUFuaW06IFNwcml0ZUFuaW1hdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh1cmxPck1hcCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlZnJhbWVBbmltID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHsgaW1hZ2VVUkw6IHVybE9yTWFwIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZWZyYW1lQW5pbSA9IG5ldyAkLmdRLkFuaW1hdGlvbih1cmxPck1hcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1lbW9Bbmltcy5zZXQodXJsT3JNYXAsIHNpbmdsZWZyYW1lQW5pbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIG5ld0dRQW5pbWF0aW9uLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgJC5nUS5BbmltYXRpb24oeyBpbWFnZVVSTDogXCJcIiB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG50eXBlIENyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAodGhpczogdm9pZCwgZ3JvdXBOYW1lOiBzdHJpbmcsIHRoZVdpZHRoOiBudW1iZXIsIHRoZUhlaWdodDogbnVtYmVyKTogdm9pZDtcbiAgICAodGhpczogdm9pZCwgZ3JvdXBOYW1lOiBzdHJpbmcpOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZywgb3B0TWFwOiBvYmplY3QpOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcm91cEluUGxheWdyb3VuZDogQ3JlYXRlR3JvdXBJblBsYXlncm91bmRGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIHRoZVdpZHRoPzogbnVtYmVyIHwgb2JqZWN0LFxuICAgIHRoZUhlaWdodD86IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZ3JvdXBOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKGdyb3VwTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJHcm91cCBuYW1lIGdpdmVuIHRvIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIGNhbm5vdCBjcmVhdGUgZHVwbGljYXRlIGdyb3VwIHdpdGggbmFtZTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVdpZHRoKTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzFdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNlY29uZCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgZXhwZWN0ZWQgdG8gYmUgYSBkaWN0aW9uYXJ5LiBJbnN0ZWFkIGZvdW5kOiBcIiArIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICB9IC8vIGVsc2UgaG9wZSBpdCdzIGEgcHJvcGVyIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQuIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgJC5wbGF5Z3JvdW5kKCkuYWRkR3JvdXAoXG4gICAgICAgICAgICBncm91cE5hbWUsXG4gICAgICAgICAgICB7IHdpZHRoOiAkLnBsYXlncm91bmQoKS53aWR0aCgpLCBoZWlnaHQ6ICQucGxheWdyb3VuZCgpLmhlaWdodCgpIH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVXaWR0aCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcInRoZVdpZHRoIG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChncm91cE5hbWUsIHsgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCB9KTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVXaWR0aCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcInRoZVdpZHRoIG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChcbiAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgIHsgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCwgcG9zeDogdGhlUG9zeCwgcG9zeTogdGhlUG9zeSB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7IC8vIHRyZWF0cyBhcmd1bWVudHNbMV0gYXMgYSBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChncm91cE5hbWUsIGFyZ3VtZW50c1sxXSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHR5cGUgU3ByaXRlQW5pbWF0aW9uID0geyBpbWFnZVVSTDogc3RyaW5nIH07XG50eXBlIENyZWF0ZVNwcml0ZUluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZUFuaW1hdGlvbjogU3ByaXRlQW5pbWF0aW9uLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlQW5pbWF0aW9uOiBTcHJpdGVBbmltYXRpb24sXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIG9wdGlvbnNNYXA6IG9iamVjdFxuICAgICk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVNwcml0ZUluR3JvdXA6IENyZWF0ZVNwcml0ZUluR3JvdXBGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB0aGVBbmltYXRpb246IFNwcml0ZUFuaW1hdGlvbiB8IG9iamVjdCxcbiAgICB0aGVXaWR0aD86IG51bWJlcixcbiAgICB0aGVIZWlnaHQ/OiBudW1iZXIsXG4gICAgdGhlUG9zeD86IG51bWJlcixcbiAgICB0aGVQb3N5PzogbnVtYmVyXG4pOiB2b2lkIHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKGdyb3VwTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGaXJzdCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZVNwcml0ZUluR3JvdXAgY2Fubm90IGZpbmQgZ3JvdXAgKGRvZXNuJ3QgZXhpc3Q/KTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTcHJpdGUgbmFtZSBnaXZlbiB0byBjcmVhdGVTcHJpdGVJbkdyb3VwIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3ByaXRlRXhpc3RzKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlU3ByaXRlSW5Hcm91cCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBzcHJpdGUgd2l0aCBuYW1lOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAodGhlQW5pbWF0aW9uKSAhPT0gXCJvYmplY3RcIiB8fCAodGhlQW5pbWF0aW9uIGluc3RhbmNlb2YgT2JqZWN0XG4gICAgICAgICAgICAgICAgJiYgKCEoXCJpbWFnZVVSTFwiIGluIHRoZUFuaW1hdGlvbikgfHwgdHlwZW9mICh0aGVBbmltYXRpb25bXCJpbWFnZVVSTFwiXSkgIT09IFwic3RyaW5nXCIpKSkge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVTcHJpdGVJbkdyb3VwIGNhbm5vdCB1c2UgdGhpcyBhcyBhbiBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICsgXCJcXG5BbmltYXRpb24gbXVzdCBiZSBvZiB0eXBlIFNwcml0ZUFuaW1hdGlvbiBidXQgeW91IHByb3ZpZGVkIGE6IFwiICsgdHlwZW9mICh0aGVBbmltYXRpb24pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG5cblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDcpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1syXSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQ6IFwiICsgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhlQW5pbWF0aW9uIGluc3RhbmNlb2YgT2JqZWN0ICYmICghKFwiaW1hZ2VVUkxcIiBpbiB0aGVBbmltYXRpb24pIHx8IHR5cGVvZiAodGhlQW5pbWF0aW9uW1wiaW1hZ2VVUkxcIl0pICE9PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQgdGhpcyBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uICsgXCIuIE1heWJlIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQ/IENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgfSAvLyBlbHNlIGhvcGUgaXQncyBhIHByb3BlciBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoXG4gICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgeyBhbmltYXRpb246IHRoZUFuaW1hdGlvbiwgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShcbiAgICAgICAgICAgIHNwcml0ZU5hbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB0aGVBbmltYXRpb24sXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhlSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICAgICAgcG9zeTogdGhlUG9zeVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzJdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKHNwcml0ZU5hbWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfVxufTtcblxudHlwZSBDcmVhdGVUZXh0U3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXA6IENyZWF0ZVRleHRTcHJpdGVJbkdyb3VwRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIC8vIHRvIGJlIHVzZWQgbGlrZSBzcHJpdGUoXCJ0ZXh0Qm94XCIpLnRleHQoXCJoaVwiKTsgLy8gb3IgLmh0bWwoXCI8Yj5oaTwvYj5cIik7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICBpZiAodHlwZW9mIChncm91cE5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgY2Fubm90IGZpbmQgZ3JvdXAgKGRvZXNuJ3QgZXhpc3Q/KTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgZ2l2ZW4gdG8gY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBzcHJpdGUgd2l0aCBuYW1lOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoc3ByaXRlTmFtZSwge1xuICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGVIZWlnaHRcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShzcHJpdGVOYW1lLCB7XG4gICAgICAgICAgICB3aWR0aDogdGhlV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoZUhlaWdodCxcbiAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICBwb3N5OiB0aGVQb3N5XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwid2hpdGVcIikgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuICAgICAgICAgICAgLmNzcyhcInVzZXItc2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICB9XG59O1xuXG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVUZXh0QXJlYUlkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi10ZXh0YXJlYVwiO1xufTtcbmNvbnN0IHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi1idXR0b25cIjtcbn07XG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBzcHJpdGVOYW1lICsgXCItc3VibWl0dGVkXCI7XG59O1xudHlwZSBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyOiBTdWJtaXRIYW5kbGVyRm5cbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXJcbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwOiBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPVxuICAgIGZ1bmN0aW9uIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5PzogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyPzogU3VibWl0SGFuZGxlckZuXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICAgICBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cChncm91cE5hbWUsIHNwcml0ZU5hbWUsIHRoZVdpZHRoLCB0aGVIZWlnaHQpO1xuICAgICAgICB9IGVsc2UgaWYgKChhcmd1bWVudHMubGVuZ3RoID09PSA4IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDkpICYmIHRoZVBvc3ggJiZcbiAgICAgICAgICAgIHRoZVBvc3kpIHtcbiAgICAgICAgICAgIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwKFxuICAgICAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgICAgIHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIHRoZUhlaWdodCxcbiAgICAgICAgICAgICAgICB0aGVQb3N4LFxuICAgICAgICAgICAgICAgIHRoZVBvc3lcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gOCB8fFxuICAgICAgICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgXCJ3aGl0ZVwiKTsgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFIdG1sID0gJzx0ZXh0YXJlYSBpZD1cIicgK1xuICAgICAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQoc3ByaXRlTmFtZSkgKyAnXCIgcm93cz1cIicgKyByb3dzICtcbiAgICAgICAgICAgICAgICAnXCIgY29scz1cIicgKyBjb2xzICsgJ1wiPmhpPC90ZXh0YXJlYT4nO1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmFwcGVuZCh0ZXh0YXJlYUh0bWwpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uSWQgPSB0ZXh0SW5wdXRTcHJpdGVTdWJtaXRCdXR0b25JZChzcHJpdGVOYW1lKTtcbiAgICAgICAgICAgIHZhciBidXR0b25IdG1sID0gJzxidXR0b24gaWQ9XCInICsgYnV0dG9uSWQgK1xuICAgICAgICAgICAgICAgICdcIiB0eXBlPVwiYnV0dG9uXCI+U3VibWl0PC9idXR0b24+JztcbiAgICAgICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5hcHBlbmQoYnV0dG9uSHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0SGFuZGxlcihzcHJpdGVOYW1lLCBzdWJtaXRIYW5kbGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVNldEhhbmRsZXIoc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuZXhwb3J0IHR5cGUgU3VibWl0SGFuZGxlckZuID0gKHM6IHN0cmluZykgPT4gdm9pZDtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRIYW5kbGVyID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN1Ym1pdEhhbmRsZXI/OiBTdWJtaXRIYW5kbGVyRm5cbik6IHZvaWQge1xuICAgIHZhciByZWFsU3VibWl0SGFuZGxlcjtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZWFsU3VibWl0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzdWJtaXRIYW5kbGVyKSBzdWJtaXRIYW5kbGVyKHRleHRJbnB1dFNwcml0ZVN0cmluZyhzcHJpdGVOYW1lKSk7XG4gICAgICAgICAgICBHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPSB0cnVlO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlYWxTdWJtaXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJChcIiNcIiArIHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkKHNwcml0ZU5hbWUpKS5jbGljayhyZWFsU3VibWl0SGFuZGxlcik7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3RyaW5nID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIFN0cmluZygkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUpO1xufTtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRTdHJpbmcgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN0cjogc3RyaW5nXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUgPSBzdHI7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlUmVzZXQgPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGV4dFByb21wdD86IHN0cmluZ1xuKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0U3RyaW5nKHNwcml0ZU5hbWUsIFwiXCIpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiB0ZXh0UHJvbXB0KSB7XG4gICAgICAgIHRleHRJbnB1dFNwcml0ZVNldFN0cmluZyhzcHJpdGVOYW1lLCB0ZXh0UHJvbXB0KTtcbiAgICB9XG4gICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3VibWl0dGVkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGlmIChHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVTcHJpdGUgPSAoc3ByaXRlTmFtZU9yT2JqOiBzdHJpbmcgfCBvYmplY3QpOiB2b2lkID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lT3JPYmopO1xuICAgICAgICB9O1xuICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZU9yT2JqKS5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKHNwcml0ZU5hbWVPck9iaikucmVtb3ZlKCk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlRXhpc3RzID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAoc3ByaXRlTmFtZSA9PSAkKFwiI1wiICsgc3ByaXRlTmFtZSkuYXR0cihcImlkXCIpKTsgLy8gc3ByaXRlTmFtZSBjb3VsZCBiZSBnaXZlbiBhcyBhbiBpbnQgYnkgYSBzdHVkZW50XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlT2JqZWN0ID0gKFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0XG4pOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWVPck9iaikgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lT3JPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkKHNwcml0ZU5hbWVPck9iaik7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUlkID0gKHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0KTogc3RyaW5nID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoJChcIiNcIiArIHNwcml0ZU5hbWVPck9iaikuYXR0cihcImlkXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RyaW5nKCQoc3ByaXRlTmFtZU9yT2JqKS5hdHRyKFwiaWRcIikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLngoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0WSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS55KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFogPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkueigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZywgeHZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLngoeHZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFkgPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB5dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeXZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueSh5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WiA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHp2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWiBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB6dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS56KHp2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYWSA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgeHZhbDogbnVtYmVyLFxuICAgIHl2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54eSh4dmFsLCB5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WFlaID0gKFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB4dmFsOiBudW1iZXIsXG4gICAgeXZhbDogbnVtYmVyLFxuICAgIHp2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlogbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgenZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueHl6KHh2YWwsIHl2YWwsIHp2YWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFdpZHRoID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLncoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0SGVpZ2h0ID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLmgoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0V2lkdGggPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB3dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIG11c3QgYmUgYSBudW1iZXIuXCIsIHd2YWwpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkudyh3dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0SGVpZ2h0ID0gKHNwcml0ZU5hbWU6IHN0cmluZywgaHZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgbXVzdCBiZSBhIG51bWJlci5cIiwgaHZhbCk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5oKGh2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRXaWR0aEhlaWdodCA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgd3ZhbDogbnVtYmVyLFxuICAgIGh2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBtdXN0IGJlIGEgbnVtYmVyLlwiLCB3dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBtdXN0IGJlIGEgbnVtYmVyLlwiLCBodmFsKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLndoKHd2YWwsIGh2YWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVJvdGF0ZSA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgYW5nbGVEZWdyZWVzOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiQW5nbGUgbXVzdCBiZSBhIG51bWJlci5cIiwgYW5nbGVEZWdyZWVzKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnJvdGF0ZShhbmdsZURlZ3JlZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVNjYWxlID0gKHNwcml0ZU5hbWU6IHN0cmluZywgcmF0aW86IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiUmF0aW8gbXVzdCBiZSBhIG51bWJlci5cIiwgcmF0aW8pO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuc2NhbGUocmF0aW8pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVNldEFuaW1hdGlvbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0LFxuICAgIGFHUUFuaW1hdGlvbj86IG9iamVjdCxcbiAgICBjYWxsYmFja0Z1bmN0aW9uPzogRnVuY3Rpb25cbikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIGFHUUFuaW1hdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIHNwcml0ZU9iamVjdChzcHJpdGVOYW1lT3JPYmopLnNldEFuaW1hdGlvbihhR1FBbmltYXRpb24pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBhR1FBbmltYXRpb24gIT0gbnVsbCAmJiB0eXBlb2YgY2FsbGJhY2tGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHNwcml0ZU9iamVjdChzcHJpdGVOYW1lT3JPYmopLnNldEFuaW1hdGlvbihhR1FBbmltYXRpb24sIGNhbGxiYWNrRnVuY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVBhdXNlQW5pbWF0aW9uID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5wYXVzZUFuaW1hdGlvbigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVSZXN1bWVBbmltYXRpb24gPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnJlc3VtZUFuaW1hdGlvbigpO1xufTtcblxuZXhwb3J0IHR5cGUgQ29sbGlzaW9uSGFuZGxpbmdGbiA9IChjb2xsSW5kZXg6IG51bWJlciwgaGl0U3ByaXRlOiBvYmplY3QpID0+XG4gICAgdm9pZDtcbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlU3ByaXRlQ29sbGlzaW9uRG8gPSAoXG4gICAgc3ByaXRlMU5hbWU6IHN0cmluZyxcbiAgICBzcHJpdGUyTmFtZTogc3RyaW5nLFxuICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb246IENvbGxpc2lvbkhhbmRsaW5nRm5cbik6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGUxTmFtZSkuY29sbGlzaW9uKFwiLmdRX2dyb3VwLCAjXCIgKyBzcHJpdGUyTmFtZSkuZWFjaChcbiAgICAgICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvblxuICAgICk7XG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoMlNwcml0ZXNIaXQgPSAoKCkgPT4ge1xuICAgIHZhciBwcmludGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIChzcHJpdGUxTmFtZTogc3RyaW5nLCBzcHJpdGUyTmFtZTogc3RyaW5nLCBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuKSA9PiB7XG4gICAgICAgIGlmICghcHJpbnRlZCkge1xuICAgICAgICAgICAgcHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRGVwcmVjYXRlZCBmdW5jdGlvbiB1c2VkOiBmb3JFYWNoMlNwcml0ZXNIaXQuICBVc2Ugd2hlbjJTcHJpdGVzSGl0IGluc3RlYWQgZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvKHNwcml0ZTFOYW1lLCBzcHJpdGUyTmFtZSwgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgfTtcbn0pKCk7XG5leHBvcnQgY29uc3Qgd2hlbjJTcHJpdGVzSGl0ID0gZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvOyAvLyBORVdcblxuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVHcm91cENvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGblxuKTogdm9pZCA9PiB7XG4gICAgJChcIiNcIiArIHNwcml0ZTFOYW1lKS5jb2xsaXNpb24oXCIjXCIgKyBncm91cE5hbWUgKyBcIiwgLmdRX3Nwcml0ZVwiKS5lYWNoKFxuICAgICAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uXG4gICAgKTtcbiAgICAvLyBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uIGNhbiBvcHRpb25hbGx5IHRha2UgdHdvIGFyZ3VtZW50czogY29sbEluZGV4LCBoaXRTcHJpdGVcbiAgICAvLyBzZWUgaHR0cDovL2FwaS5qcXVlcnkuY29tL2pRdWVyeS5lYWNoXG59O1xuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVHcm91cEhpdCA9IGZvckVhY2hTcHJpdGVHcm91cENvbGxpc2lvbkRvO1xuXG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uRG8gPSAoXG4gICAgc3ByaXRlMU5hbWU6IHN0cmluZyxcbiAgICBmaWx0ZXJTdHI6IHN0cmluZyxcbiAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgc3ByaXRlMU5hbWUpLmNvbGxpc2lvbihmaWx0ZXJTdHIpLmVhY2goY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgLy8gc2VlIGh0dHA6Ly9nYW1lcXVlcnlqcy5jb20vZG9jdW1lbnRhdGlvbi9hcGkvI2NvbGxpc2lvbiBmb3IgZmlsdGVyU3RyIHNwZWNcbiAgICAvLyBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uIGNhbiBvcHRpb25hbGx5IHRha2UgdHdvIGFyZ3VtZW50czogY29sbEluZGV4LCBoaXRTcHJpdGVcbiAgICAvLyBzZWUgaHR0cDovL2FwaS5qcXVlcnkuY29tL2pRdWVyeS5lYWNoXG59O1xuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVGaWx0ZXJlZEhpdCA9IGZvckVhY2hTcHJpdGVGaWx0ZXJlZENvbGxpc2lvbkRvO1xuXG5leHBvcnQgdHlwZSBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9IHtcbiAgICBcImxlZnRcIjogYm9vbGVhbjtcbiAgICBcInJpZ2h0XCI6IGJvb2xlYW47XG4gICAgXCJ1cFwiOiBib29sZWFuO1xuICAgIFwiZG93blwiOiBib29sZWFuO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVIaXREaXJlY3Rpb24gPSAoXG4gICAgc3ByaXRlMUlkOiBzdHJpbmcsXG4gICAgc3ByaXRlMVg6IG51bWJlcixcbiAgICBzcHJpdGUxWTogbnVtYmVyLFxuICAgIHNwcml0ZTFYU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUxWVNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMVdpZHRoOiBudW1iZXIsXG4gICAgc3ByaXRlMUhlaWdodDogbnVtYmVyLFxuICAgIHNwcml0ZTJJZDogc3RyaW5nLFxuICAgIHNwcml0ZTJYOiBudW1iZXIsXG4gICAgc3ByaXRlMlk6IG51bWJlcixcbiAgICBzcHJpdGUyWFNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMllTcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZTJXaWR0aDogbnVtYmVyLFxuICAgIHNwcml0ZTJIZWlnaHQ6IG51bWJlclxuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIHZhciBzcHJpdGUxSW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICAgICAgXCJpZFwiOiBzcHJpdGUxSWQsXG4gICAgICAgIFwieFBvc1wiOiBzcHJpdGUxWCxcbiAgICAgICAgXCJ5UG9zXCI6IHNwcml0ZTFZLFxuICAgICAgICBcInhTcGVlZFwiOiBzcHJpdGUxWFNwZWVkLFxuICAgICAgICBcInlTcGVlZFwiOiBzcHJpdGUxWVNwZWVkLFxuICAgICAgICBcImhlaWdodFwiOiBzcHJpdGUxSGVpZ2h0LFxuICAgICAgICBcIndpZHRoXCI6IHNwcml0ZTFXaWR0aFxuICAgIH07XG4gICAgdmFyIHNwcml0ZTJJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IHNwcml0ZTJJZCxcbiAgICAgICAgXCJ4UG9zXCI6IHNwcml0ZTJYLFxuICAgICAgICBcInlQb3NcIjogc3ByaXRlMlksXG4gICAgICAgIFwieFNwZWVkXCI6IHNwcml0ZTJYU3BlZWQsXG4gICAgICAgIFwieVNwZWVkXCI6IHNwcml0ZTJZU3BlZWQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHNwcml0ZTJIZWlnaHQsXG4gICAgICAgIFwid2lkdGhcIjogc3ByaXRlMldpZHRoXG4gICAgfTtcbiAgICByZXR1cm4gc3ByaXRlSGl0RGlyKHNwcml0ZTFJbmZvLCBzcHJpdGUySW5mbyk7XG59O1xuXG5leHBvcnQgdHlwZSBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMgPSB7XG4gICAgXCJ4UG9zXCI6IG51bWJlcjtcbiAgICBcInlQb3NcIjogbnVtYmVyO1xuICAgIFwieFNwZWVkXCI6IG51bWJlcjsgLy8gbW92ZW1lbnQgbXVzdCBiZSBieSBkaWN0aW9uYXJ5LFxuICAgIFwieVNwZWVkXCI6IG51bWJlcjsgLy8gd2l0aCBzb21ldGhpbmcgbGlrZSB4ID0geCArIHhTcGVlZFxuICAgIFwid2lkdGhcIjogbnVtYmVyO1xuICAgIFwiaGVpZ2h0XCI6IG51bWJlcjtcbn07XG5leHBvcnQgdHlwZSBTcHJpdGVEaWN0ID0gU3ByaXRlUGh5c2ljYWxEaW1lbnNpb25zICYge1xuICAgIFwiaWRcIjogc3RyaW5nO1xuICAgIFtzOiBzdHJpbmddOiBhbnk7XG59O1xuY29uc3Qgc3ByaXRlc1NwZWVkU2FtcGxlczogeyBbazogc3RyaW5nXTogeyBzYW1wbGVTaXplOiBudW1iZXIsIHhTcGVlZFNhbXBsZXM6IG51bWJlcltdLCB5U3BlZWRTYW1wbGVzOiBudW1iZXJbXSwgY2hlY2tlZDogYm9vbGVhbiB9IH0gPSB7fTtcbmNvbnN0IGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyA9IChzcHJpdGVJbmZvOiBTcHJpdGVEaWN0KSA9PiB7XG4gICAgLy8gQSBoZXVyaXN0aWMgY2hlY2sgZm9yIGNvbW1vbiBlcnJvcnMgZnJvbSBsZWFybmVycy5cbiAgICAvLyBDaGVjayBpZiBzcHJpdGUgc3BlZWRzIGV2ZXIgY2hhbmdlLiAgSWYgbm90LCBwcm9iYWJseSBkb2luZyBpdCB3cm9uZy5cbiAgICBpZiAoIXNwcml0ZXNTcGVlZFNhbXBsZXNbc3ByaXRlSW5mb1tcImlkXCJdXSkge1xuICAgICAgICBzcHJpdGVzU3BlZWRTYW1wbGVzW3Nwcml0ZUluZm9bXCJpZFwiXV0gPSB7XG4gICAgICAgICAgICBzYW1wbGVTaXplOiAwLFxuICAgICAgICAgICAgeFNwZWVkU2FtcGxlczogW10sXG4gICAgICAgICAgICB5U3BlZWRTYW1wbGVzOiBbXSxcbiAgICAgICAgICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3ByaXRlMVNhbXBsaW5nID0gc3ByaXRlc1NwZWVkU2FtcGxlc1tzcHJpdGVJbmZvW1wiaWRcIl1dO1xuICAgICAgICBjb25zdCBtYXhTYW1wbGVTaXplID0gMTA7XG4gICAgICAgIGlmIChzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZSA8IG1heFNhbXBsZVNpemUpIHtcbiAgICAgICAgICAgICsrc3ByaXRlMVNhbXBsaW5nLnNhbXBsZVNpemU7XG4gICAgICAgICAgICBzcHJpdGUxU2FtcGxpbmcueFNwZWVkU2FtcGxlcy5wdXNoKHNwcml0ZUluZm9bXCJ4U3BlZWRcIl0pO1xuICAgICAgICAgICAgc3ByaXRlMVNhbXBsaW5nLnlTcGVlZFNhbXBsZXMucHVzaChzcHJpdGVJbmZvW1wieVNwZWVkXCJdKTtcbiAgICAgICAgfSBlbHNlIGlmICghc3ByaXRlMVNhbXBsaW5nLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHNwcml0ZTFTYW1wbGluZy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHNzID0gc3ByaXRlMVNhbXBsaW5nLnNhbXBsZVNpemU7XG4gICAgICAgICAgICBjb25zdCBzeFNhbXBsZXMgPSBzcHJpdGUxU2FtcGxpbmcueFNwZWVkU2FtcGxlcztcbiAgICAgICAgICAgIGNvbnN0IHN5U2FtcGxlcyA9IHNwcml0ZTFTYW1wbGluZy55U3BlZWRTYW1wbGVzO1xuXG4gICAgICAgICAgICBsZXQgc2FtZVhzcGVlZCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNzOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3hTYW1wbGVzW2ldICE9PSBzeFNhbXBsZXNbaSAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhbWVYc3BlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNhbWVYc3BlZWQgJiYgc3hTYW1wbGVzWzBdICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TR1xuICAgICAgICAgICAgICAgICAgICArIFwic3ByaXRlIGhpdCBkaXJlY3Rpb24gZnVuY3Rpb25hbGl0eS0gcG9zc2libHkgd3JvbmcgeFBvcyBjYWxjdWxhdGlvbiBmb3Igc3ByaXRlOiBcIlxuICAgICAgICAgICAgICAgICAgICArIHNwcml0ZUluZm9bXCJpZFwiXVxuICAgICAgICAgICAgICAgICAgICArIFwiLiAgRW5zdXJlIHhTcGVlZCB1c2VkIHZhbGlkbHkgaWYgc3ByaXRlIGhpdCBkaXJlY3Rpb25hbGl0eSBzZWVtcyB3cm9uZy5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzYW1lWXNwZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3M7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChzeVNhbXBsZXNbaV0gIT09IHN5U2FtcGxlc1tpIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtZVlzcGVlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FtZVlzcGVlZCAmJiBzeVNhbXBsZXNbMF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHXG4gICAgICAgICAgICAgICAgICAgICsgXCJzcHJpdGUgaGl0IGRpcmVjdGlvbiBmdW5jdGlvbmFsaXR5LSBwb3NzaWJseSB3cm9uZyB5UG9zIGNhbGN1bGF0aW9uIGZvciBzcHJpdGU6IFwiXG4gICAgICAgICAgICAgICAgICAgICsgc3ByaXRlSW5mb1tcImlkXCJdXG4gICAgICAgICAgICAgICAgICAgICsgXCIuICBFbnN1cmUgeVNwZWVkIHVzZWQgdmFsaWRseSBpZiBzcHJpdGUgaGl0IGRpcmVjdGlvbmFsaXR5IHNlZW1zIHdyb25nLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVIaXREaXIgPSAoXG4gICAgc3ByaXRlMUluZm86IFNwcml0ZURpY3QsXG4gICAgc3ByaXRlMkluZm86IFNwcml0ZURpY3Rcbik6IFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyhzcHJpdGUxSW5mbyk7XG4gICAgICAgIGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyhzcHJpdGUySW5mbyk7XG4gICAgfVxuICAgIHJldHVybiBzcHJpdGVIaXREaXJJbXBsKHNwcml0ZTFJbmZvLCBzcHJpdGUySW5mbyk7XG59XG5jb25zdCBzcHJpdGVIaXREaXJJbXBsID0gKFxuICAgIHNwcml0ZTFJbmZvOiBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMsXG4gICAgc3ByaXRlMkluZm86IFNwcml0ZVBoeXNpY2FsRGltZW5zaW9uc1xuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIC8qXG4gICAgICAgUmV0dXJucyB0aGUgZGlyZWN0aW9uIHRoYXQgc3ByaXRlIDEgaGl0cyBzcHJpdGUgMiBmcm9tLlxuICAgICAgIHNwcml0ZSAxIGlzIHJlbGF0aXZlbHkgbGVmdC9yaWdodC91cC9kb3duIG9mIHNwcml0ZSAyXG4gICAgICAgXG4gICAgICAgSGl0IGRpcmVjdGlvbiByZXR1cm5lZCBjb3VsZCBiZSBtdWx0aXBsZSB2YWx1ZXMgKGUuZy4gbGVmdCBhbmQgdXApLFxuICAgICAgIGFuZCBpcyByZXR1cm5lZCBieSB0aGlzIGZ1bmN0aW9uIGFzIGEgZGljdGlvbmFyeSBhcywgZS5nLlxuICAgICAgIHtcbiAgICAgICBcImxlZnRcIjogZmFsc2UsXG4gICAgICAgXCJyaWdodFwiOiBmYWxzZSxcbiAgICAgICBcInVwXCI6IGZhbHNlLFxuICAgICAgIFwiZG93blwiOiBmYWxzZVxuICAgICAgIH1cbiAgICAgICBcbiAgICAgICBQYXJhbWV0ZXJzIHNwcml0ZXsxLDJ9SW5mbyBhcmUgZGljdGlvbmFyaWVzIHdpdGggYXQgbGVhc3QgdGhlc2Uga2V5czpcbiAgICAgICB7XG4gICAgICAgXCJpZFwiOiBcImFjdHVhbFNwcml0ZU5hbWVcIixcbiAgICAgICBcInhQb3NcIjogNTAwLFxuICAgICAgIFwieVBvc1wiOiAyMDAsXG4gICAgICAgXCJ4U3BlZWRcIjogLTgsICAvLyBtb3ZlbWVudCBtdXN0IGJlIGJ5IGRpY3Rpb25hcnksXG4gICAgICAgXCJ5U3BlZWRcIjogMCwgICAvLyB3aXRoIHNvbWV0aGluZyBsaWtlIHggPSB4ICsgeFNwZWVkXG4gICAgICAgXCJoZWlnaHRcIjogNzQsXG4gICAgICAgXCJ3aWR0aFwiOiA3NVxuICAgICAgIH1cbiAgICAgICAqL1xuXG4gICAgdmFyIHBlcmNlbnRNYXJnaW4gPSAxLjE7IC8vIHBvc2l0aXZlIHBlcmNlbnQgaW4gZGVjaW1hbFxuICAgIHZhciBkaXI6IFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0ge1xuICAgICAgICBcImxlZnRcIjogZmFsc2UsXG4gICAgICAgIFwicmlnaHRcIjogZmFsc2UsXG4gICAgICAgIFwidXBcIjogZmFsc2UsXG4gICAgICAgIFwiZG93blwiOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBjdXJyZW50IGhvcml6b250YWwgcG9zaXRpb25cbiAgICB2YXIgczFsZWZ0ID0gc3ByaXRlMUluZm9bXCJ4UG9zXCJdO1xuICAgIHZhciBzMXJpZ2h0ID0gczFsZWZ0ICsgc3ByaXRlMUluZm9bXCJ3aWR0aFwiXTtcblxuICAgIHZhciBzMmxlZnQgPSBzcHJpdGUySW5mb1tcInhQb3NcIl07XG4gICAgdmFyIHMycmlnaHQgPSBzMmxlZnQgKyBzcHJpdGUySW5mb1tcIndpZHRoXCJdO1xuXG4gICAgLy8gcmV2ZXJzZSBob3Jpem9udGFsIHBvc2l0aW9uIGJ5IHhTcGVlZCB3aXRoIHBlcmNlbnQgbWFyZ2luXG4gICAgdmFyIHNwcml0ZTFYU3BlZWQgPSBzcHJpdGUxSW5mb1tcInhTcGVlZFwiXSAqIHBlcmNlbnRNYXJnaW47XG4gICAgczFsZWZ0ID0gczFsZWZ0IC0gc3ByaXRlMVhTcGVlZDtcbiAgICBzMXJpZ2h0ID0gczFyaWdodCAtIHNwcml0ZTFYU3BlZWQ7XG5cbiAgICB2YXIgc3ByaXRlMlhTcGVlZCA9IHNwcml0ZTJJbmZvW1wieFNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMmxlZnQgPSBzMmxlZnQgLSBzcHJpdGUyWFNwZWVkO1xuICAgIHMycmlnaHQgPSBzMnJpZ2h0IC0gc3ByaXRlMlhTcGVlZDtcblxuICAgIGlmIChzMXJpZ2h0IDw9IHMybGVmdCkge1xuICAgICAgICBkaXJbXCJsZWZ0XCJdID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHMycmlnaHQgPD0gczFsZWZ0KSB7XG4gICAgICAgIGRpcltcInJpZ2h0XCJdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjdXJyZW50IHZlcnRpY2FsIHBvc2l0aW9uXG4gICAgdmFyIHMxdG9wID0gc3ByaXRlMUluZm9bXCJ5UG9zXCJdO1xuICAgIHZhciBzMWJvdHRvbSA9IHMxdG9wICsgc3ByaXRlMUluZm9bXCJoZWlnaHRcIl07XG5cbiAgICB2YXIgczJ0b3AgPSBzcHJpdGUySW5mb1tcInlQb3NcIl07XG4gICAgdmFyIHMyYm90dG9tID0gczJ0b3AgKyBzcHJpdGUySW5mb1tcImhlaWdodFwiXTtcblxuICAgIC8vIHJldmVyc2UgdmVydGljYWwgcG9zaXRpb24gYnkgeVNwZWVkIHdpdGggcGVyY2VudCBtYXJnaW5cbiAgICB2YXIgc3ByaXRlMVlTcGVlZCA9IHNwcml0ZTFJbmZvW1wieVNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMXRvcCA9IHMxdG9wIC0gc3ByaXRlMVlTcGVlZDtcbiAgICBzMWJvdHRvbSA9IHMxYm90dG9tIC0gc3ByaXRlMVlTcGVlZDtcblxuICAgIHZhciBzcHJpdGUyWVNwZWVkID0gc3ByaXRlMkluZm9bXCJ5U3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMydG9wID0gczJ0b3AgLSBzcHJpdGUyWVNwZWVkO1xuICAgIHMyYm90dG9tID0gczJib3R0b20gLSBzcHJpdGUyWVNwZWVkO1xuXG4gICAgaWYgKHMxYm90dG9tIDw9IHMydG9wKSB7XG4gICAgICAgIGRpcltcInVwXCJdID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHMyYm90dG9tIDw9IHMxdG9wKSB7XG4gICAgICAgIGRpcltcImRvd25cIl0gPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBkaXI7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0S2V5U3RhdGUgPSAoa2V5OiBudW1iZXIpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLmtleVRyYWNrZXJba2V5XTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRNb3VzZVggPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gJC5nUS5tb3VzZVRyYWNrZXIueDtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VZID0gKCk6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuICQuZ1EubW91c2VUcmFja2VyLnk7XG59O1xuZXhwb3J0IGNvbnN0IGdldE1vdXNlQnV0dG9uMSA9ICgpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLm1vdXNlVHJhY2tlclsxXTtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VCdXR0b24yID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1EubW91c2VUcmFja2VyWzJdO1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZUJ1dHRvbjMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuICEhJC5nUS5tb3VzZVRyYWNrZXJbM107XG59O1xuXG5leHBvcnQgY29uc3QgZGlzYWJsZUNvbnRleHRNZW51ID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIHNlZSBhbHNvOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTIwMjIxL2pxdWVyeS1qcy1wcmV2ZW50LXJpZ2h0LWNsaWNrLW1lbnUtaW4tYnJvd3NlcnNcbiAgICAvLyAkKFwiI3BsYXlncm91bmRcIikuY29udGV4dG1lbnUoZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2U7fSk7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLm9uKFwiY29udGV4dG1lbnVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG59O1xuZXhwb3J0IGNvbnN0IGVuYWJsZUNvbnRleHRNZW51ID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIHNlZSBhbHNvOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTIwMjIxL2pxdWVyeS1qcy1wcmV2ZW50LXJpZ2h0LWNsaWNrLW1lbnUtaW4tYnJvd3NlcnNcbiAgICAkKFwiI3BsYXlncm91bmRcIikub2ZmKFwiY29udGV4dG1lbnVcIik7XG59O1xuXG5leHBvcnQgY29uc3QgaGlkZU1vdXNlQ3Vyc29yID0gKCk6IHZvaWQgPT4ge1xuICAgICQoXCIjcGxheWdyb3VuZFwiKS5jc3MoXCJjdXJzb3JcIiwgXCJub25lXCIpO1xufTtcbmV4cG9ydCBjb25zdCBzaG93TW91c2VDdXJzb3IgPSAoKTogdm9pZCA9PiB7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLmNzcyhcImN1cnNvclwiLCBcImRlZmF1bHRcIik7XG59O1xuXG5leHBvcnQgY29uc3Qgc2F2ZURpY3Rpb25hcnlBcyA9IChzYXZlQXM6IHN0cmluZywgZGljdGlvbmFyeTogb2JqZWN0KTogdm9pZCA9PiB7XG4gICAgLy8gcmVxdWlyZXMganMtY29va2llOiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZS90cmVlL3YyLjAuNFxuICAgIENvb2tpZXMuc2V0KFwiR1FHX1wiICsgc2F2ZUFzLCBkaWN0aW9uYXJ5KTtcbn07XG5leHBvcnQgY29uc3QgZ2V0U2F2ZWREaWN0aW9uYXJ5ID0gKHNhdmVkQXM6IHN0cmluZyk6IG9iamVjdCA9PiB7XG4gICAgcmV0dXJuIENvb2tpZXMuZ2V0SlNPTihcIkdRR19cIiArIHNhdmVkQXMpO1xufTtcbmV4cG9ydCBjb25zdCBkZWxldGVTYXZlZERpY3Rpb25hcnkgPSAoc2F2ZWRBczogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgQ29va2llcy5yZW1vdmUoXCJHUUdfXCIgKyBzYXZlZEFzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVPdmFsSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gcm90ZGVnIGluIGRlZ3JlZXMgY2xvY2t3aXNlIG9uIHNjcmVlbiAocmVjYWxsIHktYXhpcyBwb2ludHMgZG93bndhcmRzISlcblxuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwTmFtZSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRTcHJpdGUoaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGdyb3VwTmFtZSwgaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9XG5cbiAgICB2YXIgYm9yZGVyX3JhZGl1cyA9ICh3IC8gMiArIFwicHggLyBcIiArIGggLyAyICsgXCJweFwiKTtcbiAgICBzcHJpdGUoaWQpXG4gICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIGNvbG9yKVxuICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCBib3JkZXJfcmFkaXVzKVxuICAgICAgICAuY3NzKFwiLW1vei1ib3JkZXItcmFkaXVzXCIsIGJvcmRlcl9yYWRpdXMpXG4gICAgICAgIC5jc3MoXCItd2Via2l0LWJvcmRlci1yYWRpdXNcIiwgYm9yZGVyX3JhZGl1cyk7XG5cbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChpZCwgdywgaCk7XG4gICAgc3ByaXRlU2V0WFkoaWQsIHgsIHkpO1xuXG4gICAgaWYgKHJvdGRlZykge1xuICAgICAgICBpZiAocm90T3JpZ2luWCAmJiByb3RPcmlnaW5ZKSB7XG4gICAgICAgICAgICB2YXIgcm90T3JpZ2luID0gcm90T3JpZ2luWCArIFwicHggXCIgKyByb3RPcmlnaW5ZICsgXCJweFwiO1xuICAgICAgICAgICAgc3ByaXRlKGlkKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItd2Via2l0LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbW96LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbXMtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1vLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgc3ByaXRlUm90YXRlKGlkLCByb3RkZWcpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgY3JlYXRlT3ZhbCA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsSW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3T3ZhbCA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlT3ZhbChcbiAgICAgICAgXCJHUUdfb3ZhbF9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ2lyY2xlSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsSW5Hcm91cChcbiAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICBpZCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgcixcbiAgICAgICAgcixcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUNpcmNsZSA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUNpcmNsZUluR3JvdXAoXG4gICAgICAgIG51bGwsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgZHJhd0NpcmNsZSA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVDaXJjbGUoXG4gICAgICAgIFwiR1FHX2NpcmNsZV9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVSZWN0SW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gcm90ZGVnIGluIGRlZ3JlZXMgY2xvY2t3aXNlIG9uIHNjcmVlbiAocmVjYWxsIHktYXhpcyBwb2ludHMgZG93bndhcmRzISlcbiAgICAvLyByb3RPcmlnaW57WCxZfSBtdXN0IGJlIHdpdGhpbiByYW5nZSBvZiB3aWRlIHcgYW5kIGhlaWdodCBoLCBhbmQgcmVsYXRpdmUgdG8gY29vcmRpbmF0ZSAoeCx5KS5cblxuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwTmFtZSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRTcHJpdGUoaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGdyb3VwTmFtZSwgaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9XG5cbiAgICBzcHJpdGUoaWQpLmNzcyhcImJhY2tncm91bmRcIiwgY29sb3IpO1xuXG4gICAgc3ByaXRlU2V0V2lkdGhIZWlnaHQoaWQsIHcsIGgpO1xuICAgIHNwcml0ZVNldFhZKGlkLCB4LCB5KTtcblxuICAgIGlmIChyb3RkZWcpIHtcbiAgICAgICAgaWYgKHJvdE9yaWdpblggJiYgcm90T3JpZ2luWSkge1xuICAgICAgICAgICAgdmFyIHJvdE9yaWdpbiA9IHJvdE9yaWdpblggKyBcInB4IFwiICsgcm90T3JpZ2luWSArIFwicHhcIjtcbiAgICAgICAgICAgIHNwcml0ZShpZClcbiAgICAgICAgICAgICAgICAuY3NzKFwiLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW1vei10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW1zLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItby10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwidHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pO1xuICAgICAgICB9XG4gICAgICAgIHNwcml0ZVJvdGF0ZShpZCwgcm90ZGVnKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlY3QgPSAoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlUmVjdEluR3JvdXAoXG4gICAgICAgIG51bGwsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgZHJhd1JlY3QgPSAoXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICB3OiBudW1iZXIsXG4gICAgaDogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZVJlY3QoXG4gICAgICAgIFwiR1FHX3JlY3RfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKSxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgdyxcbiAgICAgICAgaCxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTGluZUluR3JvdXAgPSAoXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcgfCBudWxsLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDE6IG51bWJlcixcbiAgICB5MTogbnVtYmVyLFxuICAgIHgyOiBudW1iZXIsXG4gICAgeTI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICB0aGlja25lc3M/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG4gICAgaWYgKCF0aGlja25lc3MpIHtcbiAgICAgICAgdGhpY2tuZXNzID0gMjtcbiAgICB9XG4gICAgdmFyIHhkID0geDIgLSB4MTtcbiAgICB2YXIgeWQgPSB5MiAtIHkxO1xuICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KHhkICogeGQgKyB5ZCAqIHlkKTtcblxuICAgIHZhciBhcmNDb3MgPSBNYXRoLmFjb3MoeGQgLyBkaXN0KTtcbiAgICBpZiAoeTIgPCB5MSkge1xuICAgICAgICBhcmNDb3MgKj0gLTE7XG4gICAgfVxuICAgIHZhciByb3RkZWcgPSBhcmNDb3MgKiAxODAgLyBNYXRoLlBJO1xuXG4gICAgdmFyIGhhbGZUaGljayA9IHRoaWNrbmVzcyAvIDI7XG4gICAgdmFyIGRyYXdZMSA9IHkxIC0gaGFsZlRoaWNrO1xuXG4gICAgY3JlYXRlUmVjdEluR3JvdXAoXG4gICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgaWQsXG4gICAgICAgIHgxLFxuICAgICAgICBkcmF3WTEsXG4gICAgICAgIGRpc3QsXG4gICAgICAgIHRoaWNrbmVzcyxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgMCxcbiAgICAgICAgaGFsZlRoaWNrXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlTGluZSA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHgxOiBudW1iZXIsXG4gICAgeTE6IG51bWJlcixcbiAgICB4MjogbnVtYmVyLFxuICAgIHkyOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgdGhpY2tuZXNzPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVMaW5lSW5Hcm91cChudWxsLCBpZCwgeDEsIHkxLCB4MiwgeTIsIGNvbG9yLCB0aGlja25lc3MpO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3TGluZSA9IChcbiAgICB4MTogbnVtYmVyLFxuICAgIHkxOiBudW1iZXIsXG4gICAgeDI6IG51bWJlcixcbiAgICB5MjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHRoaWNrbmVzcz86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlTGluZShcIkdRR19saW5lX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksIHgxLCB5MSwgeDIsIHkyLCBjb2xvciwgdGhpY2tuZXNzKTtcbn07XG5cbmV4cG9ydCB0eXBlIENvbnRhaW5lckl0ZXJhdG9yID0ge1xuICAgIG5leHQ6ICgpID0+IFtudW1iZXIsIG51bWJlcl07XG4gICAgaGFzTmV4dDogKCkgPT4gYm9vbGVhbjtcbiAgICBjdXJyZW50OiBudW1iZXI7XG4gICAgZW5kOiBudW1iZXI7XG4gICAgX2tleXM6IHN0cmluZ1tdO1xufTtcbmV4cG9ydCB0eXBlIE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuID0gKG46IG51bWJlcikgPT4gbnVtYmVyIHwgUmVjb3JkPFxuICAgIG51bWJlcixcbiAgICBudW1iZXJcbj47XG5leHBvcnQgdHlwZSBDcmVhdGVDb250YWluZXJJdGVyYXRvckZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogQ29udGFpbmVySXRlcmF0b3I7XG4gICAgKHRoaXM6IHZvaWQsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogQ29udGFpbmVySXRlcmF0b3I7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yOiBDcmVhdGVDb250YWluZXJJdGVyYXRvckZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgc3RhcnQ/OiBudW1iZXIsXG4gICAgZW5kPzogbnVtYmVyLFxuICAgIHN0ZXBzaXplPzogbnVtYmVyXG4pOiBDb250YWluZXJJdGVyYXRvciB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGYgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgY29uc3QgZk93blByb3BOYW1lczogc3RyaW5nW10gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhmKTtcbiAgICAgICAgY29uc3QgaXQ6IENvbnRhaW5lckl0ZXJhdG9yID0ge1xuICAgICAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgICAgIGVuZDogZk93blByb3BOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgICBfa2V5czogZk93blByb3BOYW1lcyxcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1JZHggPSB0aGlzLl9rZXlzW3RoaXMuY3VycmVudF07XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbTogW251bWJlciwgbnVtYmVyXSA9IFtOdW1iZXIoaXRlbUlkeCksIGZbaXRlbUlkeF1dO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50IDwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gaXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcInN0YXJ0IG11c3QgYmUgYSBudW1iZXIuXCIsIHN0YXJ0KTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcImVuZCBtdXN0IGJlIGEgbnVtYmVyLlwiLCBlbmQpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwic3RlcHNpemUgbXVzdCBiZSBhIG51bWJlci5cIiwgc3RlcHNpemUpO1xuICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCB8fCBlbmQgPT0gbnVsbCB8fCBzdGVwc2l6ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlRTIHR5cGUgaGludFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZng6IChuOiBudW1iZXIpID0+IG51bWJlciA9ICh0eXBlb2YgZiA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IChmIGFzICh4OiBudW1iZXIpID0+IG51bWJlcilcbiAgICAgICAgICAgIDogKHg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlcihmW3hdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjb25zdCBpdDogQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAodGhpczogQ29udGFpbmVySXRlcmF0b3IpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtOiBbbnVtYmVyLCBudW1iZXJdID0gW3RoaXMuY3VycmVudCwgZngodGhpcy5jdXJyZW50KV07XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ICs9IHN0ZXBzaXplO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50IDwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGN1cnJlbnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgICAgICBfa2V5czogdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIiA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGYpIDogKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgazogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSBzdGFydDsgaSA8IGVuZDsgaSArPSBzdGVwc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBrLnB1c2goU3RyaW5nKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGs7XG4gICAgICAgICAgICB9KSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpdDtcbiAgICB9XG59O1xuZXhwb3J0IHR5cGUgR3JhcGhDcmVhdGlvbk9wdGlvbnMgPSB7XG4gICAgaW50ZXJwb2xhdGVkOiBib29sZWFuO1xufTtcbmV4cG9ydCB0eXBlIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHJhZGl1c190aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IHR5cGUgR3JvdXBOYW1lQW5kSWRQcmVmaXggPSB7XG4gICAgXCJpZFwiOiBzdHJpbmc7XG4gICAgXCJncm91cFwiOiBzdHJpbmc7XG59O1xudHlwZSBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzID0gW1xuICAgIHN0cmluZyxcbiAgICBzdHJpbmcsXG4gICAgTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgR3JhcGhDcmVhdGlvbk9wdGlvbnNcbl07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGhXaXRoT3B0aW9uczogQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnNcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCByYWRpdXNfdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBjb2xvciwgcmFkaXVzX3RoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMpXG4gICAgLy8gbW9yZU9wdHMgPSB7XCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZU9yRmFsc2V9XG4gICAgdmFyIGludGVycG9sYXRlZCA9IG1vcmVPcHRzW1wiaW50ZXJwb2xhdGVkXCJdO1xuXG4gICAgaWYgKCFpZCkge1xuICAgICAgICBpZCA9IFwiR1FHX2dyYXBoX1wiICsgR1FHX2dldFVuaXF1ZUlkKCk7XG4gICAgfVxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgIGdyb3VwTmFtZSA9IGlkICsgXCJfZ3JvdXBcIjtcbiAgICAgICAgY3JlYXRlR3JvdXBJblBsYXlncm91bmQoZ3JvdXBOYW1lKTtcbiAgICB9XG4gICAgdmFyIGdyb3VwX2lkID0ge1xuICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICBcImdyb3VwXCI6IGdyb3VwTmFtZVxuICAgIH07XG5cbiAgICB2YXIgY29sb3I7XG4gICAgdmFyIHJhZGl1c190aGlja25lc3M7XG4gICAgbGV0IGl0ZXI6IENvbnRhaW5lckl0ZXJhdG9yO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQgJiYgYXJndW1lbnRzLmxlbmd0aCA8PSA2ICYmXG4gICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiAoZikpIHtcbiAgICAgICAgY29sb3IgPSBhcmd1bWVudHNbNF07XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSBhcmd1bWVudHNbNV07XG4gICAgICAgIGl0ZXIgPSBjcmVhdGVDb250YWluZXJJdGVyYXRvcihmKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNyAmJiBhcmd1bWVudHMubGVuZ3RoIDw9IDkpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gYXJndW1lbnRzWzRdO1xuICAgICAgICB2YXIgZW5kID0gYXJndW1lbnRzWzVdO1xuICAgICAgICB2YXIgc3RlcHNpemUgPSBhcmd1bWVudHNbNl07XG4gICAgICAgIGNvbG9yID0gYXJndW1lbnRzWzddO1xuICAgICAgICByYWRpdXNfdGhpY2tuZXNzID0gYXJndW1lbnRzWzhdO1xuICAgICAgICBpdGVyID0gY3JlYXRlQ29udGFpbmVySXRlcmF0b3IoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGdW5jdGlvbiB1c2VkIHdpdGggd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1wiKTtcbiAgICAgICAgdGhyb3cgXCJUUyB0eXBlIGhpbnRcIjtcbiAgICB9XG5cbiAgICBpZiAoY29sb3IgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbG9yID0gXCJncmF5XCI7XG4gICAgfVxuICAgIGlmIChyYWRpdXNfdGhpY2tuZXNzID09IHVuZGVmaW5lZCkge1xuICAgICAgICByYWRpdXNfdGhpY2tuZXNzID0gMjtcbiAgICB9XG5cbiAgICB2YXIgY3VyclggPSBudWxsO1xuICAgIHZhciBjdXJyWSA9IG51bGw7XG4gICAgd2hpbGUgKGl0ZXIuaGFzTmV4dCgpKSB7XG4gICAgICAgIHZhciBpdGVtID0gaXRlci5uZXh0KCk7XG4gICAgICAgIHZhciBpID0gaXRlbVswXTtcbiAgICAgICAgdmFyIGZ4aSA9IGl0ZW1bMV07XG5cbiAgICAgICAgaWYgKGZ4aSA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZ4aSA9IEdRR19NQVhfU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVI7XG4gICAgICAgIH0gZWxzZSBpZiAoZnhpID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZ4aSA9IEdRR19NSU5fU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyclkgPT09IG51bGwgJiYgZnhpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3VyclggPSBpO1xuICAgICAgICAgICAgY3VyclkgPSBmeGk7XG4gICAgICAgICAgICBpZiAoIWludGVycG9sYXRlZCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUNpcmNsZUluR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiZ3JvdXBcIl0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiaWRcIl0gKyBcIl9ncmFwaF9wdF9cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgIGZ4aSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzX3RoaWNrbmVzcyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3JcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZ4aSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICghaW50ZXJwb2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJncm91cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJpZFwiXSArIFwiX2dyYXBoX3B0X1wiICsgaSxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpbmVJbkdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImdyb3VwXCJdLFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImlkXCJdICsgXCJfZ3JhcGhfbGluZV9cIiArIGN1cnJYICsgXCItXCIgKyBpLFxuICAgICAgICAgICAgICAgICAgICBjdXJyWCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJZIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzX3RoaWNrbmVzc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyWCA9IGk7XG4gICAgICAgICAgICBjdXJyWSA9IGZ4aTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncm91cF9pZDtcbn07XG5cbnR5cGUgQ3JlYXRlR3JhcGhJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGhJbkdyb3VwOiBDcmVhdGVHcmFwaEluR3JvdXBGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmKVxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBhcmdzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IGZhbHNlIH0pO1xuICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICB0aGlzLFxuICAgICAgICBhcmdzIGFzIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXNcbiAgICApO1xufTtcblxudHlwZSBDcmVhdGVHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgaWQ6IHN0cmluZywgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGg6IENyZWF0ZUdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogZmFsc2UgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuXG50eXBlIERyYXdHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgZHJhd0dyYXBoOiBEcmF3R3JhcGhGbiA9IGZ1bmN0aW9uIGRyYXdHcmFwaChcbiAgICB0aGlzOiB2b2lkXG4pOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCBkb3RSYWRpdXMpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIGNvbG9yLCBkb3RSYWRpdXMpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZilcbiAgICB2YXIgb3B0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMywgMCwgeyBcImludGVycG9sYXRlZFwiOiBmYWxzZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG5cbnR5cGUgQ3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwOiBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXBGbiA9XG4gICAgZnVuY3Rpb24gKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvcilcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZilcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBhcmdzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICAgICApO1xuICAgIH07XG5cbnR5cGUgQ3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKHRoaXM6IHZvaWQsIGlkOiBzdHJpbmcsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUludGVycG9sYXRlZEdyYXBoOiBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG4gICAgLy8gcmV0dXJuIGNyZWF0ZUludGVycG9sYXRlZEdyYXBoSW5Hcm91cC5hcHBseSh0aGlzLCBvcHRzKTtcbn07XG5cbnR5cGUgRHJhd0ludGVycG9sYXRlZEdyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBkcmF3SW50ZXJwb2xhdGVkR3JhcGg6IERyYXdJbnRlcnBvbGF0ZWRHcmFwaEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuIl19