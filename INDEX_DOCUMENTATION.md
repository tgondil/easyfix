# Index Documentation

This document details the indexes implemented in the MongoDB database and the specific queries and reports they support.

## Indexes and Their Supported Queries

### 1. Timestamp Index
**Index Definition:** `{ timestamp: 1 }`

#### Supported Queries:
1. **Date Range Filtering**
   - **Query Location:** `main/lib/preparedStatements.js` - `getFilteredReportsPrepared()`
   - **Query Pattern:** 
     ```javascript
     matchStage.timestamp = { 
       $gte: new Date(startDate), 
       $lte: new Date(endDate) 
     };
     ```
   - **Used In:**
     - Report generation interface
     - Date-based report filtering
     - Historical report analysis

2. **Timestamp-based Sorting**
   - **Query Location:** `main/src/app/api/reports/route.js`
   - **Query Pattern:** 
     ```javascript
     const reports = await Report.find({}).sort({ timestamp: -1 });
     ```
   - **Used In:**
     - Main reports display
     - Default report listing
     - Recent reports dashboard

### 2. Compound Index: Appliance and Residence Hall
**Index Definition:** `{ appliance: 1, residenceHall: 1 }`

#### Supported Queries:
1. **Appliance and Hall Filtering**
   - **Query Location:** `main/lib/preparedStatements.js` - `getFilteredReportsPrepared()`
   - **Query Pattern:**
     ```javascript
     if (appliance) {
       matchStage.appliance = appliance;
     }
     if (residenceHall) {
       matchStage.residenceHall = residenceHall;
     }
     ```
   - **Used In:**
     - Appliance-specific reports
     - Hall-specific appliance reports
     - Maintenance tracking by location

2. **Appliance Statistics**
   - **Query Location:** `main/lib/preparedStatements.js` - `calculateStats()`
   - **Query Pattern:**
     ```javascript
     const pipeline = [
       { $match: matchStage },
       { $group: { ... } }
     ];
     ```
   - **Used In:**
     - Appliance usage statistics
     - Problem frequency analysis
     - Maintenance planning

### 3. Compound Index: Residence Hall and Timestamp
**Index Definition:** `{ residenceHall: 1, timestamp: -1 }`

#### Supported Queries:
1. **Hall-specific Recent Reports**
   - **Query Location:** `main/lib/preparedStatements.js` - `getFilteredReportsPrepared()`
   - **Query Pattern:**
     ```javascript
     matchStage.residenceHall = residenceHall;
     pipeline.push({ $sort: { timestamp: -1 } });
     ```
   - **Used In:**
     - Hall-specific report views
     - Recent issues by location
     - Location-based maintenance tracking

2. **Hall Activity Timeline**
   - **Query Location:** `main/src/app/page.js` - Report display logic
   - **Query Pattern:**
     ```javascript
     // Implicit in UI sorting and display
     reports.sort((a, b) => b.timestamp - a.timestamp);
     ```
   - **Used In:**
     - Hall activity monitoring
     - Issue tracking by location
     - Maintenance history by hall

## Index Usage Statistics

| Index | Query Type | Frequency | Performance Impact |
|-------|------------|-----------|-------------------|
| Timestamp | Date Range Filtering | High | Critical |
| Timestamp | Sorting | Very High | Critical |
| Appliance + Hall | Filtering | Medium | Important |
| Appliance + Hall | Statistics | Medium | Important |
| Hall + Timestamp | Hall-specific Views | High | Important |
| Hall + Timestamp | Timeline Views | High | Important |

## Best Practices

1. **Index Selection**
   - Timestamp index is most frequently used
   - Compound indexes are optimized for common query patterns
   - Index order matches query patterns (e.g., appliance before hall due to lower cardinality)

2. **Query Optimization**
   - Use prepared statements for complex queries
   - Leverage compound indexes for multi-field queries
   - Sort operations benefit from appropriate index order

3. **Maintenance**
   - Monitor index usage
   - Consider adding indexes for new query patterns
   - Review index performance regularly 