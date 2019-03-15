export interface IConfig {
  voidPassword?: string,
  overrideDanceRestriction?: string,
  development?: boolean
}

export interface IDance {
  count: number,
  startDate: string
  endDate: string,
  key: string,
  name: string,
  price: number
}

export interface ILevels {
  name: string,
  level: string,
  levelCheck: boolean,
  sortBy: number
}

export interface IStore {
  quantity: number,
  name: string,
  price: number
}

export interface IComps {
  key: string,
  name: string,
  role: string,
  partner?: string,
  price?: number
}

export interface IMoneyLogEntryItem {
  item: string,
  price: number,
  quantity: number
}

export interface IMoneyLogEntry {
  bookingId: number,
  amount: number,
  date?: Date,
  details: IMoneyLogEntryItem[],
  void?: boolean,
  initials?: string,
  reason?: string,
}

export interface IMissionGearIssue {
  IssueId: string,
  BookingID: number,
  FirstName: string,
  LastName: string,
  Issue: string,
  Resolved: boolean
}

export class Registration implements IRegistration {
  AdNov?:  boolean;
  AdditionalTShirts?:  string;
  Address?:  string;
  AdvNovVolunteer?:  boolean;
  Agree?:  boolean;
  AmateurCouples?:  boolean;
  AmateurPartner?:  string;
  AmountOwed?:  number;
  BadgeUpdated?:  boolean;
  BeginnerPass?:  string;
  BookingID?:  number;
  CheckedIn?:  boolean;
  City?:  string;
  Comments?:  string[];
  Comps?: IComps[];
  Country?:  string;
  CreationDate?: string;
  DancePass?:  string;
  Email?:  string;
  FirstName?:  string;
  FullMissionPasses?:  string;
  HasComments?:  boolean;
  HasGear?:  boolean
  HasLevelCheck?:  boolean;
  HasPaid?:  boolean;
  Housing?:  string;
  International?:  boolean;
  International_Full_Mission?:  string
  Invitational?:  boolean;
  LastName?:  string;
  LeadFollow?:  string;
  Level?:  string;
  LevelChecked?:  boolean;
  LevelUpdated?:  boolean;
  LimitedEditionPatch?:  string;
  LimitedEditionPatch__quantity?:  number;
  MissedLevelCheck?:  boolean;
  MissionGearIssues?: IMissionGearIssue[];
  Notes?:  string;
  Open?:  boolean;
  OriginalAmountOwed?:  number;
  OriginalLevel?:  string;
  Paid?:  number;
  Partner?:  string;
  Patch?:  boolean;
  Promo?:  string
  Shirt1?:  boolean;
  Shirt2?:  boolean;
  Size?:  string;
  Size2?:  string;
  TShirts?:  string;
  TotalCost?:  number;
  WalkIn?:  boolean;
  USState?:  string;
}

export interface IRegistration {
  AdNov?:  boolean,
  AdNovDrawRole?: string,
  AmateurDrawRole?: string,
  AdditionalTShirts?:  string,
  Address?:  string,
  AdvNovVolunteer?:  boolean,
  Agree?:  boolean,
  AmateurCouples?:  boolean,
  AmateurPartner?:  string,
  AmountOwed?:  number,
  BadgeUpdated?:  boolean,
  BeginnerPass?:  string,
  BookingID?:  number,
  CheckedIn?:  boolean,
  City?:  string,
  Comments?:  string[],
  Comps?: IComps[],
  Country?:  string,
  CreationDate?: string,
  DancePass?:  string,
  Email?:  string,
  FirstName?:  string,
  FullMissionPasses?:  string,
  HasComments?:  boolean,
  HasGear?:  boolean
  HasLevelCheck?:  boolean,
  HasPaid?:  boolean,
  Housing?:  string,
  International?:  boolean,
  International_Full_Mission?:  string
  Invitational?:  boolean,
  LastName?:  string,
  LeadFollow?:  string,
  Level?:  string,
  LevelChecked?:  boolean,
  LevelUpdated?:  boolean,
  LimitedEditionPatch?:  string,
  LimitedEditionPatch__quantity?:  number,
  MenSize?: string,
  MenSize2?: string,
  MissedLevelCheck?:  boolean,
  MissionGearIssues?: IMissionGearIssue[],
  Notes?:  string,
  Open?:  boolean,
  OriginalAmountOwed?:  number,
  OriginalLevel?:  string,
  Paid?:  number,
  Partner?:  string,
  Patch?:  boolean,
  Promo?:  string
  Shirt1?:  boolean,
  Shirt2?:  boolean,
  Size?:  string,
  Size2?:  string,
  TShirts?:  string,
  TotalCost?:  number,
  WalkIn?:  boolean,
  WomenSize?: string,
  WomenSize2?: string,
  USState?:  string,
}

export interface IAdminMissionPasses {
  name: string,
  price: number,
  sortBy: number
}

export interface IPartnerComp {
  name: string,
  partner: string
}

export interface IRoleComp {
  name: string,
  role: string
}

export interface IAdminField {
  key: string,
  label: string,
  sortOrder: number,
  type: string,
  options?: IAdminFieldOptions[]
}

export interface IAdminFieldOptions {
  label: string,
  value: any
}