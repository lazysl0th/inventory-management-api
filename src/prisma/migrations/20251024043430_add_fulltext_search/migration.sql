CREATE INDEX "idx_inventory_search_vector"
ON "Inventory" USING GIN ("searchVector");