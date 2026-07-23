const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const ActivityType = {
  CALL: "CALL",
  EMAIL: "EMAIL",
  SITE_VISIT: "SITE_VISIT",
  NOTE: "NOTE",
  STATUS_CHANGE: "STATUS_CHANGE",
}
exports.ActivityType = ActivityType;

const LeadStatus = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  SITE_VISIT_SCHEDULED: "SITE_VISIT_SCHEDULED",
  UNDER_NEGOTIATION: "UNDER_NEGOTIATION",
  CLOSED_WON: "CLOSED_WON",
  CLOSED_LOST: "CLOSED_LOST",
}
exports.LeadStatus = LeadStatus;

const PropertyStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  UNDER_CONTRACT: "UNDER_CONTRACT",
  SOLD: "SOLD",
}
exports.PropertyStatus = PropertyStatus;

const PropertyType = {
  RESIDENTIAL: "RESIDENTIAL",
  VILLA: "VILLA",
  COMMERCIAL: "COMMERCIAL",
  PLOT: "PLOT",
}
exports.PropertyType = PropertyType;

const UserRole = {
  ADMIN: "ADMIN",
  AGENT: "AGENT",
}
exports.UserRole = UserRole;

const connectorConfig = {
  connector: 'default',
  service: 'cs-properties-crm',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';
exports.upsertUserRef = upsertUserRef;

exports.upsertUser = function upsertUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserRef(dcInstance, inputVars));
}
;

const createPropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProperty', inputVars);
}
createPropertyRef.operationName = 'CreateProperty';
exports.createPropertyRef = createPropertyRef;

exports.createProperty = function createProperty(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPropertyRef(dcInstance, inputVars));
}
;

const updatePropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProperty', inputVars);
}
updatePropertyRef.operationName = 'UpdateProperty';
exports.updatePropertyRef = updatePropertyRef;

exports.updateProperty = function updateProperty(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePropertyRef(dcInstance, inputVars));
}
;

const addPropertyImageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddPropertyImage', inputVars);
}
addPropertyImageRef.operationName = 'AddPropertyImage';
exports.addPropertyImageRef = addPropertyImageRef;

exports.addPropertyImage = function addPropertyImage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addPropertyImageRef(dcInstance, inputVars));
}
;

const deletePropertyImageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePropertyImage', inputVars);
}
deletePropertyImageRef.operationName = 'DeletePropertyImage';
exports.deletePropertyImageRef = deletePropertyImageRef;

exports.deletePropertyImage = function deletePropertyImage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deletePropertyImageRef(dcInstance, inputVars));
}
;

const createLeadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLead', inputVars);
}
createLeadRef.operationName = 'CreateLead';
exports.createLeadRef = createLeadRef;

exports.createLead = function createLead(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createLeadRef(dcInstance, inputVars));
}
;

const updateLeadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLead', inputVars);
}
updateLeadRef.operationName = 'UpdateLead';
exports.updateLeadRef = updateLeadRef;

exports.updateLead = function updateLead(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateLeadRef(dcInstance, inputVars));
}
;

const createActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateActivity', inputVars);
}
createActivityRef.operationName = 'CreateActivity';
exports.createActivityRef = createActivityRef;

exports.createActivity = function createActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createActivityRef(dcInstance, inputVars));
}
;

const updateLeadAndAddActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLeadAndAddActivity', inputVars);
}
updateLeadAndAddActivityRef.operationName = 'UpdateLeadAndAddActivity';
exports.updateLeadAndAddActivityRef = updateLeadAndAddActivityRef;

exports.updateLeadAndAddActivity = function updateLeadAndAddActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateLeadAndAddActivityRef(dcInstance, inputVars));
}
;

const getPropertiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProperties');
}
getPropertiesRef.operationName = 'GetProperties';
exports.getPropertiesRef = getPropertiesRef;

exports.getProperties = function getProperties(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getPropertiesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getPropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProperty', inputVars);
}
getPropertyRef.operationName = 'GetProperty';
exports.getPropertyRef = getPropertyRef;

exports.getProperty = function getProperty(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPropertyRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLeadsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLeads', inputVars);
}
getLeadsRef.operationName = 'GetLeads';
exports.getLeadsRef = getLeadsRef;

exports.getLeads = function getLeads(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(getLeadsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLeadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLead', inputVars);
}
getLeadRef.operationName = 'GetLead';
exports.getLeadRef = getLeadRef;

exports.getLead = function getLead(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLeadRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getPropertyAgentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPropertyAgent', inputVars);
}
getPropertyAgentRef.operationName = 'GetPropertyAgent';
exports.getPropertyAgentRef = getPropertyAgentRef;

exports.getPropertyAgent = function getPropertyAgent(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPropertyAgentRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getAdminsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAdmins');
}
getAdminsRef.operationName = 'GetAdmins';
exports.getAdminsRef = getAdminsRef;

exports.getAdmins = function getAdmins(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getAdminsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLeadsAssignmentRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLeadsAssignment');
}
getLeadsAssignmentRef.operationName = 'GetLeadsAssignment';
exports.getLeadsAssignmentRef = getLeadsAssignmentRef;

exports.getLeadsAssignment = function getLeadsAssignment(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getLeadsAssignmentRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
