<?php
/**
 * This source file is proprietary and part of Rebilly.
 *
 * (c) Rebilly SRL
 *     Rebilly Ltd.
 *     Rebilly Inc.
 *
 * @see https://www.rebilly.com
 */

declare(strict_types=1);

namespace App\Service;

use Money\Money;
use Rebilly\Sdk\Exception\DataValidationException;
use Rebilly\Sdk\Model\ContactEmails;
use Rebilly\Sdk\Model\ContactObject;
use Rebilly\Sdk\Model\Customer;
use Rebilly\Sdk\Model\OneTimeSale;
use Rebilly\Sdk\Model\PlanFormulaFlatRate;
use Rebilly\Sdk\Model\Subscription;
use Rebilly\Sdk\Model\SubscriptionOrOneTimeSale;
use Rebilly\Sdk\Model\SubscriptionOrOneTimeSaleItem;
use Rebilly\Sdk\Service;

final class Donation
{
    private const PLAN_DONATION_MONTHLY = 'donation-monthly';
    private const PLAN_DONATION_ONE_TIME = 'donation-ots';
    public function __construct(private readonly Service $service) {}

    /**
     * @throws DataValidationException
     * @return string Payment url
     */
    public function donate(string $websiteId, string $customerEmail, Money $amount, bool $recurring = false): string
    {
        $customer = $this->createCustomer($websiteId, $customerEmail);
        if ($recurring) {
            $order = $this->createSubscription($customer->getId(), $websiteId, $amount);
        } else {
            $order = $this->createOts($customer->getId(), $websiteId, $amount);
        }

        return $this->service->invoices()->get($order->getRecentInvoiceId())->getPaymentFormUrl();
    }

    private function createCustomer(string $websiteId, string $email): Customer
    {
        $primaryAddress = ContactObject::from()
            ->setEmails([
                ContactEmails::from()->setValue($email)->setPrimary(true)->setLabel('Main'),
            ]);

        $customer = Customer::from()
            ->setWebsiteId($websiteId)
            ->setPrimaryAddress($primaryAddress);

        return $this->service->customers()->create($customer);
    }

    private function createSubscription(string $customerId, string $websiteId, Money $amount): SubscriptionOrOneTimeSale
    {
        $plan = $this->service->plans()->get(self::PLAN_DONATION_MONTHLY);
        $plan->setPricing(PlanFormulaFlatRate::from()->setPrice($amount->getConvertedAmount()));
        return $this->service->subscriptions()->create(
            Subscription::from()
                ->setWebsiteId($websiteId)
                ->setCustomerId($customerId)
                ->setItems([SubscriptionOrOneTimeSaleItem::from()->setPlan($plan->jsonSerialize())->setQuantity(1)]),
        );
    }

    private function createOts(string $customerId, string $websiteId, Money $amount): SubscriptionOrOneTimeSale
    {
        $plan = $this->service->plans()->get(self::PLAN_DONATION_ONE_TIME);
        $plan->setPricing(PlanFormulaFlatRate::from()->setPrice($amount->getConvertedAmount()));
        return $this->service->subscriptions()->create(
            OneTimeSale::from()
                ->setWebsiteId($websiteId)
                ->setCustomerId($customerId)
                ->setItems([SubscriptionOrOneTimeSaleItem::from()->setPlan($plan->jsonSerialize())->setQuantity(1)]),
        );
    }
}