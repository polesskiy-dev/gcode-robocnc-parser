/**
 * @summary G-code parser to RoboCNC
 *
 * RoboCNC format
 * @file readme.md
 *
 * G-code format
 * @link https://en.wikipedia.org/wiki/G-code
 *
 * @version 0.0.1
 * @author Polesskiy polesskiy.dev@gmail.com
 */
class gCodeParser {
    /**
     * @constructor
     * @param gCommandsText
     */
    constructor(gCommandsText) {
        this.gCommandsText = gCommandsText;
        this.roboCNCArr = [];

        //TODO validation before parsing

        //lets parse
        if (this.gCommandsText) {
            this.gCommandsText.split('\r\n').forEach(
                (gCodeString)=>{
                    console.log("Parsing: " + gCodeString);

                    //array of G code numbers
                    var match;
                    var gCodeNumbersArr = [];
                    while (match=(regexp.G_CODE).exec(gCodeString)) gCodeNumbersArr.push(Number(match[1]));
                    console.log(gCodeNumbersArr);
                }
            )
        }
    }

    getRoboCNCArr(){
        return this.roboCNCArr;
    }

    /**
     * G01 Linear interpolation
     * @param xx x coordenate to move to
     * @param yy y coordinate to move to
     * @param feed
     */
    g01linearInterpolation(xx, yy, feed) {
        return new RoboCommandObj(RoboCommandEnum.GO, xx, yy, feed);
    };
}

var regexp = {
    G_CODE: /G(\d+)/g,
    M_CODE: "/M(\d+)/g",
    X_COORDINATE:"/X(\d+.?\d*)/g",
    Y_COORDINATE:"/Y(\d+.?\d*)/g",
    Z_COORDINATE:"/Z(\d+.?\d*)/g",
    PARAMETER:"/Z(\d+.?\d*)/g",
    FEED:"/F(\d+.?\d*)/g"
};

/** RoboCNC commands enum*/
var RoboCommandEnum = {
    GO: 1,
    STOP: 3,
    RELATIVE_MOVE: 5,
    CHANGE_TOOL_PAUSE: 6,
    properties: {
        1: {name: "Go command"},
        3: {name: "Stop"},
        5: {name: "Relative move"},
        6: {name: "Change tool pause"}
    }
}

/** RoboCNC command object*/
class RoboCommandObj {
    /**
     * @constructor
     * @param command
     * @param xx x coordinate
     * @param yy y coordinate
     * @param zz z coordinate
     * @param feed
     */
    constructor(command, xx, yy, zz, feed) {
        this.xx = xx;
        this.yy = yy;
        this.zz = zz;
        this.feed = feed;
    }
}