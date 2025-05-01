import dbConnect from "@/lib/mongodb";
import Report from "@/models/Report";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const reports = await Report.find({}).sort({ timestamp: -1 });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching reports" }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const { name, appliance, applianceNumber, residenceHall, issue, timestamp } = await req.json();
    
    const newReport = new Report({
      name,
      appliance,
      applianceNumber,
      residenceHall,
      issue,
      timestamp,
    });
    
    await newReport.save();
    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating report" }, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  try {
    const { _id, ...updates } = await req.json();
    const updatedReport = await Report.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedReport);
  } catch (error) {
    return NextResponse.json({ error: "Error updating report" }, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    const deletedReport = await Report.findByIdAndDelete(id);
    
    if (!deletedReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting report" }, { status: 500 });
  }
}