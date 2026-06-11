import { NextResponse } from "next/server";
import sql from "mssql";

export async function GET() {
  try {
    // 1. .env variables
    const dbConfig = {
      user: process.env.COMPANY_DB_USER as string,
      password: process.env.COMPANY_DB_PASSWORD as string,
      server: process.env.COMPANY_DB_SERVER as string,
      port: parseInt(process.env.COMPANY_DB_PORT || "1433"),
      database: process.env.COMPANY_DB_NAME as string,
      options: {
        encrypt: false, // for direct IP connections without SSL
        trustServerCertificate: true, 
      },
    };

    // 2. Connect to the database
    const pool = await sql.connect(dbConfig);

    // 3. Execute the Stored Procedure
    const result = await pool.request().execute("usp_GetEmployeeDetails");

    // 4. Return the data to Reception dashboard
    return NextResponse.json(result.recordset, { status: 200 });

  } catch (error: any) {
    console.error("SQL Database connection error:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees from company database", details: error.message },
      { status: 500 }
    );
  }
}