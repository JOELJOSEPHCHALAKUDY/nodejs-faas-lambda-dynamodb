import { v4 as UUID } from "uuid";

// Interfaces
interface IProps {
  id?: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}
interface ILeadInterface extends IProps {
  createdAt: number;
  updatedAt: number;
}
export default class LeadModel {
  private _id: string;

  private _email: string;

  private _phone: string;

  private _firstName: string;

  private _lastName: string;

  constructor({
    id = UUID(),
    email = "",
    phone = "",
    firstName = "",
    lastName = "",
  }: IProps) {
    this._id = id;
    this._email = email;
    this._phone = phone;
    this._firstName = firstName;
    this._lastName = lastName;
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
   * Get Base entity mappings
   * @return {ILeadInterface}
   */
  getEntityMappings(): ILeadInterface {
    return {
      id: this.getId(),
      email: this.getEmail(),
      phone: this.getPhone(),
      firstName: this.getFirstName(),
      lastName: this.getLastName(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
