-- SQL Server synthetic demo data. No users, carts or orders.
-- Run ONCE after schema.sql. Does not delete or overwrite existing data.
USE [shop_db];
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;
IF DB_NAME() <> N'shop_db'
    THROW 51000, 'Wrong database. Select shop_db before continuing.', 1;
IF OBJECT_ID(N'dbo.products', N'U') IS NULL
    THROW 51002, 'Run database/schema.sql first.', 1;
IF EXISTS (SELECT 1 FROM [dbo].[products])
   OR EXISTS (SELECT 1 FROM [dbo].[banners])
   OR EXISTS (SELECT 1 FROM [dbo].[news])
    THROW 51003, 'Demo tables already contain data. No changes were made.', 1;

BEGIN TRY
    BEGIN TRANSACTION;
INSERT INTO [dbo].[products] ([category],[created_at],[description],[image_url],[name],[price],[quantity]) VALUES
(N'Điện thoại', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Điện thoại Demo A', 3600000, 3),
(N'Điện thoại', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Điện thoại Demo B', 3500000, 10),
(N'Laptop', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Laptop Demo A', 12100000, 10),
(N'Laptop', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Laptop Demo B', 12000000, 10),
(N'Phụ kiện', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Phụ kiện Demo A', 250000, 10),
(N'Phụ kiện', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Phụ kiện Demo B', 150000, 10),
(N'Đồng hồ', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Đồng hồ Demo A', 900000, 10),
(N'Đồng hồ', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Đồng hồ Demo B', 800000, 10),
(N'Màn hình', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Màn hình Demo A', 2500000, 10),
(N'Màn hình', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Màn hình Demo B', 2400000, 10),
(N'Gaming', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Gaming Demo A', 700000, 10),
(N'Gaming', SYSDATETIME(), N'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', N'/assets/images/demo-product.svg', N'Gaming Demo B', 600000, 10);

INSERT INTO [dbo].[banners] ([active],[button_link],[button_text],[created_at],[description],[display_order],[gradient_from],[gradient_to],[image_url],[title]) VALUES
(1,N'#/products',N'Xem sản phẩm',SYSDATETIME(),N'Dữ liệu giả lập cho buổi thực hành của Nhóm 4.',1,N'#2563eb',N'#1e3a8a',N'/assets/images/demo-product.svg',N'ISmart - Bản thực hành');
INSERT INTO [dbo].[news] ([author],[category],[content],[created_at],[image_url],[published],[summary],[title],[updated_at]) VALUES
(N'Nhóm 4',N'Hướng dẫn',N'Đây là nội dung giả lập phục vụ kiểm thử trang tin tức. Không phải tin tức thương mại.',SYSDATETIME(),N'/assets/images/demo-product.svg',1,N'Nội dung minh họa của bản thực hành.',N'Hướng dẫn dùng dữ liệu demo ISmart',SYSDATETIME());
    COMMIT TRANSACTION;
    PRINT N'Demo data inserted: 12 products, 1 banner, 1 news item.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
