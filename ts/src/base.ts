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
