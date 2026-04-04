/*
  YogaMarieMills database bootstrap for SQL Server / Azure SQL.
  Safe to run multiple times: creates missing tables and inserts minimum seed rows.
*/

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        emailAddress VARCHAR(255) NOT NULL,
        firstName VARCHAR(100) NULL,
        lastName VARCHAR(100) NULL,
        password VARCHAR(255) NOT NULL,
        createdDate DATETIME2 NOT NULL CONSTRAINT DF_Users_createdDate DEFAULT (SYSUTCDATETIME()),
        changedDate DATETIME2 NULL
    );

    CREATE UNIQUE INDEX UX_Users_emailAddress ON dbo.Users(emailAddress);
END;
GO

IF OBJECT_ID(N'dbo.Blogs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Blogs (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        short VARCHAR(MAX) NULL,
        description VARCHAR(MAX) NULL,
        image VARCHAR(500) NULL,
        href VARCHAR(500) NULL,
        type VARCHAR(100) NULL,
        component VARCHAR(100) NULL,
        postDate DATETIMEOFFSET NOT NULL CONSTRAINT DF_Blogs_postDate DEFAULT (SYSDATETIMEOFFSET())
    );
END;
GO

IF OBJECT_ID(N'dbo.ClassTypes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ClassTypes (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NULL,
        title VARCHAR(255) NOT NULL,
        short VARCHAR(MAX) NULL,
        description VARCHAR(MAX) NULL,
        image VARCHAR(500) NULL,
        href VARCHAR(500) NULL,
        component VARCHAR(100) NULL,
        detail VARCHAR(MAX) NULL,
        route VARCHAR(255) NULL
    );
END;
GO

IF OBJECT_ID(N'dbo.Headers', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Headers (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        header VARCHAR(255) NULL,
        short VARCHAR(MAX) NULL,
        description VARCHAR(MAX) NULL,
        venue VARCHAR(255) NULL
    );

    CREATE UNIQUE INDEX UX_Headers_type ON dbo.Headers(type);
END;
GO

IF OBJECT_ID(N'dbo.Consultations', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Consultations (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NULL,
        session_time VARCHAR(100) NULL,
        short VARCHAR(MAX) NULL,
        description VARCHAR(MAX) NULL,
        cost VARCHAR(100) NULL,
        icon VARCHAR(500) NULL,
        iconHeight VARCHAR(50) NULL,
        iconWidth VARCHAR(50) NULL
    );
END;
GO

IF OBJECT_ID(N'dbo.Costs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Costs (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NULL,
        course VARCHAR(255) NULL,
        cost VARCHAR(100) NULL,
        duration VARCHAR(100) NULL,
        description VARCHAR(MAX) NULL,
        package VARCHAR(255) NULL,
        sequence INT NULL
    );
END;
GO

IF OBJECT_ID(N'dbo.EventTypes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.EventTypes (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NULL,
        session_time VARCHAR(100) NULL,
        short VARCHAR(MAX) NULL,
        description VARCHAR(MAX) NULL,
        cost VARCHAR(100) NULL,
        image VARCHAR(500) NULL,
        start_date DATE NULL,
        end_date DATE NULL
    );

    CREATE INDEX IX_EventTypes_type ON dbo.EventTypes(type);
END;
GO

IF OBJECT_ID(N'dbo.Navbar_Items', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Navbar_Items (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NULL,
        name VARCHAR(255) NOT NULL,
        route VARCHAR(255) NULL,
        href VARCHAR(500) NULL,
        parent_id INT NULL
    );
END;
GO

IF OBJECT_ID(N'dbo.MassageTypes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.MassageTypes (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NULL,
        session_time VARCHAR(100) NULL,
        description VARCHAR(MAX) NULL,
        cost VARCHAR(100) NULL,
        icon VARCHAR(500) NULL,
        iconHeight VARCHAR(50) NULL,
        iconWidth VARCHAR(50) NULL
    );

    CREATE INDEX IX_MassageTypes_type ON dbo.MassageTypes(type);
END;
GO

IF OBJECT_ID(N'dbo.MassageDetails', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.MassageDetails (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NULL,
        description VARCHAR(MAX) NULL,
        parent_id INT NOT NULL
    );

    CREATE INDEX IX_MassageDetails_parent_id ON dbo.MassageDetails(parent_id);
END;
GO

IF OBJECT_ID(N'dbo.Schedules', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Schedules (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        session_date DATE NOT NULL
    );
END;
GO

IF OBJECT_ID(N'dbo.ScheduleDetails', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ScheduleDetails (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        session_time VARCHAR(100) NOT NULL,
        class VARCHAR(255) NOT NULL,
        parent_id INT NOT NULL
    );

    CREATE INDEX IX_ScheduleDetails_parent_id ON dbo.ScheduleDetails(parent_id);
END;
GO

IF OBJECT_ID(N'dbo.Testimonials', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Testimonials (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        testimonial VARCHAR(MAX) NOT NULL,
        name VARCHAR(255) NOT NULL
    );
END;
GO

/* Foreign keys added after table creation so this script is idempotent. */
IF OBJECT_ID(N'dbo.FK_MassageDetails_MassageTypes', N'F') IS NULL
BEGIN
    ALTER TABLE dbo.MassageDetails
        ADD CONSTRAINT FK_MassageDetails_MassageTypes
        FOREIGN KEY (parent_id) REFERENCES dbo.MassageTypes(id)
        ON DELETE CASCADE;
END;
GO

IF OBJECT_ID(N'dbo.FK_ScheduleDetails_Schedules', N'F') IS NULL
BEGIN
    ALTER TABLE dbo.ScheduleDetails
        ADD CONSTRAINT FK_ScheduleDetails_Schedules
        FOREIGN KEY (parent_id) REFERENCES dbo.Schedules(id)
        ON DELETE CASCADE;
END;
GO

/* Seed rows required by API assumptions. */
IF NOT EXISTS (SELECT 1 FROM dbo.Headers WHERE type = 'diet')
BEGIN
    INSERT INTO dbo.Headers (type, header, short, description, venue)
    VALUES ('diet', 'Diet Consultation', '', '', '');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Headers WHERE type = 'Schedule')
BEGIN
    INSERT INTO dbo.Headers (type, header, short, description, venue)
    VALUES ('Schedule', 'Schedule', '', '', '');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Headers WHERE type = 'Testimonial')
BEGIN
    INSERT INTO dbo.Headers (type, header, short, description, venue)
    VALUES ('Testimonial', 'Testimonials', '', '', '');
END;
GO

/* Event insert path expects parent navbar id = 20. */
IF NOT EXISTS (SELECT 1 FROM dbo.Navbar_Items WHERE id = 20)
BEGIN
    SET IDENTITY_INSERT dbo.Navbar_Items ON;

    INSERT INTO dbo.Navbar_Items (id, type, name, route, href, parent_id)
    VALUES (20, 'Events', 'Events', 'Events', 'http://www.yogamariemills/Events', NULL);

    SET IDENTITY_INSERT dbo.Navbar_Items OFF;
END;
GO

/* Ensure identity continues above the seeded row id=20. */
DECLARE @currentMaxNavbarId INT = (SELECT ISNULL(MAX(id), 0) FROM dbo.Navbar_Items);
DBCC CHECKIDENT ('dbo.Navbar_Items', RESEED, @currentMaxNavbarId);
GO
