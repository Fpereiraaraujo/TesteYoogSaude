import { InvalidStatusTransitionError } from '../exceptions/InvalidStatusTransitionError';

export enum AppointmentStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public description: string,
    private _status: AppointmentStatus,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  get status(): AppointmentStatus {
    return this._status;
  }

  startService(): void {
    if (this._status !== AppointmentStatus.WAITING) {
      throw new InvalidStatusTransitionError(this._status, AppointmentStatus.IN_PROGRESS);
    }
    
    this._status = AppointmentStatus.IN_PROGRESS;
    this.updatedAt = new Date();
  }

  finishService(): void {
    if (this._status !== AppointmentStatus.IN_PROGRESS) {
      throw new InvalidStatusTransitionError(this._status, AppointmentStatus.FINISHED);
    }
    
    this._status = AppointmentStatus.FINISHED;
    this.updatedAt = new Date();
  }
}