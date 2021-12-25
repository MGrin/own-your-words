export type OpenSeaMetadataAttribute = {
  trait_type: string;
  value: any;
};

export type OpenSeaMetadata = {
  name: string;
  description: string;
  external_url: string;
  image: string;
  attributes: OpenSeaMetadataAttribute[];
};
