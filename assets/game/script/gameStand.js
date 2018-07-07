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
        Game.GameStand = this;
    },

    start () {

    },
    GetLinePoint(point1, point2, need_X) {
        let y = point2.y - point1.y;
        let x = point2.x - point1.x;
        let k = y / x;
        let need_Y = k * (need_X - point1.x) + point1.y;
        return new cc.Vec2(need_X, need_Y);
    },
    //直线公式(点斜式)(point1,point2 直线上的两点 ，need_X 需要的点的X坐标)
    GetLinePointForSlope(point, k, need_X) {
        let need_Y = k * (need_X - point.x) + point.y;
        return new cc.Vec2(need_X, need_Y);
    },
    //两线相交求结点(都是两点式    )
    GetLineIntersectToTwoPoint(line1, line2) {
        let k1 = (line1.point2.y - line1.point1.y) / (line1.point2.x - line1.point1.x);
        let temp_line1 = { point: line1.point1, k: k1 };
        return this.GetLineIntersectToMixture(temp_line1, line2);},
    //两线相交求结点(混合式)
    GetLineIntersectToMixture(line1, line2) {
        let k2 = (line2.point2.y - line2.point1.y) / (line2.point2.x - line2.point1.x);
        let temp_line2 = { point: line2.point1, k: k2 };
        return this.GetLineIntersectToPointAndSlope(line1, temp_line2);},
    //两线相交求结点(都是点斜式)
    GetLineIntersectToPointAndSlope(line1, line2) {
        let x1 = line1.point.x, y1 = line1.point.y;
        let x2 = line2.point.x, y2 = line2.point.y;
        let k1 = line1.k;
        let k2 = line2.k;
        //  y1 - y2 - k1 * x2 + k1 *x1
        let temp1 = y1 - y2 - k2 * x2 + k1 * x1;
        //k2 - k1
        let temp2 = k2 - k1;
        let x = temp1 / temp2;
        let y = k1 * (x - line1.point.x) + line1.point.y;
        return new cc.Vec2(x, y);},
    //椭圆公式 取需要的点的正Y坐标（centerPoint 是椭圆的中心点 ，xSemiaxis 是x轴上的半轴 ，ySemiaxis 是y轴上的半轴 ，need_X 需要的点的X坐标）
    GetEllipsePoint(centerPoint, xSemiaxis, ySemiaxis, need_X) {
        let a, b = null;
        let h = centerPoint.x;
        let k = centerPoint.y;
        if (xSemiaxis > ySemiaxis) {
            a = xSemiaxis;
            b = ySemiaxis;} else {
            b = xSemiaxis;
            a = ySemiaxis;}let need_Y = Math.sqrt(Math.pow(b, 2) - Math.pow(b / a * (need_X - h), 2)) + k;
        return need_Y;},
    // //椭圆与直线相交求节点(直线是两点式)
    // public static GetEllipseIntersectToTwoPoint(ellipse:{centerPoint:cc.Vec2,xSemiaxis:number,ySemiaxis:number},line:{point1:cc.Vec2,point2:cc.Vec2}):{rightPoint:cc.Vec2,leftPoint:cc.Vec2}
    // {
    //     let k = (line.point2.y - line.point1.y)/(line.point2.x - line.point1.x)
    //     let temp_line = {point:line.point1,k:k};
    //     return this.GetEllipseIntersectToPointAndSlope(ellipse,temp_line);
    // }
    //椭圆与直线相交求节点(直线是点斜式)
    GetEllipseIntersectToPointAndSlope(ellipse, line_k) {
        //m,n 为长短半轴
        let m = ellipse.xSemiaxis > ellipse.ySemiaxis ? ellipse.xSemiaxis : ellipse.ySemiaxis;
        let n = ellipse.xSemiaxis + ellipse.ySemiaxis - m;
        let x_center = ellipse.centerPoint.x;
        let y_center = ellipse.centerPoint.y;
        let tempSqrt = Math.sqrt((m * m * n * n) / (n * n + m * m * line_k * line_k));
        let x1 = x_center + tempSqrt;
        let y1 = line_k * (x1 - x_center) + y_center;
        let x2 = x_center - tempSqrt;
        let y2 = line_k * (x2 - x_center) + y_center;
        let right_point = null;
        let left_point = null;
        if (x1 > x2) {
            right_point = new cc.Vec2(x1, y1);
            left_point = new cc.Vec2(x2, y2);
        } else {
            left_point = new cc.Vec2(x1, y1);
            right_point = new cc.Vec2(x2, y2);
        }
            return { rightPoint: right_point, leftPoint: left_point };
    },
    // update (dt) {},
});
