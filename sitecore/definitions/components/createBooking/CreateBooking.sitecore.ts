import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the CreateBooking component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function CreateBooking(manifest: Manifest): void {
  manifest.addComponent({
    name: 'CreateBooking',
    templateName: 'CreateBooking',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      // Step 1 – BookAmenity
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'facilitySectionTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'facilityDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'facilityLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'dateSelectionWarning', type: CommonFieldTypes.SingleLineText },
      { name: 'bookAmenityCTA', type: CommonFieldTypes.SingleLineText },
      { name: 'confirmCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelBookingCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'addToCalendarLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'createAnotherBookingLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'backToAmenityBookingsLabel', type: CommonFieldTypes.SingleLineText },

      // Step 2 – AmenityBookingDetails
      { name: 'bookingDetailsSectionTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'bookingReferenceLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'upcomingLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelledLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'amenityLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'locationLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'durationLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'reservationCancelInfoText', type: CommonFieldTypes.SingleLineText },
      { name: 'cancellationPolicy', type: CommonFieldTypes.SingleLineText },
      { name: 'tncText', type: CommonFieldTypes.SingleLineText },
      { name: 'shareYourBookingLabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
