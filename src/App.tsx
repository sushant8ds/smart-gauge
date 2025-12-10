import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

const Dashboard = () => {
  const [rows, setRows] = useState<any[]>([]);

  // ML Constants
  const BASELINE_USAGE = 40000;
  const K = 0.6;

  // Universal Date Parser
  const parseExcelDate = (value: any) => {
    if (!value) return null;

    // Excel number date
    if (typeof value === "number") {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (!parsed) return null;
      return new Date(parsed.y, parsed.m - 1, parsed.d);
    }

    // Text date
    if (typeof value === "string") {
      const parts = value.split(/[-\/]/).map(Number);
      if (parts.length === 3) {
        let [a, b, c] = parts;

        // DD-MM-YYYY
        if (a > 12) return new Date(c, b - 1, a);

        // MM-DD-YYYY
        return new Date(a, b - 1, c);
      }
    }

    return null;
  };

  // FILE UPLOAD HANDLER
  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      let upcomingCount = 0;
      let overdueCount = 0;

      const processed = json.map((g: any) => {
        const gageId = g["Gage ID"];
        const description = g["Description"];

        const lastCalRaw = g["Last Cal Date"];
        const lastCal = parseExcelDate(lastCalRaw);

        if (!lastCal) {
          return {
            gage_id: gageId,
            description,
            last_cal: "Invalid Date",
            next_due: "Invalid Date",
            daysLeft: "NaN",
            status: "Current",
          };
        }

        const calibFreqMonths = Number(g["Calib Freq"]) || 6;
        const usage = Number(g["Usage"]) || BASELINE_USAGE;

        const baselineDays = calibFreqMonths * 30.44;
        const usageRatio = usage / BASELINE_USAGE;

        let adjustedInterval = baselineDays / (1 + K * (usageRatio - 1));

        if (usageRatio < 0.5) adjustedInterval = baselineDays * 1.5;
        if (usageRatio > 2) adjustedInterval = baselineDays * 0.5;

        const nextDue = new Date(lastCal);
        nextDue.setDate(nextDue.getDate() + Math.round(adjustedInterval));

        const today = new Date();
        const daysLeft = Math.ceil(
          (nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        let status = "Current";
        if (daysLeft < 0) status = "Overdue";
        else if (daysLeft <= 3) status = "Upcoming";

        // Count notifications
        if (status === "Upcoming") upcomingCount++;
        if (status === "Overdue") overdueCount++;

        return {
          gage_id: gageId,
          description,
          last_cal: lastCal.toLocaleDateString(),
          next_due: nextDue.toLocaleDateString(),
          daysLeft,
          status,
        };
      });

      // Show only ONE summary notification
      if (upcomingCount > 0) {
        toast.warning(
          `${upcomingCount} gauges are due within 3 days`,
          { description: "Please check calibration schedule." }
        );
      }

      if (overdueCount > 0) {
        toast.error(
          `${overdueCount} gauges are OVERDUE!`,
          { description: "Immediate calibration required." }
        );
      }

      setRows(processed);
    };

    reader.readAsBinaryString(file);
  };

  const getBadge = (status: string) => {
    if (status === "Overdue")
      return <Badge className="bg-red-600 text-white px-3 py-1">Overdue</Badge>;
    if (status === "Upcoming")
      return <Badge className="bg-yellow-500 text-black px-3 py-1">Upcoming</Badge>;
    return <Badge className="bg-green-600 text-white px-3 py-1">Current</Badge>;
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto">

        {/* Upload Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Real-Time Dashboard</h2>

          <label>
            <Button asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" /> Upload Excel
              </span>
            </Button>
            <Input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card><CardHeader><CardTitle>{rows.filter(r => r.status === "Overdue").length}</CardTitle><p>Overdue</p></CardHeader></Card>
          <Card><CardHeader><CardTitle>{rows.filter(r => r.status === "Upcoming").length}</CardTitle><p>Upcoming (≤3 days)</p></CardHeader></Card>
          <Card><CardHeader><CardTitle>{rows.filter(r => r.status === "Current").length}</CardTitle><p>Current</p></CardHeader></Card>
          <Card><CardHeader><CardTitle>{rows.length}</CardTitle><p>Total Gauges</p></CardHeader></Card>
        </div>

        {/* TABLE */}
        <Card>
          <CardHeader><CardTitle>Gauge Status</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gauge ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Last Calibration</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((r, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{r.gage_id}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>{r.last_cal}</TableCell>
                    <TableCell>{r.next_due}</TableCell>
                    <TableCell>{r.daysLeft}</TableCell>
                    <TableCell>{getBadge(r.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </CardContent>
        </Card>

      </div>
    </section>
  );
};

export default Dashboard;
