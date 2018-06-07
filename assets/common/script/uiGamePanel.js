var mvs = require("Matchvs");
var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad() {
        this._super();
        this.nodeDict["right"].on(cc.Node.EventType.TOUCH_START, this.rightStart, this);
        this.nodeDict["right"].on(cc.Node.EventType.TOUCH_END, this.rightCancel, this);
        this.nodeDict["left"].on(cc.Node.EventType.TOUCH_START, this.leftStart, this);
        this.nodeDict["left"].on(cc.Node.EventType.TOUCH_END, this.leftCancel, this);
        this.nodeDict["shootButton"].on(cc.Node.EventType.TOUCH_START, this.sendFireMsg, this);
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        // clientEvent.on(clientEvent.eventType.playerDead, this.playerDead, this);
        // clientEvent.on(clientEvent.eventType.roundOver, this.roundOver, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.on(clientEvent.eventType.timeOver, this.timeOver, this);
        // clientEvent.on(clientEvent.eventType.leaveRoomNotifyMed, this.leaveRoom, this);

        this.nodeDict["exit"].on("click", this.exit, this);
        this.playerIcons = [];
    },

    leaveRoom(data) {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    uiTip.setData("对手离开了游戏");
                }
            }.bind(this));
        }
    },

    rightStart() {
        this.sendDirectMsg(DirectState.Right);
    },

    rightCancel() {
        this.sendDirectMsg(DirectState.None);
    },

    leftStart() {
        this.sendDirectMsg(DirectState.Left);
    },

    leftCancel() {
        this.sendDirectMsg(DirectState.None);

    },

    sendDirectMsg(direction) {
        if (Game.GameManager.gameState === GameState.Play) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.DIRECTION,
                direction: direction
            }));
        }
    },

    sendFireMsg() {
        if (Game.GameManager.gameState === GameState.Play) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.FIRE
            }));
        }
    },

    exit() {
        uiFunc.openUI("uiExit");
    },

    gameOver: function() {
        this.nodeDict['gameOver'].getComponent(cc.Animation).play();
        this.nodeDict['gameOver'].getComponent(cc.AudioSource).play();
    },

    roundStart: function() {
        this.nodeDict['readyGo'].getComponent(cc.Animation).play();
        this.nodeDict['readyGo'].getComponent(cc.AudioSource).play();
    },
});
