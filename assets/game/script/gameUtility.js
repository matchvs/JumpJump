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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Game.GameUtility=this;
    },

    start () {

    },
    GetRandomFloat(min, max) {
    return min + cc.random0To1() * max;
    },
    //not include max
    GetRandomInt(min, max) {
    let Range = max - min;
    let Rand = Math.random();
    let num = min + Math.floor(Rand * Range); //舍去
    return num;
    },
    //include max
    GetRandomRoundInt(min, max) {
    let Range = max - min;
    let Rand = Math.random();
    let num = min + Math.round(Rand * Range); //四舍五入
    return num;
    },
    //runAction的回调函数调用方法：cc.sequence(cc.action,....,cc.callFunc(func))
    ScaleBigAndFadeOut(image, isMoveUp = false, callback = null) {
    image.scale = 1;
    image.opacity = 255;
    var scale = cc.scaleTo(0.1, 1.5);
    var fade = cc.fadeOut(0.4);
    var move = cc.moveBy(0.5, cc.p(0, 100));
    if (callback == null) {
        image.runAction(cc.sequence(scale, fade));
        if (isMoveUp) {
            image.runAction(move);
        }
    }
    else {
        image.runAction(cc.sequence(scale, fade, cc.callFunc(callback)));
        if (isMoveUp) {
            image.runAction(move);
        }
    }
    }
    // update (dt) {},
});
