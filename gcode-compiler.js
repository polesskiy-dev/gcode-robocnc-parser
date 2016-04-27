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

        //max feed for idle moving
        this.idleMaxFeed = 100;

        //var resultArr = [];

        //TODO validation before parsing

        //parse
        if (this.gCommandsText) {
            this.gCommandsText.split('\r\n').forEach(
                (gCodeString)=> {
                    //parse string to object
                    var gCodeObj = parseStringToGCode(gCodeString);

                    //debug
                    console.log("Parsing: " + gCodeString);
                    console.log(JSON.stringify(gCodeObj));

                    //iterate all g codes from string
                    gCodeObj.gCodeValuesArr.forEach((gCodeValue)=> {
                        switch (gCodeValue) {
                            case "00":
                                this.roboCNCArr.push(this.g00(gCodeObj.xX, gCodeObj.yY, gCodeObj.zZ));
                                break;
                            case "01":
                                this.roboCNCArr.push(this.g01(gCodeObj.xX, gCodeObj.yY, gCodeObj.zZ, gCodeObj.feedF));
                                break;
                            default:
                                this.roboCNCArr.push('//unrecognized G code ' + gCodeValue);
                        }
                    })
                });
            //console.log(JSON.stringify(resultArr));
        }
    }


    getRoboCNCArr() {
        return this.roboCNCArr;
    }


    /**
     * G00 indle move with maximum speed
     * @param xx
     * @param yy
     * @param zz
     * @returns {RoboCommandObj}
     */
    g00(xx, yy, zz) {
        return new RoboCommandObj(RoboCommandEnum.GO, xx, yy, zz, this.idleMaxFeed);
    }

    /**
     * G01 Linear interpolation
     * @param xx x coordenate to move to
     * @param yy y coordinate to move to
     * @param feed
     */
    g01(xx, yy, zz, feed) {
        return new RoboCommandObj(RoboCommandEnum.GO, xx, yy, zz, feed);
    };
}

/**
 * Parse string to G code obj
 * @param gCodeRawString string to parse
 * @returns {{gCodeValuesArr: Array, xX: null, yY: null, zZ: null, parameterP: null, feedF: null, correctionD: null}}
 * G code representation object
 */
function parseStringToGCode(gCodeRawString) {
    /** G code represent object*/
    var gCode = {
        gCodeValuesArr: [],
        xX: null,
        yY: null,
        zZ: null,
        parameterP: null,
        feedF: null,
        correctionD: null
    };

    /** regexps for G code values parsing*/
    var regexp = {
        G_CODE: /G(\d+)/g,
        M_CODE: /M(\d+)/g,
        X_COORDINATE: /X(\d+.?\d*)/,
        Y_COORDINATE: /Y(\d+.?\d*)/,
        Z_COORDINATE: /Z(\d+.?\d*)/,
        PARAMETER: /Z(\d+.?\d*)/g,
        FEED: /F(\d+.?\d*)/g
    };

    //parse array of G code numbers
    var match;
    while (match = (regexp.G_CODE).exec(gCodeRawString)) gCode.gCodeValuesArr.push(match[1]);

    //parse X
    var xX = (regexp.X_COORDINATE).exec(gCodeRawString);
    gCode.xX = (xX) ? Number(xX[1]) : null;

    //parse Y
    var yY = (regexp.Y_COORDINATE).exec(gCodeRawString);
    gCode.yY = (yY) ? Number(yY[1]) : null;

    //parse Z
    var zZ = (regexp.Z_COORDINATE).exec(gCodeRawString);
    gCode.zZ = (zZ) ? Number(zZ[1]) : null;

    //parse parameter P
    var parameterP = (regexp.PARAMETER).exec(gCodeRawString);
    gCode.parameterP = (parameterP) ? Number(parameterP[1]) : null;

    //parse feed
    var feedF = (regexp.FEED).exec(gCodeRawString);
    gCode.feedF = (feedF) ? Number(feedF[1]) : null;

    return gCode;
}

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
};

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
        this.command = command;
        this.xx = xx;
        this.yy = yy;
        this.zz = zz;
        this.feed = feed;
    }
}