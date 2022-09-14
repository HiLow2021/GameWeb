export class Vector {
    public static readonly up = new Vector(0, -1);
    public static readonly upRight = new Vector(1, -1);
    public static readonly right = new Vector(1, 0);
    public static readonly downRight = new Vector(1, 1);
    public static readonly down = new Vector(0, 1);
    public static readonly downLeft = new Vector(-1, 1);
    public static readonly left = new Vector(-1, 0);
    public static readonly upLeft = new Vector(-1, -1);

    public static readonly all = [
        Vector.up,
        Vector.upRight,
        Vector.right,
        Vector.downRight,
        Vector.down,
        Vector.downLeft,
        Vector.left,
        Vector.upLeft
    ];
    public static readonly half = Vector.all.slice(0, Vector.all.length / 2);

    public constructor(public x: number, public y: number) {}
}
