import { v4 as UUID } from "uuid";

// Interfaces
interface IProps {
  id?: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  message: string;
}
interface ILeadFormInterface extends IProps {
  createdAt: number;
  updatedAt: number;
}
export default class LeadFormModel {
  private _id: string;

  private _email: string;

  private _phone: string;

  private _firstName: string;

  private _lastName: string;

  private _message: string;

  constructor({
    id = UUID(),
    email = "",
    phone = "",
    firstName = "",
    lastName = "",
    message = "",
  }: IProps) {
    this._id = id;
    this._email = email;
    this._phone = phone;
    this._firstName = firstName;
    this._lastName = lastName;
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
   * Set Email
   * @param value
   */
  setEmail(value: string) {
    this._email = value !== "" ? value : null;
  }

  /**
   * Get Email
   * @return {string|*}
   */
  getEmail() {
    return this._email;
  }

  /**
   * Set Phone
   * @param value
   */
  setPhone(value: string) {
    this._phone = value !== "" ? value : null;
  }

  /**
   * Get Phone
   * @return {string|*}
   */
  getPhone() {
    return this._phone;
  }

  /**
   * Set First Name
   * @param value
   */
  setFirstName(value: string) {
    this._firstName = value !== "" ? value : null;
  }

  /**
   * Get First Name
   * @return {string|*}
   */
  getFirstName() {
    return this._firstName;
  }

  /**
   * Set Last Name
   * @param value
   */
  setLastName(value: string) {
    this._lastName = value !== "" ? value : null;
  }

  /**
   * Get Last Name
   * @return {string|*}
   */
  getLastName() {
    return this._lastName;
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
   * @return {ILeadFormInterface}
   */
  getEntityMappings(): ILeadFormInterface {
    return {
      id: this.getId(),
      email: this.getEmail(),
      phone: this.getPhone(),
      firstName: this.getFirstName(),
      lastName: this.getLastName(),
      message: this.getMessage(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
