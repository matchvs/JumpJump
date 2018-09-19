var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        Game.BulletManager = this;
        this.BrickName = {
            box1: "Box1",
            box2: "Box2",
            box3: "Box3",
            box4: "Box4",
            box5: "Box5",
            box6: "Box6",
            box7: "Box7",
            box8: "Box8",
            box9: "Box9",
            box10: "Box10",
        }
        this.BrickWeight = {
            box1: 0,
            box2: 1,
            box3: 2,
            box4: 3,
            box5: 4,
            box6: 5,
            box7: 6,
            box8: 7,
            box9: 8,
            box10: 9,
            MaxNumber: 10
        }
        this.m_brickObj = [
            { Name: "prefab/Box1", IsLoaded: false },
            { Name: "prefab/Box2", IsLoaded: false },
            { Name: "prefab/Box3", IsLoaded: false },
            { Name: "prefab/Box4", IsLoaded: false },
            { Name: "prefab/Box5", IsLoaded: false },
            { Name: "prefab/Box6", IsLoaded: false },
            { Name: "prefab/Box7", IsLoaded: false },
            { Name: "prefab/Box8", IsLoaded: false },
            { Name: "prefab/Box9", IsLoaded: false },
            { Name: "prefab/Box10", IsLoaded: false },
        ];
        this.m_brickSize = [0, 1];
        this.m_brickPrefab = {};
        this.m_brickGameList = [];
        this.m_brickPoolList = {};
        //方块字段
        this.m_firstBrickEntity = null;
        this.m_currentBrickEntity = null;
        this.m_nRightDirection = 1;
        this.m_nLeftDirection = -1;
        this.m_nBrickInstanceMinX = 230;
        this.m_nBrickInstanceMaxX = 300;
        this.m_nPlayerToScreenMinY = 800; //屏幕移动后和玩家的高度差
        this.m_nBrickCount = 0;
        this.m_nTestCubeInstance = 0;
        this.m_nRecoveryBrickCount = 0;
        this.m_fAngle = null;
        this.m_currentBrickPosition = null;
    },
    IsPrefabLoaded() {
        let tempBool = true;
        for (let i = 0; i < this.m_brickObj.length; i++) {
            tempBool = tempBool && this.m_brickObj[i].IsLoaded;
        }
        return tempBool;
    },
    FirstBrickPosition() {
        return new cc.Vec2(-151, -460);
    },
    SecondBrickPosition() {
        return new cc.Vec2(160, -302);
    },
    //初始化
    Init() {
    for (let i = 0; i < this.m_brickObj.length; i++) {
        this.LoadBrickPrefab(this.m_brickObj[i]);
    }
    console.log("初始化")
    this.m_fAngle = null;
    this.m_currentBrickPosition = null;
    },
//初始生成方块
InitInstanceBrick() {
    let brick1 = this.GetBrick(this.BrickName.box1);
    let BrickEntity1 = brick1.getComponent("brickEntity");
    brick1.setPosition(this.FirstBrickPosition());
    let brick2 = this.GetBrick(this.BrickName.box1);
    brick2.setSiblingIndex(0);
    let BrickEntity2 = brick2.getComponent("brickEntity");
    brick2.setPosition(this.SecondBrickPosition());
    BrickEntity1.direction = 1;
    BrickEntity1.nextBrick = BrickEntity2;
    this.m_currentBrickPosition = this.SecondBrickPosition();
    this.m_currentBrickEntity = BrickEntity2;
    this.m_firstBrickEntity = BrickEntity1;
},
//生成方块
InstanceBrick(brickCount, randomBrick, randomSize, randomDirection, randomPosition) {
    if (null != brickCount) {
        if (this.m_nBrickCount >= brickCount)
            return;
    }
    // let brick:cc.Node = null//this.GetBrick(BrickName.cube);
    //下一个方块坐标
    //let nextBrickPosition:cc.Vec2 = this.FirstBrickPosition;
    //下一个方块名字
    // let random_brick:number = BrickWeight.blackCube;
    //下一个方块尺寸
    // let random_size:number = 0;
    //下一个方块方向
    //let random_direction:number = 1;
    //下一个方块名字
    // console.log(random_brick)
    let random_brick = null == randomBrick ? Game.GameUtility.GetRandomRoundInt(0, 100) : randomBrick;
    //下一个方块尺寸
    let random_size = null == randomSize ? Game.GameUtility.GetRandomRoundInt(0, 100) : randomSize;
    //下一个方块方向
    let random_direction = null == randomDirection ? this.RandomDirection() : randomDirection;
    //下一个方块坐标
    let nextBrickPosition = null == randomPosition ? this.GetNextPosition(random_direction) : randomPosition;
    let brick = this.BrickFactory(random_brick, random_size);
    brick.setSiblingIndex(0);
    let nextBrickEntity = brick.getComponent("brickEntity");
    brick.setPosition(nextBrickPosition);
    nextBrickEntity.Drop();
    this.m_currentBrickEntity.direction = random_direction;
    this.m_currentBrickEntity.nextBrick = nextBrickEntity;
    this.m_currentBrickPosition = nextBrickPosition;
    this.m_currentBrickEntity = nextBrickEntity;
    this.m_nBrickCount++;
    Game.brick = random_brick;
    Game.dir = random_direction;
    Game.pos = nextBrickPosition;
    //GameNetWorkManager_1.GameNetWorkManager.GetInstance().SendGameData({ info: GlobalConfing_1.GlobalConfing.MessageId_InstanceBrick, brickCount: this.m_nBrickCount, randomBrick: random_brick, randomSize: random_size, randomDirection: random_direction, randomPosition: nextBrickPosition });
},
//回收对象
RecoveryBrick(playerPosition, recoveryCount = null) {
    if (this.m_brickGameList[0].position.y >= playerPosition.y)
        return;
    if (null == recoveryCount) {
        recoveryCount = 0;
        for (let i = 0; i < this.m_brickGameList.length; i++) {
            //cc.log("方块的坐标：" + this.m_brickGameList[i].position);
            if (this.m_brickGameList[i].position.y < playerPosition.y - this.m_nPlayerToScreenMinY) {
                recoveryCount++;
            }
            else {
                break;
            }
        }
        //GameNetWorkManager.GetInstance().SendGameData({info:GlobalConfing.MessageId_RecoveryBrick,playerPosition:playerPosition,recoveryCount:recoveryCount});
    }
    for (let i = 0; i < recoveryCount; i++) {
        let Obj = this.m_brickGameList.shift();
        let brickName = Obj.name;
        Obj.active = false;
        if (null != Obj) {
            let recoveryBrickEntity = Obj.getComponent(BrickEntity_1.default);
            recoveryBrickEntity.InitProperty();
            this.m_brickPoolList[brickName].push(Obj);
        }
        else {
            cc.log("回收的对象不存在");
        }
    }
    // cc.log("=======\\/GameList\\/=======")
    // cc.log(this.m_brickGameList)
    // cc.log("=======/\\GameList/\\=======")
    // cc.log("=======\\/PoolList\\/=======")
    // cc.log(this.m_brickPoolList)
    // cc.log("=======/\\PoolList/\\=======")
},
//获取第一个方块
GetFirstBrickEntity() {
    return this.m_firstBrickEntity;
},
//获取下一个生成位置
GetNextPosition(direction) {
    let random_x = Game.GameUtility.GetRandomRoundInt(this.m_nBrickInstanceMinX, this.m_nBrickInstanceMaxX);
    let x = random_x * direction;
    let y = random_x * this.m_fAngle;
    return new cc.Vec2(x + this.m_currentBrickEntity.GetMidPoint().x, y + this.m_currentBrickEntity.GetMidPoint().y);
},
//获取斜率
GetAngle() {
    return this.m_fAngle;
},
//正常得分
GetNormalScroe(pointInfo) {
    switch (pointInfo) {
        case Game.GlobalsConfig.PointInfo.Mid:
            return 2;
        default:
            return 1;
    }
},
//特殊得分
GetSpecialScore(brickName) {
    let score = 0;
    switch (brickName) {
        case this.BrickName.box5:
            score = 10;
            break;
        case this.BrickName.box8:
            score = 10;
            break;
        case this.BrickName.box10:
            score = 10;
            break;
        default:
            score = 0;
            break;
    }
    return score;
},
//加载预制体到内存中
LoadBrickPrefab(brickObj) {
    var self = this;
    cc.loader.loadRes(brickObj.Name, (err, Obj) => {
        if (null != err) {
            cc.log(err);
        }
        if (null == Obj) {
            cc.log("读取的" + brickObj.Name + "预制体不存在");
        }
        self.m_brickPrefab[Obj.name] = Obj;
        brickObj.IsLoaded = true;
    });
},
//从对象池获取Brick
GetBrick(brickName, size = 0) {
    let prefabName = brickName;
    if (size != 0) {
        prefabName = brickName + size.toString();
    }
    // cc.log("prefabName: "+ prefabName)
    if (null == this.m_brickPoolList[prefabName]) {
        this.m_brickPoolList[prefabName] = [];
    }
    let brickCount = this.m_brickPoolList[prefabName].length;
    let brick;
    if (brickCount > 0) {
        cc.log("从对象池中拿出");
        brick = this.m_brickPoolList[prefabName].shift();
    }
    else {
        if (null == this.m_brickPrefab[prefabName]) {
            cc.log("缓存的" + prefabName + "不存在");
        }
        else {
            brick = cc.instantiate(this.m_brickPrefab[prefabName]);
            brick.parent = uiFunc.findUI("uiGamePanel").getComponent("uiGamePanel").CubeRoot;
            this.SetAngle(brick);
        }
    }
    this.m_brickGameList.push(brick);
    brick.active = true;
    return brick;
},
//方块工厂模式
BrickFactory(randomBrick, randomSize) {
    let brickWeight = randomBrick % this.BrickWeight.MaxNumber; //this.m_nTestCubeInstance;
    let sizeWeight = randomSize % this.m_brickSize.length;
    let brickNode = null;
    switch (brickWeight) {
        case this.BrickWeight.box1:
            brickNode = this.GetBrick(this.BrickName.box1);
            break;
        case this.BrickWeight.box2:
            brickNode = this.GetBrick(this.BrickName.box2);
            break;
        case this.BrickWeight.box3:
            brickNode = this.GetBrick(this.BrickName.box3);
            break;
        case this.BrickWeight.box4:
            brickNode = this.GetBrick(this.BrickName.box4);
            break;
        case this.BrickWeight.box5:
            brickNode = this.GetBrick(this.BrickName.box5);
            break;
        case this.BrickWeight.box6:
            brickNode = this.GetBrick(this.BrickName.box6);
            break;
        case this.BrickWeight.box7:
            brickNode = this.GetBrick(this.BrickName.box7);
            break;
        case this.BrickWeight.box8:
            brickNode = this.GetBrick(this.BrickName.box8);
            break;
        case this.BrickWeight.box9:
            brickNode = this.GetBrick(this.BrickName.box9);
            break;
        case this.BrickWeight.box10:
            brickNode = this.GetBrick(this.BrickName.box10);
            break;
        default:
            cc.error("方块工厂出错");
            break;
    }
    // this.m_nTestCubeInstance ++;
    // this.m_nTestCubeInstance %= BrickWeight.MaxNumber;
    return brickNode;
},
DebugDirection(brick) {
    //cc.log(brick.direction);
    let nextBrick = brick.nextBrick;
    if (null != nextBrick)
        this.DebugDirection(nextBrick);
    return;
},
//设置方块斜率
SetAngle(brick) {
    let entity = brick.getComponent("brickEntity");
    entity.InitBrick();
    if (null == this.m_fAngle) {
        this.m_fAngle = entity.GetAngle();
    }
},
//随机生成方向
RandomDirection() {
    let randomNumber = Math.random();
    let direction;
    if (randomNumber < 0.5) {
        direction = this.m_nLeftDirection;
    }
    else {
        direction = this.m_nRightDirection;
    }
    return direction;
},
});
