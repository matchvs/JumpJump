cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0,
        firePoint: cc.Node
    },

    start() {
        this.playerId = GLB.playerUserIds[1];
        this.direction = DirectState.None;
        this.targetPosX = this.node.x;
        this.limitX = 415;
    },

    fire() {
        var bullet = Game.BulletManager.getBullet();
        bullet.node.parent = Game.BulletManager.node;
        var worldPos = this.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        var bulletPoint = Game.BulletManager.node.convertToNodeSpaceAR(worldPos);
        bullet.node.position = bulletPoint;
        bullet.init(this.playerId);
    },


    move() {
        var dir = this.direction === DirectState.None ? 0 :
            this.direction === DirectState.Left ? 1 : -1;
        var deltaX = (1 / GLB.FRAME_RATE) * this.speed * dir;
        this.targetPosX += deltaX;
        if (this.targetPosX < -this.limitX) {
            this.targetPosX = this.limitX + deltaX;
            this.node.x = this.limitX;
        }
        if (this.targetPosX > this.limitX) {
            this.targetPosX = -this.limitX + deltaX;
            this.node.x = -this.limitX;
        }
    },

    setDirect(dir) {
        this.direction = dir;
    },

    update(dt) {
        this.node.x = cc.lerp(this.node.x, this.targetPosX, 4 * dt);
    }
});
