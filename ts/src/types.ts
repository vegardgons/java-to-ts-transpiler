// YOU ARE NOT SUPPOSED TO MODIFY THIS FILE.
export type AstNode = Expr;

export type Expr = Additive | Multiplicative | PrimitiveExpr;

export type PrimitiveExpr = PhysicalUnit | Constant | GroupExpr;

export type Operator = OpMulDiv | OpAddSub;

type NodeType =
    | "Multiplicative"
    | "Additive"
    | "OpAddSub"
    | "OpMulDiv"
    | "Constant"
    | "PhysicalUnit"
    | "GroupExpr";

export interface NodeBase {
    nodeType: NodeType;
}

export interface OpMulDiv extends NodeBase {
    nodeType: "OpMulDiv";
    value: "*" | "/";
}

export interface OpAddSub extends NodeBase {
    value: "+" | "-";
}

export interface GroupExpr extends NodeBase {
    subExpr: Expr;
}

export interface Constant extends NodeBase {
    val: number;
}

export interface Additive extends NodeBase {
    left: PrimitiveExpr | Multiplicative | Additive;
    op: Operator;
    right: PrimitiveExpr | Multiplicative;
}

export interface Multiplicative extends NodeBase {
    left: PrimitiveExpr | Multiplicative;
    op: Operator;
    right: PrimitiveExpr;
}

export interface PhysicalUnit extends NodeBase {
    kind: UnitEnum;
}


export type UnitValues = Time | Distance | Velocity;

export enum UnitEnum {
    Time = "s",
    Distance = "m",
    Velocity = "m/s",
    Constant = "constant"
}

export type Time = "min" | "s" | "h";

export type Distance = "m" | "km";

export type Velocity = "km/h" | "km/s" | "km/min" | "m/h" | "m/s" | "m/min";
