import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the TerminateUtilities component to the disconnected manifest.
 */
export default function TerminateUtilities(manifest: Manifest): void {
  manifest.addComponent({
    name: 'TerminateUtilities',
    templateName: 'TerminateUtilities',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'icon', type: CommonFieldTypes.RichText },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'desktopIcon', type: CommonFieldTypes.RichText },
      { name: 'redirectIcon', type: CommonFieldTypes.RichText },
      { name: 'mapIcon', type: CommonFieldTypes.RichText },
      { name: 'requestOnlineTermination', type: CommonFieldTypes.SingleLineText },
      { name: 'findCustomerServiceCenter', type: CommonFieldTypes.SingleLineText },
      { name: 'multiProviderInfoLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'viewDetailsCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'documentIcon', type: CommonFieldTypes.RichText },
      { name: 'empowerNocNoticeText', type: CommonFieldTypes.SingleLineText },
      { name: 'empowerNocDownloadLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cta', type: CommonFieldTypes.GeneralLink },
      { name: 'nextCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
