cc.Class({
    extends: cc.Component,

    properties: {
        speedX: 0,
        bullets: [cc.Node],
        bulletParent: cc.Node,
        itemSp: cc.Node,
        explosionClip: {
            default: null,
            url: cc.AudioClip
        },
        explosionPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad() {
        this.isDestroy = false;
        if (GLB.isRoomOwner) {
            this.speedX *= -1;
        }
    },

    init(itemId) {
        this.itemId = itemId;
    },

    explosion(hostPlayerId) {
        this.isDestroy = true;
        cc.audioEngine.play(this.explosionClip, false, 1);
        var boom = cc.instantiate(this.explosionPrefab);
        boom.parent = this.node;
        boom.position = cc.v2(0.0);

        this.node.getComponent(cc.BoxCollider).enabled = false;
        this.bulletParent.active = true;
        this.itemSp.active = false;
        if (GLB.userInfo.id === hostPlayerId) {
            this.node.rotation = 0;
        } else {
            this.node.rotation = 180;
        }
        for (var i = 0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i].getComponent("bullet");
            if (bullet) {
                bullet.init(hostPlayerId, GLB.NormalBulletSpeed)
            }
        }
    },

    update(dt) {
        if (!this.isDestroy) {
            this.node.x += this.speedX * dt;
        }
    }

});
