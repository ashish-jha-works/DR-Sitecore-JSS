import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ExploreProperties component to the disconnected manifest.
 */
export default function ExploreProperties(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ExploreProperties',
    templateName: 'ExploreProperties',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'formHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'formDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'communityLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'communityPlaceholder', type: CommonFieldTypes.SingleLineText },
      { name: 'propertyTypeLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'apartmentOption', type: CommonFieldTypes.SingleLineText },
      { name: 'villaOption', type: CommonFieldTypes.SingleLineText },
      { name: 'bedroomsLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'studioOption', type: CommonFieldTypes.SingleLineText },
      { name: 'oneBedroomOption', type: CommonFieldTypes.SingleLineText },
      { name: 'twoBedroomOption', type: CommonFieldTypes.SingleLineText },
      { name: 'threeBedroomOption', type: CommonFieldTypes.SingleLineText },
      { name: 'fourBedroomOption', type: CommonFieldTypes.SingleLineText },
      { name: 'areaLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'areaMinLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'areaMaxLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'areaMinPlaceholder', type: CommonFieldTypes.SingleLineText },
      { name: 'areaMaxPlaceholder', type: CommonFieldTypes.SingleLineText },
      { name: 'areaRangeHelperText', type: CommonFieldTypes.SingleLineText },
      { name: 'priceRangeLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'priceMinLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'priceMaxLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'priceMinPlaceholder', type: CommonFieldTypes.SingleLineText },
      { name: 'priceMaxPlaceholder', type: CommonFieldTypes.SingleLineText },
      { name: 'priceRangeHelperText', type: CommonFieldTypes.SingleLineText },
      { name: 'moveInDateLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'confirmButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'successModalHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'successModalDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'successModalButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'emptyCommunityMessage', type: CommonFieldTypes.MultiLineText },
      { name: 'emptyPropertyTypeMessage', type: CommonFieldTypes.MultiLineText },
      { name: 'emptyStateContactMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'emptyStateContactNumber', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
