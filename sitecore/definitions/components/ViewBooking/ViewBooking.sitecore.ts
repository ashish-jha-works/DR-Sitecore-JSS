import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ViewBooking component to the disconnected manifest.
 */
export default function ViewBooking(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ViewBooking',
    templateName: 'ViewBooking',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'icon', type: CommonFieldTypes.RichText },

      // Step 2 – AmenityBookingDetails
      { name: 'bookingReferenceLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'upcomingLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelledLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'amenityLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'facilityLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'locationLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'durationLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'reservationCancelInfoText', type: CommonFieldTypes.SingleLineText },
      { name: 'shareYourBookingLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelBookingCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'addToCalendarLabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
