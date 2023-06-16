<?php

namespace App\Controller\API;

use App\Repository\EstimateRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class EstimateController extends AbstractController
{
    private EstimateRepository $estimateRepository;
    
    function __construct(EstimateRepository $estimateRepository) {
        $this->estimateRepository = $estimateRepository;
    }

    /**
     * @Route("/estimate", name="get_estimates", methods={"GET"})
     */
    public function get_estimates(Request $request): JsonResponse
    {
        return $this->json("Route under construction", Response::HTTP_OK);
    }

    /**
     * @Route("/estimate", name="post_estimate", methods={"POST"})
     */
    public function post_estimate(Request $request) : JsonResponse 
    {
        return $this->json("Route under construction", Response::HTTP_OK);
    }

    /**
     * @Route("/estimate/{estimateID}", name="get_estimate", methods={"GET"})
     */
    public function get_estimate(int $estimateID) : JsonResponse 
    {
        return $this->json("Route under construction", Response::HTTP_OK);
    }

    /**
     * @Route("/estimate/{estimateID}/update", name="update_estimate", methods={"UPDATE", "PUT"})
     */
    public function update_estimate(Request $request) : JsonResponse 
    {
        return $this->json("Route under construction", Response::HTTP_OK);
    }

    /**
     * @Route("/estimate/{estimateID}/remove", name="remove_estimate", methods={"DELETE"})
     */
    public function remove_estimate() : JsonResponse 
    {
        return $this->json("Route under construction", Response::HTTP_OK);
    }
}
