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
        this.node.getChildByName("tuichuanniu").on(cc.Node.EventType.TOUCH_START, this.exit, this)
    },
    init(){
        Game.BattleManager.Init();
        this.playBgm();
        setTimeout(function () {
            Game.BattleManager.InstanceBrickAndPlayer();
            this.m_nTime = 60;
            this.time = setInterval(this.TimeCount.bind(this), 1000);
        }.bind(this), 1000);
        if (Game.GameManager.avatarUrl) {
            cc.loader.load({url: Game.GameManager.avatarUrl, type: 'png'}, function(err, texture) {
                var spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                this.nodeDict["userIcon"].getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }.bind(this));
        }
    },
    playBgm(){
        this.audio = cc.audioEngine.play(this.bgmAudio, true, 1);
    },
    stopBgm(){
        cc.audioEngine.stop(this.audio);
    },
    exit() {
        uiFunc.openUI("uiExit");
    },
    updateScore(point){
        this.score.getComponent(cc.Label).string = point;
    },
    updateScore2(point){
        this.score2.getComponent(cc.Label).string = point;
    },
    leaveRoom(data) {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    if (data.leaveRoomInfo.userId !== GLB.userInfo.id) {
                        uiTip.setData("对手离开了游戏");
                    }
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

    reloadCartridge() {
        setTimeout(function() {
            this.cartridgeBullets = [].concat(this.nodeDict["cartridge"].children);
            this.bulletCnt = this.cartridgeBullets.length;
            for (var i = 0; i < this.cartridgeBullets.length; i++) {
                this.cartridgeBullets[i].getComponent(cc.Animation).play("reloading");
            }
            this.lackBulletAnim.stop();
            this.lackBulletAnim.node.opacity = 0;
        }.bind(this), 5000);
    },
    TimeCount() {
        if (Game.GameManager.gameState !== GameState.Over) {
            this.m_nTime -= 1;
            this.node.getChildByName("TimeNode").getChildByName("Label").getComponent(cc.Label).string = this.m_nTime
            // cc.log(this.m_nTime);
            if (this.m_nTime <= 0) {
                this.m_nTime = 0;
                clearInterval(this.time);
                Game.GameManager.gameOver();
            }
            //GameNetWorkManager_1.GameNetWorkManager.GetInstance().SendGameData({ info: GlobalConfing_1.GlobalConfing.MessageId_Time, time: this.m_nTime });
            //GameMain_1.default.GetInstance().DlgGameBattle.getComponent(DlgGameBattle_1.default).UpdateTime(this.m_nTime);
        }
    },
    exit() {
        uiFunc.openUI("uiExit");
    },


    roundStart: function() {
        this.nodeDict['readyGo'].getComponent(cc.Animation).play();
        this.nodeDict['readyGo'].getComponent(cc.AudioSource).play();
    },

    leaveRoom() {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    uiTip.setData("对手离开了游戏");
                }
            }.bind(this));
        }
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.off(clientEvent.eventType.refreshSlateBtn, this.refreshSlateBtn, this);
        clientEvent.off(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);

    }
});
