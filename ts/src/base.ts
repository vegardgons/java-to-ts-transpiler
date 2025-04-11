import {Additive, AstNode, Multiplicative, PhysicalUnit} from "./types";
import {Tokenizer} from "./tokenizer";
import {parseExpression} from "./parser";

class Unit {
    constructor(public kind: string, public val: number) {
    }
}

const unitScale = {
    m: 1,
    km: 1000,
    s: 1,
    min: 60,
    h: 3600,
}

function baseValue(unit: Unit): number {
    return unitScale[unit.kind] * unit.val;
}

function inferUnitKind(expr: string): string {
    const tokenizer = new Tokenizer(expr);
    const tokens = tokenizer.tokenize();
    const ast = parseExpression(tokens);
    const unit = traverseAST(ast);
    if (!unit) {
        throw new Error("Units are not compatible");
    }
    return unit;
}

function traverseAST(ast: AstNode): string | null {
    if (ast.nodeType === "Additive") {
        const additive = ast as Additive;
        const left = traverseAST(additive.left);
        const right = traverseAST(additive.right);
        if (!left || !right) return null;
        if (["m", "km"].includes(right)) return "m";
        if (["min", "h", "s"].includes(right)) return "s";
        if (["m", "km"].includes(left)) return "m";
        if (["min", "h", "s"].includes(left)) return "s";
        return left;
    }
    if (ast.nodeType === "Multiplicative") {
        const multiplicative = ast as Multiplicative;
        const operator = multiplicative.op.value;
        const left = traverseAST(multiplicative.left);
        const right = traverseAST(multiplicative.right);
        if (!left || !right) return null;
        if (operator === "/") {
            const normLeft = (["km"].includes(left) ? "m" : left);
            const normRight = (["h"].includes(right) ? "s" : right);
            if (normLeft === "m" && normRight === "s") return "m/s";
            return normLeft + operator + normRight;
        }
        if (operator === "*") {
            return left + operator + right;
        }
        return null;
    }

    if (ast.nodeType === "Constant") {
        return "constant";
    }
    if (ast.nodeType === "PhysicalUnit") {
        const unit = ast as PhysicalUnit;
        return unit.kind;
    }
    return null;
}





