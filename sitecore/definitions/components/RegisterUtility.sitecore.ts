import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the RegisterUtility component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function RegisterUtility(manifest: Manifest): void {
  manifest.addComponent({
    name: 'RegisterUtility',
    templateName: 'RegisterUtility',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backToMoveInCTA', type: CommonFieldTypes.GeneralLink },

      { name: 'clipBoardIcon', type: CommonFieldTypes.RichText },
      { name: 'desktopIcon', type: CommonFieldTypes.RichText },
      { name: 'documentIcon', type: CommonFieldTypes.RichText },
      { name: 'redirectIcon', type: CommonFieldTypes.RichText },
      { name: 'mapIcon', type: CommonFieldTypes.RichText },
      { name: 'searchIcon', type: CommonFieldTypes.RichText },

      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'registrationPrerequisiteInfo', type: CommonFieldTypes.SingleLineText },

      { name: 'prerequisiteList', type: CommonFieldTypes.ContentList },

      { name: 'submitOnlineRequest', type: CommonFieldTypes.SingleLineText },
      { name: 'findCustomerServiceCenter', type: CommonFieldTypes.SingleLineText },
      { name: 'browseUtilityProvider', type: CommonFieldTypes.SingleLineText },
      { name: 'multiProviderInfoLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'viewDetailsCTALabel', type: CommonFieldTypes.SingleLineText },

      { name: 'nextCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },

      { name: 'registerUtilitiesInputSectionTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'accountNumberLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'registrationDateLabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
