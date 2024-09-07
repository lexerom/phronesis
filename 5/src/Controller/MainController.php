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

namespace App\Controller;
use App\Service\Donation;
use Money\Currency;
use Money\Money;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Rebilly\Sdk\Exception\DataValidationException;
use Slim\Exception\HttpBadRequestException;
use Slim\Views\PhpRenderer;

final class MainController
{
    public function __construct(
        private readonly PhpRenderer $renderer,
        private readonly Donation $donation,
    ) {}

    public function index(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        return $this->renderer->render($response, 'index.phtml');
    }

    public function donate(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $params = (array) $request->getParsedBody();

        // Add validation, csrf check and so on

        try {
            $paymentUrl = $this->donation->donate(
                $request->getServerParams()['WEBSITE_ID'],
                $params['email'],
                Money::fromString($params['amount'], new Currency('USD')),
                array_key_exists('recurring', $params) && $params['recurring'],
            );
        } catch (DataValidationException $exception) {
            throw new HttpBadRequestException($request, $exception->getMessage());
        }

        return $response
            ->withHeader('Location', $paymentUrl)
            ->withStatus(302);
    }
}