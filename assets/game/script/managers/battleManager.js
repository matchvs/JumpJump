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
        Game.BattleManager=this;
        this.m_brickCount = 0;
        this.m_leftSide = null;
        this.m_rightSide = null;
        this.m_downSide = null;
        this.m_distence = null;
        this.m_nTime = 0;
        this.m_bIsGameOver = false;
        this.ALLTIME = 60;
        this.m_nTimer = 0;
    },

    start () {

    },
    Timer(time) {
        this.m_nTimer = time;
    },
    Timer() {
        return this.m_nTimer;
    },
    Init() {
    this.m_leftSide = -200;
    this.m_rightSide = 163;
    this.m_downSide = -300;
    this.m_nTime = this.ALLTIME;
    this.m_bIsGameOver = false;
    this.m_distence = this.m_rightSide - this.m_leftSide;
    //GameMain_1.default.GetInstance().DlgGameBattle.getComponent(DlgGameBattle_1.default).UpdateTime(this.m_nTime);
    },
//生成方块和玩家
    InstanceBrickAndPlayer() {
    this.InitInstanceBrick();
    let firstBrick = Game.BulletManager.GetFirstBrickEntity();
    let firstCenter = firstBrick.GetMidPoint();
    let url = location.search;
    let theRequest = { robot: "0", level: "1" };
    let aiLevel = null;
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    //if (theRequest.robot == "1") {
    //    aiLevel = GlobalConfing_1.GlobalConfing.GetEnumDifficulty(theRequest.level);
    //    setTimeout(() => {
    //        PlayerManager_1.PlayerManager.GetInstance().SetIsHost(true);
    //    }, 1000);
    //}
    //if (GlobalConfing_1.GlobalConfing.IsQQSendMessage) {
    //    if (QQGameSDK_1.QQGameSDK.GetInstance().IsQQRobot) {
    //        aiLevel = QQGameSDK_1.QQGameSDK.GetInstance().robotLevel;
    //        setTimeout(() => {
    //            PlayerManager_1.PlayerManager.GetInstance().SetIsHost(true);
    //        }, 1000);
    //    }
    //}
    Game.PlayerManager.AddOnePlayer(1, firstCenter, firstBrick);
    Game.PlayerManager.AddOnePlayer2(2, firstCenter, firstBrick);
    //setTimeout(function () {
    //    var cubeRoot = uiFunc.findUI("uiGamePanel").getComponent("uiGamePanel").CubeRoot;
    //    if(cubeRoot.children[2].getComponent("playerEntity").m_nPlayerID==1){
     //       this.player = cubeRoot.children[2];
    //        Game.player2 = cubeRoot.children[3].getComponent("playerEntity");
    //    }else{
    //        this.player = cubeRoot.children[3];
     //       Game.player2 = cubeRoot.children[2].getComponent("playerEntity");
     //   }
     //   this.player.parent.parent.on(cc.Node.EventType.TOUCH_START,function () {
     //       this.player.getComponent("playerEntity").BePress();
     //   },this);
     //   this.player.parent.parent.on(cc.Node.EventType.TOUCH_END,function () {
     //       this.player.getComponent("playerEntity").PressEnd();
     //   },this);
    //},2000);
    },
//场景移动
    MoveRoot(brick, duration) {
    let cubeRoot = uiFunc.findUI("uiGamePanel").getComponent("uiGamePanel").CubeRoot;
    let x_distence = null;
    let currentPosition = brick.GetMidPoint();
    if (brick.direction > 0) {
        x_distence = currentPosition.x - this.m_leftSide;
        this.m_leftSide = currentPosition.x;
        this.m_rightSide = currentPosition.x + this.m_distence;
    }
    else {
        x_distence = currentPosition.x - this.m_rightSide;
        this.m_rightSide = currentPosition.x;
        this.m_leftSide = currentPosition.x - this.m_distence;
    }
    let y_distence = currentPosition.y - this.m_downSide;
    this.m_downSide = currentPosition.y;
    let nextPosition = new cc.Vec2((cubeRoot.position.x - x_distence), (cubeRoot.position.y - y_distence));
    let move = cc.moveTo(duration, nextPosition);
    cubeRoot.runAction(move);
    },
//判断是否踩到方块
    JudgeOnBrick(playerPosition, brick) {
    let brickList = [];
    let firstDirection = brick.direction;
    if (null != brick) {
        brickList.push(brick);
        if (null != brick.nextBrick) {
            brickList.push(brick.nextBrick);
            let secondDirection = brick.nextBrick.direction;
            if (null != brick.nextBrick.nextBrick && secondDirection == firstDirection) {
                brickList.push(brick.nextBrick.nextBrick);
            }
        }
    }
    else {
        cc.log("玩家传入的方块为空");
        return;
    }
    let minResualt = null;
    let direction = 1;
    for (let i = 0; i < brickList.length; i++) {
        let brickEntity = brickList[i];
        //cc.log("方向:" + direction)
        let resualt = this.JudgeOnNode(firstDirection, playerPosition, i, brickEntity);
        if (null == minResualt) {
            minResualt = resualt;
        }
        else {
            if (minResualt.minLen > resualt.minLen) {
                minResualt = resualt;
            }
        }
    }
    let ruturnInfo = { position: minResualt.minPos, pointInfo: minResualt.pointInfo, info: minResualt.info, brikc: minResualt.brick };
    //cc.warn(minResualt.info);
    return ruturnInfo;
    // return GameStrand.GetJumpInfo(playerPosition,playerJumpX,playerBrick);
    },
    InitInstanceBrick() {
       Game.BulletManager.InitInstanceBrick();
    },
    //生成方块
    InstanceBrick(brickCount = null, randomBrick = null, randomSize = null, randomDirection = null, randomPosition = null) {
    //if (null != Game.PlayerManager.GetSettimeoutWaittingUI()) {
        //clearTimeout(Game.PlayerManager.GetSettimeoutWaittingUI());
        //Game.PlayerManager.GetInstance().SetSettimeoutWaittingUI(null);
        //GameMain_1.default.GetInstance().DlgGameBattle.getComponent(DlgGameBattle_1.default).CloseWaitting();
    //}
        Game.BulletManager.InstanceBrick(brickCount, randomBrick, randomSize, randomDirection, randomPosition);
    },
    //回收方块
    RecoveryBrick(playerPosition, recoverybrickCount = null) {
        Game.BulletManager.RecoveryBrick(playerPosition, recoverybrickCount);
    },
    //正常得分
    GetNormalScroe(pointInfo) {
    return Game.BulletManager.GetNormalScroe(pointInfo);
    },
    //特殊得分
    GetSpecialScore(brickName) {
    return Game.BulletManager.GetSpecialScore(brickName);
    },
    TimeCount() {
    if (this.m_bIsGameOver == false) {
        this.m_nTime -= 1;
        // cc.log(this.m_nTime);
        if (this.m_nTime <= 0) {
            this.m_nTime = 0;
            this.GameOver();
        }
        GameNetWorkManager_1.GameNetWorkManager.GetInstance().SendGameData({ info: GlobalConfing_1.GlobalConfing.MessageId_Time, time: this.m_nTime });
        GameMain_1.default.GetInstance().DlgGameBattle.getComponent(DlgGameBattle_1.default).UpdateTime(this.m_nTime);
    }
    },
    SetTime(time) {
    if (this.m_nTime > time) {
        this.m_nTime = time;
        this.Timer = 0;
    }
    GameMain_1.default.GetInstance().DlgGameBattle.getComponent(DlgGameBattle_1.default).UpdateTime(this.m_nTime);
    },
    IsGameOver() {
    return this.m_bIsGameOver;
    },
    GameOver() {
    this.m_bIsGameOver = true;
    // let result:{id:number,score:number}=PlayerManager.GetInstance().GetHeighScorePlayer();
    //游戏结束
    /**
     * 若对手已经结束，使用对手的结束时间
     * 若对手还未结束，使用自己的结束时间并发送当前时间
     * */
    GameStateManager_1.GameStateManager.GetInstance().ChangeState(GameStateManager_1.EnumGameState.eGameState_End);
    if (PlayerManager_1.PlayerManager.GetInstance().gameEndTime === 0) {
        // PlayerManager.GetInstance().gameEndTime = new Date().getTime();
        // if (!PlayerManager.GetInstance().isMyRoll) {
        //     PlayerManager.GetInstance().gameEndTime -= PlayerManager.GetInstance().disTime;
        // }
        // GameNetWorkManager.GetInstance().SendOverTime();
        PlayerManager_1.PlayerManager.GetInstance().gameEndTime = PlayerManager_1.PlayerManager.GetInstance().gameStartTime + BattleManager.GetInstance().ALLTIME * 1000;
    }
    if (UIManager_1.default.GetInstance().dlgGameBattle.getPlayerScore() > UIManager_1.default.GetInstance().dlgGameBattle.getEnemyScore()) {
        GameNetWorkManager_1.GameNetWorkManager.GetInstance().SendGameResult(1, 3);
    }
    else if (UIManager_1.default.GetInstance().dlgGameBattle.getPlayerScore() < UIManager_1.default.GetInstance().dlgGameBattle.getEnemyScore()) {
        GameNetWorkManager_1.GameNetWorkManager.GetInstance().SendGameResult(3, 1);
    }
    else {
        GameNetWorkManager_1.GameNetWorkManager.GetInstance().SendGameResult(2, 2);
    }
    },
    //判断掉落节点
    JudgeOnNode(direction, playerPosition, index, brickEntity) {
    if (direction > 0) {
        //cc.log("向右跳");
        return this.JudgeJumpRight(playerPosition, index, brickEntity);
    }
    else {
        //cc.log("向左跳");
        return this.JudgeJumpLeft(playerPosition, index, brickEntity);
    }
    },
    //判断向右跳
    JudgeJumpRight(playerPosition, index, brickEntity) {
    let pointList = brickEntity.GetJumpRightList();
    let leftDownOutPoint = pointList[0].position;
    let rightUpOutPoint = pointList[pointList.length-1].position;
    if (playerPosition.x > rightUpOutPoint.x || playerPosition.x < leftDownOutPoint.x) {
        //掉落
        return { minLen: 200, minPos: playerPosition, pointInfo: "", info: Game.GlobalsConfig.Drop(), brick: null };
    }
    //两点的向量
    let tempDir = cc.pSub(playerPosition, leftDownOutPoint);
    //两点的距离
    let tempLen = cc.pLength(tempDir);
    let minLen = tempLen;
    //距离最小的点
    let minPos = leftDownOutPoint;
    //站立信息
    let info = Game.GlobalsConfig.Shake();
    //位置信息
    let minPointInfo = pointList[0].info;
    if (index == 0) {
        let result = this.JudgeFirstBrickMinLen(playerPosition, true, pointList);
        minLen = result.minLen;
        minPos = result.minPos;
        info = result.info;
        minPointInfo = result.minPointInfo;
    }
    this.DebugJudgeInfo(playerPosition, leftDownOutPoint, minLen, minPos);
    for (let i = 1; i < pointList.length; i++) {
        //两点的向量
        tempDir = cc.pSub(playerPosition, pointList[i].position);
        //两点的距离
        tempLen = cc.pLength(tempDir);
        if (tempLen < minLen) {
            //最小距离
            minLen = tempLen;
            //距离最小的点
            minPos = pointList[i].position;
            //站立信息
            if (i == pointList.length - 1) {
                info = Game.GlobalsConfig.Shake();
            }
            else {
                info = Game.GlobalsConfig.Stand();
            }
            //cc.warn("i:  "+ i +", info:  "+  info);
            minPointInfo = pointList[i].info;
        }
        this.DebugJudgeInfo(playerPosition, pointList[i].position, minLen, minPos);
    }
    //cc.warn("minPointInfo:  "+ minPointInfo +", info:  "+  info);
    return { minLen: minLen, minPos: minPos, pointInfo: minPointInfo, info: info, brick: brickEntity };
    },
    //判断向左跳
    JudgeJumpLeft(playerPosition, index, brickEntity) {
    let pointList = brickEntity.GetJumpLeftList();
    let rightDownOutPoint = pointList[0].position;
    let leftUpOutPoint = pointList[pointList.length - 1].position;
    if (playerPosition.x > rightDownOutPoint.x || playerPosition.x < leftUpOutPoint.x) {
        //掉落
        return { minLen: 999, minPos: playerPosition, pointInfo: "", info: Game.GlobalsConfig.Drop(), brick: null };
    }
    //两点的向量
    let tempDir = cc.pSub(playerPosition, rightDownOutPoint);
    //两点的距离
    let tempLen = cc.pLength(tempDir);
    let minLen = tempLen;
    //距离最小的点
    let minPos = rightDownOutPoint;
    //站立信息
    let info = Game.GlobalsConfig.Shake();
    //位置信息
    let minPointInfo = pointList[0].info;
    if (index == 0) {
        let result = this.JudgeFirstBrickMinLen(playerPosition, true, pointList);
        minLen = result.minLen;
        minPos = result.minPos;
        info = result.info;
        minPointInfo = result.minPointInfo;
    }
    this.DebugJudgeInfo(playerPosition, rightDownOutPoint, minLen, minPos);
    for (let i = 0; i < pointList.length; i++) {
        //两点的向量
        tempDir = cc.pSub(playerPosition, pointList[i].position);
        //两点的距离
        tempLen = cc.pLength(tempDir);
        if (tempLen < minLen) {
            //最小距离
            minLen = tempLen;
            //距离最小的点
            minPos = pointList[i].position;
            //站立信息
            if (i == pointList.length - 1) {
                info = Game.GlobalsConfig.Shake();
            }
            else {
                info = Game.GlobalsConfig.Stand();
            }
            //位置信息
            minPointInfo = pointList[i].info;
        }
        this.DebugJudgeInfo(playerPosition, pointList[i].position, minLen, minPos);
    }
    return { minLen: minLen, minPos: minPos, pointInfo: minPointInfo, info: info, brick: brickEntity };
    },
    JudgeFirstBrickMinLen(playerPosition, rightJump, pointList) {
    let minLen = null;
    let minPos = null;
    let info = Game.GlobalsConfig.Stand();
    let minPointInfo = "";
    for (let i = 0; i < pointList.length; i++) {
        if (rightJump) {
            if (playerPosition.x <= pointList[i].position.x) {
                minLen = cc.pLength(cc.pSub(playerPosition, pointList[i].position));
                minPos = pointList[i].position;
                minPointInfo = pointList[i].info;
                if (i == pointList.length - 1) {
                    info = Game.GlobalsConfig.Shake();
                }
                break;
            }
        }
        else {
            if (playerPosition.x >= pointList[i].position.x) {
                minLen = cc.pLength(cc.pSub(playerPosition, pointList[i].position));
                minPos = pointList[i].position;
                minPointInfo = pointList[i].info;
                if (i == pointList.length - 1) {
                    info = Game.GlobalsConfig.Shake();
                }
                break;
            }
        }
    }
    cc.warn("minPointInfo:  " + minPointInfo + ", info:  " + info);
    return { minLen: minLen, minPos: minPos, info: info, minPointInfo: minPointInfo };
    },
    DebugJudgeInfo(playerPosition, nodePosition, minLen, minPos) {
    // cc.log("玩家传入的点：" + playerPosition.x + "," + playerPosition.y);
    // cc.log("节点坐标" + nodePosition.x + "," + nodePosition.y);
    // cc.log("最小距离" + minLen);
    // cc.log("最靠近的坐标" + nodePosition.x + "," + nodePosition.y);
    },
    // update (dt) {},
});
