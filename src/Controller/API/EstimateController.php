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
        return $this->json(["message" => "Route under construction"], Response::HTTP_OK);
    }

    /**
     * @Route("/estimate", name="post_estimate", methods={"POST"})
     */
    public function post_estimate(Request $request) : JsonResponse 
    {
        return $this->json(["message" => "Route under construction"], Response::HTTP_OK);
    }

    /**
     * @Route("/estimate/{estimateID}", requirements={"estimateID"="\d+"}, name="get_estimate", methods={"GET"})
     */
    public function get_estimate(int $estimateID) : JsonResponse 
    {
        if(empty($estimateID)) {
            return $this->json(["message" => "The estimate identifier is missing"], Response::HTTP_FORBIDDEN);
        }

        $estimate = $this->estimateRepository->find($estimateID);
        if(empty($estimate)) {
            return $this->json(["message" => "Not found estimate"], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            "estimate" => $estimate,
            "estimateDetails" => $estimate->getEstimateDetails()
        ], Response::HTTP_OK);
    }

    /**
     * @Route("/estimate/{estimateID}/update", requirements={"estimateID"="\d+"}, name="update_estimate", methods={"UPDATE", "PUT"})
     */
    public function update_estimate(Request $request, int $estimateID) : JsonResponse 
    {
        // Get the body request
        $contentBody = $request->getContent();

        // Decode the body
        $jsonContent = json_decode($contentBody);
        
        // If I couldn't decode the body then return an error
        if(!$jsonContent) {
            return $this->json([
                "message" => "An error has been found when decoding the body"
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $fields = [];
        foreach($jsonContent as $key => $value) {
            if(!in_array($key, ["estimate_details", "label", "status"])) {
                continue;
            }

            $fields[$key] = $value;
        }

        if(empty($fields)) {
            return $this->json([
                "message" => "Empty body"
            ], Response::HTTP_FORBIDDEN);
        }

        // Return a response to the client
        return $this->json(["message" => "Route under construction"], Response::HTTP_OK);
    }

    /**
     * @Route("/estimate/{estimateID}/remove", requirements={"estimateID"="\d+"}, name="remove_estimate", methods={"DELETE"})
     */
    public function remove_estimate(Request $request, int $estimateID) : JsonResponse 
    {
        if(empty($estimateID)) {
            return $this->json(["message" => "Missing estimate identifier"], Response::HTTP_FORBIDDEN);
        }

        $estimate = $this->estimateRepository->find($estimateID);
        if(empty($estimate)) {
            return $this->json(["message" => "Not found estimate"], Response::HTTP_NOT_FOUND);
        }

        // Remove from the database the estimate
        try {
            $this->estimateRepository->remove($estimate, true);
        } catch(\Exception $e) {
            return $this->json(["message" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}
