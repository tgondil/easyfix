import { MongoClient } from 'mongodb';

async function getClient() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

export async function getFilteredReportsPrepared(startDate, endDate, appliance, residenceHall) {
  const client = await getClient();
  
  try {
    const db = client.db();
    const collection = db.collection('reports');
    
    const pipeline = [];
    
    const matchStage = {};
    
    if (startDate && endDate) {
      matchStage.timestamp = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    } else if (startDate) {
      matchStage.timestamp = { $gte: new Date(startDate) };
    } else if (endDate) {
      matchStage.timestamp = { $lte: new Date(endDate) };
    }
    
    if (appliance) {
      matchStage.appliance = appliance;
    }
    
    if (residenceHall) {
      matchStage.residenceHall = residenceHall;
    }
    
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }
    
    pipeline.push({ $sort: { timestamp: -1 } });
    
    const reports = await collection.aggregate(pipeline).toArray();
    
    const stats = await calculateStats(collection, matchStage);
    
    return { reports, stats };
  } finally {
    await client.close();
  }
}

async function calculateStats(collection, matchStage) {
  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalReports: { $sum: 1 },
        avgApplianceNumber: { $avg: '$applianceNumber' },
        applianceCounts: {
          $push: '$appliance'
        },
        uniqueDates: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } } }
      }
    },
    {
      $project: {
        _id: 0,
        totalReports: 1,
        avgApplianceNumber: 1,
        applianceCounts: 1,
        uniqueDatesCount: { $size: '$uniqueDates' }
      }
    }
  ];
  
  const result = await collection.aggregate(pipeline).toArray();
  
  if (result.length === 0) {
    return {
      totalReports: 0,
      avgApplianceNumber: 0,
      mostReportedType: 'None',
      avgPerDay: 0
    };
  }
  
  const stats = result[0];
  const appliances = stats.applianceCounts;
  const applianceCounts = {};
  
  appliances.forEach(appliance => {
    applianceCounts[appliance] = (applianceCounts[appliance] || 0) + 1;
  });
  
  let mostReportedType = 'None';
  let maxCount = 0;
  
  for (const [appliance, count] of Object.entries(applianceCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostReportedType = appliance;
    }
  }
  
  const avgPerDay = stats.uniqueDatesCount > 0 
    ? (stats.totalReports / stats.uniqueDatesCount).toFixed(2) 
    : 0;
  
  return {
    totalReports: stats.totalReports,
    avgApplianceNumber: stats.avgApplianceNumber.toFixed(2),
    mostReportedType,
    avgPerDay
  };
}

export async function createReportsWithTransaction(reports) {
  const client = await getClient();
  const session = client.startSession();
  
  try {
    session.startTransaction({
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
      readPreference: 'primary'
    });
    
    const db = client.db();
    const collection = db.collection('reports');
    
    const insertPromises = reports.map(report => 
      collection.insertOne(report, { session })
    );
    
    const results = await Promise.all(insertPromises);
    
    await session.commitTransaction();
    
    return results;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
    await client.close();
  }
}

export async function getResidenceHalls() {
  const client = await getClient();
  
  try {
    const db = client.db();
    const collection = db.collection('reports');
    
    const pipeline = [
      { $group: { _id: '$residenceHall' } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: '$_id' } }
    ];
    
    return await collection.aggregate(pipeline).toArray();
  } finally {
    await client.close();
  }
} 