var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        Game.ItemManager = this;
        this.itemId = 0;
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.roundOver, this.roundOver, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
    },

    roundStart() {
        this.spawnItem();
    },

    spawnItem() {
        this.scheduleItemId = setInterval(function() {
            if (Game.GameManager.gameState === GameState.Over) {
                return;
            }
            var data = [];
            for (var j = 0; j < Game.PlayerManager.players.length; j++) {
                var playerScript = Game.PlayerManager.players[j].getComponent("player");
                if (playerScript) {
                    var worldPos = playerScript.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
                    var bulletPoint = playerScript.node.parent.convertToNodeSpaceAR(worldPos);
                    data.push({playerId: playerScript.userId, bulletPointY: bulletPoint.y});
                }
            }
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.SHOOT_GUN_ITEM,
            }));
        }.bind(this), 8000);
    },

    roundOver() {
        clearInterval(this.scheduleItemId);
    },

    gameOver() {
        clearInterval(this.scheduleItemId);
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
    }

});
