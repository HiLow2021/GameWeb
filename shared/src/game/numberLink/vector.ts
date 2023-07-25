export class Vector {
    public static readonly up = new Vector(0, -1);
    public static readonly right = new Vector(1, 0);
    public static readonly down = new Vector(0, 1);
    public static readonly left = new Vector(-1, 0);

    public static readonly all = [Vector.up, Vector.right, Vector.down, Vector.left];

    public constructor(public x: number, public y: number) {}

    public isOpposite(vector: Vector): boolean {
        return this.x === vector.x * -1 && this.y === vector.y * -1;
    }

    public isSame(vector: Vector): boolean {
        return this.x === vector.x && this.y === vector.y;
    }

    public opposite(): Vector {
        return new Vector(this.x * -1, this.y * -1);
    }
}
