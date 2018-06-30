// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Game.GlobalsConfig=this;
    },

    start () {

    },
    //斜率
    Angle() {
        return Game.BulletManager.GetAngle();
    },
    //阴影斜率
    ShadowSlope() {
        return 1;
    },
    //站立
    Stand() {
        return "stand";
    },
    //摇晃
    Shake() {
        return "shake";
        //改为不进行摇晃
        //return "stand";
    },
    //掉落
    Drop() {
        return "drop";
    },
    //判断点信息
    PointInfo() {
        return { LeftUp: "LeftUp", LeftUpOut: "LeftUpOut", LeftDownOut: "LeftDownOut", LeftDown: "LeftDown", Mid: "Mid", RightUp: "RightUp", RightUpOut: "RightUpOut", RightDown: "RightDown", RightDownOut: "RightDown" };
    },
    ChessR() {
        return { a: 40, b: 23.6 };
    },
    LevelProbability(level) {
    if (level == 1) {
        return { DropClose: 20, StandClose: 25, Center: 10, StandFar: 25, DropFar: 20 };
    }
    else if (level == 2) {
        return { DropClose: 15, StandClose: 20, Center: 30, StandFar: 20, DropFar: 15 };
    }
    else if (level == 3) {
        return { DropClose: 10, StandClose: 15, Center: 50, StandFar: 15, DropFar: 10 };
    }
    else {
        return null;
    }
    },
    DropPlace() {
    return { DropClose: "DropClose", StandClose: "StandClose", Center: "Center", StandFar: "StandFar", DropFar: "DropFar" };
    },
    GetEnumDifficulty(level) {
    if (level == "1") {
        return 1;
    }
    else if (level == "2") {
        return 2;
    }
    else if (level == "3") {
        return 3;
    }
    else {
        return null;
    }
    },
/***************Game Logic End******************/
/********************NetWork  Start*************/
    IP() {
    // return "47.106.171.247";
    return "tcjump.anyh5.com";
    // return "tcrhythm.anyh5.com";
    },
    Port() {
    // return "8081";
    return "8196";
    // return "8195";
    },
    IsQQSendMessage() {
    return true;
    },
/********************NetWork  End************************/
/********************NetWork  MessageId******************/
    MessageId_Connected() {
    return "online";
    },
    MessageId_CloseConnect() {
    return "onclose";
    },
// 离线，大厅到游戏
    MessageId_ConnectError() {
    return "offline";
    },
// 通道创建，大厅到游戏
    MessageId_ChannelCreated() {
    return "channelCreated";
    },
// 游戏开始，大厅到游戏
    MessageId_GameStart() {
    return "gameStart";
    },
// 游戏重置，大厅到游戏
    MessageId_GameReset() {
    return "gameReset";
    },
// 游戏初始化，游戏到大厅
    MessageId_GameInit() {
    return "gameInit";
    },
// 游戏ready，游戏到大厅
    MessageId_GameReady() {
    return "gameReady";
    },
// 结算信息，游戏到大厅
    MessageId_GameResult() {
    return "gameResult";
    },
// 玩家离开
    MessageId_GameLeave() {
    return "leave";
    },
// 数据传输，游戏到大厅或者大厅到游戏
    MessageId_GameData() {
    return "gameData";
    },
    MessageId_InstanceBrick() {
    return "instanceBrick";
    },
    MessageId_RecoveryBrick() {
    return "recoveryBrick";
    },
    MessageId_PlayerJump() {
    return "Jump";
    },
    MessageId_PlayerScore() {
    return "Score";
    },
    MessageId_Time() {
    return "Time";
    },
    MessaegId_Host() {
    return "Host";
    },
    MessageId_HostAgain() {
    return "HostAgain";
    },
    MessageId_ChangeHost() {
    return "ChangeHost";
    }
    // update (dt) {},
});
