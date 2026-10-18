import ClockIcon from 'assets/icons/ClockIcon';
import { PaymentAccordion } from 'components/Accordion/PaymentAccordion';
import { JSX } from 'react';
import { usePaymentPageData } from './usePaymentPageData';
import TableItem from 'components/table/TableItem';
import { formatDate } from 'src/utils/formatDate';
import { formatAmount } from 'lib/utils/helper';
import {
  OutstandingPaymentsSkeleton,
  PaymentsHistorySkeleton,
  UpcomingPaymentsSkeleton,
} from 'components/payments/PaymentsPage/PaymentSkeleton';
import MoneyCardIcon from 'assets/icons/MoneyCardIcon';
import Settings from 'assets/icons/Settings';
import VisibilityIcon from 'assets/icons/VisibilityIcon';
import CirclePlusIcon from 'assets/icons/CirclePlusIcon';
import DeleteBinIcon from 'assets/icons/DeleteBinIcon';
import PaymentCard from 'components/payments/PaymentCard/PaymentCard';
import CalendarIcon from 'assets/icons/CalendarIcon';
import Select from 'components/common/Select';
import ChevronDown from 'assets/icons/ChevronDown';
import Link from 'next/link';
export default function PaymentsPage(): JSX.Element {
  const {
    outstandingPayments,
    totalOutstandingAmount,
    isOutstandingPaymentLoading,
    upcomingPayments,
    totalUpcomingAmount,
    isUpcomingPaymentLoading,
    cardData,
    leaseTenureOptions,
    leaseTenure,
    setLeaseTenure,
    transactions,
    showAll,
    setShowAll,
    shouldShowMore,
    visibleTransactions,
    isLoadingPaymentHistory,
    requestAccessToken,
    handleViewReceipt,
    handleDownloadStatement,
  } = usePaymentPageData();

  return (
    <div className="payment-dashboard-body relative -mt-13 z-1 [&>*:last-child]:!mb-8 lg:[&>*:last-child]:!mb-10">
      {/* Outstanding Payments section */}
      <PaymentAccordion title={'Outstanding payments'} icon={<ClockIcon />} collapsible={false}>
        {isOutstandingPaymentLoading ? (
          <OutstandingPaymentsSkeleton />
        ) : (
          <div>
            <div
              className={`flex flex-col gap-1 lg:gap-2 ${
                outstandingPayments?.length === 0
                  ? 'border-t border-lilac-100 mt-4 mb-0'
                  : 'mb-2 lg:mb-3'
              }`}
            >
              {outstandingPayments?.length > 0 ? (
                outstandingPayments.map((outstandingPaymentItem) => (
                  <TableItem
                    key={outstandingPaymentItem.Id}
                    leftTitle={outstandingPaymentItem?.Title}
                    leftSubtitle={formatDate(outstandingPaymentItem?.Date)}
                    rightTitle={`AED ${formatAmount(outstandingPaymentItem?.Amount)}`}
                  />
                ))
              ) : (
                <p className="text-body mt-5 lg:mt-6 mb-0 text-center text-navy-500 font-light">
                  Currently, there are no outstanding payments
                </p>
              )}
              {outstandingPayments?.length > 0 && totalOutstandingAmount ? (
                <TableItem
                  leftTitle="Total"
                  rightTitle={`AED ${formatAmount(totalOutstandingAmount)}`}
                  emphasis="total"
                  isLastItem={true}
                />
              ) : null}
            </div>
            {outstandingPayments?.length > 0 && totalOutstandingAmount ? (
              <Link
                className="btn btn-primary lg:w-68.75 flex justify-self-end"
                href="/payment/outstandingPayment"
                onClick={requestAccessToken}
              >
                Pay
              </Link>
            ) : null}
          </div>
        )}
      </PaymentAccordion>

      {/* Upcoming Payments section */}
      <PaymentAccordion
        title={'Upcoming payments'}
        icon={<MoneyCardIcon />}
        collapsible={true}
        defaultOpen={false}
        totalAmount={
          upcomingPayments !== null && upcomingPayments?.length && totalUpcomingAmount
            ? `AED ${formatAmount(totalUpcomingAmount)}`
            : null
        }
      >
        {isUpcomingPaymentLoading ? (
          <UpcomingPaymentsSkeleton />
        ) : (
          <div>
            <div
              className={`flex flex-col gap-1 lg:gap-2 ${
                upcomingPayments?.length === 0
                  ? 'border-t border-lilac-100 mt-4 mb-0'
                  : 'mb-2 lg:mb-3'
              }`}
            >
              {upcomingPayments !== null && upcomingPayments?.length > 0 && totalUpcomingAmount ? (
                upcomingPayments.map((upcomingPaymentItem, index) => (
                  <TableItem
                    key={upcomingPaymentItem.Id}
                    leftTitle={upcomingPaymentItem?.Title}
                    leftSubtitle={formatDate(upcomingPaymentItem?.Date)}
                    rightTitle={`AED ${formatAmount(upcomingPaymentItem?.Amount)}`}
                    isLastItem={index === upcomingPayments.length - 1}
                  />
                ))
              ) : (
                <p className="text-body mt-5 lg:mt-6 mb-0 text-center text-navy-500 font-light">
                  You have no upcoming payments.
                </p>
              )}
            </div>
          </div>
        )}
      </PaymentAccordion>

      {/* Manage Cards section */}
      <PaymentAccordion
        title={'Manage cards'}
        icon={<Settings />}
        collapsible={true}
        defaultOpen={false}
      >
        <div className="card-body mt-5 lg:mt-6 flex flex-col lg:flex-row">
          <div className="left-panel lg:max-w-1/2 flex justify-end mx-auto lg:mr-20 mb-5 lg:mb-0">
            <PaymentCard onClick={() => {}} cardData={cardData} isPrimary={true} />
          </div>
          <div className="right-panel lg:w-1/2">
            <h4 className="text-body font-medium mb-4">In the Manage Cards page, you can:</h4>
            <ul className="flex flex-col gap-5 lg:gap-4 font-light">
              <li className="flex gap-4 items-center">
                <VisibilityIcon className="text-lilac-500" width={24} height={24} /> View all your
                saved cards
              </li>
              <li className="flex gap-4 items-center">
                <CirclePlusIcon className="text-lilac-500" width={24} height={24} /> Add a new card
              </li>
              <li className="flex gap-4 items-center">
                <DeleteBinIcon className="text-lilac-500" width={24} height={24} /> Remove saved
                cards
              </li>
              <li className="flex gap-4 items-center">
                <MoneyCardIcon className="text-lilac-500" width={24} height={24} /> Select your
                primary card
              </li>
            </ul>
          </div>
        </div>
        <div className="btn-wrapper w-full mt-5 lg:mt-3">
          <Link
            href={'/payment/manage-cards'}
            className="btn btn-primary lg:w-68.75 flex justify-self-end"
          >
            Manage Cards
          </Link>
        </div>
      </PaymentAccordion>

      {/* Payment History section */}
      <PaymentAccordion
        title={'Payment history'}
        icon={<CalendarIcon />}
        collapsible={false}
        isDownloadEnable={Boolean(transactions?.length)}
        handleDownloadAction={handleDownloadStatement}
      >
        <div className="mt-3">
          <div className="w-full lg:w-68 font-light mb-5 lg:mb-6">
            <Select
              label={'Leases'}
              options={leaseTenureOptions}
              value={leaseTenure}
              onChange={setLeaseTenure}
            />
          </div>
          {isLoadingPaymentHistory ? (
            <PaymentsHistorySkeleton />
          ) : (
            <div className="payment-listing">
              <div className="mb-2 lg:mb-3 flex flex-col gap-1 lg:gap-2 max-h-145 overflow-x-auto pe-3">
                {transactions !== null && transactions?.length > 0 ? (
                  visibleTransactions.map((transaction, index) => (
                    <TableItem
                      key={index}
                      leftTitle={transaction?.Description}
                      leftSubtitle={formatDate(transaction?.TransactionDate)}
                      rightTitle={`${
                        transaction?.TransactionCurrency ? transaction.TransactionCurrency : 'AED'
                      } ${formatAmount(transaction?.Amount)}`}
                      rightSubtitleLink="View Receipt"
                      rightLinkAction={() => handleViewReceipt(transaction.ReceptNumber)}
                      isLastItem={index === visibleTransactions.length - 1}
                    />
                  ))
                ) : (
                  <p className="text-body mt-5 lg:mt-6 mb-0 text-center text-navy-500 font-light">
                    Your downloadable payment history will be shown here.
                  </p>
                )}
              </div>
              {shouldShowMore && !showAll && (
                <div className="flex items-center justify-center">
                  <a
                    className="uppercase text-navy-500 text-body-sm lg:text-body font-medium items-center"
                    onClick={() => setShowAll(true)}
                  >
                    <ChevronDown className="mr-2 lg:mr-3" />
                    Load More
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </PaymentAccordion>
    </div>
  );
}
