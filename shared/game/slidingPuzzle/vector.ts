export class Vector {
    public static readonly up = new Vector(0, -1);
    public static readonly right = new Vector(1, 0);
    public static readonly down = new Vector(0, 1);
    public static readonly left = new Vector(-1, 0);

    public static readonly all = [Vector.up, Vector.right, Vector.down, Vector.left];

    public constructor(public x: number, public y: number) {}
}
