var mvs = require("Matchvs");
var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {
        bgmAudio: {
            default: null,
            url: cc.AudioClip
        },
        GameRoot: cc.Node,
        CubeRoot: cc.Node
    },
    onLoad() {
        this.score = this.node.getChildByName("Board").getChildByName("player1").getChildByName("score");
        this.score2 = this.node.getChildByName("Board").getChildByName("player2").getChildByName("score");
        this.node.getChildByName("tuichuanniu").on(cc.Node.EventType.TOUCH_START, this.exit, this);
        this.player = this.node.getChildByName("Board").getChildByName("player1").getComponent("resultPlayerIcon");
        this.player.setData(GLB.playerUserIds[0]);
        this.rival = this.node.getChildByName("Board").getChildByName("player2").getComponent("resultPlayerIcon");
        this.rival.setData(GLB.playerUserIds[1]);
        clientEvent.on(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);
    },
    init() {
        Game.BattleManager.Init();
        this.playBgm();
        setTimeout(function() {
            Game.BattleManager.InstanceBrickAndPlayer();
            this.m_nTime = 60;
            if(GLB.isRoomOwner==true){
                this.time = setInterval(function () {
                    var msg = {timeCount:true};
                    mvs.engine.sendFrameEvent(JSON.stringify(msg));
                    this.TimeCount();
                }.bind(this), 1000);
            }
        }.bind(this), 1000);
    },
    stopTime(){
        clearInterval(this.time);
    },
    playBgm() {
        this.audio = cc.audioEngine.play(this.bgmAudio, true, 1);
    },
    stopBgm() {
        cc.audioEngine.stop(this.audio);
    },
    exit() {
        uiFunc.openUI("uiExit");
    },
    updateScore(point) {
        this.score.getComponent(cc.Label).string = point;
    },
    updateScore2(point) {
        this.score2.getComponent(cc.Label).string = point;
    },

    TimeCount() {
        if (Game.GameManager.gameState !== GameState.Over) {
            this.m_nTime -= 1;
            if (this.node) {
                this.node.getChildByName("TimeNode").getChildByName("Label").getComponent(cc.Label).string = this.m_nTime;
            }
            // cc.log(this.m_nTime);
            if (this.m_nTime <= 0) {
                this.m_nTime = 0;
                clearInterval(this.time);
                Game.GameManager.gameOver();
            }
        }
    },

    leaveRoom() {
        if (Game.GameManager.gameState !== GameState.Over) {
            clearInterval(this.time);
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    uiTip.setData("对手离开了游戏");
                }
            }.bind(this));
        }
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);
    }
});
