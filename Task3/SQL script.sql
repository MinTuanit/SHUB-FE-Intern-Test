-- ================================
-- File: queries_gas_station.sql
-- Description: Queries for Gas Station Transactions
-- ================================

-- Lấy tất cả giao dịch trong một khoảng ngày
SELECT *
FROM transaction
WHERE created_at BETWEEN '2025-08-01' AND '2025-08-15'  -- Thay khoảng ngày cần tính
ORDER BY created_at;

-- Tổng doanh thu theo ngày của một trụ bơm
SELECT DATE(created_at) AS transaction_date,
       SUM(total_amount) AS daily_revenue
FROM transaction
WHERE dispenser_id = 1   -- Thay ID trụ bơm cần tính
GROUP BY DATE(created_at)
ORDER BY transaction_date;

-- Tổng doanh thu theo ngày cho một trạm xăng
SELECT DATE(t.created_at) AS transaction_date,
       SUM(t.total_amount) AS daily_revenue
FROM transaction t
WHERE t.station_id = 1   -- Thay ID trạm xăng cần tính
GROUP BY DATE(t.created_at)
ORDER BY transaction_date;

-- Top 3 hàng hóa bán chạy nhất và tổng số lít tại một trạm trong tháng
SELECT p.name AS product_name,
       SUM(t.quantity) AS total_liters_sold
FROM transaction t
JOIN fuel_dispenser f ON t.dispenser_id = f.id
JOIN product p ON f.product_id = p.id
WHERE t.station_id = 2            -- ID trạm xăng
  AND MONTH(t.created_at) = 8     -- Tháng cần tính
  AND YEAR(t.created_at) = 2025   -- Năm cần tính
GROUP BY p.id, p.name
ORDER BY total_liters_sold DESC
LIMIT 3;




