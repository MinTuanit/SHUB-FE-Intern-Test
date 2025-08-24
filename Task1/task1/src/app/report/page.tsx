"use client";

import * as XLSX from "xlsx";
import { useMemo, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

type Row = Record<string, any>;

interface ReportInfo {
  chain: string | null;
  station: string | null;
  typeOfReport: string | null;
  fromDate: string | null;
  toDate: string | null;
  totalMoney: string | null;
  totalLit: string | null;
}

export default function Page() {
  const [reportInfo, setReportInfo] = useState<ReportInfo>();
  const [rawData, setRawData] = useState<Row[]>([]);
  const [fromHour, setFromHour] = useState<Date | null>(null);
  const [toHour, setToHour] = useState<Date | null>(null);

  // load file excel
  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const reportInfo = {
      chain: rows[2]?.[1] || null, // chuỗi
      station: rows[2]?.[4] || null, // trạm
      typeOfReport: rows[3]?.[1] || null, // loại báo cáo
      fromDate: rows[4]?.[1] || null, // từ ngày
      toDate: rows[4]?.[4] || null, // đến ngày
      totalMoney: rows[5]?.[1] || null, // tổng tiền
      totalLit: rows[5]?.[4] || null, // tổng lít
    };

    const headerRowIndex = 7;
    const headers: string[] = rows[headerRowIndex];
    const dataRows = rows.slice(headerRowIndex + 1);

    const jsonData: Row[] = dataRows.map((r) => {
      const o: Row = {};
      headers.forEach((h, i) => (o[h] = r[i] ?? null));
      return o;
    });
    setReportInfo(reportInfo);
    setRawData(jsonData);
  };

  // lọc dữ liệu theo giờ đã chọn
  const filtered = useMemo(() => {
    if (!rawData.length) return [];

    return rawData.filter((row) => {
      const timeStr = String(row["Giờ"] || "").trim();
      if (!timeStr) return false;

      const [h, m, s] = timeStr.split(":").map(Number);
      if (isNaN(h) || isNaN(m) || isNaN(s)) return false;

      const recordMinutes = h * 60 + m;
      const fromMinutes =
        fromHour !== null
          ? fromHour.getHours() * 60 + fromHour.getMinutes()
          : null;
      const toMinutes =
        toHour !== null ? toHour.getHours() * 60 + toHour.getMinutes() : null;

      if (fromMinutes !== null && recordMinutes < fromMinutes) return false;
      if (toMinutes !== null && recordMinutes >= toMinutes) return false;

      return true;
    });
  }, [rawData, fromHour, toHour]);

  const columns = useMemo(
    () => (filtered[0] ? Object.keys(filtered[0]) : []),
    [filtered]
  );

  const totalThanhTien = useMemo(() => {
    return filtered.reduce((sum, row) => {
      const value = Number(row["Thành tiền (VNĐ)"]) || 0;
      return sum + value;
    }, 0);
  }, [filtered]);

  return (
    <div className="bg-gray-50 min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-blue-700">
        Trích xuất dữ liệu từ file báo cáo
      </h1>

      {/* Upload + bộ lọc */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ height: "56px" }}
            startIcon={<UploadFileIcon />}
          >
            Upload file
            <input
              type="file"
              hidden
              accept=".xlsx"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Giờ bắt đầu"
              value={fromHour}
              onChange={(newValue) => setFromHour(newValue)}
            />
          </LocalizationProvider>
        </div>

        <div className="flex flex-col gap-2">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Giờ kết thúc"
              value={toHour}
              onChange={(newValue) => setToHour(newValue)}
            />
          </LocalizationProvider>
        </div>
      </div>

      <div className="text-xl font-medium text-gray-700 bg-white p-3 rounded-lg shadow grid gap-6 md:grid-cols-3">
        <div className="mr-4 text-black flex flex-col gap-2">
          Chuỗi: {reportInfo?.chain}
        </div>
        <div className="mr-4 text-black flex flex-col gap-2">
          Trạm: {reportInfo?.station}
        </div>
      </div>
      <div className="text-xl font-medium text-gray-700 bg-white p-3 rounded-lg shadow grid gap-6 md:grid-cols-3">
        <span className="mr-4 text-black flex flex-col gap-2">
          Loại báo cáo: {reportInfo?.typeOfReport}
        </span>
        <span className="mr-4 text-black flex flex-col gap-2">
          Ngày: {reportInfo?.fromDate?.split(" ")[0]}
        </span>
        <span className="mr-4 text-black flex flex-col gap-2">
          Tổng thành tiền : {totalThanhTien.toLocaleString("vi-VN")} đ
        </span>
      </div>

      {/* Bảng kết quả */}
      <div className="overflow-x-auto bg-white shadow">
        {filtered.length > 0 ? (
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-blue-100 text-blue-800 font-semibold">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-4 py-2 border">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                >
                  {columns.map((c) => (
                    <td key={c} className="px-4 py-2 border text-gray-700">
                      {row[c] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center py-6">
            Chưa có dữ liệu hiển thị. Hãy chọn file phù hợp và/hoặc chọn khoảng giờ.
          </p>
        )}
      </div>
    </div>
  );
}
