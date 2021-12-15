import { v4 as UUID } from 'uuid';

// Interfaces
interface IProps {
    id?: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
}

interface ILeadInterface extends IProps {
    created_at: Date;
    updated_at: Date;
}

export default class LeadModel {

    private _id: string;
    private _email: string;
    private _phone: string;
    private _first_name: string;
    private _last_name: string;

    constructor({ id = UUID(), email = '', phone = '', first_name = '', last_name = '' }: IProps) {
        this._id = id;
        this._email = email;
        this._phone = phone;
        this._first_name = first_name;
        this._last_name = last_name;

    }

    /**
    * Set Id
    * @param value
    */
    setId(value: string) {
        this._id = value !== '' ? value : null;
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
        this._email = value !== '' ? value : null;
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
        this._phone = value !== '' ? value : null;
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
        this._first_name = value !== '' ? value : null;
    }

    /**
     * Get First Name
     * @return {string|*}
     */
    getFirstName() {
        return this._first_name;
    }


    /**
* Set Last Name
* @param value
*/
    setLastName(value: string) {
        this._last_name = value !== '' ? value : null;
    }

    /**
     * Get Last Name
     * @return {string|*}
     */
    getLastName() {
        return this._last_name;
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
            first_name: this.getFirstName(),
            last_name: this.getLastName(),
            created_at: new Date(),
            updated_at: new Date()
        };
    }
}