/* tslint:disable */
/* eslint-disable */

export interface Serializable {
}

export class AuditEntity implements Serializable{
  createdBy?: string;
  createdAt?: Date;
  modifiedBy?: string;
  modifiedAt?: Date;
}

export class Message extends AuditEntity {
  id?: number;
  accountIdentifier?: string;
  participant?: Participant;
  text?: string;
  type?: number;
  read?: boolean;
}

export class Participant extends AuditEntity{
  id?: number;
  companyId?: number;
  companyName?: string;
  participantName?: string;
  participantMobile?: string;
}
