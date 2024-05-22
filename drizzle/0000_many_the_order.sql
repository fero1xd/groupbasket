CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"images" varchar[] DEFAULT '{}'::text[] NOT NULL,
	"name" varchar(256),
	"modeNumber" varchar(256),
	"description" text NOT NULL,
	"marketPrice" integer NOT NULL,
	"sellingPrice" integer NOT NULL,
	"targetOrders" integer NOT NULL,
	"currentDemand" integer DEFAULT 0 NOT NULL
);
