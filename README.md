# Customer - CRM (Backend using NodeJS)

This is a **Customer Relationship Management (CRM)** application backend built using **Node.js** and **SQLite**. It provides functionality for managing customers, logging interactions and more.

### API endpoints

* https://crm-system-tlpo.onrender.com/register `methods supported: [POST]`
* https://crm-system-tlpo.onrender.com/login `methods supported: [POST]`
* https://crm-system-tlpo.onrender.com/customers `send with JWT token methods supported: [GET, POST, PUT]`
* https://crm-system-tlpo.onrender.com/customers/id `send with JWT token methods supported: [DELETE]`
* https://crm-system-tlpo.onrender.com/search?query=value `send with JWT token method supported: [GET]`

  * Used to search name, email or phone
  * `value` field replaces with search parameter
* https://crm-system-tlpo.onrender.com/search-company?company=value `send with JWT token method supported: [GET]`

  * Used to search customers who workes in same company
  * `value` field replaces with company name

### **Features**

1. Customer Management

   * Create, Update, Delete and Fetch customer information
   * Pagination and searching features added to find customers with name, email or phone
   * By using company name, we can fetch all the customers who are working in particular company
2. Register

   * Before accessing customer data, need to register with CRM application to create an account.
   * After creating the account, user needs to login with CRM application to continue.
3. Login

   * Once after creating account in CRM application, to perform CRUD opperation need to login.
   * Right after login, internal system will generate specific JWT token for users to perform operations.
   * This JWT token is valid for 90 days, without JWT token, no one can access the customer data.
4. Authentication

   * Secure user authentication using JWT token validation.
   * Users password are hashed with bcrypt. Which provides encrypt and decrypt the password during register and login process.

> Happy Coding...
