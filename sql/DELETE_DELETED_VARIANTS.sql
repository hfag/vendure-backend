-- delete product_variant_asset
DELETE FROM product_variant_asset where productVariantId IN (SELECT id FROM product_variant WHERE deletedAt IS NOT NULL);
-- delete product_variant_facet_values_facet_value
DELETE FROM product_variant_facet_values_facet_value where productVariantId IN (SELECT id FROM product_variant WHERE deletedAt IS NOT NULL);
-- delete product_variant_options_product_option
DELETE FROM product_variant_options_product_option where productVariantId IN (SELECT id FROM product_variant WHERE deletedAt IS NOT NULL);
-- delete product_variant_price
DELETE FROM product_variant_price where variantId IN (SELECT id FROM product_variant WHERE deletedAt IS NOT NULL);
-- delete product_variant_translation
DELETE FROM product_variant_translation where baseId IN (SELECT id FROM product_variant WHERE deletedAt IS NOT NULL);
-- delete collection_product_variants_product_variant
DELETE FROM collection_product_variants_product_variant where productVariantId IN (SELECT id FROM product_variant WHERE deletedAt IS NOT NULL);
-- delete stock_movement
DELETE FROM stock_movement where productVariantId IN (SELECT id FROM product_variant WHERE deletedAt IS NOT NULL);
-- delete actual variants
DELETE FROM product_variant WHERE deletedAt IS NOT NULL;