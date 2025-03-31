class Unit {
    constructor(public kind: string, public val: number) { }
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
    // TODO Implement me!
    return "g";
}

class Example {
main(): void {
let a: Unit = new Unit("* m *", 400);
let b: Unit = new Unit("* km *", 2);
let c: Unit = new Unit("* s *", 2000);
let d: Unit = new Unit("* min *", 25);
let e: Unit = new Unit("* h *", 1);
let f = 6;
console.log(((15 MULTIPLY 2) PLUS f));
console.log((a PLUS (b MULTIPLY 2)));
console.log((d MINUS e));
console.log((b DIVIDE e));
console.log((((a DIVIDE c) MULTIPLY d) PLUS (b MULTIPLY f)));
}
}
