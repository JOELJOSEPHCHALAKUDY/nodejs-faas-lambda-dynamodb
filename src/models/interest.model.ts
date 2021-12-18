import { v4 as UUID } from "uuid";

// Interfaces
interface IProps {
  id?: string;
  leadId: string;
  message: string;
}

interface IInterestInterface extends IProps {
  createdAt: number;
  updatedAt: number;
}

export default class InterestModel {
  private _id: string;

  private _leadId: string;

  private _message: string;

  constructor({ id = UUID(), leadId, message = "" }: IProps) {
    this._id = id;
    this._leadId = leadId;
    this._message = message;
  }

  /**
   * Set Id
   * @param value
   */
  setId(value: string) {
    this._id = value !== "" ? value : null;
  }

  /**
   * Get Id
   * @return {string|*}
   */
  getId() {
    return this._id;
  }

  /**
   * Set Lead ID
   * @param value
   */
  setLeadId(value: string) {
    this._leadId = value !== "" ? value : null;
  }

  /**
   * Get Lead ID
   * @return {string|*}
   */
  getLeadId() {
    return this._leadId;
  }

  /**
   * Set Message
   * @param value
   */
  setMessage(value: string) {
    this._message = value !== "" ? value : null;
  }

  /**
   * Get Message
   * @return {string|*}
   */
  getMessage() {
    return this._message;
  }

  /**
   * Get Base entity mappings
   * @return {IInterestInterface}
   */
  getEntityMappings(): IInterestInterface {
    return {
      id: this.getId(),
      leadId: this.getLeadId(),
      message: this.getMessage(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
