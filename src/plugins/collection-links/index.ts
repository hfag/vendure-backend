import {
  VendurePlugin,
  PluginCommonModule,
  PromotionCondition,
  LanguageCode,
  ID,
} from "@vendure/core";
import gql from "graphql-tag";
import { CollectionLink } from "./collection-links.entity";
import { CollectionLinkTranslation } from "./collection-links-translation.entity";
import {
  CollectionLinksAdminResolver,
  CollectionLinkEntityResolver,
  CollectionEntityResolver,
} from "./collection-links.resolver";
import { CollectionLinkService } from "./collection-links.service";
import { AdminUiExtension } from "@vendure/ui-devkit/compiler";

export type CreateCollectionLinkInput = {
  collectionId: ID;
  type: "pdf" | "video" | "link";
  translations: {
    languageCode: LanguageCode;
    name: string;
    url: string;
  }[];
};
export type UpdateCollectionLinkInput = {
  id: ID;
  collectionId: ID;
  type: "pdf" | "video" | "link";
  translations: {
    languageCode: LanguageCode;
    name: string;
    url: string;
  }[];
};

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

  type CollectionLink {
    id: ID!
    collection: Collection!
    collectionId: ID!
    type: CollectionLinkType!
    name: String!
    url: String!
    translations: [CollectionLinkTranslation!]!
  }

  input CollectionLinkTranslationInput {
    id: ID
    languageCode: LanguageCode!
    name: String!
    url: String!
  }

  input CreateCollectionLinkInput {
    collectionId: ID!
    type: CollectionLinkType!
    translations: [CollectionLinkTranslationInput!]!
  }

  input UpdateCollectionLinkInput {
    id: ID!
    collectionId: ID!
    type: CollectionLinkType!
    translations: [CollectionLinkTranslationInput!]!
  }

  extend type Collection {
    links: [CollectionLink!]!
  }

  extend type Mutation {
    createCollectionLink(input: CreateCollectionLinkInput!): Collection!
    createCollectionLinks(input: [CreateCollectionLinkInput!]!): Boolean!

    updateCollectionLink(input: UpdateCollectionLinkInput!): Collection!
    updateCollectionLinks(input: [UpdateCollectionLinkInput!]!): Boolean!

    deleteCollectionLink(id: ID!): Boolean!
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
    type: CollectionLinkType!
    name: String!
    url: String!
    translations: [CollectionLinkTranslation!]!
  }

  extend type Collection {
    links: [CollectionLink!]!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [CollectionLink, CollectionLinkTranslation],
  providers: [CollectionLinkService],
  adminApiExtensions: {
    schema: adminSchemaExtension,
    resolvers: [
      CollectionLinksAdminResolver,
      CollectionLinkEntityResolver,
      CollectionEntityResolver,
    ],
  },
  shopApiExtensions: {
    schema: shopSchemaExtension,
    resolvers: [CollectionLinkEntityResolver, CollectionEntityResolver],
  },
  configuration: (config) => {
    config.customFields.Collection.push({
      type: "boolean",
      name: "hasLinks",
      label: [{ languageCode: LanguageCode.en, value: "Has links" }],
    });
    return config;
  },
})
export class CollectionLinksPlugin {}
