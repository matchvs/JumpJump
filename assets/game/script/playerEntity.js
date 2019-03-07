// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var mvs = require("Matchvs");
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
        console.log(GLB.isRoomOwner)
        this.fashe = cc.url.raw('resources/audio/fa she.mp3');
        this.tiaozhong = cc.url.raw('resources/audio/tiao zhong.mp3');
        this.diaoluo = cc.url.raw('resources/audio/diao luo.mp3');
        this.jumpMid = cc.url.raw('resources/audio/+2.mp3');
        this.m_bIsHost = false;
        this.m_nDecideNumber = 0;
        this.m_settimeoutChangeHost = null;
        this.m_settimeoutWaittingUI = null;
        this.m_qwyzNode = null;
        this.m_rotateNode = null;
        this.m_animationNode = null;
        this.m_diNode = null;
        this.m_nPlayerScore = 0;
        this.m_nPlayerScore2 = 0;
        this.m_nAddPower = 0;
        this.m_fSpeed = 0;
        this.m_bIsPress = false;
        this.m_bCanPress = true;
        this.m_fRadio = 0;
        this.m_fXDistance = 0;
        this.m_bIsTranslucent = false;
        this.m_nPlayerID = 0;
        this.m_vec2PlayerCurrentPos = null;
        this.m_objCurrentCube = null;
        this.m_bIsGameOver = false;
        this.const_BASESPEED = 100;
        this.m_compentMotionStreak = null;
        // private m_textureTuoWei:cc.Texture2D=null;
        this.m_nAILevel = 0;
        this.m_bIsAI = false;
        this.m_vec2ResetRootNodePos = cc.Vec2.ZERO;
        this.m_timecountStand = null;
        this.m_bCanNextAction = true;
        this.m_nTimer = 0;
        this.m_nodeAddScore = null;
        this.m_labelAddScore = null;
        this.m_posReborn = cc.Vec2.ZERO;
        this.m_animationJumpSuccessCenter = null;
        this.m_animationJumpSuccessNotCenter = null;
        this.m_animationGatherStrength = null;
        this.m_animationJumpFailed = null;
        this.m_animationJumpFailedSweat = null;
        this.m_animationBrickTimeOut = null;
        // private m_posReForAnim:cc.Vec2=null;
        this.m_posReForDi = null;
        this.m_intLastScore = 0;
        this.AnimNameJumpSuccessCenter = "JumpSuccessCenter";
        this.AnimNameJumpSuccessNotCenter = "JumpSuccessNotCenter";
        this.AnimNameGatherStrength = "GatherStrength";
        this.AnimNameJumpFailed = "JumpFailedAnim";
        this.AnimNameJumpFailedSweat = "JumpFailedSweat";
        this.m_listPlayerActions = [];
        this.bool = true;
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    // onDestroy () {
    //     cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    //     cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    // },
    AddScore(point) {
        if (Game.GameManager.gameState === GameState.Over) {
            return;
        }
        if (point <= 0) {
            return;
        }
        this.m_nPlayerScore += point;
        this.m_nPlayerScore2 += point;

        //    if (this.m_bIsAI==false)
        //    {
        //GameNetWorkManager.GetInstance().SendGameData({info:Game.GlobalsConfig.MessageId_PlayerScore,score:this.m_nPlayerScore});
        //GameMain.GetInstance().DlgGameBattle.getComponent<DlgGameBattle>(DlgGameBattle).UpdatePlayerScore(this.m_nPlayerScore);
        if(this.m_bIsAI==false){
            this.UIAddScoreAction(point);
            this.gameMain.updateScore(this.m_nPlayerScore);
        }
        if(this.m_bIsAI==true){
            this.gameMain.updateScore2(this.m_nPlayerScore2);
        }
        var msg = {point: this.m_nPlayerScore};
        mvs.engine.sendFrameEvent(JSON.stringify(msg));
        //    }
        //    else
        //    {
        //     GameMain.GetInstance().DlgGameBattle.getComponent<DlgGameBattle>(DlgGameBattle).UpdateEnemyScore(this.m_nPlayerScore);
        //    }
        //    cc.log(this.m_nPlayerID+":"+this.m_nPlayerScore);
    },
    ReduceScore(point) {
        this.m_nPlayerScore -= point;
        this.gameMain.updateScore(this.m_nPlayerScore);
    },
    SetScore(point) {
        this.m_nPlayerScore = point;
        GameMain_1.default.GetInstance().DlgGameBattle.getComponent(DlgGameBattle_1.default).UpdateEnemyScore(this.m_nPlayerScore);
    },
    Score() {
        return this.m_nPlayerScore;
    },
    IsPressMode() {
        return this.m_bIsPress;
    },
    IsAI() {
        return this.m_bIsAI;
    },
    AddPower() {
        return this.m_nAddPower;
    },
    Speed() {
        return this.m_fSpeed;
    },
    XDistance() {
        return this.m_fXDistance;
    },
    XDistance(fxDistance) {
        this.m_fXDistance = fxDistance;
    },
    PlayerID(id) {
        this.m_nPlayerID = id;
    },
    PlayerID() {
        return this.m_nPlayerID;
    },
    PlayerCurrentPosi() {
        var pos = this.gameMain.GameRoot.convertToNodeSpace(this.m_vec2PlayerCurrentPos);
        this.dis = this.m_vec2PlayerCurrentPos.y - pos.y;
        pos.y += this.dis;
        return pos;
        //return this.gameMain.GameRoot.convertToNodeSpace(this.m_vec2PlayerCurrentPos);
    },
    PlayerCurrentPos(pos) {
        this.m_vec2PlayerCurrentPos = pos;
        var dis = this.m_posReborn.y - pos.y;
        pos.y += dis;
        this.node.setPosition(pos);
    },
    PlayerCurrentPosInit(pos){
        this.m_vec2PlayerCurrentPos = pos;
        this.node.setPosition(pos);
    },
    CurrentPlayerDiPos() {
        return this.gameMain.GameRoot.convertToNodeSpace(this.m_diNode.parent.getPosition());
    },
    CurrentPlayerDiNodeRotate(rotation) {
        this.m_diNode.rotation = rotation;
    },
    CurrentPlayerCube() {
        return this.m_objCurrentCube;
    },
    CurrentPlayerCube(brick) {
        this.m_objCurrentCube = brick;
    },
    GetPosXDistance() {
        let pos = this.gameMain.GameRoot.convertToNodeSpace(this.node.getPosition());
        pos.x = pos.x + this.m_fXDistance;
        return pos;
    },
    Init(id, pos, currentCube, AILevel ) {
        cc.log("初始化玩家");
        var uiGamePanel = uiFunc.findUI("uiGamePanel");
        if(uiGamePanel){
            this.gameMain = uiGamePanel.getComponent("uiGamePanel");
        }
        this.m_nPlayerScore = 0;
        this.m_nTimer = 0;
        this.m_nAddPower = 430;
        this.m_nPlayerID = id;
        this.m_rotateNode = this.node.getChildByName("rotate");
        this.m_diNode = this.m_rotateNode.getChildByName("di");
        this.m_animationNode = this.m_diNode.getChildByName("AnimGroup");
        this.m_qwyzNode = this.m_diNode.getChildByName("qwyz");
        this.m_nodeAddScore = this.node.getChildByName("labelAddScore");
        this.m_labelAddScore = this.m_nodeAddScore.getComponent(cc.Label);
        this.m_nodeAddScore.active = false;
        this.m_bIsPress = false;
        this.m_fSpeed = this.const_BASESPEED;
        this.m_fXDistance = 0;
        this.PlayerCurrentPosInit(pos);
        this.m_bIsGameOver = false;
        this.m_bCanPress = true;
        this.m_objCurrentCube = currentCube;
        //this.m_compentMotionStreak = this.node.getComponent(cc.MotionStreak);
        //console.log(this.m_compentMotionStreak)
        //this.m_compentMotionStreak.fadeTime = 0;
        // this.m_textureTuoWei=this.m_compentMotionStreak.texture;
        // this.m_compentMotionStreak.texture=null;

        this.m_bCanNextAction = true;
        this.m_intLastScore = 0;
        // cc.loader.loadRes(this.TuoWeiImagePath,(err,Obj)=>
        // {
        //     if(err != null)
        //     {
        //         cc.log(err);
        //     }
        //     if ( null == Obj)
        //     {
        //         cc.log("读取的" + this.TuoWeiImagePath + "预制体不存在")
        //     }
        //     this.m_textureTuoWei=Obj;
        // });
        this.node.setSiblingIndex(this.m_objCurrentCube.node.getSiblingIndex() + 1);
        if (null != AILevel) {
            this.SetAIJoin(AILevel);
            setTimeout(() => {
                this.AIJump();
        }, 2000);
        }
        else {
            if (id == 1) {
                this.m_nDecideNumber = Math.random() * 1000;
                // this.m_nDecideNumber=1000;
                setTimeout(() => {
                    //GameNetWorkManager_1.GameNetWorkManager.GetInstance().SendGameData({ info: GlobalConfing_1.GlobalConfing.MessaegId_Host, decide: this.m_nDecideNumber });
                }, 500);
            }
        }
        this.m_settimeoutChangeHost = null;
        this.m_settimeoutWaittingUI = null;
        this.m_posReborn = pos;
        this.m_animationJumpSuccessCenter = this.node.getChildByName("JumpSuccessCenterAnim").getComponent(cc.Animation);
        this.m_animationJumpSuccessNotCenter = this.node.getChildByName("JumpSuccessNotCenterAnim").getComponent(cc.Animation);
        this.m_animationGatherStrength = this.node.getChildByName("GatherStrengthAnim").getComponent(cc.Animation);
        this.m_animationJumpFailed = this.m_animationNode.getChildByName("JumpFailedAnim").getComponent(cc.Animation);
        this.m_animationJumpFailedSweat = this.m_diNode.getChildByName("Sweat").getComponent(cc.Animation);
        this.m_animationJumpFailedSweat.node.active = false;
        this.m_animationJumpFailed.node.active = false;
        this.m_animationGatherStrength.node.active = false;
        this.m_animationJumpSuccessCenter.on("finished", this.onAnimEndListenerCenter, this);
        this.m_animationJumpSuccessNotCenter.on("finished", this.onAnimEndListenerNotCenter, this);
        this.m_animationJumpFailed.on("finished", this.onAnimEndListenerFailed, this);
        //GameMain_1.default.GetInstance().DlgGameBattle.getComponent(DlgGameBattle_1.default).UpdatePlayerScore(this.m_nPlayerScore);
        //GameMain_1.default.GetInstance().DlgGameBattle.getComponent(DlgGameBattle_1.default).UpdateEnemyScore(this.m_nPlayerScore);
    },
    SettimeoutWaittingUI() {
        return this.m_settimeoutWaittingUI;
    },
    SettimeoutWaittingUI(data) {
        this.m_settimeoutWaittingUI = data;
    },
    DecideNumber() {
        return this.m_nDecideNumber;
    },
    DecideNumber(temp) {
        this.m_nDecideNumber = temp;
    },
    IsHost(ishost) {
        this.m_bIsHost = ishost;
    },
    IsHost() {
        return this.m_bIsHost;
    },
    ChangeDir() {
        if (this.m_objCurrentCube.direction == 1) {
            this.m_diNode.scaleX = 1;
        }
        else {
            this.m_diNode.scaleX = -1;
        }
    },
    // onKeyDown: function (event) {
    //     if(this.bool){
    //         switch (event.keyCode) {
    //             case 13:
    //             case 49:
    //                 this.BePress();
    //                 this.bool = false;
    //                 break;
    //         }
    //     }
    // },
    //
    // onKeyUp: function (event) {
    //    // if(this.bool){
    //         switch (event.keyCode) {
    //             case 13:
    //             case 49:
    //                 this.PressEnd();
    //                 this.bool = true;
    //                 break;
    //         }
    //     //}
    // },
    BePress() {
        if (Game.GameManager.gameState !== GameState.Over) {
            if (this.m_bCanPress && this.m_bIsAI == false) {
                this.m_bIsPress = true;
                this.m_fXDistance = 0;
                this.m_animationNode.stopAllActions();
                this.m_rotateNode.stopAllActions();
                this.m_animationNode.runAction(cc.scaleTo(1, 1, 0.8));
                this.m_vec2ResetRootNodePos = this.m_rotateNode.getPosition();
                this.m_rotateNode.runAction(cc.moveTo(1, new cc.Vec2(this.m_rotateNode.getPosition().x, this.m_rotateNode.getPosition().y - 20)));
                this.m_animationGatherStrength.node.active = true;
                this.m_animationGatherStrength.play(this.AnimNameGatherStrength);
                this.m_objCurrentCube.PressStart();
                this.m_nTimer = 0;
                this.juli = cc.audioEngine.play(this.fashe, false, 1);
            }
        }
    },
    PressEnd() {
        if (Game.GameManager.gameState !== GameState.Over) {
            if (this.m_bCanPress && this.m_bIsAI == false) {
                this.m_bIsPress = false;
                this.m_bCanPress = false;
                var msg = { fxDistance: this.m_fXDistance};
                mvs.engine.sendFrameEvent(JSON.stringify(msg));
                this.m_animationNode.stopAllActions();
                this.m_rotateNode.stopAllActions();
                this.m_rotateNode.setPosition(this.m_vec2ResetRootNodePos);
                this.m_animationNode.runAction(cc.scaleTo(0.5, 1, 1));
                this.m_animationGatherStrength.pause();
                this.m_animationGatherStrength.node.active = false;
                this.m_objCurrentCube.PressEnd();
                this.PlayerJump(null,true);
                this.m_nTimer = 0;
                cc.audioEngine.stop(this.juli);
            }
        }
    },
    SetAIJoin(level) {
        this.m_bIsAI = true;
        this.m_nAILevel = level;
    },
    ShutDownAI() {
        this.m_bIsAI = false;
    },
    AddPlayerJumpList(pos, needSynchronize = false) {
        let info = { pos, needSynchronize };
        this.m_listPlayerActions.push(info);
    },
    PlayerJumpByList() {
        if (this.m_bCanNextAction == true) {
            let info = this.m_listPlayerActions.shift();
            if (null != info) {
                this.m_bCanNextAction = false;
                this.PlayerJump(info.pos, info.needSynchronize);
            }
        }
    },
    PlayerJump(pos , needSynchronize ) {
        if (null != this.m_timecountStand) {
            clearTimeout(this.m_timecountStand);
        }
        let fxDistance = this.m_fXDistance;
        let fyDistance = this.m_fXDistance * Game.GlobalsConfig.Angle();
        let dir = this.m_objCurrentCube.direction; //dir 表示方向
        let posTarget = this.PlayerCurrentPosi();
        if (null == pos) {
            posTarget.x += fxDistance * dir;
            posTarget.y = this.JumpInLine(posTarget.x);
        }
        else {
            if (needSynchronize == false) {
                posTarget = pos;
            }
            else {
                if (this.m_bIsAI) {
                    posTarget = pos;
                }
            }
        }
        if (needSynchronize) {
            //GameNetWorkManager_1.GameNetWorkManager.GetInstance().SendGameData({ info: GlobalConfing_1.GlobalConfing.MessageId_PlayerJump, posX: posTarget.x, posY: posTarget.y });
        }
        let result = Game.BattleManager.JudgeOnBrick(posTarget, this.m_objCurrentCube);
        posTarget = result.position;
        posTarget.y += this.dis;
        this.m_vec2PlayerCurrentPos = posTarget;
        this.m_qwyzNode.active = false;
        this.m_rotateNode.runAction(cc.rotateBy(0.36, 360 * dir));
        let actionJump = cc.jumpTo(0.36, posTarget, 200, 1);
        //this.m_compentMotionStreak.fadeTime = 0;
        setTimeout(() => {
            //     // this.m_compentMotionStreak.reset();
            //this.m_compentMotionStreak.fadeTime = 0.4;
            // this.m_compentMotionStreak.texture= this.m_textureTuoWei;
        }, 50); //14.5
        this.node.runAction(cc.sequence(actionJump, cc.callFunc(function () {
            // this.m_compentMotionStreak.texture=null;
            //this.m_compentMotionStreak.fadeTime = 0;
            if (result.info == Game.GlobalsConfig.Stand()) {
                this.JumpSuccess(result.brikc, result.pointInfo);
            }
            else if (result.info == Game.GlobalsConfig.Shake()) {
                this.PlayerDie(true, result.brikc, result.pointInfo);
            }
            else if (result.info == Game.GlobalsConfig.Drop()) {
                this.PlayerDie(false);
            }
        }.bind(this))));
        this.m_fSpeed = this.const_BASESPEED;
        this.m_fXDistance = 0;
    },
    TurnTranslucent(isTranslucent) {
        if (isTranslucent) {
            this.node.opacity = 155;
        }
        else {
            this.node.opacity = 255;
        }
    },
    JumpSuccess(brick, point) {
        // var anim = brick.node.getChildByName("Shadow1").getComponent(cc.Animation);
        // anim.play("waterWave");
        if (this.m_objCurrentCube == brick) {
            this.m_intLastScore = 0;
        }
        else {
            if (null != this.m_animationBrickTimeOut && this.PlayerID == 1) {
                this.m_objCurrentCube.StopAnimation();
                clearTimeout(this.m_animationBrickTimeOut);
            }
            let index = brick.node.getSiblingIndex();
            this.m_objCurrentCube = brick;
            this.node.setSiblingIndex(index + 1);
            if (this.m_nPlayerID==1) {
                this.m_animationBrickTimeOut = setTimeout(() => {
                    this.m_objCurrentCube.PlayAnimation();
            }, 1000);
                this.m_animationJumpSuccessNotCenter.node.active = true;
                this.m_animationJumpSuccessNotCenter.play(this.AnimNameJumpSuccessNotCenter);
                if (point == Game.GlobalsConfig.PointInfo().Mid) {
                    this.m_animationJumpSuccessCenter.node.active = true;
                    this.m_animationJumpSuccessCenter.play(this.AnimNameJumpSuccessCenter);
                }
                else {
                    // this.m_animationJumpSuccessNotCenter.node.active=true;
                    // this.m_animationJumpSuccessNotCenter.play(this.AnimNameJumpSuccessNotCenter);
                }
                if (this.m_objCurrentCube.nextBrick == null&&GLB.isRoomOwner==true) {
                    Game.BattleManager.InstanceBrick();
                    var msg = {random_brick: Game.brick,random_direction: Game.dir, nextBrickPosition: Game.pos};
                    mvs.engine.sendFrameEvent(JSON.stringify(msg));
                }
                if (this.m_objCurrentCube.nextBrick != null) {
                    Game.BattleManager.MoveRoot(this.m_objCurrentCube, 0.5);
                }
                if (point == Game.GlobalsConfig.PointInfo().Mid) {
                    cc.audioEngine.play(this.jumpMid, false, 1);
                    let score = Game.BattleManager.GetNormalScroe(point) + this.m_intLastScore;
                    this.AddScore(score);
                    this.m_intLastScore = score;
                }
                else {
                    cc.audioEngine.play(this.tiaozhong, false, 1);
                    let score = Game.BattleManager.GetNormalScroe(point);
                    this.AddScore(score);
                    this.m_intLastScore = 0;
                }
                this.m_timecountStand = setTimeout(() => {
                    if(this.m_objCurrentCube) {
                    this.AddScore(Game.BattleManager.GetSpecialScore(this.m_objCurrentCube.GetBrickName()));
                }
            }, 2000);
            }
            if(cc.ai === false){
                if(this.m_nPlayerID==2){
                    this.m_animationBrickTimeOut = setTimeout(() => {
                        this.m_objCurrentCube.PlayAnimation();
                }, 1000);
                    this.m_animationJumpSuccessNotCenter.node.active = true;
                    this.m_animationJumpSuccessNotCenter.play(this.AnimNameJumpSuccessNotCenter);
                    if (point == Game.GlobalsConfig.PointInfo().Mid) {
                        this.m_animationJumpSuccessCenter.node.active = true;
                        this.m_animationJumpSuccessCenter.play(this.AnimNameJumpSuccessCenter);
                    }
                    else {
                        // this.m_animationJumpSuccessNotCenter.node.active=true;
                        // this.m_animationJumpSuccessNotCenter.play(this.AnimNameJumpSuccessNotCenter);
                    }
                    if (this.m_objCurrentCube.nextBrick == null&&GLB.isRoomOwner==true) {
                        Game.BattleManager.InstanceBrick();
                        var msg = {random_brick: Game.brick,random_direction: Game.dir, nextBrickPosition: Game.pos};
                        mvs.engine.sendFrameEvent(JSON.stringify(msg));
                    }
                }
            }

            else {
                //Game.BattleManager.RecoveryBrick(Game.PlayerManager.GetMinYPlayerPos());
                if (this.m_bIsAI) {
                    if (this.m_objCurrentCube.nextBrick == null) {
                        Game.BattleManager.InstanceBrick();
                        var msg = {random_brick: Game.brick,random_direction: Game.dir, nextBrickPosition: Game.pos};
                        mvs.engine.sendFrameEvent(JSON.stringify(msg));
                    }
                    if (point == Game.GlobalsConfig.PointInfo.Mid) {
                        let score = Game.BattleManager.GetNormalScroe(point) + this.m_intLastScore;
                        this.AddScore(score);
                        this.m_intLastScore = score;
                    }
                    else {
                        let score = Game.BattleManager.GetNormalScroe(point);
                        this.AddScore(score);
                        this.m_intLastScore = 0;
                    }
                    // let score= BattleManager.GetInstance().GetNormalScroe(point);
                    // this.AddScore(score);
                    this.m_timecountStand = setTimeout(() => {
                        //this.AddScore(Game.BattleManager.GetSpecialScore(this.m_objCurrentCube.GetBrickName()));
                    }, 2000);
                }
                else {
                    if (this.m_objCurrentCube.nextBrick == null) {
                        //Game.BattleManager.InstanceBrick();
                    }
                }
            }
            if (this.m_objCurrentCube.direction == 1) {
                this.m_diNode.scaleX = 1;
            }
            else {
                this.m_diNode.scaleX = -1;
            }
        }
        if (this.m_nPlayerID == 1) {
            if (this.m_objCurrentCube.nextBrick == null && Game.PlayerManager.GetIsHost() == false) {
                this.m_settimeoutWaittingUI = setTimeout(() => {
                    GameMain_1.default.GetInstance().DlgGameBattle.getComponent(DlgGameBattle_1.default).OpenWaitting();
            }, 1000);
                // this.m_settimeoutChangeHost= setTimeout(() => {
                //     if (this.m_objCurrentCube.nextBrick==null&&PlayerManager.GetInstance().GetIsHost()==false)
                //     {
                //         cc.log("交换主机，开始实例化");
                //         // PlayerManager.GetInstance().SetIsHost(true);
                //         GameNetWorkManager.GetInstance().SendGameData({info:GlobalConfing.MessageId_ChangeHost});
                //         // BattleManager.GetInstance().InstanceBrick();
                //         // BattleManager.GetInstance().MoveRoot(this.m_objCurrentCube,0.5);
                //         this.m_settimeoutChangeHost=null;
                //     }
                // }, 5000);
            }
            else {
                // if (null!=this.m_settimeoutChangeHost)
                // {
                // clearTimeout(this.m_settimeoutChangeHost);
                // this.m_settimeoutChangeHost=null;
                // }
            }
        }
        this.m_posReborn = this.PlayerCurrentPosi();
        this.m_bCanPress = true;
        this.AIMode();
        this.m_bCanNextAction = true;
        this.m_qwyzNode.active = true;
        // this.m_compentMotionStreak.reset();
    },
    PlayerDie(needShake, brick = null, pointInfo = null) {
        if (this.m_nPlayerID == 1) {
            cc.audioEngine.play(this.diaoluo, false, 1);
        }
        if (needShake) {
            this.PlayerShake(brick, pointInfo);
        }
        else {
            this.PlayerDrop();
        }
        this.m_intLastScore = 0;
    },
    PlayerReborn() {
        this.CurrentPlayerDiNodeRotate = 0; //重置anim角度
        this.m_animationNode.rotation = 0;
        this.PlayerCurrentPos(this.gameMain.GameRoot.convertToNodeSpace(this.m_posReborn));
        // this.PlayerCurrentPos=new cc.Vec2(61,-474.4);
        // this.m_compentMotionStreak.reset();
        this.m_bCanPress = true;
        this.AIMode();
        this.m_bCanNextAction = true;
        this.m_qwyzNode.active = true;
        this.node.setSiblingIndex(this.m_objCurrentCube.node.getSiblingIndex() + 1);
    },
    AIJump() {
        if (this.m_bIsAI) {
            let result = "";
            let probability = Math.random() * 100;
            let listProbalility = Game.GlobalsConfig.LevelProbability(this.m_nAILevel);
            probability -= listProbalility.DropClose;
            if (probability <= 0) {
                result = Game.GlobalsConfig.DropPlace().DropClose;
            }
            else {
                probability -= listProbalility.StandClose;
                if (probability <= 0) {
                    result = Game.GlobalsConfig.DropPlace().StandClose;
                }
                else {
                    probability -= listProbalility.Center;
                    if (probability <= 0) {
                        result = Game.GlobalsConfig.DropPlace().Center;
                    }
                    else {
                        probability -= listProbalility.StandFar;
                        if (probability <= 0) {
                            result = Game.GlobalsConfig.DropPlace().StandFar;
                        }
                        else {
                            probability -= listProbalility.DropFar;
                            if (probability <= 0) {
                                result = Game.GlobalsConfig.DropPlace().DropFar;
                            }
                        }
                    }
                }
            }
            this.PlayerJump(this.JumpPlace(result), true);
        }
    },
    DestroySelf() {
        this.node.destroy();
    },
    start() {
    },
    update(dt) {
        if (this.m_bIsPress) {
            this.m_nTimer += dt;
            if (this.m_nTimer <= 2) {
                this.m_fSpeed += (this.m_nAddPower * dt);
                this.m_fXDistance += this.m_fSpeed * dt;
            }
        }
        this.PlayerJumpByList();
    },
    UIAddScoreAction(addScore) {
        this.m_nodeAddScore.active = true;
        this.m_labelAddScore.string = "+" + addScore.toString();
        let posRe = this.m_nodeAddScore.getPosition();
        let pos = this.m_nodeAddScore.getPosition();
        pos.y += 60;
        let actionMoveUp = cc.moveTo(0.5, pos);
        this.m_nodeAddScore.opacity = 255;
        let actionIn = cc.fadeOut(0.5);
        this.m_nodeAddScore.runAction(actionIn);
        this.m_nodeAddScore.runAction(cc.sequence(actionMoveUp, cc.callFunc(function () {
            this.m_nodeAddScore.setPosition(posRe);
            this.m_nodeAddScore.opacity = 255;
            this.m_nodeAddScore.active = false;
        }.bind(this))));
    },
    PlayerShake(brick, pointInfo) {
        this.m_posReForDi = this.m_diNode.getPosition();
        let actionRotate1 = null;
        let actionRotate2 = null;
        let actionRotate3 = null;
        let actionRotate4 = null;
        let pos = this.m_diNode.getPosition();
        pos.x = pos.x + 20;
        pos.y = pos.y - 80;
        let actionMove4 = cc.moveTo(0.3, pos);
        let actionRotate5 = null;
        if (pointInfo == Game.GlobalsConfig.PointInfo().LeftUpOut || pointInfo == Game.GlobalsConfig.PointInfo().LeftDownOut) {
            actionRotate1 = cc.rotateBy(0.25, -30);
            actionRotate2 = cc.rotateBy(0.5, 60);
            actionRotate3 = cc.rotateBy(0.3, -45);
            actionRotate4 = cc.rotateBy(0.3, -45);
            actionRotate5 = cc.rotateBy(0.2, -30);
        }
        else if (pointInfo == Game.GlobalsConfig.PointInfo().RightUpOut || pointInfo == Game.GlobalsConfig.PointInfo().RightDownOut) {
            actionRotate1 = cc.rotateBy(0.25, 30);
            actionRotate2 = cc.rotateBy(0.5, -60);
            actionRotate3 = cc.rotateBy(0.3, 45);
            actionRotate4 = cc.rotateBy(0.3, 45);
            actionRotate5 = cc.rotateBy(0.2, 30);
        }
        // let reIndex:number= this.node.getSiblingIndex();
        this.m_animationNode.runAction(cc.sequence(actionRotate1, actionRotate2, actionRotate3, cc.callFunc(function () {
            let index = brick.node.getSiblingIndex();
            if (pointInfo == Game.GlobalsConfig.PointInfo().LeftUpOut || pointInfo == Game.GlobalsConfig.PointInfo().RightUpOut) {
                this.node.setSiblingIndex(index);
            }
            else {
                this.node.setSiblingIndex(index + 1);
            }
            this.m_animationJumpFailedSweat.node.active = true;
            this.m_animationJumpFailedSweat.play(this.AnimNameJumpFailedSweat);
        }.bind(this)), actionRotate4, cc.callFunc(function () {
            this.m_diNode.runAction(actionMove4);
        }.bind(this)), actionRotate5, cc.callFunc(function () {
            // this.m_diNode.setPosition(posRe);
            // this.PlayerReborn();
            this.m_animationJumpFailed.node.active = true;
            this.m_animationJumpFailed.node.rotation = -this.m_animationNode.rotation;
            this.m_animationJumpFailed.play(this.AnimNameJumpFailed);
            // this.node.setSiblingIndex(reIndex);
        }.bind(this))));
    },
    PlayerDrop() {
        this.m_posReForDi = this.m_diNode.getPosition();
        let pos = this.m_diNode.getPosition();
        pos.y = pos.y - 115;
        let actionMove = cc.moveTo(0.6, pos);
        // let index=this.m_objCurrentCube.node.getSiblingIndex();
        // let reIndex=this.node.getSiblingIndex();
        if (this.node.position.y > this.m_objCurrentCube.node.position.y) {
            this.node.setSiblingIndex(this.m_objCurrentCube.node.getSiblingIndex());
            if (null != this.m_objCurrentCube.nextBrick) {
                if (this.node.position.y > this.m_objCurrentCube.nextBrick.node.position.y) {
                    this.node.setSiblingIndex(this.m_objCurrentCube.nextBrick.node.getSiblingIndex());
                    if (null != this.m_objCurrentCube.nextBrick.nextBrick) {
                        if (this.node.position.y > this.m_objCurrentCube.nextBrick.nextBrick.node.position.y) {
                            this.node.setSiblingIndex(this.m_objCurrentCube.nextBrick.nextBrick.node.getSiblingIndex());
                        }
                    }
                }
            }
        }
        // this.m_animationNode.runAction(cc.sequence(cc.callFunc(function()
        // {
        //     this.m_animationJumpFailedSweat.node.active=true;
        //     this.m_animationJumpFailedSweat.play(this.AnimNameJumpFailedSweat);
        //     this.m_diNode.runAction(actionMove);
        // }.bind(this)),cc.callFunc(function()
        // {
        //     this.m_animationJumpFailed.node.active=true;
        //     // this.m_animationJumpFailed.node.setSiblingIndex(this.m_animationNode.getSiblingIndex()-1);
        //     this.m_animationJumpFailed.play(this.AnimNameJumpFailed);
        //     // this.m_animationJumpFailedSweat.node.active=true;
        //     // this.m_animationJumpFailedSweat.play(this.AnimNameJumpFailedSweat);
        //     // this.m_animationNode.setPosition(posRe);
        //     // this.PlayerReborn();
        //     // this.node.setSiblingIndex(reIndex);
        // }.bind(this))));
        this.m_diNode.runAction(cc.sequence(cc.callFunc(function () {
            this.m_animationJumpFailedSweat.node.active = true;
            this.m_animationJumpFailedSweat.play(this.AnimNameJumpFailedSweat);
            // this.m_diNode.runAction(actionMove);
        }.bind(this)), actionMove, cc.callFunc(function () {
            this.m_animationJumpFailed.node.active = true;
            // this.m_animationJumpFailed.node.setSiblingIndex(this.m_animationNode.getSiblingIndex()-1);
            this.m_animationJumpFailed.play(this.AnimNameJumpFailed);
            // this.m_animationJumpFailedSweat.node.active=true;
            // this.m_animationJumpFailedSweat.play(this.AnimNameJumpFailedSweat);
            // this.m_animationNode.setPosition(posRe);
            // this.PlayerReborn();
            // this.node.setSiblingIndex(reIndex);
        }.bind(this))));
    },
    JumpInLine(posTartgetX) {
        let posCurrentCube = this.gameMain.GameRoot.convertToNodeSpace(this.m_objCurrentCube.node.position);
        this.dis = this.m_objCurrentCube.node.position.y - posCurrentCube.y;
        let b = posCurrentCube.y - Game.GlobalsConfig.Angle() * this.m_objCurrentCube.direction * posCurrentCube.x;
        let y = 0;
        let x = 0;
        x = posTartgetX;
        return Game.GlobalsConfig.Angle() * this.m_objCurrentCube.direction * posTartgetX + b;
    },
    JumpPlace(strPlace) {
        let pos = cc.Vec2.ZERO;
        if (this.m_objCurrentCube.direction > 0) {
            if (strPlace == Game.GlobalsConfig.DropPlace().DropClose) {
                pos = this.m_objCurrentCube.nextBrick.GetLeftDownOut();
            }
            else if (strPlace == Game.GlobalsConfig.DropPlace().StandClose) {
                pos = this.m_objCurrentCube.nextBrick.GetLeftDownPoint();
            }
            else if (strPlace == Game.GlobalsConfig.DropPlace().Center) {
                pos = this.m_objCurrentCube.nextBrick.GetMidPoint();
            }
            else if (strPlace == Game.GlobalsConfig.DropPlace().StandFar) {
                pos = this.m_objCurrentCube.nextBrick.GetRightUpPoint();
            }
            else if (strPlace == Game.GlobalsConfig.DropPlace().DropFar) {
                pos = this.m_objCurrentCube.nextBrick.GetRightUpOut();
            }
        }
        else {
            if (strPlace == Game.GlobalsConfig.DropPlace().DropClose) {
                pos = this.m_objCurrentCube.nextBrick.GetRightDownOut();
            }
            else if (strPlace == Game.GlobalsConfig.DropPlace().StandClose) {
                pos = this.m_objCurrentCube.nextBrick.GetRightDownPoint();
            }
            else if (strPlace == Game.GlobalsConfig.DropPlace().Center) {
                pos = this.m_objCurrentCube.nextBrick.GetMidPoint();
            }
            else if (strPlace == Game.GlobalsConfig.DropPlace().StandFar) {
                pos = this.m_objCurrentCube.nextBrick.GetLeftUpPoint();
            }
            else if (strPlace == Game.GlobalsConfig.DropPlace().DropFar) {
                pos = this.m_objCurrentCube.nextBrick.GetLeftUpOut();
            }
        }
        var GameRoot=uiFunc.findUI("uiGamePanel").getComponent("uiGamePanel").GameRoot;
        return GameRoot.convertToNodeSpace(pos);
    },
    AIMode() {
        //if (Game.BattleManager.IsGameOver == false) {
        if (this.m_bIsAI) {
            let time = 1500 + Math.random() * 1500;
            setTimeout(() => {
                if (this.m_bIsAI) {
                this.AIJump();
            }
        }, time);
        }
        //}
    },
    onAnimEndListenerCenter() {
        this.m_animationJumpSuccessCenter.node.active = false;
        // this.m_animationJumpSuccessNotCenter.node.active=false;
    },
    onAnimEndListenerNotCenter() {
        this.m_animationJumpSuccessNotCenter.node.active = false;
    },
    onAnimEndListenerFailed() {
        this.m_animationJumpFailed.node.rotation = 0;
        this.m_animationJumpFailed.node.active = false;
        this.m_animationJumpFailedSweat.node.active = false;
        // if (null!=this.m_posReForAnim)
        // {
        //     this.m_animationNode.setPosition(this.m_posReForAnim);
        //     this.m_posReForAnim=null;
        // }
        if (null != this.m_posReForDi) {
            this.m_diNode.setPosition(this.m_posReForDi);
            this.m_posReForDi = null;
        }
        this.PlayerReborn();
    }
});
