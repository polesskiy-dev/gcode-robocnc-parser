##G-code to RoboCNC parser
##RoboCNC format description

RoboCNC format is very simple, it is an array of commands containing the coordinates of where to go in steps of stepper motor.

####Commands:

    1 - Go command, move spindle.
    2 - ???
    3 - Stop, end of program, disable stepper motors hold.
    4 - ???
    5 - Moving in relative coordinates
    6 - Change tool pause


####Example of command objects array:

    [
    {Command:1, X:10000, Y:20000, Z:1600}, //1 - Go command, below - the absolute coordinates of the point.
    {Command 1, X: 10000, Y: 10000, Z: 0, Speed:8000}, //Moving with setting maximum speed.
    {Command: 5, X:0, Y:0, Z:-500 }, //Moving in relative coordinates (here - raise spindle up).
    {Command: 6}, //Change tool pause
    {Command: 5, X:0, Y:0, Z:+700 }, //Drill hole.
    {Command: 5, X:0, Y:0, Z:-1800 }, //Raise spindle up.
    {Command: 3}, //STOP. End of program, disable stepper motors hold.
    ]

####Stepper motor steps to other units scale factor:

    mm: x400
    hp: x10
    steps: x1






