import {
  VendurePlugin,
  PluginCommonModule,
  PromotionCondition,
  LanguageCode,
  ID,
} from "@vendure/core";
import gql from "graphql-tag";
import { CollectionLink } from "./collection-link.entity";
import {
  CollectionLinksAdminResolver,
  CollectionLinkEntityResolver,
  CollectionEntityResolverAdmin,
  CollectionAssetLinkResolverAdmin,
  CollectionEntityResolverShop,
} from "./collection-links.resolver";
import { CollectionLinkService } from "./collection-links.service";
import { AdminUiExtension } from "@vendure/ui-devkit/compiler";
import { CollectionLinkUrl } from "./collection-link-url.entity";
import { CollectionLinkUrlTranslation } from "./collection-link-url-translation.entity";
import { CollectionLinkAsset } from "./collection-link-asset.entity";

export type CreateCollectionLinkUrlInput = {
  collectionId: ID;
  icon: "pdf" | "video" | "link";
  order: number;
  translations: {
    languageCode: LanguageCode;
    name: string;
    url: string;
  }[];
};
export type CreateCollectionLinkAssetInput = {
  collectionId: ID;
  icon: "pdf" | "video" | "link";
  order: number;
  assetId: ID;
};

export type UpdateCollectionLinkUrlInput = {
  id: ID;
  icon: "pdf" | "video" | "link";
  order: number;
  translations: {
    languageCode: LanguageCode;
    name: string;
    url: string;
  }[];
};
export type UpdateCollectionLinkAssetInput = {
  id: ID;
  assetId: ID;
  icon: "pdf" | "video" | "link";
  order: number;
};

export type UpdateCollectionLinkInput =
  | UpdateCollectionLinkUrlInput
  | UpdateCollectionLinkAssetInput;

export const CollectionLinkInputModule: AdminUiExtension["ngModules"][0] = {
  type: "shared",
  ngModuleFileName: "collection-links-input.module.ts",
  ngModuleName: "CollectionLinkInputModule",
};

//extend product

const adminSchemaExtension = gql`
  enum CollectionLinkType {
    PDF
    VIDEO
    LINK
  }

  type CollectionLinkTranslation {
    id: ID!
    languageCode: LanguageCode!
    name: ID!
    url: String!
  }

  type CollectionAssetLink {
    linkId: ID!
    linkAssetId: ID!
    collectionId: ID!
    icon: CollectionLinkType!
    order: Int!
    assetId: ID!
    asset: Asset!
  }

  type CollectionUrlLink {
    linkId: ID!
    linkUrlId: ID!
    collectionId: ID!
    icon: CollectionLinkType!
    order: Int!
    name: String!
    url: String!
    translations: [CollectionLinkTranslation!]!
  }

  union CollectionLink = CollectionUrlLink | CollectionAssetLink

  input CollectionLinkTranslationInput {
    id: ID
    languageCode: LanguageCode!
    name: String!
    url: String!
  }

  input CreateCollectionLinkUrlInput {
    collectionId: ID!
    icon: CollectionLinkType!
    order: Int!
    translations: [CollectionLinkTranslationInput!]!
  }

  input CreateCollectionLinkAssetInput {
    collectionId: ID!
    icon: CollectionLinkType!
    order: Int!
    assetId: ID!
  }

  input UpdateCollectionLinkUrlInput {
    id: ID!
    icon: CollectionLinkType!
    order: Int!
    translations: [CollectionLinkTranslationInput!]!
  }

  input UpdateCollectionLinkAssetInput {
    id: ID!
    icon: CollectionLinkType!
    order: Int!
    assetId: ID!
  }

  extend type Collection {
    links: [CollectionLink!]!
  }

  extend type Mutation {
    createCollectionLinkUrl(input: CreateCollectionLinkUrlInput!): Collection!
    createCollectionLinkAsset(
      input: CreateCollectionLinkAssetInput!
    ): Collection!

    updateCollectionUrlLink(input: UpdateCollectionLinkUrlInput!): Collection!
    updateCollectionAssetLink(
      input: UpdateCollectionLinkAssetInput!
    ): Collection!

    deleteCollectionLink(id: ID!): Collection!
  }
`;

const shopSchemaExtension = gql`
  enum CollectionLinkType {
    PDF
    VIDEO
    LINK
  }

  type CollectionLinkTranslation {
    id: ID!
    languageCode: LanguageCode!
    name: ID!
    url: String!
  }

  type CollectionLink {
    id: ID!
    collection: Collection!
    collectionId: ID!
    icon: CollectionLinkType!
    order: Int!
    name: String!
    url: String!
  }

  extend type Collection {
    links: [CollectionLink!]!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [
    CollectionLink,
    CollectionLinkUrl,
    CollectionLinkUrlTranslation,
    CollectionLinkAsset,
  ],
  providers: [CollectionLinkService],
  adminApiExtensions: {
    schema: adminSchemaExtension,
    resolvers: [
      CollectionLinksAdminResolver,
      CollectionLinkEntityResolver,
      CollectionEntityResolverAdmin,
      CollectionAssetLinkResolverAdmin,
    ],
  },
  shopApiExtensions: {
    schema: shopSchemaExtension,
    resolvers: [CollectionLinkEntityResolver, CollectionEntityResolverShop],
  },
})
export class CollectionLinksPlugin {}