'use client'

import Joi from "joi";
import { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";

const schema = Joi.object({
  time: Joi.string().required().messages({
    "any.required": "Vui lòng nhập thời gian",
    "string.empty": "Vui lòng nhập thời gian",
  }),
  quantity: Joi.number().positive().required().messages({
    "any.required": "Vui lòng nhập số lượng",
    "number.base": "Số lượng phải là số",
    "number.positive": "Số lượng phải > 0",
  }),
  station: Joi.string().required().messages({
    "any.required": "Vui lòng chọn trụ",
    "string.empty": "Vui lòng chọn trụ",
  }),
  revenue: Joi.number().min(0).required().messages({
    "any.required": "Vui lòng nhập doanh thu",
    "number.base": "Doanh thu phải là số",
    "number.min": "Doanh thu không được âm",
  }),
  price: Joi.number().min(0).required().messages({
    "any.required": "Vui lòng nhập đơn giá",
    "number.base": "Đơn giá phải là số",
    "number.min": "Đơn giá không được âm",
    "number.positive": "Đơn giá phải > 0",
  }),
});

type FormValues = {
  time: string;
  quantity: number;
  station: string;
  revenue: number;
  price: number;
};

export default function TransactionForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormValues>({
    time: "",
    quantity: 0,
    station: "",
    revenue: 0,
    price: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const handleChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
      setErrors({});
      setMessage(null);
    };

  const handleDateChange = (value: any) => {
    setForm({
      ...form,
      time: value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : "",
    });
    setErrors({});
    setMessage(null);
  };

  const handleSubmit = () => {
    const { error } = schema.validate(form, { abortEarly: false });

    if (error) {
      const fieldErrors: Record<string, string> = {};
      error.details.forEach((d) => {
        fieldErrors[d.path[0]] = d.message;
      });
      setErrors(fieldErrors);
      setMessage("");
    } else {
      setErrors({});
      setMessage("Cập nhật thành công!");
    }
  };

  return (
    <div>
      {/* Nút mở Modal */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Thêm giao dịch
        </Button>
      </Box>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center">
              <IconButton onClick={() => setOpen(false)}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                Đóng
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", borderRadius: 3 }}
              onClick={handleSubmit}
            >
              Cập nhật
            </Button>
          </Stack>
        </DialogTitle>

        <DialogContent >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Nhập giao dịch
          </Typography>

          {/* Thời gian */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Thời gian"
              format="DD-MM-YYYY HH:mm:ss"
              views={["year", "month", "day", "hours", "minutes", "seconds"]}
              value={form.time ? dayjs(form.time) : null}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!errors.time,
                  helperText: errors.time,
                },
              }}
            />
          </LocalizationProvider>

          {/* Số lượng */}
          <TextField
            label="Số lượng"
            type="number"
            fullWidth
            margin="normal"
            value={form.quantity}
            onChange={handleChange("quantity")}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />

          {/* Trụ */}
          <TextField
            select
            label="Trụ"
            fullWidth
            margin="normal"
            value={form.station}
            onChange={handleChange("station")}
            error={!!errors.station}
            helperText={errors.station}
          >
            <MenuItem value="">-- Chọn trụ --</MenuItem>
            <MenuItem value="1">Trụ 1</MenuItem>
            <MenuItem value="2">Trụ 2</MenuItem>
            <MenuItem value="3">Trụ 3</MenuItem>
          </TextField>

          {/* Doanh thu */}
          <TextField
            label="Doanh thu"
            type="number"
            fullWidth
            margin="normal"
            value={form.revenue}
            onChange={handleChange("revenue")}
            error={!!errors.revenue}
            helperText={errors.revenue}
          />

          {/* Đơn giá */}
          <TextField
            label="Đơn giá"
            type="number"
            fullWidth
            margin="normal"
            value={form.price}
            onChange={handleChange("price")}
            error={!!errors.price}
            helperText={errors.price}
          />

          {/* Hiển thị lỗi tổng hợp */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {Object.values(errors).map((err, idx) => (
                <div key={idx}>{err}</div>
              ))}
            </Alert>
          )}

          {/* Hiển thị thông báo thành công */}
          {message && Object.keys(errors).length === 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
