import { NextResponse } from "next/server";
import { 
  getFilteredReportsPrepared, 
  createReportsWithTransaction,
  getResidenceHalls
} from "@/lib/preparedStatements";

// API route to get filtered reports using prepared statements
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const appliance = searchParams.get('appliance');
    const residenceHall = searchParams.get('residenceHall');
    const action = searchParams.get('action');
    
    // If requesting residence halls for dynamic UI
    if (action === 'getResidenceHalls') {
      const halls = await getResidenceHalls();
      return NextResponse.json(halls);
    }
    
    // Get filtered reports with prepared statements
    const results = await getFilteredReportsPrepared(
      startDate, 
      endDate, 
      appliance, 
      residenceHall
    );
    
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in prepared reports API:", error);
    return NextResponse.json(
      { error: "Error fetching reports with prepared statements" }, 
      { status: 500 }
    );
  }
}

// API route to create multiple reports with transaction support
export async function POST(req) {
  try {
    const reports = await req.json();
    
    if (!Array.isArray(reports)) {
      return NextResponse.json(
        { error: "Expected an array of reports" }, 
        { status: 400 }
      );
    }
    
    // Add timestamps to reports if not provided
    const reportsWithTimestamps = reports.map(report => ({
      ...report,
      timestamp: report.timestamp || new Date()
    }));
    
    const results = await createReportsWithTransaction(reportsWithTimestamps);
    
    return NextResponse.json(
      { message: `${results.length} reports created successfully` }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in transaction API:", error);
    return NextResponse.json(
      { error: "Error creating reports with transaction" }, 
      { status: 500 }
    );
  }
} 