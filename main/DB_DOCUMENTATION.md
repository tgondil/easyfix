# Database Implementation Documentation

## Database Schema

The application uses MongoDB with the following schema:

### Report Collection

```javascript
{
  name: String,
  appliance: String, // "washer" or "dryer"
  applianceNumber: Number, // 1-20
  residenceHall: String,
  issue: String,
  timestamp: Date
}
```

## Indexes

The following indexes have been implemented to optimize query performance:

1. **Timestamp Index**
   - `{ timestamp: 1 }`
   - Supports: 
     - Filtering reports by date range
     - Sorting reports by most recent first
     - Used in: Report generation interface

2. **Compound Index: Appliance and Residence Hall**
   - `{ appliance: 1, residenceHall: 1 }`
   - Supports:
     - Filtering reports by appliance type and residence hall
     - Used in: Report generation with multiple filters

3. **Compound Index: Residence Hall and Timestamp**
   - `{ residenceHall: 1, timestamp: -1 }`
   - Supports:
     - Filtering reports by residence hall sorted by timestamp
     - Used in: Location-specific report generation

## Database Access Methods

The application implements two database access methods:

### 1. ORM (Mongoose)

- Used for approximately 60% of database operations
- Handles:
  - Basic CRUD operations for reports
  - Simple queries
- Implementation:
  - `main/models/Report.js` - Defines the Mongoose schema
  - `main/src/app/api/reports/route.js` - API routes using Mongoose

### 2. Prepared Statements (Native MongoDB Driver)

- Used for approximately 40% of database operations
- Handles:
  - Complex report filtering and aggregation
  - Transactions for batch operations
  - Dynamic UI component data retrieval
- Implementation:
  - `main/lib/preparedStatements.js` - Prepared statements implementation
  - `main/src/app/api/reports/prepared/route.js` - API routes using prepared statements

## Transaction Support

The application implements transaction support for batch operations:

- Implemented in `createReportsWithTransaction()` function
- Uses MongoDB sessions with the following isolation settings:
  - Read Concern: `local` - Ensures data consistency within the transaction
  - Write Concern: `majority` - Ensures data is written to a majority of replica set members
  - Read Preference: `primary` - Reads data from the primary node

This transaction implementation ensures:
- Atomic operations when creating multiple reports
- Data consistency in concurrent environments
- Proper error handling with transaction abort on failures

## Dynamic UI Components

The application builds UI components dynamically from database data:

1. **Residence Hall Dropdown**
   - Data retrieved using `getResidenceHalls()` function
   - API endpoint: `/api/reports/prepared?action=getResidenceHalls`
   - Implementation extracts unique residence halls from existing reports

2. **Report Filtering Interface**
   - Filters are dynamically applied based on user selections
   - Report statistics are calculated on the fly from filtered data

## Lessons Learned

1. **Schema Design**
   - Properly designed schema and indexes from the beginning improves performance
   - Consider adding more normalized collections for residence halls and appliances in future versions

2. **Database Access Methods**
   - ORM (Mongoose) provides convenience but can limit complex query capabilities
   - Prepared statements with the native driver offer more flexibility for complex reports
   - A balanced approach using both methods provides the best of both worlds

3. **Transaction Management**
   - MongoDB's transaction support ensures data consistency
   - Isolation level selection is crucial for performance vs consistency balance
   - Transaction overhead should be considered for high-volume operations

4. **Future Improvements**
   - Implement user authentication and authorization
   - Add more granular reporting capabilities
   - Consider implementing caching for frequently accessed data
   - Create dedicated collections for reference data instead of extracting from reports 