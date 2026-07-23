import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum ActivityType {
  CALL = "CALL",
  EMAIL = "EMAIL",
  SITE_VISIT = "SITE_VISIT",
  NOTE = "NOTE",
  STATUS_CHANGE = "STATUS_CHANGE",
};

export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  SITE_VISIT_SCHEDULED = "SITE_VISIT_SCHEDULED",
  UNDER_NEGOTIATION = "UNDER_NEGOTIATION",
  CLOSED_WON = "CLOSED_WON",
  CLOSED_LOST = "CLOSED_LOST",
};

export enum PropertyStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  UNDER_CONTRACT = "UNDER_CONTRACT",
  SOLD = "SOLD",
};

export enum PropertyType {
  RESIDENTIAL = "RESIDENTIAL",
  VILLA = "VILLA",
  COMMERCIAL = "COMMERCIAL",
  PLOT = "PLOT",
};

export enum UserRole {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
};



export interface Activity_Key {
  id: UUIDString;
  __typename?: 'Activity_Key';
}

export interface AddPropertyImageData {
  propertyImage_insert: PropertyImage_Key;
}

export interface AddPropertyImageVariables {
  propertyId: UUIDString;
  url: string;
  displayOrder: number;
}

export interface CreateActivityData {
  activity_insert: Activity_Key;
}

export interface CreateActivityVariables {
  leadId: UUIDString;
  actorId: UUIDString;
  type: ActivityType;
  comment: string;
}

export interface CreateLeadData {
  lead_insert: Lead_Key;
}

export interface CreateLeadVariables {
  fullName: string;
  email: string;
  phone: string;
  status: LeadStatus;
  budget: number;
  notes?: string | null;
  source?: string | null;
  propertyId?: UUIDString | null;
  assignedToId?: UUIDString | null;
}

export interface CreatePropertyData {
  property_insert: Property_Key;
}

export interface CreatePropertyVariables {
  title: string;
  description: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqFt?: number | null;
  address: string;
  city: string;
  agentId: UUIDString;
}

export interface DeletePropertyImageData {
  propertyImage_delete?: PropertyImage_Key | null;
}

export interface DeletePropertyImageVariables {
  id: UUIDString;
}

export interface GetAdminsData {
  users: ({
    id: UUIDString;
  } & User_Key)[];
}

export interface GetLeadData {
  lead?: {
    id: UUIDString;
    fullName: string;
    email: string;
    phone: string;
    status: LeadStatus;
    budget: number;
    notes?: string | null;
    source?: string | null;
    property?: {
      id: UUIDString;
      title: string;
      price: number;
    } & Property_Key;
      assignedTo?: {
        id: UUIDString;
        name: string;
        role: UserRole;
      } & User_Key;
        createdAt: TimestampString;
  } & Lead_Key;
    activities: ({
      id: UUIDString;
      actor: {
        id: UUIDString;
        name: string;
        role: UserRole;
      } & User_Key;
        type: ActivityType;
        comment: string;
        createdAt: TimestampString;
    } & Activity_Key)[];
}

export interface GetLeadVariables {
  id: UUIDString;
}

export interface GetLeadsAssignmentData {
  leads: ({
    assignedTo?: {
      id: UUIDString;
    } & User_Key;
  })[];
}

export interface GetLeadsData {
  leads: ({
    id: UUIDString;
    fullName: string;
    email: string;
    phone: string;
    status: LeadStatus;
    budget: number;
    notes?: string | null;
    source?: string | null;
    property?: {
      id: UUIDString;
      title: string;
    } & Property_Key;
      assignedTo?: {
        id: UUIDString;
        name: string;
      } & User_Key;
        createdAt: TimestampString;
  } & Lead_Key)[];
}

export interface GetLeadsVariables {
  status?: LeadStatus | null;
  assignedToId?: UUIDString | null;
}

export interface GetPropertiesData {
  properties: ({
    id: UUIDString;
    title: string;
    description: string;
    price: number;
    status: PropertyStatus;
    type: PropertyType;
    bedrooms?: number | null;
    bathrooms?: number | null;
    areaSqFt?: number | null;
    address: string;
    city: string;
    agent: {
      id: UUIDString;
      name: string;
      email: string;
    } & User_Key;
      createdAt: TimestampString;
  } & Property_Key)[];
}

export interface GetPropertyAgentData {
  property?: {
    agent: {
      id: UUIDString;
    } & User_Key;
  };
}

export interface GetPropertyAgentVariables {
  id: UUIDString;
}

export interface GetPropertyData {
  property?: {
    id: UUIDString;
    title: string;
    description: string;
    price: number;
    status: PropertyStatus;
    type: PropertyType;
    bedrooms?: number | null;
    bathrooms?: number | null;
    areaSqFt?: number | null;
    address: string;
    city: string;
    agent: {
      id: UUIDString;
      name: string;
      email: string;
    } & User_Key;
      createdAt: TimestampString;
  } & Property_Key;
    propertyImages: ({
      id: UUIDString;
      url: string;
      displayOrder: number;
    } & PropertyImage_Key)[];
}

export interface GetPropertyVariables {
  id: UUIDString;
}

export interface Lead_Key {
  id: UUIDString;
  __typename?: 'Lead_Key';
}

export interface PropertyImage_Key {
  id: UUIDString;
  __typename?: 'PropertyImage_Key';
}

export interface Property_Key {
  id: UUIDString;
  __typename?: 'Property_Key';
}

export interface UpdateLeadAndAddActivityData {
  lead_update?: Lead_Key | null;
  activity_insert: Activity_Key;
}

export interface UpdateLeadAndAddActivityVariables {
  leadId: UUIDString;
  newStatus: LeadStatus;
  actorId: UUIDString;
  comment: string;
}

export interface UpdateLeadData {
  lead_update?: Lead_Key | null;
}

export interface UpdateLeadVariables {
  id: UUIDString;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: LeadStatus | null;
  budget?: number | null;
  notes?: string | null;
  source?: string | null;
  propertyId?: UUIDString | null;
  assignedToId?: UUIDString | null;
}

export interface UpdatePropertyData {
  property_update?: Property_Key | null;
}

export interface UpdatePropertyVariables {
  id: UUIDString;
  title?: string | null;
  description?: string | null;
  price?: number | null;
  status?: PropertyStatus | null;
  type?: PropertyType | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqFt?: number | null;
  address?: string | null;
  city?: string | null;
  agentId?: UUIDString | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  id: UUIDString;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface CreatePropertyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePropertyVariables): MutationRef<CreatePropertyData, CreatePropertyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePropertyVariables): MutationRef<CreatePropertyData, CreatePropertyVariables>;
  operationName: string;
}
export const createPropertyRef: CreatePropertyRef;

export function createProperty(vars: CreatePropertyVariables): MutationPromise<CreatePropertyData, CreatePropertyVariables>;
export function createProperty(dc: DataConnect, vars: CreatePropertyVariables): MutationPromise<CreatePropertyData, CreatePropertyVariables>;

interface UpdatePropertyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePropertyVariables): MutationRef<UpdatePropertyData, UpdatePropertyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePropertyVariables): MutationRef<UpdatePropertyData, UpdatePropertyVariables>;
  operationName: string;
}
export const updatePropertyRef: UpdatePropertyRef;

export function updateProperty(vars: UpdatePropertyVariables): MutationPromise<UpdatePropertyData, UpdatePropertyVariables>;
export function updateProperty(dc: DataConnect, vars: UpdatePropertyVariables): MutationPromise<UpdatePropertyData, UpdatePropertyVariables>;

interface AddPropertyImageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddPropertyImageVariables): MutationRef<AddPropertyImageData, AddPropertyImageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddPropertyImageVariables): MutationRef<AddPropertyImageData, AddPropertyImageVariables>;
  operationName: string;
}
export const addPropertyImageRef: AddPropertyImageRef;

export function addPropertyImage(vars: AddPropertyImageVariables): MutationPromise<AddPropertyImageData, AddPropertyImageVariables>;
export function addPropertyImage(dc: DataConnect, vars: AddPropertyImageVariables): MutationPromise<AddPropertyImageData, AddPropertyImageVariables>;

interface DeletePropertyImageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePropertyImageVariables): MutationRef<DeletePropertyImageData, DeletePropertyImageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePropertyImageVariables): MutationRef<DeletePropertyImageData, DeletePropertyImageVariables>;
  operationName: string;
}
export const deletePropertyImageRef: DeletePropertyImageRef;

export function deletePropertyImage(vars: DeletePropertyImageVariables): MutationPromise<DeletePropertyImageData, DeletePropertyImageVariables>;
export function deletePropertyImage(dc: DataConnect, vars: DeletePropertyImageVariables): MutationPromise<DeletePropertyImageData, DeletePropertyImageVariables>;

interface CreateLeadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLeadVariables): MutationRef<CreateLeadData, CreateLeadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateLeadVariables): MutationRef<CreateLeadData, CreateLeadVariables>;
  operationName: string;
}
export const createLeadRef: CreateLeadRef;

export function createLead(vars: CreateLeadVariables): MutationPromise<CreateLeadData, CreateLeadVariables>;
export function createLead(dc: DataConnect, vars: CreateLeadVariables): MutationPromise<CreateLeadData, CreateLeadVariables>;

interface UpdateLeadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLeadVariables): MutationRef<UpdateLeadData, UpdateLeadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateLeadVariables): MutationRef<UpdateLeadData, UpdateLeadVariables>;
  operationName: string;
}
export const updateLeadRef: UpdateLeadRef;

export function updateLead(vars: UpdateLeadVariables): MutationPromise<UpdateLeadData, UpdateLeadVariables>;
export function updateLead(dc: DataConnect, vars: UpdateLeadVariables): MutationPromise<UpdateLeadData, UpdateLeadVariables>;

interface CreateActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateActivityVariables): MutationRef<CreateActivityData, CreateActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateActivityVariables): MutationRef<CreateActivityData, CreateActivityVariables>;
  operationName: string;
}
export const createActivityRef: CreateActivityRef;

export function createActivity(vars: CreateActivityVariables): MutationPromise<CreateActivityData, CreateActivityVariables>;
export function createActivity(dc: DataConnect, vars: CreateActivityVariables): MutationPromise<CreateActivityData, CreateActivityVariables>;

interface UpdateLeadAndAddActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLeadAndAddActivityVariables): MutationRef<UpdateLeadAndAddActivityData, UpdateLeadAndAddActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateLeadAndAddActivityVariables): MutationRef<UpdateLeadAndAddActivityData, UpdateLeadAndAddActivityVariables>;
  operationName: string;
}
export const updateLeadAndAddActivityRef: UpdateLeadAndAddActivityRef;

export function updateLeadAndAddActivity(vars: UpdateLeadAndAddActivityVariables): MutationPromise<UpdateLeadAndAddActivityData, UpdateLeadAndAddActivityVariables>;
export function updateLeadAndAddActivity(dc: DataConnect, vars: UpdateLeadAndAddActivityVariables): MutationPromise<UpdateLeadAndAddActivityData, UpdateLeadAndAddActivityVariables>;

interface GetPropertiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPropertiesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPropertiesData, undefined>;
  operationName: string;
}
export const getPropertiesRef: GetPropertiesRef;

export function getProperties(options?: ExecuteQueryOptions): QueryPromise<GetPropertiesData, undefined>;
export function getProperties(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetPropertiesData, undefined>;

interface GetPropertyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPropertyVariables): QueryRef<GetPropertyData, GetPropertyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPropertyVariables): QueryRef<GetPropertyData, GetPropertyVariables>;
  operationName: string;
}
export const getPropertyRef: GetPropertyRef;

export function getProperty(vars: GetPropertyVariables, options?: ExecuteQueryOptions): QueryPromise<GetPropertyData, GetPropertyVariables>;
export function getProperty(dc: DataConnect, vars: GetPropertyVariables, options?: ExecuteQueryOptions): QueryPromise<GetPropertyData, GetPropertyVariables>;

interface GetLeadsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetLeadsVariables): QueryRef<GetLeadsData, GetLeadsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetLeadsVariables): QueryRef<GetLeadsData, GetLeadsVariables>;
  operationName: string;
}
export const getLeadsRef: GetLeadsRef;

export function getLeads(vars?: GetLeadsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLeadsData, GetLeadsVariables>;
export function getLeads(dc: DataConnect, vars?: GetLeadsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLeadsData, GetLeadsVariables>;

interface GetLeadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLeadVariables): QueryRef<GetLeadData, GetLeadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLeadVariables): QueryRef<GetLeadData, GetLeadVariables>;
  operationName: string;
}
export const getLeadRef: GetLeadRef;

export function getLead(vars: GetLeadVariables, options?: ExecuteQueryOptions): QueryPromise<GetLeadData, GetLeadVariables>;
export function getLead(dc: DataConnect, vars: GetLeadVariables, options?: ExecuteQueryOptions): QueryPromise<GetLeadData, GetLeadVariables>;

interface GetPropertyAgentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPropertyAgentVariables): QueryRef<GetPropertyAgentData, GetPropertyAgentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPropertyAgentVariables): QueryRef<GetPropertyAgentData, GetPropertyAgentVariables>;
  operationName: string;
}
export const getPropertyAgentRef: GetPropertyAgentRef;

export function getPropertyAgent(vars: GetPropertyAgentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPropertyAgentData, GetPropertyAgentVariables>;
export function getPropertyAgent(dc: DataConnect, vars: GetPropertyAgentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPropertyAgentData, GetPropertyAgentVariables>;

interface GetAdminsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAdminsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAdminsData, undefined>;
  operationName: string;
}
export const getAdminsRef: GetAdminsRef;

export function getAdmins(options?: ExecuteQueryOptions): QueryPromise<GetAdminsData, undefined>;
export function getAdmins(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetAdminsData, undefined>;

interface GetLeadsAssignmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetLeadsAssignmentData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetLeadsAssignmentData, undefined>;
  operationName: string;
}
export const getLeadsAssignmentRef: GetLeadsAssignmentRef;

export function getLeadsAssignment(options?: ExecuteQueryOptions): QueryPromise<GetLeadsAssignmentData, undefined>;
export function getLeadsAssignment(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetLeadsAssignmentData, undefined>;

