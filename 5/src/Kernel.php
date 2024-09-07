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

namespace App;

use App\Controller\MainController;
use DI\Container;
use Psr\Container\ContainerInterface;
use Rebilly\Sdk\Client;
use Rebilly\Sdk\Service;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Views\PhpRenderer;

final class Kernel
{
    private ContainerInterface $container;
    public function __construct()
    {
        $this->boot();
    }

    private function boot(): void
    {
        $container = new Container();
        $container->set(PhpRenderer::class, fn () => new PhpRenderer(__DIR__ . '/views'));
        $container->set(Service::class, fn () => new Service(
            new Client([
                'baseUrl' => $_ENV['ENV'] === 'sandbox' ? Client::SANDBOX_HOST : Client::BASE_HOST,
                'organizationId' => $_ENV['ORG_ID'],
                'apiKey' => $_ENV['API_KEY'],
            ]),
        ));

        $this->container = $container;
    }

    public function createApp(): App
    {
        $app = AppFactory::create(container: $this->container);
        $app->addRoutingMiddleware();
        $app->addErrorMiddleware(true, false, false);
        $app->get('/', MainController::class . ':index');
        $app->post('/donate', MainController::class . ':donate');

        return $app;
    }
}