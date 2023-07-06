<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class IndexController extends AbstractController
{
    /**
     * @Route("/{level0}", name="home", defaults={"level0": null})
     * @Route("/user/{level1}", name="user", defaults={"level1": null})
     * @Route("/user/{level1}/{level2}", name="user", defaults={"level1": null, "level2": null})
     * @Route("/user/{level1}/{level2}/{level3}", name="user", defaults={"level1": null, "level2": null, "level3": null})
     */
    public function index()
    {
        return $this->render("index/index.html.twig");
    }
}
