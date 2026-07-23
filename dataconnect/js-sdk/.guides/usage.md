# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUser, createProperty, updateProperty, addPropertyImage, deletePropertyImage, createLead, updateLead, createActivity, updateLeadAndAddActivity, getProperties } from '@firebasegen/default-connector';


// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation CreateProperty:  For variables, look at type CreatePropertyVars in ../index.d.ts
const { data } = await CreateProperty(dataConnect, createPropertyVars);

// Operation UpdateProperty:  For variables, look at type UpdatePropertyVars in ../index.d.ts
const { data } = await UpdateProperty(dataConnect, updatePropertyVars);

// Operation AddPropertyImage:  For variables, look at type AddPropertyImageVars in ../index.d.ts
const { data } = await AddPropertyImage(dataConnect, addPropertyImageVars);

// Operation DeletePropertyImage:  For variables, look at type DeletePropertyImageVars in ../index.d.ts
const { data } = await DeletePropertyImage(dataConnect, deletePropertyImageVars);

// Operation CreateLead:  For variables, look at type CreateLeadVars in ../index.d.ts
const { data } = await CreateLead(dataConnect, createLeadVars);

// Operation UpdateLead:  For variables, look at type UpdateLeadVars in ../index.d.ts
const { data } = await UpdateLead(dataConnect, updateLeadVars);

// Operation CreateActivity:  For variables, look at type CreateActivityVars in ../index.d.ts
const { data } = await CreateActivity(dataConnect, createActivityVars);

// Operation UpdateLeadAndAddActivity:  For variables, look at type UpdateLeadAndAddActivityVars in ../index.d.ts
const { data } = await UpdateLeadAndAddActivity(dataConnect, updateLeadAndAddActivityVars);

// Operation GetProperties: 
const { data } = await GetProperties(dataConnect);


```