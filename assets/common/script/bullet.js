var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0,
        fireClip: {
            default: null,
            url: cc.AudioClip
        },
        hitClip: {
            default: null,
            url: cc.AudioClip
        },
    },

    init(playerId) {
        this.hostPlayerId = playerId;
        if (this.hostPlayerId !== GLB.userInfo.id) {
            this.curSpeed = -this.speed;
        } else {
            this.curSpeed = this.speed;
        }
        cc.audioEngine.play(this.fireClip, false, 1);
    },

    onCollisionEnter: function(other) {
        var group = cc.game.groupList[other.node.groupIndex];
        if (group === 'rival') {
            this.sendRecycleBulletMsg();
            var rival = other.node.getComponent('rival');
            this.sendHurtMsg(rival);
        } else if (group === 'player') {
            this.sendRecycleBulletMsg();
            var player = other.node.getComponent('player');
            this.sendHurtMsg(player);
        }
        else if (group === 'item') {
            this.sendRecycleBulletMsg();
            var item = other.node.getComponent('shootgunItem');
            this.sendItemGetMsg(item);
        } else if (group === 'ground') {
            this.sendRecycleBulletMsg();
        } else if (group === 'obstacle') {
            this.sendRecycleBulletMsg();
        }
    },

    sendItemGetMsg(item) {
        if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.ITEM_GET,
                playerId: this.hostPlayerId,
                itemId: item.itemId
            }));
        }
    },

    sendHurtMsg(targetPlayer) {
        if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.HURT,
                playerId: targetPlayer.playerId
            }));
        }
    },

    sendRecycleBulletMsg() {
        if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.RECYCLE_BULLET,
                bulletId: this.bulletId
            }));
        }
    },

    update(dt) {
        this.node.setPositionY(this.node.position.y + (this.curSpeed * dt));
    }
});
