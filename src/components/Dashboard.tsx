import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, RefreshCw } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [rows, setRows] = useState<any[]>([]);

  // ML Formula Constants
  const BASELINE_USAGE = 40; // assume 40 hrs/week
  const K = 0.6;

  // 🔥 MAIN FUNCTION: handles Excel → parses → calculates → updates dashboard
  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const processed = json.map((g: any) => {
        const lastCal = new Date(g["Last Cal Date"]);
        const baselineFreq = Number(g["Calib Freq"]) * 30.44; // months → days

        const currentUsage = Number(g["Usage"]) || 40;
        const usageRatio = currentUsage / BASELINE_USAGE;

        // ML interval formula
        let adjusted_interval =
          baselineFreq / (1 + K * (usageRatio - 1));

        // caps
        if (usageRatio < 0.5) adjusted_interval = baselineFreq * 1.5;
        if (usageRatio > 2) adjusted_interval = baselineFreq * 0.5;

        const nextDue = new Date(lastCal);
        nextDue.setDate(nextDue.getDate() + Math.round(adjusted_interval));

        const daysLeft = Math.ceil(
          (nextDue.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );

        let status = "Current";
        if (daysLeft < 0) status = "Overdue";
        else if (daysLeft <= 3) status = "Upcoming";

        return {
          gage_id: g["Gage ID"],
          description: g["Description"],
          last_cal: lastCal.toLocaleDateString(),
          next_due: nextDue.toLocaleDateString(),
          daysLeft,
          status,
        };
      });

      setRows(processed);
    };

    reader.readAsBinaryString(file);
  };

  // BADGE COLORS
  const getBadge = (status: string) => {
    if (status === "Overdue") return <Badge className="bg-red-600">Overdue</Badge>;
    if (status === "Upcoming") return <Badge className="bg-yellow-500">Upcoming</Badge>;
    return <Badge className="bg-green-600">Current</Badge>;
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto">

        {/* FILE UPLOAD */}
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

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card><CardHeader><CardTitle>{rows.filter(r=>r.status==="Overdue").length}</CardTitle><p>Overdue</p></CardHeader></Card>
          <Card><CardHeader><CardTitle>{rows.filter(r=>r.status==="Upcoming").length}</CardTitle><p>Upcoming</p></CardHeader></Card>
          <Card><CardHeader><CardTitle>{rows.filter(r=>r.status==="Current").length}</CardTitle><p>Current</p></CardHeader></Card>
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
