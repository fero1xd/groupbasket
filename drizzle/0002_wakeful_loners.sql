ALTER TABLE "demand" ADD COLUMN "productId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "demand" ADD CONSTRAINT "demand_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
