cc.Class({
    extends: cc.Component,

    properties: {
        selfNode: cc.Node,
        rivalNode: cc.Node,
    },

    onLoad() {
        Game.PlayerManager = this;
        this.gameStartTime = 0;
        this.gameEndTime = 0;
        this.isMyRoll = true; // 主机
        this.isReportFinished = false;
        this.disTime = 0;
        this.m_PlayerPrefabPath = "prefab/player";
        this.m_PlayerPrefabPath2 = "prefab/player2";
        this.m_listSigns = null;
        this.m_listPlayers = null;
        this.m_listPlayersLength = 0;
        this.m_nPlayersCount = 0;
        this.m_PlayerPrefab = null;
        //this.self = this.selfNode.getComponent("player");
        //this.self.init(GLB.playerUserIds[0]);
        //this.rival = this.rivalNode.getComponent("player");
        //this.rival.init(GLB.playerUserIds[1]);
    },
    PlayerCount() {
        return this.m_nPlayersCount;
    },
    CurrentPlayerXDistance() {
        return this.m_listPlayers[1].XDistance;
    },
    CurrentPlayerPosXDistance() {
        return this.GetPlayerPosXDistance(1);
    },
    GetPlayerPosXDistance(id) {
        return this.m_listPlayers[id].GetPosXDistance();
    },
GetOnePlayerScore(id) {
    if (null != this.m_listPlayers[id]) {
        return this.m_listPlayers[id].Score;
    }
},
GetHeighScorePlayer() {
    let result = { id: 1, score: this.GetOnePlayerScore(1) };
    if (result.score < this.GetOnePlayerScore(2)) {
        result = { id: 2, score: this.GetOnePlayerScore(2) };
    }
    return result;
},
AddOnePlayerScore(id, point) {
    if (null != this.m_listPlayers[id]) {
        this.m_listPlayers[id].AddScore(point);
    }
},
SetOnePlayerScore(id, point) {
    if (null != this.m_listPlayers[id]) {
        this.m_listPlayers[id].SetScore(point);
    }
},
ReducePlayerScore(id, point) {
    if (null != this.m_listPlayers[id]) {
        this.m_listPlayers[id].ReduceScore(point);
    }
},
 CurrentPlayerPos() {
    return this.m_listPlayers[1].PlayerCurrentPos;
},
GetOnePlayerPos(id) {
    return this.m_listPlayers[id].PlayerCurrentPos;
},
 CurrentPlayerDiPos() {
    return this.GetOnePlayerDiPos(1);
},
GetOnePlayerDiPos(id) {
    return this.m_listPlayers[id].CurrentPlayerDiPos;
},
 CurrentPlayCurrentBrick() {
    return this.GetOnePlayerCurrentBrick(1);
},
GetOnePlayerCurrentBrick(id) {
    return this.m_listPlayers[id].CurrentPlayerCube;
},
 CurrentPlayerCurrnetBricks(brick) {
    this.SetOnePlayerCurrentBrick(1, brick);
},
SetOnePlayerCurrentBrick(id, brick) {
    this.m_listPlayers[id].CurrentPlayerCube = brick;
},
SetOnePlayerPos(id, pos) {
    if (null != this.m_listPlayers[id]) {
        this.m_listPlayers[id].PlayerCurrentPos = pos;
    }
},
GetPlayerEntity(id) {
    return this.m_listPlayers[id];
},
GetCurrentPlayerEntity() {
    return this.GetPlayerEntity(1);
},
OnePlayerJump(id, pos, needSynchronize = true) {
    if (id == 1) {
        this.m_listPlayers[1].AddPlayerJumpList(pos, needSynchronize);
    }
    else {
        if (this.m_listPlayers[2].IsAI == false) {
            this.m_listPlayers[2].AddPlayerJumpList(pos, needSynchronize);
        }
        else {
            //    this.m_listPlayers[2].PlayerJump(pos,false);
            this.m_listPlayers[2].AIJump();
        }
    }
},
GetMinYPlayerPos() {
    let nodePos = this.m_listPlayers[1].node.position;
    if (this.m_listPlayers[2].node.position.y < nodePos.y) {
        nodePos = this.m_listPlayers[2].node.position;
    }
    return nodePos;
},
GetPlayerDecideNumber() {
    if (null == this.m_listPlayers[1]) {
        return null;
    }
    return this.m_listPlayers[1].DecideNumber;
},
RandomPlayerDecideNumber() {
    let temp = Math.random() * 1000;
    this.m_listPlayers[1].DecideNumber = temp;
    return temp;
},
GetSettimeoutWaittingUI() {
    if (null == this.m_listPlayers[1]) {
        return null;
    }
    return this.m_listPlayers[1].SettimeoutWaittingUI;
},
SetSettimeoutWaittingUI(data) {
    if (null == this.m_listPlayers[1]) {
        return;
    }
    this.m_listPlayers[1].SettimeoutWaittingUI = data;
},
GetIsHost() {
    //return this.m_listPlayers[1].IsHost;
},
SetIsHost(ishost) {
    this.m_listPlayers[1].IsHost = ishost;
},
ChangePlayerDir() {
    this.m_listPlayers[1].ChangeDir();
    this.m_listPlayers[2].ChangeDir();
},
Init() {
    var self = this;
    self.m_listPlayers = {};
    self.m_listSigns = {};
    self.m_listPlayersLength = 0;
    self.m_nPlayersCount = 0;
},
AddOnePlayer(id, pos, currentCube, AILevel = null) {
    cc.loader.loadRes(this.m_PlayerPrefabPath, (err, Obj) => {
        if (err != null) {
            cc.log(err);
        }
        if (null == Obj) {
            cc.log("读取的" + this.m_PlayerPrefabPath + "预制体不存在");
        }
        this.m_PlayerPrefab = Obj;
        let objPlayer = cc.instantiate(this.m_PlayerPrefab);
        objPlayer.parent = uiFunc.findUI("uiGamePanel").getComponent("uiGamePanel").CubeRoot;
        objPlayer.parent.parent.on(cc.Node.EventType.TOUCH_START,function () {
            objPlayer.getComponent("playerEntity").BePress();
        },this);
        objPlayer.parent.parent.on(cc.Node.EventType.TOUCH_END,function () {
            objPlayer.getComponent("playerEntity").PressEnd();
        },this);
        let tempPlayerEntity = objPlayer.getComponent("playerEntity");
        tempPlayerEntity.Init(id, pos, currentCube, AILevel);
        this.m_listPlayersLength += 1;
        this.m_nPlayersCount += 1;
        //this.m_listSigns[this.m_listPlayersLength] = id; //记录玩家id对应字典第几个
        //this.m_listPlayers[id] = tempPlayerEntity;
        if (id != 1) {
            tempPlayerEntity.TurnTranslucent(true);
        }
    });
},
    AddOnePlayer2(id, pos, currentCube, AILevel = null) {
        cc.loader.loadRes(this.m_PlayerPrefabPath2, (err, Obj) => {
            if (err != null) {
                cc.log(err);
            }
            if (null == Obj) {
                cc.log("读取的" + this.m_PlayerPrefabPath2 + "预制体不存在");
            }
            this.m_PlayerPrefab = Obj;
            let objPlayer = cc.instantiate(this.m_PlayerPrefab);
            objPlayer.parent = uiFunc.findUI("uiGamePanel").getComponent("uiGamePanel").CubeRoot;
            let tempPlayerEntity = objPlayer.getComponent("playerEntity");
            Game.player2 = tempPlayerEntity;
            tempPlayerEntity.Init(id, pos, currentCube, AILevel);
            this.m_listPlayersLength += 1;
            this.m_nPlayersCount += 1;
            //this.m_listSigns[this.m_listPlayersLength] = id; //记录玩家id对应字典第几个
            //this.m_listPlayers[id] = tempPlayerEntity;
            if (id != 1) {
                tempPlayerEntity.TurnTranslucent(true);
            }
        });
    },
RemoveAllPlayer() {
    if (this.m_listPlayersLength > 0) {
        for (let key = 1; key <= this.m_listPlayersLength; key++) {
            this.m_listPlayers[key].DestroySelf();
        }
        this.m_listPlayers = {};
        this.m_listSigns = {};
        this.m_listPlayersLength = 0;
        this.m_nPlayersCount = 0;
    }
},
RemoveOnePlayer(id) {
    if (null != this.m_listPlayers[id]) {
        this.m_listPlayers[id].DestroySelf();
        this.m_listPlayers[id] = null;
        this.m_nPlayersCount -= 1;
    }
},
    MoveOnePlayer(id, fMoveXDistance) {
        if (null != this.m_listPlayers[id]) {
            this.m_listPlayers[id].XDistance = fMoveXDistance;
            this.m_listPlayers[id].PlayerJump();
        }
    },
    MoveOthersPlayer(listOthersMove) {
        for (let key = 1; key <= this.m_listPlayersLength; key++) {
            if (null != listOthersMove[this.m_listSigns[key]]) {
                this.MoveOnePlayer(this.m_listSigns[key], listOthersMove[this.m_listSigns[key]]);
            }
       }
    },
OnePlayerDie(id, needShake) {
    this.m_listPlayers[id].PlayerDie(needShake);
},
EventCurrentPlayerBePress() {
    this.m_listPlayers[1].BePress();
},
EventCurrentPlayerPressEnd() {
    this.m_listPlayers[1].PressEnd();
},
Random(upper, lower) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
},
random(lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
},
});
