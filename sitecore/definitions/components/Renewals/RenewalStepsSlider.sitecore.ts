import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the RenewalStepsSlider component to the disconnected manifest.
 */
export default function RenewalStepsSlider(manifest: Manifest): void {
  manifest.addComponent({
    name: 'RenewalStepsSlider',
    templateName: 'RenewalStepsSlider',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'renewContractCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'shortTermRenewalCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'remindLaterCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'remindLaterModalHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'remindLaterSelectDateLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'remindLaterCancelButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'remindLaterAddToCalendarLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'remindLaterEventTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'remindLaterEventDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'moveOutLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'moveOutCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'moveOutConfirmHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'moveOutConfirmCancelText', type: CommonFieldTypes.SingleLineText },
      { name: 'moveOutConfirmContinueText', type: CommonFieldTypes.SingleLineText },
      { name: 'moveOutConfirmList', type: CommonFieldTypes.ContentList },
      { name: 'explorePropertiesLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'explorePropertiesCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'list', type: CommonFieldTypes.RichText },
    ],
  });

  manifest.addComponent({
    name: 'MoveOutConfirmListItem',
    templateName: 'MoveOutConfirmListItem',
    fields: [
      { name: 'image', type: CommonFieldTypes.Image },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.RichText },
    ],
  });
}
