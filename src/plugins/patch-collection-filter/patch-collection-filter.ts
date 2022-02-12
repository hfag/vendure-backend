import {
  Collection,
  CollectionService,
  ID,
  LanguageCode,
  Logger,
  PluginCommonModule,
  PromotionCondition,
  VendurePlugin,
} from "@vendure/core";
import { pick } from "@vendure/common/lib/pick";

const monkeyPatch = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "DO NOT USE THIS",
    },
  ],
  code: "monkey-patch",
  args: {},
  init(injector) {
    /*
      Monkey-patched function:
      https://github.com/vendure-ecommerce/vendure/blob/c2a3b03e2e283fee4c4ebc117dc78f0f2b9e2c8b/packages/core/src/service/services/collection.service.ts#L492

      Will be solved in the future: https://github.com/vendure-ecommerce/vendure/issues/1382
    */
    const collectionService = injector.get(CollectionService);
    collectionService["applyCollectionFiltersInternal"] = async function (
      collection: Collection,
      applyToChangedVariantsOnly = true
    ): Promise<ID[]> {
      /*const ancestorFilters = await this.getAncestors(collection.id).then(
        (ancestors) =>
          ancestors.reduce(
            (filters, c) => [...filters, ...(c.filters || [])],
            [] as ConfigurableOperation[]
          )
      );*/
      const preIds = await this.getCollectionProductVariantIds(collection);
      collection.productVariants = await this["getFilteredProductVariants"](
        collection.filters || []
      );
      const postIds = collection.productVariants.map((v) => v.id);
      try {
        await this["connection"]
          .getRepository(Collection)
          // Only update the exact changed properties, to avoid VERY hard-to-debug
          // non-deterministic race conditions e.g. when the "position" is changed
          // by moving a Collection and then this save operation clobbers it back
          // to the old value.
          .save(pick(collection, ["id", "productVariants"]), {
            chunk: Math.ceil(collection.productVariants.length / 500),
            reload: false,
          });
      } catch (e) {
        //@ts-ignore
        Logger.error(e);
      }
      const preIdsSet = new Set(preIds);
      const postIdsSet = new Set(postIds);

      if (applyToChangedVariantsOnly) {
        return [
          ...preIds.filter((id) => !postIdsSet.has(id)),
          ...postIds.filter((id) => !preIdsSet.has(id)),
        ];
      } else {
        return [...preIds.filter((id) => !postIdsSet.has(id)), ...postIds];
      }
    };
  },
  async check(ctx, order, args) {
    return true;
  },
});

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.promotionOptions.promotionConditions.push(monkeyPatch);
    return config;
  },
})
export class PatchCollectionFilter {}
