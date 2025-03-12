export interface Token {
    kind: TokenKind;
    value: string;
}

export type TokenKind =
    | "OpMulDiv"
    | "OpAddSub"
    | "PhysicalUnit"
    | "Constant"
    | "OpeningBracket"
    | "ClosingBracket"

export class Tokenizer {
    private tokens: Token[] = [];
    private current = -1;

    constructor(private source: string) { }

    tokenize(): Token[] {
        while (this.current < this.source.length - 1) {
            this.scanToken();
        }
        return this.tokens;
    }

    private scanToken() {
        let char = this.advance();

        while (char == " ")
            char = this.advance();

        if (this.current >= this.source.length)
            return;

        switch (char) {
            case "+":
            case "-":
                this.consumeToken("OpAddSub", char);
                break;
            case "/":
            case "*":
                this.consumeToken("OpMulDiv", char);
                break;
            case "(":
                this.consumeToken("OpeningBracket", char);
                break;
            case ")":
                this.consumeToken("ClosingBracket", char);
                break;
            default:
                if (this.isAlpha(char)) {
                    this.consumeUnit();
                } else if (this.isNumerical(char)) {
                    this.consumeNumber();
                } else {
                    throw new Error("Invalid token: " + char);
                }
                break;
        }
    }

    private peek(x: number) {
        return this.source[this.current + x];
    }

    private consumeUnit() {
        let unit = "";
        while (this.isAlpha(this.getCurrent())) {
            unit += this.getCurrent();
            if (!this.isAlpha(this.peek(1))) {
                break;
            }
            this.advance();
        }
        this.consumeToken("PhysicalUnit", unit);
    }

    private consumeNumber() {
        let numberWord = "";
        while (true) {
            numberWord += this.getCurrent();
            if (!this.isNumerical(this.peek(1))) {
                break;
            }
            this.advance();
        }

        this.consumeToken("Constant", numberWord);
    }


    private getCurrent() {
        return this.source[this.current];
    }

    private consumeToken(tokenType: TokenKind, token: string) {
        this.tokens.push({ kind: tokenType, value: token });
    }

    private advance(): string {
        this.current += 1;
        return this.current >= this.source.length ? "" : this.source[this.current];
    }

    private isAlpha(val: string): boolean {
        let alphabet = new Set(
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".split("")
        );
        return alphabet.has(val);
    }

    private isNumerical(char: string): boolean {
        let numbers = new Set("1234567890".split(""));
        return numbers.has(char);
    }
}
