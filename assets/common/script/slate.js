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
        heart: 0
    },

    onLoad() {
        this.anim = this.node.getComponent(cc.Animation);
    },

    start() {

    },

    beHitted() {
        this.heart--;
        if (this.heart <= 0) {
            this.brokenAnim();
        } else {
            this.hitAnim();
        }
    },

    brokenAnim() {

    },

    hitAnim() {
        this.anim.play("hit" + this.heart);
    }
});
