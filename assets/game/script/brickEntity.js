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
        calculateNode:cc.Node,
        judgeNode:cc.Node,
        backgroundNode:cc.Node,
        shadowNode:cc.Node,
        AnimationClip:cc.AnimationClip
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //方向
        this.direction = 0;
        //下一个方块实体
        this.nextBrick = null;
        //中心点
        this.brickCenterPoint = null;
        //上顶点
        this.upPoint = null;
        //下顶点
        this.downPoint = null;
        //右顶点
        this.rightPoint = null;
        //左顶点
        this.leftPoint = null;
        //是否按压
        this.isPress = false;
        this.judgeRightNodeList = null;
        this.judgeLeftNodeList = null;
        this.bgEndPosition = null;
        this.sdEndPosition = null;
        this.defaultSprite = null;
        this.calculateNodeName = {
            upPoint: "up_point",
            downPoint: "down_point",
            rightPoint: "right_point",
            leftPoint: "left_point",
        };
        this.judgeNodeName = {
            mid: "mid",
            right_up: "right_up",
            left_up: "left_up",
            right_down: "right_down",
            left_down: "left_down",
            right_up_out: "right_up_out",
            left_up_out: "left_up_out",
            right_down_out: "right_down_out",
            left_down_out: "left_down_out",
        };
        this.gameMain=uiFunc.findUI("uiGamePanel").getComponent("uiGamePanel");
    },

    start () {

    },
    InitBrick() {
        this.upPoint = this.calculateNode.getChildByName(this.calculateNodeName.upPoint).position;
        this.downPoint = this.calculateNode.getChildByName(this.calculateNodeName.downPoint).position;
        this.rightPoint = this.calculateNode.getChildByName(this.calculateNodeName.rightPoint).position;
        this.leftPoint = this.calculateNode.getChildByName(this.calculateNodeName.leftPoint).position;
        this.bgEndPosition = this.backgroundNode.position;
        //this.PlayAnimation();
        this.InitJudgeArea();
    },
    //判断节点初始化
    InitJudgeArea() {
        if (this.node.name != "Cube" || "Cube1") {
            this.judgeNode.addChild(new cc.Node(this.judgeNodeName.right_down));
            this.judgeNode.addChild(new cc.Node(this.judgeNodeName.right_down_out));
            this.judgeNode.addChild(new cc.Node(this.judgeNodeName.left_up));
            this.judgeNode.addChild(new cc.Node(this.judgeNodeName.left_up_out));
            this.judgeNode.addChild(new cc.Node(this.judgeNodeName.right_up));
            this.judgeNode.addChild(new cc.Node(this.judgeNodeName.right_up_out));
            this.judgeNode.addChild(new cc.Node(this.judgeNodeName.left_down));
            this.judgeNode.addChild(new cc.Node(this.judgeNodeName.left_down_out));
        }
        if (null == this.judgeLeftNodeList) {
            this.judgeLeftNodeList = { [this.judgeNodeName.right_down_out]: null, [this.judgeNodeName.right_down]: null, [this.judgeNodeName.mid]: null, [this.judgeNodeName.left_up]: null, [this.judgeNodeName.left_up_out]: null };
            this.judgeLeftNodeList[this.judgeNodeName.mid] = judgrCenterPoint;
            this.judgeLeftNodeList[this.judgeNodeName.right_down] = this.judgeNode.getChildByName(this.judgeNodeName.right_down);
            this.judgeLeftNodeList[this.judgeNodeName.right_down_out] = this.judgeNode.getChildByName(this.judgeNodeName.right_down_out);
            this.judgeLeftNodeList[this.judgeNodeName.left_up] = this.judgeNode.getChildByName(this.judgeNodeName.left_up);
            this.judgeLeftNodeList[this.judgeNodeName.left_up_out] = this.judgeNode.getChildByName(this.judgeNodeName.left_up_out);
        }
        if (null == this.judgeRightNodeList) {
            var judgrCenterPoint = this.judgeNode.getChildByName(this.judgeNodeName.mid);
            this.judgeRightNodeList = { [this.judgeNodeName.left_down_out]: null, [this.judgeNodeName.left_down]: null, [this.judgeNodeName.mid]: null, [this.judgeNodeName.right_up]: null, [this.judgeNodeName.right_up_out]: null };
            this.judgeRightNodeList[this.judgeNodeName.mid] = judgrCenterPoint;
            this.judgeRightNodeList[this.judgeNodeName.right_up] = this.judgeNode.getChildByName(this.judgeNodeName.right_up);
            this.judgeRightNodeList[this.judgeNodeName.right_up_out] = this.judgeNode.getChildByName(this.judgeNodeName.right_up_out);
            this.judgeRightNodeList[this.judgeNodeName.left_down] = this.judgeNode.getChildByName(this.judgeNodeName.left_down);
            this.judgeRightNodeList[this.judgeNodeName.left_down_out] = this.judgeNode.getChildByName(this.judgeNodeName.left_down_out);
        }
        this.InitJudge();
    },
    InitJudge() {
        if (null != this.brickCenterPoint) {
            return;
        }
        this.brickCenterPoint = new cc.Vec2((this.rightPoint.x + this.leftPoint.x) / 2, (this.upPoint.y + this.downPoint.y) / 2);
        let graphCenterPoint = this.PosToJudgeNode(this.brickCenterPoint);
        let midNode = this.judgeRightNodeList[this.judgeNodeName.mid];
        //图形中心点与判断的中心点的高度差
        let hightValue = midNode.position.y - graphCenterPoint.y;
        //右左斜率
        let right_slope = this.GetSlope(this.rightPoint, this.downPoint);
        let left_slope = this.GetSlope(this.leftPoint, this.downPoint);
        //过图形中心的两线
        let right_line = { point: graphCenterPoint, k: right_slope };
        let left_line = { point: graphCenterPoint, k: left_slope };
        //方块外围的四条线
        let right_up_line = { point: this.PosToJudgeNode(this.upPoint), k: right_slope };
        let right_down_line = { point: this.PosToJudgeNode(this.downPoint), k: right_slope };
        let left_up_line = { point: this.PosToJudgeNode(this.upPoint), k: left_slope };
        let left_down_line = { point: this.PosToJudgeNode(this.downPoint), k: left_slope };
        //过图形中心的两线与方块外围的四条线的交点
        let rightUpIntersect = Game.GameStand.GetLineIntersectToPointAndSlope(right_line, left_up_line);
        let leftDownIntersect = Game.GameStand.GetLineIntersectToPointAndSlope(right_line, left_down_line);
        let rightDownIntersect = Game.GameStand.GetLineIntersectToPointAndSlope(left_line, right_down_line);
        let leftUpIntersect = Game.GameStand.GetLineIntersectToPointAndSlope(left_line, right_up_line);
        this.SetJudgeNodeShakePosition(hightValue, rightUpIntersect, leftDownIntersect, rightDownIntersect, leftUpIntersect);
        this.SetJudgeNodeStandPosition(hightValue, graphCenterPoint, rightUpIntersect, leftDownIntersect, rightDownIntersect, leftUpIntersect);
    },
    //初始化属性，方向，下一个方块
    InitProperty() {
        this.direction = 0;
        this.nextBrick = null;
        this.node.active = false;
        // this.StopAnimation();
    },
    //方块掉落
    Drop() {
        //方块掉落
        this.backgroundNode.y = this.backgroundNode.position.y + uiFunc.findUI("uiGamePanel").getComponent("uiGamePanel").GameRoot.height;
        let move = cc.moveTo(0.3, this.bgEndPosition);
        let move2 = cc.moveTo(0.1, new cc.Vec2(this.bgEndPosition.x, this.bgEndPosition.y + 20));
        let move3 = cc.moveTo(0.1, this.bgEndPosition);
        let shake1 = cc.rotateTo(0.05, 2);
        let shake2 = cc.rotateTo(0.05, -2);
        let shake3 = cc.rotateTo(0.05, 0);
        this.backgroundNode.runAction(cc.sequence(move, move2, shake1, move3, shake2, shake3));
        if (null != this.shadowNode) {
            this.shadowNode.scale = 0;
            //阴影缩放
            let scale1 = cc.scaleTo(0.2, 1, 1);
            let scale2 = cc.scaleTo(0.1, 0.9, 0.9);
            let scale3 = cc.scaleTo(0.05, 1, 1);
            this.shadowNode.runAction(cc.sequence(scale1, scale2, shake1, scale3, shake2, shake3));
        }
    },
    //播放动画
    PlayAnimation() {
        if (null != this.AnimationClip) {
            this.defaultSprite = this.AnimationClip.node.getComponent(cc.Sprite).spriteFrame;
            this.AnimationClip.play();
        }
    },
    //停止动画
    StopAnimation() {
        if (null != this.AnimationClip) {
            this.AnimationClip.stop();
            this.AnimationClip.node.getComponent(cc.Sprite).spriteFrame = this.defaultSprite;
        }
    },
    GetBrickName() {
        return this.node.name;
    },
    GetMidPoint() {
        return this.CalculateNodePosition(this.judgeRightNodeList[this.judgeNodeName.mid].getPosition());
    },
    GetRightUpPoint() {
        return this.CalculateNodePosition(this.judgeRightNodeList[this.judgeNodeName.right_up].getPosition());
    },
    GetRightUpOutPoint() {
        return this.CalculateNodePosition(this.judgeRightNodeList[this.judgeNodeName.right_up_out].getPosition());
    },
    GetLeftDownPoint() {
        return this.CalculateNodePosition(this.judgeRightNodeList[this.judgeNodeName.left_down].getPosition());
    },
    GetLeftDownOutPoint() {
        return this.CalculateNodePosition(this.judgeRightNodeList[this.judgeNodeName.left_down_out].getPosition());
    },
    GetRightDownPoint() {
        return this.CalculateNodePosition(this.judgeLeftNodeList[this.judgeNodeName.right_down].getPosition());
    },
    GetRightDownOutPoint() {
        return this.CalculateNodePosition(this.judgeLeftNodeList[this.judgeNodeName.right_down_out].getPosition());
    },
    GetLeftUpPoint() {
        return this.CalculateNodePosition(this.judgeLeftNodeList[this.judgeNodeName.left_up].getPosition());
    },
    GetLeftUpOutPoint() {
        return this.CalculateNodePosition(this.judgeLeftNodeList[this.judgeNodeName.left_up_out].getPosition());
    },
    GetLeftUpOut() {
        let out_X = this.GetLeftUpOutPoint().x - 5;
        let out_Y = this.CalculateOutPoint(out_X, this.GetLeftUpOutPoint(), this.GetRightDownOutPoint());
        return new cc.Vec2(out_X, out_Y);
    },
    GetRightDownOut() {
        let out_X = this.GetRightDownOutPoint().x + 5;
        let out_Y = this.CalculateOutPoint(out_X, this.GetLeftUpOutPoint(), this.GetRightDownOutPoint());
        return new cc.Vec2(out_X, out_Y);
    },
    GetLeftDownOut() {
        let out_X = this.GetLeftUpOutPoint().x - 5;
        let out_Y = this.CalculateOutPoint(out_X, this.GetRightUpOutPoint(), this.GetLeftDownOutPoint());
        return new cc.Vec2(out_X, out_Y);
    },
    GetRightUpOut() {
        let out_X = this.GetRightUpOutPoint().x + 5;
        let out_Y = this.CalculateOutPoint(out_X, this.GetRightUpOutPoint(), this.GetLeftDownOutPoint());
        return new cc.Vec2(out_X, out_Y);
    },
    //获取向右跳的判断点节点
    GetJumpRightList() {
        let pointList = [];
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetLeftDownOutPoint()), info: Game.GlobalsConfig.PointInfo().LeftDownOut });
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetLeftDownPoint()), info: Game.GlobalsConfig.PointInfo().LeftDownOut });
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetMidPoint()), info: Game.GlobalsConfig.PointInfo().Mid });
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetRightUpPoint()), info: Game.GlobalsConfig.PointInfo().RightUp });
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetRightUpOutPoint()), info: Game.GlobalsConfig.PointInfo().RightUpOut });
        return pointList;
    },
    //获取向左跳的判断点节点
    GetJumpLeftList() {
        let pointList = [];
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetRightDownOutPoint()), info: Game.GlobalsConfig.PointInfo().RightDownOut });
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetRightDownPoint()), info: Game.GlobalsConfig.PointInfo().RightDown });
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetMidPoint()), info: Game.GlobalsConfig.PointInfo().Mid });
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetLeftUpPoint()), info: Game.GlobalsConfig.PointInfo().LeftUp });
        pointList.push({ position: this.gameMain.GameRoot.convertToNodeSpace(this.GetLeftUpOutPoint()), info: Game.GlobalsConfig.PointInfo().LeftUpOut });
        return pointList;
    },
    //获取斜率
    GetAngle() {
        let y = this.rightPoint.y - this.downPoint.y;
        let x = this.rightPoint.x - this.downPoint.x;
        return y / x;
    },
    //获取在gameRoot的中心点
    // GetCenterPoint():cc.Vec2
    // {
    //     let nodePosition = GameMain.GetInstance().GameRoot.convertToNodeSpace(this.node.position);
    //     let x = nodePosition.x + this.brickCenterPoint.x;
    //     let y = nodePosition.y + this.brickCenterPoint.y;
    //     return new cc.Vec2(x,y);
    // }
    // //获取中心点到左右顶点距离
    // GetLength():number
    // {
    //     let x = this.rightPoint.x - this.leftPoint.x;
    //     return x/2;
    // }
    //获取方向和下一个方块
    GetInfo() {
        let direction = this.direction;
        let nextCube = this.nextBrick;
        return { direction, nextCube };
    },
    //方块被按下
    PressStart() {
        this.shadowNode.runAction(cc.scaleTo(1, 1, 0.9));
        this.backgroundNode.runAction(cc.scaleTo(1, 1, 0.9));
    },
    //方块被抬起
    PressEnd() {
        this.backgroundNode.stopAllActions();
        this.shadowNode.stopAllActions();
        let scale1 = cc.scaleTo(0.1, 1, 1.05);
        let scale2 = cc.scaleTo(0.05, 1, 0.95);
        let scale3 = cc.scaleTo(0.05, 1, 1);
        let seq = cc.sequence(scale1, scale2, scale3);
        this.backgroundNode.runAction(seq);
        let shaweScale1 = cc.scaleTo(0.1, 1, 1.05);
        let shaweScale2 = cc.scaleTo(0.05, 1, 0.95);
        let shaweScale3 = cc.scaleTo(0.05, 1, 1);
        let seq1 = cc.sequence(shaweScale1, shaweScale2, shaweScale3);
        this.shadowNode.runAction(seq1);
    },
    //取斜率
    GetSlope(pos1, pos2) {
        let x = pos1.x - pos2.x;
        let y = pos1.y - pos2.y;
        return y / x;
    },
    //坐标相加
    PosAdd(pos1, pos2) {
        let x = pos1.x + pos2.x;
        let y = pos1.y + pos2.y;
        return new cc.Vec2(x, y);
    },
    //坐标相减
    PosSub(pos1, pos2) {
        let x = pos1.x - pos2.x;
        let y = pos1.y - pos2.y;
        return new cc.Vec2(x, y);
    },
    //两点的中点
    PosCenter(pos1, pos2, x_offset = 0, y_offset = 0) {
        let x = pos1.x + pos2.x;
        let y = pos1.y + pos2.y;
        return new cc.Vec2(x / 2 + x_offset, y / 2 + y_offset);
    },
    PosToJudgeNode(position) {
        return this.PosSub(this.PosAdd(position, this.calculateNode.position), this.judgeNode.position);
    },
    //设置判断节点坐标
    SetJudgeNodeShakePosition(hightValue, rightUpIntersect, leftDownIntersect, rightDownIntersect, leftUpIntersect) {
        //四个摇晃点
        let rightUpOutPoint = new cc.Vec2(rightUpIntersect.x, rightUpIntersect.y + hightValue);
        let LeftDownOutPoint = new cc.Vec2(leftDownIntersect.x, leftDownIntersect.y + hightValue);
        let rightDownOutPoint = new cc.Vec2(rightDownIntersect.x, rightDownIntersect.y + hightValue);
        let LeftUpOutPoint = new cc.Vec2(leftUpIntersect.x, leftUpIntersect.y + hightValue);
        this.judgeRightNodeList[this.judgeNodeName.right_up_out].setPosition(rightUpOutPoint);
        this.judgeRightNodeList[this.judgeNodeName.left_down_out].setPosition(LeftDownOutPoint);
        this.judgeLeftNodeList[this.judgeNodeName.right_down_out].setPosition(rightDownOutPoint);
        this.judgeLeftNodeList[this.judgeNodeName.left_up_out].setPosition(LeftUpOutPoint);
    },
    SetJudgeNodeStandPosition(hightValue, graphCenterPosition, rightUpIntersect, leftDownIntersect, rightDownIntersect, leftUpIntersect) {
        //四个站立点
        let rightUpPoint = this.PosCenter(graphCenterPosition, rightUpIntersect, 0, hightValue);
        let LeftDownPoint = this.PosCenter(graphCenterPosition, leftDownIntersect, 0, hightValue);
        let rightDownPoint = this.PosCenter(graphCenterPosition, rightDownIntersect, 0, hightValue);
        let LeftUpPoint = this.PosCenter(graphCenterPosition, leftUpIntersect, 0, hightValue);
        this.judgeRightNodeList[this.judgeNodeName.right_up].setPosition(rightUpPoint);
        this.judgeRightNodeList[this.judgeNodeName.left_down].setPosition(LeftDownPoint);
        this.judgeLeftNodeList[this.judgeNodeName.right_down].setPosition(rightDownPoint);
        this.judgeLeftNodeList[this.judgeNodeName.left_up].setPosition(LeftUpPoint);
    },
    //计算节点在父级位置
    CalculateNodePosition(position) {
        let x = this.node.x + position.x + this.judgeNode.x;
        let y = this.node.y + position.y + this.judgeNode.y;
        return new cc.Vec2(x, y);
    },
    //计算掉落点的y坐标
    CalculateOutPoint(out_X, upPoint, downPoint) {
        let x = upPoint.x - downPoint.x;
        let y = upPoint.y - downPoint.y;
        let k = y / x;
        return k * (out_X - downPoint.x) + downPoint.y;
    }
    // update (dt) {},
});
