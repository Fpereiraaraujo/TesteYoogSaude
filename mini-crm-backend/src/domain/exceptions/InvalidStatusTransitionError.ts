export class InvalidStatusTransitionError extends Error {
  constructor(currentStatus: string, newStatus: string) {
    super(`Cannot transition from ${currentStatus} to ${newStatus}`);
    this.name = 'InvalidStatusTransitionError';
  }
}