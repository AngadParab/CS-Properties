import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const ActivityType = {
  CALL: "CALL",
  EMAIL: "EMAIL",
  SITE_VISIT: "SITE_VISIT",
  NOTE: "NOTE",
  STATUS_CHANGE: "STATUS_CHANGE",
}

export const LeadStatus = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  SITE_VISIT_SCHEDULED: "SITE_VISIT_SCHEDULED",
  UNDER_NEGOTIATION: "UNDER_NEGOTIATION",
  CLOSED_WON: "CLOSED_WON",
  CLOSED_LOST: "CLOSED_LOST",
}

export const PropertyStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  UNDER_CONTRACT: "UNDER_CONTRACT",
  SOLD: "SOLD",
}

export const PropertyType = {
  RESIDENTIAL: "RESIDENTIAL",
  VILLA: "VILLA",
  COMMERCIAL: "COMMERCIAL",
  PLOT: "PLOT",
}

export const UserRole = {
  ADMIN: "ADMIN",
  AGENT: "AGENT",
}

export const connectorConfig = {
  connector: 'default',
  service: 'cs-properties-crm',
  location: 'us-central1'
};
export const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';

export function upsertUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserRef(dcInstance, inputVars));
}

export const createPropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProperty', inputVars);
}
createPropertyRef.operationName = 'CreateProperty';

export function createProperty(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPropertyRef(dcInstance, inputVars));
}

export const updatePropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProperty', inputVars);
}
updatePropertyRef.operationName = 'UpdateProperty';

export function updateProperty(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePropertyRef(dcInstance, inputVars));
}

export const addPropertyImageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddPropertyImage', inputVars);
}
addPropertyImageRef.operationName = 'AddPropertyImage';

export function addPropertyImage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addPropertyImageRef(dcInstance, inputVars));
}

export const deletePropertyImageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePropertyImage', inputVars);
}
deletePropertyImageRef.operationName = 'DeletePropertyImage';

export function deletePropertyImage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deletePropertyImageRef(dcInstance, inputVars));
}

export const createLeadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLead', inputVars);
}
createLeadRef.operationName = 'CreateLead';

export function createLead(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createLeadRef(dcInstance, inputVars));
}

export const updateLeadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLead', inputVars);
}
updateLeadRef.operationName = 'UpdateLead';

export function updateLead(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateLeadRef(dcInstance, inputVars));
}

export const createActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateActivity', inputVars);
}
createActivityRef.operationName = 'CreateActivity';

export function createActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createActivityRef(dcInstance, inputVars));
}

export const updateLeadAndAddActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLeadAndAddActivity', inputVars);
}
updateLeadAndAddActivityRef.operationName = 'UpdateLeadAndAddActivity';

export function updateLeadAndAddActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateLeadAndAddActivityRef(dcInstance, inputVars));
}

export const getPropertiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProperties');
}
getPropertiesRef.operationName = 'GetProperties';

export function getProperties(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getPropertiesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getPropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProperty', inputVars);
}
getPropertyRef.operationName = 'GetProperty';

export function getProperty(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPropertyRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getLeadsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLeads', inputVars);
}
getLeadsRef.operationName = 'GetLeads';

export function getLeads(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(getLeadsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getLeadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLead', inputVars);
}
getLeadRef.operationName = 'GetLead';

export function getLead(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLeadRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getPropertyAgentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPropertyAgent', inputVars);
}
getPropertyAgentRef.operationName = 'GetPropertyAgent';

export function getPropertyAgent(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPropertyAgentRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getAdminsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAdmins');
}
getAdminsRef.operationName = 'GetAdmins';

export function getAdmins(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getAdminsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getLeadsAssignmentRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLeadsAssignment');
}
getLeadsAssignmentRef.operationName = 'GetLeadsAssignment';

export function getLeadsAssignment(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getLeadsAssignmentRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getPropertyImagesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPropertyImages');
}
getPropertyImagesRef.operationName = 'GetPropertyImages';

export function getPropertyImages(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getPropertyImagesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

