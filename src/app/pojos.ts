/* tslint:disable */
/* eslint-disable */

export interface Serializable {
}

export class AuditEntity implements Serializable{
  createdBy?: string;
  createdAt?: Date;
  created_at_format?: string;
  modifiedBy?: string;
  modifiedAt?: Date;
  modified_at_format?: string;
}

export class Message extends AuditEntity {
  id?: number;
  accountIdentifier?: string;
  participant?: Participant;
  text?: string;
  type?: number;
  direction?: number;
  read?: boolean;
  media?: Media;
  message_date?: string;
  message_time?: string;
}

export class Media extends AuditEntity {
  id?: number;
  contentType?: string;
  name?: string;
  content?: string;
}

export class Participant extends AuditEntity{
  id?: number;
  companyId?: number;
  companyName?: string;
  participantName?: string;
  participantMobile?: string;
  messages = new Map<number, Message>();
  newMessageCount?: number = 0;
  lastMessage?: number;
  registrationMap?: any;
}

export class Company{
  id?: number;
  name?: string;
  accounts?: Account[];
}

export class Account {
  id?: number;
  identifier?: string;
  type?: string;
}

export class AccountProperty {
  id?: number;
  property_name?: string;
  property_type?: string;
  property_value?: string;
}

export class User {
  username?: string;
  company?: Company[];
}
