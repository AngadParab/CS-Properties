# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetProperties*](#getproperties)
  - [*GetProperty*](#getproperty)
  - [*GetLeads*](#getleads)
  - [*GetLead*](#getlead)
  - [*GetPropertyAgent*](#getpropertyagent)
  - [*GetAdmins*](#getadmins)
  - [*GetLeadsAssignment*](#getleadsassignment)
- [**Mutations**](#mutations)
  - [*UpsertUser*](#upsertuser)
  - [*CreateProperty*](#createproperty)
  - [*UpdateProperty*](#updateproperty)
  - [*AddPropertyImage*](#addpropertyimage)
  - [*DeletePropertyImage*](#deletepropertyimage)
  - [*CreateLead*](#createlead)
  - [*UpdateLead*](#updatelead)
  - [*CreateActivity*](#createactivity)
  - [*UpdateLeadAndAddActivity*](#updateleadandaddactivity)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetProperties
You can execute the `GetProperties` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
getProperties(options?: ExecuteQueryOptions): QueryPromise<GetPropertiesData, undefined>;

interface GetPropertiesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPropertiesData, undefined>;
}
export const getPropertiesRef: GetPropertiesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProperties(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetPropertiesData, undefined>;

interface GetPropertiesRef {
  ...
  (dc: DataConnect): QueryRef<GetPropertiesData, undefined>;
}
export const getPropertiesRef: GetPropertiesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPropertiesRef:
```typescript
const name = getPropertiesRef.operationName;
console.log(name);
```

### Variables
The `GetProperties` query has no variables.
### Return Type
Recall that executing the `GetProperties` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPropertiesData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetProperties`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProperties } from '@firebasegen/default-connector';


// Call the `getProperties()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProperties();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProperties(dataConnect);

console.log(data.properties);

// Or, you can use the `Promise` API.
getProperties().then((response) => {
  const data = response.data;
  console.log(data.properties);
});
```

### Using `GetProperties`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPropertiesRef } from '@firebasegen/default-connector';


// Call the `getPropertiesRef()` function to get a reference to the query.
const ref = getPropertiesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPropertiesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.properties);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.properties);
});
```

## GetProperty
You can execute the `GetProperty` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
getProperty(vars: GetPropertyVariables, options?: ExecuteQueryOptions): QueryPromise<GetPropertyData, GetPropertyVariables>;

interface GetPropertyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPropertyVariables): QueryRef<GetPropertyData, GetPropertyVariables>;
}
export const getPropertyRef: GetPropertyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProperty(dc: DataConnect, vars: GetPropertyVariables, options?: ExecuteQueryOptions): QueryPromise<GetPropertyData, GetPropertyVariables>;

interface GetPropertyRef {
  ...
  (dc: DataConnect, vars: GetPropertyVariables): QueryRef<GetPropertyData, GetPropertyVariables>;
}
export const getPropertyRef: GetPropertyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPropertyRef:
```typescript
const name = getPropertyRef.operationName;
console.log(name);
```

### Variables
The `GetProperty` query requires an argument of type `GetPropertyVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPropertyVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetProperty` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPropertyData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetProperty`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProperty, GetPropertyVariables } from '@firebasegen/default-connector';

// The `GetProperty` query requires an argument of type `GetPropertyVariables`:
const getPropertyVars: GetPropertyVariables = {
  id: ..., 
};

// Call the `getProperty()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProperty(getPropertyVars);
// Variables can be defined inline as well.
const { data } = await getProperty({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProperty(dataConnect, getPropertyVars);

console.log(data.property);
console.log(data.propertyImages);

// Or, you can use the `Promise` API.
getProperty(getPropertyVars).then((response) => {
  const data = response.data;
  console.log(data.property);
  console.log(data.propertyImages);
});
```

### Using `GetProperty`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPropertyRef, GetPropertyVariables } from '@firebasegen/default-connector';

// The `GetProperty` query requires an argument of type `GetPropertyVariables`:
const getPropertyVars: GetPropertyVariables = {
  id: ..., 
};

// Call the `getPropertyRef()` function to get a reference to the query.
const ref = getPropertyRef(getPropertyVars);
// Variables can be defined inline as well.
const ref = getPropertyRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPropertyRef(dataConnect, getPropertyVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.property);
console.log(data.propertyImages);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.property);
  console.log(data.propertyImages);
});
```

## GetLeads
You can execute the `GetLeads` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
getLeads(vars?: GetLeadsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLeadsData, GetLeadsVariables>;

interface GetLeadsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetLeadsVariables): QueryRef<GetLeadsData, GetLeadsVariables>;
}
export const getLeadsRef: GetLeadsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLeads(dc: DataConnect, vars?: GetLeadsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLeadsData, GetLeadsVariables>;

interface GetLeadsRef {
  ...
  (dc: DataConnect, vars?: GetLeadsVariables): QueryRef<GetLeadsData, GetLeadsVariables>;
}
export const getLeadsRef: GetLeadsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLeadsRef:
```typescript
const name = getLeadsRef.operationName;
console.log(name);
```

### Variables
The `GetLeads` query has an optional argument of type `GetLeadsVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLeadsVariables {
  status?: LeadStatus | null;
  assignedToId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `GetLeads` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLeadsData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetLeads`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLeads, GetLeadsVariables } from '@firebasegen/default-connector';

// The `GetLeads` query has an optional argument of type `GetLeadsVariables`:
const getLeadsVars: GetLeadsVariables = {
  status: ..., // optional
  assignedToId: ..., // optional
};

// Call the `getLeads()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLeads(getLeadsVars);
// Variables can be defined inline as well.
const { data } = await getLeads({ status: ..., assignedToId: ..., });
// Since all variables are optional for this query, you can omit the `GetLeadsVariables` argument.
const { data } = await getLeads();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLeads(dataConnect, getLeadsVars);

console.log(data.leads);

// Or, you can use the `Promise` API.
getLeads(getLeadsVars).then((response) => {
  const data = response.data;
  console.log(data.leads);
});
```

### Using `GetLeads`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLeadsRef, GetLeadsVariables } from '@firebasegen/default-connector';

// The `GetLeads` query has an optional argument of type `GetLeadsVariables`:
const getLeadsVars: GetLeadsVariables = {
  status: ..., // optional
  assignedToId: ..., // optional
};

// Call the `getLeadsRef()` function to get a reference to the query.
const ref = getLeadsRef(getLeadsVars);
// Variables can be defined inline as well.
const ref = getLeadsRef({ status: ..., assignedToId: ..., });
// Since all variables are optional for this query, you can omit the `GetLeadsVariables` argument.
const ref = getLeadsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLeadsRef(dataConnect, getLeadsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.leads);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.leads);
});
```

## GetLead
You can execute the `GetLead` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
getLead(vars: GetLeadVariables, options?: ExecuteQueryOptions): QueryPromise<GetLeadData, GetLeadVariables>;

interface GetLeadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLeadVariables): QueryRef<GetLeadData, GetLeadVariables>;
}
export const getLeadRef: GetLeadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLead(dc: DataConnect, vars: GetLeadVariables, options?: ExecuteQueryOptions): QueryPromise<GetLeadData, GetLeadVariables>;

interface GetLeadRef {
  ...
  (dc: DataConnect, vars: GetLeadVariables): QueryRef<GetLeadData, GetLeadVariables>;
}
export const getLeadRef: GetLeadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLeadRef:
```typescript
const name = getLeadRef.operationName;
console.log(name);
```

### Variables
The `GetLead` query requires an argument of type `GetLeadVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLeadVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetLead` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLeadData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetLead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLead, GetLeadVariables } from '@firebasegen/default-connector';

// The `GetLead` query requires an argument of type `GetLeadVariables`:
const getLeadVars: GetLeadVariables = {
  id: ..., 
};

// Call the `getLead()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLead(getLeadVars);
// Variables can be defined inline as well.
const { data } = await getLead({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLead(dataConnect, getLeadVars);

console.log(data.lead);
console.log(data.activities);

// Or, you can use the `Promise` API.
getLead(getLeadVars).then((response) => {
  const data = response.data;
  console.log(data.lead);
  console.log(data.activities);
});
```

### Using `GetLead`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLeadRef, GetLeadVariables } from '@firebasegen/default-connector';

// The `GetLead` query requires an argument of type `GetLeadVariables`:
const getLeadVars: GetLeadVariables = {
  id: ..., 
};

// Call the `getLeadRef()` function to get a reference to the query.
const ref = getLeadRef(getLeadVars);
// Variables can be defined inline as well.
const ref = getLeadRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLeadRef(dataConnect, getLeadVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.lead);
console.log(data.activities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.lead);
  console.log(data.activities);
});
```

## GetPropertyAgent
You can execute the `GetPropertyAgent` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
getPropertyAgent(vars: GetPropertyAgentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPropertyAgentData, GetPropertyAgentVariables>;

interface GetPropertyAgentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPropertyAgentVariables): QueryRef<GetPropertyAgentData, GetPropertyAgentVariables>;
}
export const getPropertyAgentRef: GetPropertyAgentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPropertyAgent(dc: DataConnect, vars: GetPropertyAgentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPropertyAgentData, GetPropertyAgentVariables>;

interface GetPropertyAgentRef {
  ...
  (dc: DataConnect, vars: GetPropertyAgentVariables): QueryRef<GetPropertyAgentData, GetPropertyAgentVariables>;
}
export const getPropertyAgentRef: GetPropertyAgentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPropertyAgentRef:
```typescript
const name = getPropertyAgentRef.operationName;
console.log(name);
```

### Variables
The `GetPropertyAgent` query requires an argument of type `GetPropertyAgentVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPropertyAgentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetPropertyAgent` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPropertyAgentData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPropertyAgentData {
  property?: {
    agent: {
      id: UUIDString;
    } & User_Key;
  };
}
```
### Using `GetPropertyAgent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPropertyAgent, GetPropertyAgentVariables } from '@firebasegen/default-connector';

// The `GetPropertyAgent` query requires an argument of type `GetPropertyAgentVariables`:
const getPropertyAgentVars: GetPropertyAgentVariables = {
  id: ..., 
};

// Call the `getPropertyAgent()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPropertyAgent(getPropertyAgentVars);
// Variables can be defined inline as well.
const { data } = await getPropertyAgent({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPropertyAgent(dataConnect, getPropertyAgentVars);

console.log(data.property);

// Or, you can use the `Promise` API.
getPropertyAgent(getPropertyAgentVars).then((response) => {
  const data = response.data;
  console.log(data.property);
});
```

### Using `GetPropertyAgent`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPropertyAgentRef, GetPropertyAgentVariables } from '@firebasegen/default-connector';

// The `GetPropertyAgent` query requires an argument of type `GetPropertyAgentVariables`:
const getPropertyAgentVars: GetPropertyAgentVariables = {
  id: ..., 
};

// Call the `getPropertyAgentRef()` function to get a reference to the query.
const ref = getPropertyAgentRef(getPropertyAgentVars);
// Variables can be defined inline as well.
const ref = getPropertyAgentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPropertyAgentRef(dataConnect, getPropertyAgentVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.property);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.property);
});
```

## GetAdmins
You can execute the `GetAdmins` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
getAdmins(options?: ExecuteQueryOptions): QueryPromise<GetAdminsData, undefined>;

interface GetAdminsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAdminsData, undefined>;
}
export const getAdminsRef: GetAdminsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAdmins(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetAdminsData, undefined>;

interface GetAdminsRef {
  ...
  (dc: DataConnect): QueryRef<GetAdminsData, undefined>;
}
export const getAdminsRef: GetAdminsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAdminsRef:
```typescript
const name = getAdminsRef.operationName;
console.log(name);
```

### Variables
The `GetAdmins` query has no variables.
### Return Type
Recall that executing the `GetAdmins` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAdminsData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAdminsData {
  users: ({
    id: UUIDString;
  } & User_Key)[];
}
```
### Using `GetAdmins`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAdmins } from '@firebasegen/default-connector';


// Call the `getAdmins()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAdmins();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAdmins(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
getAdmins().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetAdmins`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAdminsRef } from '@firebasegen/default-connector';


// Call the `getAdminsRef()` function to get a reference to the query.
const ref = getAdminsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAdminsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetLeadsAssignment
You can execute the `GetLeadsAssignment` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
getLeadsAssignment(options?: ExecuteQueryOptions): QueryPromise<GetLeadsAssignmentData, undefined>;

interface GetLeadsAssignmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetLeadsAssignmentData, undefined>;
}
export const getLeadsAssignmentRef: GetLeadsAssignmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLeadsAssignment(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetLeadsAssignmentData, undefined>;

interface GetLeadsAssignmentRef {
  ...
  (dc: DataConnect): QueryRef<GetLeadsAssignmentData, undefined>;
}
export const getLeadsAssignmentRef: GetLeadsAssignmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLeadsAssignmentRef:
```typescript
const name = getLeadsAssignmentRef.operationName;
console.log(name);
```

### Variables
The `GetLeadsAssignment` query has no variables.
### Return Type
Recall that executing the `GetLeadsAssignment` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLeadsAssignmentData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLeadsAssignmentData {
  leads: ({
    assignedTo?: {
      id: UUIDString;
    } & User_Key;
  })[];
}
```
### Using `GetLeadsAssignment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLeadsAssignment } from '@firebasegen/default-connector';


// Call the `getLeadsAssignment()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLeadsAssignment();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLeadsAssignment(dataConnect);

console.log(data.leads);

// Or, you can use the `Promise` API.
getLeadsAssignment().then((response) => {
  const data = response.data;
  console.log(data.leads);
});
```

### Using `GetLeadsAssignment`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLeadsAssignmentRef } from '@firebasegen/default-connector';


// Call the `getLeadsAssignmentRef()` function to get a reference to the query.
const ref = getLeadsAssignmentRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLeadsAssignmentRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.leads);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.leads);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  id: UUIDString;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@firebasegen/default-connector';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  email: ..., 
  name: ..., 
  role: ..., 
  phone: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ id: ..., email: ..., name: ..., role: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@firebasegen/default-connector';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  email: ..., 
  name: ..., 
  role: ..., 
  phone: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ id: ..., email: ..., name: ..., role: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateProperty
You can execute the `CreateProperty` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
createProperty(vars: CreatePropertyVariables): MutationPromise<CreatePropertyData, CreatePropertyVariables>;

interface CreatePropertyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePropertyVariables): MutationRef<CreatePropertyData, CreatePropertyVariables>;
}
export const createPropertyRef: CreatePropertyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProperty(dc: DataConnect, vars: CreatePropertyVariables): MutationPromise<CreatePropertyData, CreatePropertyVariables>;

interface CreatePropertyRef {
  ...
  (dc: DataConnect, vars: CreatePropertyVariables): MutationRef<CreatePropertyData, CreatePropertyVariables>;
}
export const createPropertyRef: CreatePropertyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPropertyRef:
```typescript
const name = createPropertyRef.operationName;
console.log(name);
```

### Variables
The `CreateProperty` mutation requires an argument of type `CreatePropertyVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateProperty` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePropertyData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePropertyData {
  property_insert: Property_Key;
}
```
### Using `CreateProperty`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProperty, CreatePropertyVariables } from '@firebasegen/default-connector';

// The `CreateProperty` mutation requires an argument of type `CreatePropertyVariables`:
const createPropertyVars: CreatePropertyVariables = {
  title: ..., 
  description: ..., 
  price: ..., 
  status: ..., 
  type: ..., 
  bedrooms: ..., // optional
  bathrooms: ..., // optional
  areaSqFt: ..., // optional
  address: ..., 
  city: ..., 
  agentId: ..., 
};

// Call the `createProperty()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProperty(createPropertyVars);
// Variables can be defined inline as well.
const { data } = await createProperty({ title: ..., description: ..., price: ..., status: ..., type: ..., bedrooms: ..., bathrooms: ..., areaSqFt: ..., address: ..., city: ..., agentId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProperty(dataConnect, createPropertyVars);

console.log(data.property_insert);

// Or, you can use the `Promise` API.
createProperty(createPropertyVars).then((response) => {
  const data = response.data;
  console.log(data.property_insert);
});
```

### Using `CreateProperty`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPropertyRef, CreatePropertyVariables } from '@firebasegen/default-connector';

// The `CreateProperty` mutation requires an argument of type `CreatePropertyVariables`:
const createPropertyVars: CreatePropertyVariables = {
  title: ..., 
  description: ..., 
  price: ..., 
  status: ..., 
  type: ..., 
  bedrooms: ..., // optional
  bathrooms: ..., // optional
  areaSqFt: ..., // optional
  address: ..., 
  city: ..., 
  agentId: ..., 
};

// Call the `createPropertyRef()` function to get a reference to the mutation.
const ref = createPropertyRef(createPropertyVars);
// Variables can be defined inline as well.
const ref = createPropertyRef({ title: ..., description: ..., price: ..., status: ..., type: ..., bedrooms: ..., bathrooms: ..., areaSqFt: ..., address: ..., city: ..., agentId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPropertyRef(dataConnect, createPropertyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.property_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.property_insert);
});
```

## UpdateProperty
You can execute the `UpdateProperty` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
updateProperty(vars: UpdatePropertyVariables): MutationPromise<UpdatePropertyData, UpdatePropertyVariables>;

interface UpdatePropertyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePropertyVariables): MutationRef<UpdatePropertyData, UpdatePropertyVariables>;
}
export const updatePropertyRef: UpdatePropertyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProperty(dc: DataConnect, vars: UpdatePropertyVariables): MutationPromise<UpdatePropertyData, UpdatePropertyVariables>;

interface UpdatePropertyRef {
  ...
  (dc: DataConnect, vars: UpdatePropertyVariables): MutationRef<UpdatePropertyData, UpdatePropertyVariables>;
}
export const updatePropertyRef: UpdatePropertyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePropertyRef:
```typescript
const name = updatePropertyRef.operationName;
console.log(name);
```

### Variables
The `UpdateProperty` mutation requires an argument of type `UpdatePropertyVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateProperty` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePropertyData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePropertyData {
  property_update?: Property_Key | null;
}
```
### Using `UpdateProperty`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProperty, UpdatePropertyVariables } from '@firebasegen/default-connector';

// The `UpdateProperty` mutation requires an argument of type `UpdatePropertyVariables`:
const updatePropertyVars: UpdatePropertyVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  price: ..., // optional
  status: ..., // optional
  type: ..., // optional
  bedrooms: ..., // optional
  bathrooms: ..., // optional
  areaSqFt: ..., // optional
  address: ..., // optional
  city: ..., // optional
  agentId: ..., // optional
};

// Call the `updateProperty()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProperty(updatePropertyVars);
// Variables can be defined inline as well.
const { data } = await updateProperty({ id: ..., title: ..., description: ..., price: ..., status: ..., type: ..., bedrooms: ..., bathrooms: ..., areaSqFt: ..., address: ..., city: ..., agentId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProperty(dataConnect, updatePropertyVars);

console.log(data.property_update);

// Or, you can use the `Promise` API.
updateProperty(updatePropertyVars).then((response) => {
  const data = response.data;
  console.log(data.property_update);
});
```

### Using `UpdateProperty`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePropertyRef, UpdatePropertyVariables } from '@firebasegen/default-connector';

// The `UpdateProperty` mutation requires an argument of type `UpdatePropertyVariables`:
const updatePropertyVars: UpdatePropertyVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  price: ..., // optional
  status: ..., // optional
  type: ..., // optional
  bedrooms: ..., // optional
  bathrooms: ..., // optional
  areaSqFt: ..., // optional
  address: ..., // optional
  city: ..., // optional
  agentId: ..., // optional
};

// Call the `updatePropertyRef()` function to get a reference to the mutation.
const ref = updatePropertyRef(updatePropertyVars);
// Variables can be defined inline as well.
const ref = updatePropertyRef({ id: ..., title: ..., description: ..., price: ..., status: ..., type: ..., bedrooms: ..., bathrooms: ..., areaSqFt: ..., address: ..., city: ..., agentId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePropertyRef(dataConnect, updatePropertyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.property_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.property_update);
});
```

## AddPropertyImage
You can execute the `AddPropertyImage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
addPropertyImage(vars: AddPropertyImageVariables): MutationPromise<AddPropertyImageData, AddPropertyImageVariables>;

interface AddPropertyImageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddPropertyImageVariables): MutationRef<AddPropertyImageData, AddPropertyImageVariables>;
}
export const addPropertyImageRef: AddPropertyImageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addPropertyImage(dc: DataConnect, vars: AddPropertyImageVariables): MutationPromise<AddPropertyImageData, AddPropertyImageVariables>;

interface AddPropertyImageRef {
  ...
  (dc: DataConnect, vars: AddPropertyImageVariables): MutationRef<AddPropertyImageData, AddPropertyImageVariables>;
}
export const addPropertyImageRef: AddPropertyImageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addPropertyImageRef:
```typescript
const name = addPropertyImageRef.operationName;
console.log(name);
```

### Variables
The `AddPropertyImage` mutation requires an argument of type `AddPropertyImageVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddPropertyImageVariables {
  propertyId: UUIDString;
  url: string;
  displayOrder: number;
}
```
### Return Type
Recall that executing the `AddPropertyImage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddPropertyImageData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddPropertyImageData {
  propertyImage_insert: PropertyImage_Key;
}
```
### Using `AddPropertyImage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addPropertyImage, AddPropertyImageVariables } from '@firebasegen/default-connector';

// The `AddPropertyImage` mutation requires an argument of type `AddPropertyImageVariables`:
const addPropertyImageVars: AddPropertyImageVariables = {
  propertyId: ..., 
  url: ..., 
  displayOrder: ..., 
};

// Call the `addPropertyImage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addPropertyImage(addPropertyImageVars);
// Variables can be defined inline as well.
const { data } = await addPropertyImage({ propertyId: ..., url: ..., displayOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addPropertyImage(dataConnect, addPropertyImageVars);

console.log(data.propertyImage_insert);

// Or, you can use the `Promise` API.
addPropertyImage(addPropertyImageVars).then((response) => {
  const data = response.data;
  console.log(data.propertyImage_insert);
});
```

### Using `AddPropertyImage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addPropertyImageRef, AddPropertyImageVariables } from '@firebasegen/default-connector';

// The `AddPropertyImage` mutation requires an argument of type `AddPropertyImageVariables`:
const addPropertyImageVars: AddPropertyImageVariables = {
  propertyId: ..., 
  url: ..., 
  displayOrder: ..., 
};

// Call the `addPropertyImageRef()` function to get a reference to the mutation.
const ref = addPropertyImageRef(addPropertyImageVars);
// Variables can be defined inline as well.
const ref = addPropertyImageRef({ propertyId: ..., url: ..., displayOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addPropertyImageRef(dataConnect, addPropertyImageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.propertyImage_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.propertyImage_insert);
});
```

## DeletePropertyImage
You can execute the `DeletePropertyImage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
deletePropertyImage(vars: DeletePropertyImageVariables): MutationPromise<DeletePropertyImageData, DeletePropertyImageVariables>;

interface DeletePropertyImageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePropertyImageVariables): MutationRef<DeletePropertyImageData, DeletePropertyImageVariables>;
}
export const deletePropertyImageRef: DeletePropertyImageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePropertyImage(dc: DataConnect, vars: DeletePropertyImageVariables): MutationPromise<DeletePropertyImageData, DeletePropertyImageVariables>;

interface DeletePropertyImageRef {
  ...
  (dc: DataConnect, vars: DeletePropertyImageVariables): MutationRef<DeletePropertyImageData, DeletePropertyImageVariables>;
}
export const deletePropertyImageRef: DeletePropertyImageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePropertyImageRef:
```typescript
const name = deletePropertyImageRef.operationName;
console.log(name);
```

### Variables
The `DeletePropertyImage` mutation requires an argument of type `DeletePropertyImageVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePropertyImageVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeletePropertyImage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePropertyImageData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePropertyImageData {
  propertyImage_delete?: PropertyImage_Key | null;
}
```
### Using `DeletePropertyImage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePropertyImage, DeletePropertyImageVariables } from '@firebasegen/default-connector';

// The `DeletePropertyImage` mutation requires an argument of type `DeletePropertyImageVariables`:
const deletePropertyImageVars: DeletePropertyImageVariables = {
  id: ..., 
};

// Call the `deletePropertyImage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePropertyImage(deletePropertyImageVars);
// Variables can be defined inline as well.
const { data } = await deletePropertyImage({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePropertyImage(dataConnect, deletePropertyImageVars);

console.log(data.propertyImage_delete);

// Or, you can use the `Promise` API.
deletePropertyImage(deletePropertyImageVars).then((response) => {
  const data = response.data;
  console.log(data.propertyImage_delete);
});
```

### Using `DeletePropertyImage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePropertyImageRef, DeletePropertyImageVariables } from '@firebasegen/default-connector';

// The `DeletePropertyImage` mutation requires an argument of type `DeletePropertyImageVariables`:
const deletePropertyImageVars: DeletePropertyImageVariables = {
  id: ..., 
};

// Call the `deletePropertyImageRef()` function to get a reference to the mutation.
const ref = deletePropertyImageRef(deletePropertyImageVars);
// Variables can be defined inline as well.
const ref = deletePropertyImageRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePropertyImageRef(dataConnect, deletePropertyImageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.propertyImage_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.propertyImage_delete);
});
```

## CreateLead
You can execute the `CreateLead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
createLead(vars: CreateLeadVariables): MutationPromise<CreateLeadData, CreateLeadVariables>;

interface CreateLeadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLeadVariables): MutationRef<CreateLeadData, CreateLeadVariables>;
}
export const createLeadRef: CreateLeadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLead(dc: DataConnect, vars: CreateLeadVariables): MutationPromise<CreateLeadData, CreateLeadVariables>;

interface CreateLeadRef {
  ...
  (dc: DataConnect, vars: CreateLeadVariables): MutationRef<CreateLeadData, CreateLeadVariables>;
}
export const createLeadRef: CreateLeadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLeadRef:
```typescript
const name = createLeadRef.operationName;
console.log(name);
```

### Variables
The `CreateLead` mutation requires an argument of type `CreateLeadVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateLead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLeadData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLeadData {
  lead_insert: Lead_Key;
}
```
### Using `CreateLead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLead, CreateLeadVariables } from '@firebasegen/default-connector';

// The `CreateLead` mutation requires an argument of type `CreateLeadVariables`:
const createLeadVars: CreateLeadVariables = {
  fullName: ..., 
  email: ..., 
  phone: ..., 
  status: ..., 
  budget: ..., 
  notes: ..., // optional
  source: ..., // optional
  propertyId: ..., // optional
  assignedToId: ..., // optional
};

// Call the `createLead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLead(createLeadVars);
// Variables can be defined inline as well.
const { data } = await createLead({ fullName: ..., email: ..., phone: ..., status: ..., budget: ..., notes: ..., source: ..., propertyId: ..., assignedToId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLead(dataConnect, createLeadVars);

console.log(data.lead_insert);

// Or, you can use the `Promise` API.
createLead(createLeadVars).then((response) => {
  const data = response.data;
  console.log(data.lead_insert);
});
```

### Using `CreateLead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLeadRef, CreateLeadVariables } from '@firebasegen/default-connector';

// The `CreateLead` mutation requires an argument of type `CreateLeadVariables`:
const createLeadVars: CreateLeadVariables = {
  fullName: ..., 
  email: ..., 
  phone: ..., 
  status: ..., 
  budget: ..., 
  notes: ..., // optional
  source: ..., // optional
  propertyId: ..., // optional
  assignedToId: ..., // optional
};

// Call the `createLeadRef()` function to get a reference to the mutation.
const ref = createLeadRef(createLeadVars);
// Variables can be defined inline as well.
const ref = createLeadRef({ fullName: ..., email: ..., phone: ..., status: ..., budget: ..., notes: ..., source: ..., propertyId: ..., assignedToId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLeadRef(dataConnect, createLeadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lead_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lead_insert);
});
```

## UpdateLead
You can execute the `UpdateLead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
updateLead(vars: UpdateLeadVariables): MutationPromise<UpdateLeadData, UpdateLeadVariables>;

interface UpdateLeadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLeadVariables): MutationRef<UpdateLeadData, UpdateLeadVariables>;
}
export const updateLeadRef: UpdateLeadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLead(dc: DataConnect, vars: UpdateLeadVariables): MutationPromise<UpdateLeadData, UpdateLeadVariables>;

interface UpdateLeadRef {
  ...
  (dc: DataConnect, vars: UpdateLeadVariables): MutationRef<UpdateLeadData, UpdateLeadVariables>;
}
export const updateLeadRef: UpdateLeadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLeadRef:
```typescript
const name = updateLeadRef.operationName;
console.log(name);
```

### Variables
The `UpdateLead` mutation requires an argument of type `UpdateLeadVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateLead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLeadData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLeadData {
  lead_update?: Lead_Key | null;
}
```
### Using `UpdateLead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLead, UpdateLeadVariables } from '@firebasegen/default-connector';

// The `UpdateLead` mutation requires an argument of type `UpdateLeadVariables`:
const updateLeadVars: UpdateLeadVariables = {
  id: ..., 
  fullName: ..., // optional
  email: ..., // optional
  phone: ..., // optional
  status: ..., // optional
  budget: ..., // optional
  notes: ..., // optional
  source: ..., // optional
  propertyId: ..., // optional
  assignedToId: ..., // optional
};

// Call the `updateLead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLead(updateLeadVars);
// Variables can be defined inline as well.
const { data } = await updateLead({ id: ..., fullName: ..., email: ..., phone: ..., status: ..., budget: ..., notes: ..., source: ..., propertyId: ..., assignedToId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLead(dataConnect, updateLeadVars);

console.log(data.lead_update);

// Or, you can use the `Promise` API.
updateLead(updateLeadVars).then((response) => {
  const data = response.data;
  console.log(data.lead_update);
});
```

### Using `UpdateLead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLeadRef, UpdateLeadVariables } from '@firebasegen/default-connector';

// The `UpdateLead` mutation requires an argument of type `UpdateLeadVariables`:
const updateLeadVars: UpdateLeadVariables = {
  id: ..., 
  fullName: ..., // optional
  email: ..., // optional
  phone: ..., // optional
  status: ..., // optional
  budget: ..., // optional
  notes: ..., // optional
  source: ..., // optional
  propertyId: ..., // optional
  assignedToId: ..., // optional
};

// Call the `updateLeadRef()` function to get a reference to the mutation.
const ref = updateLeadRef(updateLeadVars);
// Variables can be defined inline as well.
const ref = updateLeadRef({ id: ..., fullName: ..., email: ..., phone: ..., status: ..., budget: ..., notes: ..., source: ..., propertyId: ..., assignedToId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLeadRef(dataConnect, updateLeadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lead_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lead_update);
});
```

## CreateActivity
You can execute the `CreateActivity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
createActivity(vars: CreateActivityVariables): MutationPromise<CreateActivityData, CreateActivityVariables>;

interface CreateActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateActivityVariables): MutationRef<CreateActivityData, CreateActivityVariables>;
}
export const createActivityRef: CreateActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createActivity(dc: DataConnect, vars: CreateActivityVariables): MutationPromise<CreateActivityData, CreateActivityVariables>;

interface CreateActivityRef {
  ...
  (dc: DataConnect, vars: CreateActivityVariables): MutationRef<CreateActivityData, CreateActivityVariables>;
}
export const createActivityRef: CreateActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createActivityRef:
```typescript
const name = createActivityRef.operationName;
console.log(name);
```

### Variables
The `CreateActivity` mutation requires an argument of type `CreateActivityVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateActivityVariables {
  leadId: UUIDString;
  actorId: UUIDString;
  type: ActivityType;
  comment: string;
}
```
### Return Type
Recall that executing the `CreateActivity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateActivityData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateActivityData {
  activity_insert: Activity_Key;
}
```
### Using `CreateActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createActivity, CreateActivityVariables } from '@firebasegen/default-connector';

// The `CreateActivity` mutation requires an argument of type `CreateActivityVariables`:
const createActivityVars: CreateActivityVariables = {
  leadId: ..., 
  actorId: ..., 
  type: ..., 
  comment: ..., 
};

// Call the `createActivity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createActivity(createActivityVars);
// Variables can be defined inline as well.
const { data } = await createActivity({ leadId: ..., actorId: ..., type: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createActivity(dataConnect, createActivityVars);

console.log(data.activity_insert);

// Or, you can use the `Promise` API.
createActivity(createActivityVars).then((response) => {
  const data = response.data;
  console.log(data.activity_insert);
});
```

### Using `CreateActivity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createActivityRef, CreateActivityVariables } from '@firebasegen/default-connector';

// The `CreateActivity` mutation requires an argument of type `CreateActivityVariables`:
const createActivityVars: CreateActivityVariables = {
  leadId: ..., 
  actorId: ..., 
  type: ..., 
  comment: ..., 
};

// Call the `createActivityRef()` function to get a reference to the mutation.
const ref = createActivityRef(createActivityVars);
// Variables can be defined inline as well.
const ref = createActivityRef({ leadId: ..., actorId: ..., type: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createActivityRef(dataConnect, createActivityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activity_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activity_insert);
});
```

## UpdateLeadAndAddActivity
You can execute the `UpdateLeadAndAddActivity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js-sdk/index.d.ts](./index.d.ts):
```typescript
updateLeadAndAddActivity(vars: UpdateLeadAndAddActivityVariables): MutationPromise<UpdateLeadAndAddActivityData, UpdateLeadAndAddActivityVariables>;

interface UpdateLeadAndAddActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLeadAndAddActivityVariables): MutationRef<UpdateLeadAndAddActivityData, UpdateLeadAndAddActivityVariables>;
}
export const updateLeadAndAddActivityRef: UpdateLeadAndAddActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLeadAndAddActivity(dc: DataConnect, vars: UpdateLeadAndAddActivityVariables): MutationPromise<UpdateLeadAndAddActivityData, UpdateLeadAndAddActivityVariables>;

interface UpdateLeadAndAddActivityRef {
  ...
  (dc: DataConnect, vars: UpdateLeadAndAddActivityVariables): MutationRef<UpdateLeadAndAddActivityData, UpdateLeadAndAddActivityVariables>;
}
export const updateLeadAndAddActivityRef: UpdateLeadAndAddActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLeadAndAddActivityRef:
```typescript
const name = updateLeadAndAddActivityRef.operationName;
console.log(name);
```

### Variables
The `UpdateLeadAndAddActivity` mutation requires an argument of type `UpdateLeadAndAddActivityVariables`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateLeadAndAddActivityVariables {
  leadId: UUIDString;
  newStatus: LeadStatus;
  actorId: UUIDString;
  comment: string;
}
```
### Return Type
Recall that executing the `UpdateLeadAndAddActivity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLeadAndAddActivityData`, which is defined in [js-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLeadAndAddActivityData {
  lead_update?: Lead_Key | null;
  activity_insert: Activity_Key;
}
```
### Using `UpdateLeadAndAddActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLeadAndAddActivity, UpdateLeadAndAddActivityVariables } from '@firebasegen/default-connector';

// The `UpdateLeadAndAddActivity` mutation requires an argument of type `UpdateLeadAndAddActivityVariables`:
const updateLeadAndAddActivityVars: UpdateLeadAndAddActivityVariables = {
  leadId: ..., 
  newStatus: ..., 
  actorId: ..., 
  comment: ..., 
};

// Call the `updateLeadAndAddActivity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLeadAndAddActivity(updateLeadAndAddActivityVars);
// Variables can be defined inline as well.
const { data } = await updateLeadAndAddActivity({ leadId: ..., newStatus: ..., actorId: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLeadAndAddActivity(dataConnect, updateLeadAndAddActivityVars);

console.log(data.lead_update);
console.log(data.activity_insert);

// Or, you can use the `Promise` API.
updateLeadAndAddActivity(updateLeadAndAddActivityVars).then((response) => {
  const data = response.data;
  console.log(data.lead_update);
  console.log(data.activity_insert);
});
```

### Using `UpdateLeadAndAddActivity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLeadAndAddActivityRef, UpdateLeadAndAddActivityVariables } from '@firebasegen/default-connector';

// The `UpdateLeadAndAddActivity` mutation requires an argument of type `UpdateLeadAndAddActivityVariables`:
const updateLeadAndAddActivityVars: UpdateLeadAndAddActivityVariables = {
  leadId: ..., 
  newStatus: ..., 
  actorId: ..., 
  comment: ..., 
};

// Call the `updateLeadAndAddActivityRef()` function to get a reference to the mutation.
const ref = updateLeadAndAddActivityRef(updateLeadAndAddActivityVars);
// Variables can be defined inline as well.
const ref = updateLeadAndAddActivityRef({ leadId: ..., newStatus: ..., actorId: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLeadAndAddActivityRef(dataConnect, updateLeadAndAddActivityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lead_update);
console.log(data.activity_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lead_update);
  console.log(data.activity_insert);
});
```

