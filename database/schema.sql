-- Microsoft SQL Server 2019+ / SSMS. Run once against a NEW EMPTY shop_db.
-- No user accounts, password hashes or order history are included.
-- GO is a client batch separator (SSMS/sqlcmd), not a JDBC statement.
USE [master];
GO
IF DB_ID(N'shop_db') IS NULL
    EXEC(N'CREATE DATABASE [shop_db] COLLATE Latin1_General_100_CI_AS_SC');
GO
USE [shop_db];
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;
IF DB_NAME() <> N'shop_db'
    THROW 51000, 'Wrong database. Select shop_db before continuing.', 1;
IF EXISTS (SELECT 1 FROM sys.tables WHERE [is_ms_shipped] = 0)
    THROW 51001, 'shop_db is not empty. This script does not overwrite or upgrade an existing database.', 1;

BEGIN TRY
    BEGIN TRANSACTION;

CREATE TABLE [dbo].[users] (
    [id] bigint IDENTITY(1,1) NOT NULL CONSTRAINT [PK_users] PRIMARY KEY,
    [address] nvarchar(255) NULL,
    [created_at] datetime2(6) NOT NULL,
    [email] nvarchar(100) NOT NULL CONSTRAINT [UQ_users_email] UNIQUE,
    [full_name] nvarchar(100) NULL,
    [password] nvarchar(255) NOT NULL,
    [phone] nvarchar(20) NULL,
    [role] nvarchar(255) NOT NULL CONSTRAINT [CK_users_role] CHECK ([role] IN (N'ADMIN',N'USER')),
    [status] nvarchar(255) NOT NULL CONSTRAINT [CK_users_status] CHECK ([status] IN (N'ACTIVE',N'BLOCKED')),
    [username] nvarchar(50) NOT NULL CONSTRAINT [UQ_users_username] UNIQUE
);

CREATE TABLE [dbo].[products] (
    [id] bigint IDENTITY(1,1) NOT NULL CONSTRAINT [PK_products] PRIMARY KEY,
    [category] nvarchar(100) NULL,
    [created_at] datetime2(6) NOT NULL,
    [description] nvarchar(max) NULL,
    [image_url] nvarchar(500) NULL,
    [name] nvarchar(255) NOT NULL,
    [price] decimal(12,2) NOT NULL,
    [quantity] int NOT NULL
);

CREATE TABLE [dbo].[banners] (
    [id] bigint IDENTITY(1,1) NOT NULL CONSTRAINT [PK_banners] PRIMARY KEY,
    [active] bit NOT NULL,
    [button_link] nvarchar(255) NULL,
    [button_text] nvarchar(100) NULL,
    [created_at] datetime2(6) NOT NULL,
    [description] nvarchar(500) NULL,
    [display_order] int NOT NULL,
    [gradient_from] nvarchar(20) NULL,
    [gradient_to] nvarchar(20) NULL,
    [image_url] nvarchar(500) NULL,
    [title] nvarchar(255) NOT NULL
);

CREATE TABLE [dbo].[news] (
    [id] bigint IDENTITY(1,1) NOT NULL CONSTRAINT [PK_news] PRIMARY KEY,
    [author] nvarchar(100) NULL,
    [category] nvarchar(100) NULL,
    [content] nvarchar(max) NOT NULL,
    [created_at] datetime2(6) NOT NULL,
    [image_url] nvarchar(500) NULL,
    [published] bit NOT NULL,
    [summary] nvarchar(500) NULL,
    [title] nvarchar(255) NOT NULL,
    [updated_at] datetime2(6) NULL
);

CREATE TABLE [dbo].[promotions] (
    [id] bigint IDENTITY(1,1) NOT NULL CONSTRAINT [PK_promotions] PRIMARY KEY,
    [active] bit NOT NULL,
    [code] nvarchar(50) NOT NULL CONSTRAINT [UQ_promotions_code] UNIQUE,
    [created_at] datetime2(6) NOT NULL,
    [description] nvarchar(255) NULL,
    [discount_type] nvarchar(255) NOT NULL CONSTRAINT [CK_promotions_type] CHECK ([discount_type] IN (N'FIXED',N'PERCENT')),
    [discount_value] decimal(12,2) NOT NULL,
    [end_date] datetime2(6) NULL,
    [max_discount_amount] decimal(12,2) NULL,
    [min_order_amount] decimal(12,2) NOT NULL,
    [start_date] datetime2(6) NULL,
    [usage_limit] int NULL,
    [used_count] int NOT NULL
);

CREATE TABLE [dbo].[carts] (
    [id] bigint IDENTITY(1,1) NOT NULL CONSTRAINT [PK_carts] PRIMARY KEY,
    [user_id] bigint NOT NULL CONSTRAINT [UQ_carts_user] UNIQUE,
    CONSTRAINT [FK_carts_users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users] ([id])
);

CREATE TABLE [dbo].[cart_items] (
    [id] bigint IDENTITY(1,1) NOT NULL CONSTRAINT [PK_cart_items] PRIMARY KEY,
    [quantity] int NOT NULL,
    [cart_id] bigint NOT NULL,
    [product_id] bigint NOT NULL,
    CONSTRAINT [UQ_cart_items_product] UNIQUE ([cart_id],[product_id]),
    CONSTRAINT [FK_cart_items_carts] FOREIGN KEY ([cart_id]) REFERENCES [dbo].[carts] ([id]),
    CONSTRAINT [FK_cart_items_products] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products] ([id])
);

CREATE TABLE [dbo].[orders] (
    [id] bigint IDENTITY(1,1) NOT NULL CONSTRAINT [PK_orders] PRIMARY KEY,
    [created_at] datetime2(6) NOT NULL,
    [shipping_address] nvarchar(255) NOT NULL,
    [status] nvarchar(255) NOT NULL CONSTRAINT [CK_orders_status] CHECK ([status] IN (N'CANCELLED',N'COMPLETED',N'CONFIRMED',N'PENDING',N'SHIPPING')),
    [total_amount] decimal(12,2) NOT NULL,
    [user_id] bigint NOT NULL,
    [discount_amount] decimal(12,2) NOT NULL,
    [promotion_code] nvarchar(50) NULL,
    CONSTRAINT [FK_orders_users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users] ([id])
);

CREATE TABLE [dbo].[order_items] (
    [id] bigint IDENTITY(1,1) NOT NULL CONSTRAINT [PK_order_items] PRIMARY KEY,
    [price_at_order] decimal(12,2) NOT NULL,
    [quantity] int NOT NULL,
    [order_id] bigint NOT NULL,
    [product_id] bigint NOT NULL,
    CONSTRAINT [FK_order_items_orders] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders] ([id]),
    CONSTRAINT [FK_order_items_products] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products] ([id])
);

CREATE INDEX [IX_cart_items_product] ON [dbo].[cart_items] ([product_id]);
CREATE INDEX [IX_orders_user] ON [dbo].[orders] ([user_id]);
CREATE INDEX [IX_order_items_order] ON [dbo].[order_items] ([order_id]);
CREATE INDEX [IX_order_items_product] ON [dbo].[order_items] ([product_id]);

    COMMIT TRANSACTION;
    PRINT N'Created 9 tables in shop_db. Run seed-demo.sql next.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
