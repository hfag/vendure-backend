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
    // REMOVE MONKEYPATCH ASAP, i.e. vendure 2.0
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
      const filteredVariantIds: any[] = await this[
        "getFilteredProductVariantIds"
      ]([
        /*...ancestorFilters,*/
        ...(collection.filters || []),
      ]);
      const postIds = filteredVariantIds.map((v) => v.id);
      const preIdsSet = new Set(preIds);
      const postIdsSet = new Set(postIds);

      const toDeleteIds = preIds.filter((id) => !postIdsSet.has(id));
      const toAddIds = postIds.filter((id) => !preIdsSet.has(id));

      try {
        // First we remove variants that are no longer in the collection
        const chunkedDeleteIds = this["chunkArray"](toDeleteIds, 500);

        for (const chunkedDeleteId of chunkedDeleteIds) {
          await this["connection"].rawConnection
            .createQueryBuilder()
            .relation(Collection, "productVariants")
            .of(collection)
            .remove(chunkedDeleteId);
        }

        // Then we add variants have been added
        const chunkedAddIds = this["chunkArray"](toAddIds, 500);

        for (const chunkedAddId of chunkedAddIds) {
          await this["connection"].rawConnection
            .createQueryBuilder()
            .relation(Collection, "productVariants")
            .of(collection)
            .add(chunkedAddId);
        }
      } catch (e: any) {
        Logger.error(e);
      }

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
  async check() {
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
