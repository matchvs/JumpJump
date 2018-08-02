var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
cc.Class({
    extends: uiPanel,

    properties: {
        loseClip: {
            default: null,
            url: cc.AudioClip
        },
        victoryClip: {
            default: null,
            url: cc.AudioClip
        }
    },

    start() {
        uiFunc.findUI("uiGamePanel").getComponent("uiGamePanel").stopBgm();
        var point1 = uiFunc.findUI("uiGamePanel").getChildByName("Board").getChildByName("player1").getChildByName("score").getComponent(cc.Label).string;
        var point2 = uiFunc.findUI("uiGamePanel").getChildByName("Board").getChildByName("player2").getChildByName("score").getComponent(cc.Label).string;
        var isLose = point1 >= point2 ? false : true;
        this.player = this.nodeDict["player"].getComponent("resultPlayerIcon");
        this.player.setData(GLB.playerUserIds[0]);
        this.rival = this.nodeDict["rival"].getComponent("resultPlayerIcon");
        this.rival.setData(GLB.playerUserIds[1]);
        this.nodeDict["vs"].active = false;
        this.nodeDict["score"].active = true;
        this.nodeDict["quit"].on("click", this.quit, this);

        this.nodeDict["lose"].active = isLose;
        this.nodeDict["win"].active = !isLose;

        if (!isLose) {
            cc.audioEngine.play(this.victoryClip, false, 1);
            // 发送胜局记录--
            Game.GameManager.loginServer();

        } else {
            cc.audioEngine.play(this.loseClip, false, 1);
        }
        this.nodeDict["playerScore"].getComponent(cc.Label).string = point1;
        this.nodeDict["rivalScore"].getComponent(cc.Label).string = point2;
    },

    quit: function() {
        mvs.engine.leaveRoom("");
        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            uiFunc.closeUI("uiGamePanel");
            gamePanel.destroy();
        }
        uiFunc.closeUI(this.node.name);
        this.node.destroy();


        Game.GameManager.lobbyShow();
    }
});
