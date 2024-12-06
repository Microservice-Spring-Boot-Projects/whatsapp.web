/* tslint:disable */
/* eslint-disable */

import { Timestamp } from "rxjs";

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
  created_at_long?: number;
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
  lastName?:string;
  firstName?:string;
  messages = new Map<number, Message>();
  newMessageCount?: number = 0;
  lastMessage?: number;
  registrationMap?: any;
  participantDateofbirth?: Date;
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
  account_properties?: AccountProperty [];
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

export class SalesOrder {
  id?: number;
  companyId?: number;
  accountId?: number;
  participant?: Participant;
  salesTimestamp?: Date;
  positions?: SalesOrderPosition[];
}

export class SalesOrderPosition {
  id?: number;
  brand?: string;
  variantKey?: string;
}

export class Template {
  name?: string;
  language?: string;
  status?: string;
  category?: string;
  id?: string;
  components?: Component[];
}

export class Component {
  type?: string;
  format?: string;
  text?: string;
}

export class TemplateRequest{
  text1?: string = "";
  text2?: string = "";
  text3?: string = "";
  text4?: string = "";
  text5?: string = "";
  text6?: string = "";
  text7?: string = "";
  headerImageUrl?: string = "";
  templateName?: string = "";
  accountIdentifier?: string = "";
}
