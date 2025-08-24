-- ================================
-- Design Database: Gas Station Transactions
-- ================================

CREATE TABLE [gas_station] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(255),
  [address] nvarchar(255),
  [phone] nvarchar(255)
)
GO

CREATE TABLE [product] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(255),
  [type] nvarchar(255),
  [price] decimal
)
GO

CREATE TABLE [fuel_dispenser] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [station_id] int,
  [product_id] int,
  [dispenser_code] nvarchar(255),
  [status] nvarchar(255)
)
GO

CREATE TABLE [transactions] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [station_id] int,
  [dispenser_id] int,
  [quantity] decimal,
  [total_amount] decimal,
  [payment_method] nvarchar(255),
  [created_at] datetime
)
GO

ALTER TABLE [fuel_dispenser] ADD FOREIGN KEY ([station_id]) REFERENCES [gas_station] ([id])
GO

ALTER TABLE [fuel_dispenser] ADD FOREIGN KEY ([product_id]) REFERENCES [product] ([id])
GO

ALTER TABLE [transactions] ADD FOREIGN KEY ([station_id]) REFERENCES [gas_station] ([id])
GO

ALTER TABLE [transactions] ADD FOREIGN KEY ([dispenser_id]) REFERENCES [fuel_dispenser] ([id])
GO

-- ================================
-- INSERT DATA FOR GAS STATION DB
-- ================================

-- 1. Thêm dữ liệu bảng gas_station
INSERT INTO gas_station ([name], [address], [phone]) VALUES
(N'Petrolimex Trạm 1', N'123 Lê Lợi, Hà Nội', N'024-111-2222'),
(N'Petrolimex Trạm 2', N'456 Nguyễn Huệ, TP.HCM', N'028-333-4444'),
(N'PV Oil Trạm 3',    N'789 Trần Hưng Đạo, Đà Nẵng', N'0236-555-6666'),
(N'Petrolimex Trạm 4', N'101 Cách Mạng Tháng 8, Cần Thơ', N'0292-777-8888'),
(N'PV Oil Trạm 5',    N'202 Phan Chu Trinh, Hải Phòng', N'0225-999-0000');
GO

-- 2. Thêm dữ liệu bảng product (5 sản phẩm)
INSERT INTO product ([name], [type], [price]) VALUES
(N'Xăng RON 95-IV',        N'Xăng', 24500),
(N'Xăng E5 RON 92-II',     N'Xăng', 22500),
(N'Dầu DO 0,05S-II',       N'Dầu', 20500),
(N'Dầu hỏa',            N'Dầu', 18500),
(N'Dầu Diesel EN590',   N'Dầu', 21500);
GO

-- 3. Thêm dữ liệu bảng fuel_dispenser
INSERT INTO fuel_dispenser ([station_id], [product_id], [dispenser_code], [status]) VALUES
(1, 1, N'DSP-001', N'Hoạt động'),
(1, 2, N'DSP-002', N'Hoạt động'),
(2, 3, N'DSP-003', N'Bảo trì'),
(3, 1, N'DSP-004', N'Hoạt động'),
(4, 2, N'DSP-005', N'Hoạt động'),
(5, 4, N'DSP-006', N'Hoạt động'), 
(5, 5, N'DSP-007', N'Hoạt động');
GO

-- 4. Thêm dữ liệu bảng transactions
INSERT INTO transactions ([station_id], [dispenser_id], [quantity], [total_amount], [payment_method], [created_at]) VALUES
(1, 1, 20, 20 * 24500, N'Tiền mặt',    '2025-08-01 08:30:00'),
(1, 2, 15, 15 * 22500, N'Chuyển khoản','2025-08-01 09:00:00'),
(2, 3, 30, 30 * 20500, N'Tiền mặt',    '2025-08-02 10:15:00'),
(3, 4, 10, 10 * 24500, N'Ví điện tử',  '2025-08-03 11:20:00'),
(4, 5, 25, 25 * 22500, N'Tiền mặt',    '2025-08-04 12:45:00'),
(1, 1, 12, 12 * 24500, N'Ví điện tử',  '2025-08-05 14:10:00'),
(2, 3, 18, 18 * 20500, N'Chuyển khoản','2025-08-06 15:30:00'),
(3, 4, 22, 22 * 24500, N'Tiền mặt',    '2025-08-07 16:50:00'),
(4, 5,  8,  8 * 22500, N'Ví điện tử',  '2025-08-08 17:25:00'),
(1, 2, 14, 14 * 22500, N'Tiền mặt',    '2025-08-09 18:40:00'),
(5, 6, 20, 20 * 18500, N'Tiền mặt',    '2025-08-10 09:15:00'),
(5, 6, 35, 35 * 18500, N'Chuyển khoản','2025-08-11 10:30:00'),
(5, 7, 25, 25 * 21500, N'Ví điện tử',  '2025-08-12 14:45:00'),
(5, 7, 40, 40 * 21500, N'Tiền mặt',    '2025-08-13 16:00:00');
GO


-- ================================
-- Queries for Gas Station Transactions
-- ================================

-- Lấy tất cả giao dịch trong một khoảng ngày
SELECT *
FROM transactions
WHERE created_at BETWEEN '2025-08-01 00:00:00' AND '2025-08-15 23:59:59' -- Thay đổi ngày theo yêu cầu
ORDER BY created_at;

-- Tổng doanh thu theo ngày của một trụ bơm
SELECT CAST(created_at AS DATE) AS transaction_date,
       SUM(total_amount) AS daily_revenue
FROM transactions
WHERE dispenser_id = 1   -- Thay ID trụ bơm cần tính
GROUP BY CAST(created_at AS DATE)
ORDER BY transaction_date;

-- Tổng doanh thu theo ngày cho một trạm xăng
SELECT CAST(t.created_at AS DATE) AS transaction_date,
       SUM(t.total_amount) AS daily_revenue
FROM transactions t
WHERE t.station_id = 1   -- Thay ID trạm xăng cần tính
GROUP BY CAST(t.created_at AS DATE)
ORDER BY transaction_date;

-- Top 3 hàng hóa bán chạy nhất và tổng số lít tại một trạm trong tháng
SELECT TOP 3 p.name AS product_name,
       SUM(t.quantity) AS total_liters_sold
FROM transactions t
JOIN fuel_dispenser f ON t.dispenser_id = f.id
JOIN product p ON f.product_id = p.id
WHERE t.station_id = 2
  AND MONTH(t.created_at) = 8
  AND YEAR(t.created_at) = 2025
GROUP BY p.name
ORDER BY SUM(t.quantity) DESC;