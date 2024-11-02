CREATE TABLE IF NOT EXISTS measurements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    symbol VARCHAR(25) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(12) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC DEFAULT 0,
    measurement_id INT NOT NULL,
    price NUMERIC DEFAULT 0.00,
    description TEXT,
    FOREIGN KEY (measurement_id) REFERENCES measurements(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    article_id VARCHAR(12) NOT NULL,
    mode SMALLINT NOT NULL,
    quantity NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE rw_count (
    table_name TEXT PRIMARY KEY,
    row_count BIGINT DEFAULT 0
);

INSERT INTO rw_count (table_name, row_count)
VALUES ('articles', 0),
       ('measurements', 0);

CREATE OR REPLACE FUNCTION increment_articles_count()
RETURNS TRIGGER AS $$
BEGIN
UPDATE rw_count
SET row_count = row_count + 1
WHERE table_name = 'articles';
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_articles_count()
RETURNS TRIGGER AS $$
BEGIN
UPDATE rw_count
SET row_count = row_count - 1
WHERE table_name = 'articles';
RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_measurement_count()
RETURNS TRIGGER AS $$
BEGIN
UPDATE rw_count
SET row_count = row_count + 1
WHERE table_name = 'measurements';
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_measurement_count()
RETURNS TRIGGER AS $$
BEGIN
UPDATE rw_count
SET row_count = row_count - 1
WHERE table_name = 'measurements';
RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_insert_trigger
    AFTER INSERT ON articles
    FOR EACH ROW
    EXECUTE FUNCTION increment_articles_count();

CREATE TRIGGER articles_delete_trigger
    AFTER DELETE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION decrement_articles_count();

CREATE TRIGGER articles_insert_trigger
    AFTER INSERT ON measurements
    FOR EACH ROW
    EXECUTE FUNCTION increment_measurement_count();

CREATE TRIGGER articles_delete_trigger
    AFTER DELETE ON measurements
    FOR EACH ROW
    EXECUTE FUNCTION decrement_measurement_count();

INSERT INTO measurements (name, symbol)
VALUES ('Meter', 'm'),
       ('Kilogram', 'kg'),
       ('Second', 's'),
       ('Ampere', 'A'),
       ('Kelvin', 'K'),
       ('Mole', 'mol'),
       ('Candela', 'cd'),
       ('Liter', 'L'),
       ('Newton', 'N'),
       ('Joule', 'J');

INSERT INTO articles (id, name, quantity, measurement_id, price, description)
VALUES (100000000001, 'Widget A1', 10, 1, 5.99, 'A versatile widget for various applications.'),
       (100000000002, 'Widget A2', 15, 2, 7.49, 'An upgraded widget with additional features.'),
       (100000000003, 'Gizmo A1', 8, 3, 4.75, 'A basic gizmo for standard operations.'),
       (100000000004, 'Gizmo A2', 12, 4, 6.50, 'Enhanced gizmo for precision tasks.'),
       (100000000005, 'Gadget A1', 25, 5, 12.99, 'A reliable gadget for field operations.'),
       (100000000006, 'Gadget A2', 5, 6, 13.49, 'Advanced gadget for technical usage.'),
       (100000000007, 'Tool A1', 30, 7, 8.25, 'Standard tool for light use.'),
       (100000000008, 'Tool A2', 18, 8, 9.99, 'Heavy-duty tool for industrial applications.'),
       (100000000009, 'Instrument A1', 9, 9, 15.00, 'Precision instrument for detailed work.'),
       (100000000010, 'Instrument A2', 20, 10, 18.50, 'High-end instrument for technical experts.'),
       (100000000011, 'Widget B1', 14, 1, 6.99, 'Widget with robust design.'),
       (100000000012, 'Widget B2', 28, 2, 7.99, 'Upgraded widget for advanced tasks.'),
       (100000000013, 'Gizmo B1', 21, 3, 3.99, 'Compact gizmo for portability.'),
       (100000000014, 'Gizmo B2', 16, 4, 6.49, 'Portable gizmo with precision features.'),
       (100000000015, 'Gadget B1', 12, 5, 14.50, 'Reliable field gadget.'),
       (100000000016, 'Gadget B2', 22, 6, 16.30, 'Technical gadget with enhanced specs.'),
       (100000000017, 'Tool B1', 7, 7, 7.25, 'Lightweight tool for easy handling.'),
       (100000000018, 'Tool B2', 19, 8, 10.49, 'Heavy-duty industrial tool.'),
       (100000000019, 'Instrument B1', 23, 9, 21.00, 'Precision instrument for professionals.'),
       (100000000020, 'Instrument B2', 11, 10, 22.75, 'High-quality instrument for expert use.'),
       (100000000021, 'Machine A1', 50, 1, 150.00, 'Large industrial machine.'),
       (100000000022, 'Machine A2', 45, 2, 155.00, 'Advanced machine for high-capacity work.'),
       (100000000023, 'Engine A1', 33, 3, 250.75, 'Engine optimized for performance.'),
       (100000000024, 'Engine A2', 60, 4, 300.00, 'Heavy-duty engine for industrial use.'),
       (100000000025, 'Pump A1', 40, 5, 125.50, 'Pump suitable for liquids.'),
       (100000000026, 'Pump A2', 55, 6, 140.80, 'High-pressure pump for demanding tasks.'),
       (100000000027, 'Valve A1', 75, 7, 15.99, 'Reliable valve for standard applications.'),
       (100000000028, 'Valve A2', 20, 8, 17.50, 'High-quality valve with extended life.'),
       (100000000029, 'Sensor A1', 38, 9, 50.00, 'Sensor with high accuracy.'),
       (100000000030, 'Sensor A2', 44, 10, 52.75, 'Advanced sensor for industrial monitoring.'),
       (100000000031, 'Processor Z', 75, 1, 200.00, 'High-performance processor for advanced applications.'),

-- FOR TESTING

       (100000000032, 'Widget A2', 15, 2, 7.49, 'An upgraded widget with additional features.'),
       (100000000033, 'Gizmo A1', 8, 3, 4.75, 'A basic gizmo for standard operations.'),
       (100000000034, 'Gizmo A2', 12, 4, 6.50, 'Enhanced gizmo for precision tasks.'),
       (100000000035, 'Gadget A1', 25, 5, 12.99, 'A reliable gadget for field operations.'),
       (100000000036, 'Gadget A2', 5, 6, 13.49, 'Advanced gadget for technical usage.'),
       (100000000037, 'Tool A1', 30, 7, 8.25, 'Standard tool for light use.'),
       (100000000038, 'Tool A2', 18, 8, 9.99, 'Heavy-duty tool for industrial applications.'),
       (100000000039, 'Instrument A1', 9, 9, 15.00, 'Precision instrument for detailed work.'),
       (100000000040, 'Instrument A2', 20, 10, 18.50, 'High-end instrument for technical experts.'),
       (100000000041, 'Widget B1', 14, 1, 6.99, 'Widget with robust design.'),
       (100000000042, 'Widget B2', 28, 2, 7.99, 'Upgraded widget for advanced tasks.'),
       (100000000043, 'Gizmo B1', 21, 3, 3.99, 'Compact gizmo for portability.'),
       (100000000044, 'Gizmo B2', 16, 4, 6.49, 'Portable gizmo with precision features.'),
       (100000000045, 'Gadget B1', 12, 5, 14.50, 'Reliable field gadget.'),
       (100000000046, 'Gadget B2', 22, 6, 16.30, 'Technical gadget with enhanced specs.'),
       (100000000047, 'Tool B1', 7, 7, 7.25, 'Lightweight tool for easy handling.'),
       (100000000048, 'Tool B2', 19, 8, 10.49, 'Heavy-duty industrial tool.'),
       (100000000049, 'Instrument B1', 23, 9, 21.00, 'Precision instrument for professionals.'),
       (100000000050, 'Instrument B2', 11, 10, 22.75, 'High-quality instrument for expert use.'),
       (100000000051, 'Machine A1', 50, 1, 150.00, 'Large industrial machine.'),
       (100000000052, 'Machine A2', 45, 2, 155.00, 'Advanced machine for high-capacity work.'),
       (100000000053, 'Engine A1', 33, 3, 250.75, 'Engine optimized for performance.'),
       (100000000054, 'Engine A2', 60, 4, 300.00, 'Heavy-duty engine for industrial use.'),
       (100000000055, 'Pump A1', 40, 5, 125.50, 'Pump suitable for liquids.'),
       (100000000056, 'Pump A2', 55, 6, 140.80, 'High-pressure pump for demanding tasks.'),
       (100000000057, 'Valve A1', 75, 7, 15.99, 'Reliable valve for standard applications.'),
       (100000000058, 'Valve A2', 20, 8, 17.50, 'High-quality valve with extended life.'),
       (100000000059, 'Sensor A1', 38, 9, 50.00, 'Sensor with high accuracy.'),
       (100000000061, 'Processor Z', 75, 1, 200.00, 'High-performance processor for advanced applications.'),

       (100000000062, 'Widget A2', 15, 2, 7.49, 'An upgraded widget with additional features.'),
       (100000000063, 'Gizmo A1', 8, 3, 4.75, 'A basic gizmo for standard operations.'),
       (100000000064, 'Gizmo A2', 12, 4, 6.50, 'Enhanced gizmo for precision tasks.'),
       (100000000065, 'Gadget A1', 25, 5, 12.99, 'A reliable gadget for field operations.'),
       (100000000066, 'Gadget A2', 5, 6, 13.49, 'Advanced gadget for technical usage.'),
       (100000000067, 'Tool A1', 30, 7, 8.25, 'Standard tool for light use.'),
       (100000000068, 'Tool A2', 18, 8, 9.99, 'Heavy-duty tool for industrial applications.'),
       (100000000069, 'Instrument A1', 9, 9, 15.00, 'Precision instrument for detailed work.'),
       (100000000070, 'Instrument A2', 20, 10, 18.50, 'High-end instrument for technical experts.'),
       (100000000071, 'Widget B1', 14, 1, 6.99, 'Widget with robust design.'),
       (100000000072, 'Widget B2', 28, 2, 7.99, 'Upgraded widget for advanced tasks.'),
       (100000000073, 'Gizmo B1', 21, 3, 3.99, 'Compact gizmo for portability.'),
       (100000000074, 'Gizmo B2', 16, 4, 6.49, 'Portable gizmo with precision features.'),
       (100000000075, 'Gadget B1', 12, 5, 14.50, 'Reliable field gadget.'),
       (100000000076, 'Gadget B2', 22, 6, 16.30, 'Technical gadget with enhanced specs.'),
       (100000000077, 'Tool B1', 7, 7, 7.25, 'Lightweight tool for easy handling.'),
       (100000000078, 'Tool B2', 19, 8, 10.49, 'Heavy-duty industrial tool.'),
       (100000000079, 'Instrument B1', 23, 9, 21.00, 'Precision instrument for professionals.'),
       (100000000080, 'Instrument B2', 11, 10, 22.75, 'High-quality instrument for expert use.'),
       (100000000081, 'Machine A1', 50, 1, 150.00, 'Large industrial machine.'),
       (100000000082, 'Machine A2', 45, 2, 155.00, 'Advanced machine for high-capacity work.'),
       (100000000083, 'Engine A1', 33, 3, 250.75, 'Engine optimized for performance.'),
       (100000000084, 'Engine A2', 60, 4, 300.00, 'Heavy-duty engine for industrial use.'),
       (100000000085, 'Pump A1', 40, 5, 125.50, 'Pump suitable for liquids.'),
       (100000000086, 'Pump A2', 55, 6, 140.80, 'High-pressure pump for demanding tasks.'),
       (100000000087, 'Valve A1', 75, 7, 15.99, 'Reliable valve for standard applications.'),
       (100000000088, 'Valve A2', 20, 8, 17.50, 'High-quality valve with extended life.'),
       (100000000089, 'Sensor A1', 38, 9, 50.00, 'Sensor with high accuracy.'),
       (100000000090, 'Sensor A2', 44, 10, 52.75, 'Advanced sensor for industrial monitoring.'),
       (100000000091, 'Processor Z', 75, 1, 200.00, 'High-performance processor for advanced applications.');