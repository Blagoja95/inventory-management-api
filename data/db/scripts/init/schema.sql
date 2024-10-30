CREATE TABLE IF NOT EXISTS measurements
(
	id
	SERIAL
	PRIMARY
	KEY,
	name
	VARCHAR
(
	255
) UNIQUE NOT NULL,
	symbol VARCHAR
(
	25
) UNIQUE NOT NULL
	);

CREATE TABLE IF NOT EXISTS articles
(
	id varchar
(
	12
) PRIMARY KEY,
	name VARCHAR
(
	255
) NOT NULL,
	quantity NUMERIC DEFAULT 0,
	measurement_id INT NOT NULL,
	price NUMERIC DEFAULT 0.00,
	description TEXT,
	FOREIGN KEY
(
	measurement_id
) REFERENCES measurements
(
	id
)
	);

CREATE TABLE IF NOT EXISTS transactions
(
	id
	SERIAL
	PRIMARY
	KEY,
	article_id
	varchar
(
	12
) NOT NULL,
	mode SMALLINT NOT NULL,
	Quantity NUMERIC NOT NULL,
	Price NUMERIC NOT NULL,
	Date DATE NOT NULL DEFAULT CURRENT_DATE,
	FOREIGN KEY
(
	article_id
) REFERENCES articles
(
	id
)
	);

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
	   -- Entries continue in the same format
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
	   -- Continue up to entry 100000000200
	   (100000000200, 'Processor Z', 75, 1, 200.00, 'High-performance processor for advanced applications.');