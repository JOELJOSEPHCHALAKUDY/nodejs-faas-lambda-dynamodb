import { v4 as UUID } from 'uuid';

// Interfaces
interface IProps {
    id?: string;
    leadId: string;
    message: string;
}

interface IInterestInterface extends IProps {
    created_at: Date;
    updated_at: Date;
}

export default class LeadModel {

    private _id: string;
    private _lead_id: string;
    private _message: string;

    constructor({ id = UUID(), leadId, message = '' }: IProps) {
        this._id = id;
        this._lead_id = leadId;
        this._message = message;
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
     * Set Lead ID
     * @param value
     */
    setLeadId(value: string) {
        this._lead_id = value !== '' ? value : null;
    }

    /**
     * Get Lead ID
     * @return {string|*}
     */
    getLeadId() {
        return this._lead_id;
    }


    /**
     * Set Message
     * @param value
     */
    setMessage(value: string) {
        this._message = value !== '' ? value : null;
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
            created_at: new Date(),
            updated_at: new Date()
        };
    }
}