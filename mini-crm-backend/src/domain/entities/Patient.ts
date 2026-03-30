export class Patient {
  constructor(
    public readonly id: string,
    public name: string,
    public phone: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}
}