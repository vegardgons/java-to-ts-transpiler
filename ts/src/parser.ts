import { Token } from "./tokenizer";
import {
    AstNode,
    Operator,
    PhysicalUnit,
    PrimitiveExpr,
    UnitEnum,
    Multiplicative,
    Additive,
    GroupExpr,
    Expr,
    Constant,
} from "./types";

export function parseExpression(tokens: Token[]): AstNode {
    let currentPosition = -1;
    let done: boolean = false;

    return Expr();

    function getCurrentToken(): Token {
        return tokens[currentPosition];
    }

    function advance(): void {
        ++currentPosition;
        done = currentPosition + 1 >= tokens.length;
    }

    function peek(): Token {
        return tokens[currentPosition + 1];
    }

    function error(): Error {
        return new Error(
            "Parsing failed at position: " +
            currentPosition +
            ". The erroneous input token is: " +
            getCurrentToken().value
        );
    }

    function OpeningBracket(): void {
        if (peek().kind === "OpeningBracket") {
            advance();
        }
        else throw error();
    }

    function ClosingBracket(): void {
        if (peek().kind === "ClosingBracket") {
            advance();
        }
        else throw error();
    }

    function Constant(): Constant {
        if (peek().kind === "Constant") {
            advance();
            return { val: parseInt(getCurrentToken().value, 10), nodeType: "Constant" };
        }
        throw error();
    }

    function PhysicalUnit(): PhysicalUnit {
        advance();
        let unit = getCurrentToken();
        if (unit.kind === "PhysicalUnit") {
            let unitValue = unit.value;
            if (["min", "s", "h"].includes(unitValue)) {
                return {
                    kind: UnitEnum.Time,
                    nodeType: "PhysicalUnit"
                };
            } else if (["km", "m"].includes(unitValue)) {
                return {
                    kind: UnitEnum.Distance,
                    nodeType: "PhysicalUnit"
                }
            }
        }
        throw error();
    }

    function Expr(): Expr {
        return Additive();
    }

    function GroupExpr(): GroupExpr {
        OpeningBracket();
        let subExpr: Expr = Expr();
        ClosingBracket();
        return {
            subExpr: subExpr,
            nodeType: "GroupExpr"
        }
    }

    function PrimitiveExpr(): PrimitiveExpr {
        switch (peek().kind) {
            case "PhysicalUnit":
                return PhysicalUnit();
            case "Constant":
                return Constant();
            case "OpeningBracket":
                return GroupExpr();
            default:
                throw error();
        }
    }

    function OpAddSub(): Operator {
        if (peek().kind === "OpAddSub") {
            advance();
        }
        else throw error();
        switch (getCurrentToken().value) {
            case "+":
                return {
                    value: "+",
                    nodeType: "OpAddSub"
                };
            case "-":
                return {
                    value: "-",
                    nodeType: "OpAddSub"
                }
            default:
                throw error();
        }
    }

    function OpMulDiv(): Operator {
        if (peek().kind == "OpMulDiv") {
            advance();
        }
        else throw error();
        switch (getCurrentToken().value) {
            case "*":
                return {
                    value: "*",
                    nodeType: "OpMulDiv"
                };
            case "/":
                return {
                    value: "/",
                    nodeType: "OpMulDiv"
                }
            default:
                throw error();
        }
    }

    function Additive(): PrimitiveExpr | Multiplicative | Additive {
        let left: PrimitiveExpr | Multiplicative | Additive = Multiplicative();
        while (!done && peek().kind === "OpAddSub") {
            let op = OpAddSub();
            let right = Multiplicative();
            left = {
                left: left,
                op: op,
                right: right,
                nodeType: "Additive",
            };
        }
        return left;
    }

    function Multiplicative(): Multiplicative | PrimitiveExpr {
        let left: PrimitiveExpr | Multiplicative = PrimitiveExpr();
        while (!done && peek().kind === "OpMulDiv") {
            let op = OpMulDiv();
            let right = PrimitiveExpr();
            left = {
                left: left,
                op: op,
                right: right,
                nodeType: "Multiplicative",
            };
        }
        return left;
    }
}
