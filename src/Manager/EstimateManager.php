<?php

namespace App\Manager;

use Psr\Container\ContainerInterface;

class EstimateManager extends AbstractController {

    function __construct(
        ContainerInterface $container
    ) {
        $this->setContainer($container);
    }

    public function generateEstimate(Shop $shop)
    {
        return;
    }
}