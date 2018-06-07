cc.Class({
    extends: cc.Component,

    properties: {
        cartridge: cc.Node,
        bulletPrefab: cc.Prefab,
        shotGunPrefab: cc.Prefab,
    },

    onLoad() {
        Game.BulletManager = this;
        this.bulletId = 0;
        this.bullets = [];
        this.bulletPool = new cc.NodePool();
    },

    getBullet() {
        var obj = this.bulletPool.get();
        if (!obj) {
            obj = cc.instantiate(this.bulletPrefab);
        }
        var bullet = obj.getComponent('bullet');
        bullet.bulletId = this.bulletId++;
        this.bullets.push(bullet);
        return bullet;
    },

    recycleBullet(bulletId) {
        var bulletIndex = this.bullets.findIndex(function(x) {
            return x.bulletId === bulletId;
        });
        if (bulletIndex >= 0) {
            this.bulletPool.put(this.bullets[bulletIndex].node);
            this.bullets.splice(bulletIndex, 1);
        } else {
            console.log("bulletId:" + bulletId + " is miss");
        }
    }
});
