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