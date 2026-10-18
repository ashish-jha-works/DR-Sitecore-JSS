import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ProfileDetails component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function ProfileDetails(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ProfileDetails',
    templateName: 'ProfileDetails',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'profileName', type: CommonFieldTypes.SingleLineText },
      { name: 'profileLocation', type: CommonFieldTypes.SingleLineText },
      { name: 'profileImage', type: CommonFieldTypes.Image },
      { name: 'editProfile', type: CommonFieldTypes.Number },
      { name: 'editProfileIcon', type: CommonFieldTypes.RichText },
      { name: 'changePasswordCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'leaseStartDateLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'leaseStartDate', type: CommonFieldTypes.SingleLineText },
      { name: 'leaseRenewalDateLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'leaseRenewalDate', type: CommonFieldTypes.SingleLineText },
      { name: 'contactDetailsTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'contactDetailsIcon', type: CommonFieldTypes.RichText },
      { name: 'contactDetailsBody', type: CommonFieldTypes.RichText },
      { name: 'leaseDetailsTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'leaseDetailsIcon', type: CommonFieldTypes.RichText },
      { name: 'leaseDetailsBody', type: CommonFieldTypes.RichText },
      { name: 'dependentsDetailsTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'dependentsDetailsIcon', type: CommonFieldTypes.RichText },
      { name: 'dependentsDetailsBody', type: CommonFieldTypes.RichText },
      { name: 'addDependentInfoText', type: CommonFieldTypes.RichText },
      { name: 'dependentSubProfileHelpText', type: CommonFieldTypes.RichText },
      { name: 'dependentSubProfilePermissionsBanner', type: CommonFieldTypes.RichText },
      { name: 'dependentSubProfileMaintenanceText', type: CommonFieldTypes.RichText },
      { name: 'dependentSubProfileEventsText', type: CommonFieldTypes.RichText },
      { name: 'dependentSubProfileAcknowledgementText', type: CommonFieldTypes.RichText },
    ],
  });
}
