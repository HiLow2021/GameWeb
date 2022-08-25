export class Vector {
    public static readonly up: Vector = { x: 0, y: -1 };
    public static readonly upRight: Vector = { x: 1, y: -1 };
    public static readonly right: Vector = { x: 1, y: 0 };
    public static readonly downRight: Vector = { x: 1, y: 1 };
    public static readonly down: Vector = { x: 0, y: 1 };
    public static readonly downLeft: Vector = { x: -1, y: 1 };
    public static readonly left: Vector = { x: -1, y: 0 };
    public static readonly upLeft: Vector = { x: -1, y: -1 };

    public static readonly all: Vector[] = [
        Vector.up,
        Vector.upRight,
        Vector.right,
        Vector.downRight,
        Vector.down,
        Vector.downLeft,
        Vector.left,
        Vector.upLeft
    ];

    public constructor(public x: number, public y: number) {}
}
