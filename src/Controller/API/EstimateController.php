<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Entity\Estimate;
use App\Enum\EstimateEnum;
use App\Manager\EstimateManager;
use App\Manager\SerializeManager;
use App\Repository\UserRepository;
use App\Repository\EstimateRepository;
use App\Repository\EstimateDetailRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class EstimateController extends AbstractController
{
    private User $user;
    private EstimateManager $estimateManager;
    private SerializeManager $serializeManager;
    private EstimateRepository $estimateRepository;
    private EstimateDetailRepository $estimateDetailRepository;
    
    function __construct(
        Security $security, 
        UserRepository $userRepository, // Temporary => To delete after the login process has been implemented
        EstimateManager $estimateManager, 
        SerializeManager $serializeManager, 
        EstimateRepository $estimateRepository, 
        EstimateDetailRepository $estimateDetailRepository
    ) {
        $this->user = $security->getUser() ?? $userRepository->find(1);
        $this->estimateManager = $estimateManager;
        $this->serializeManager = $serializeManager;
        $this->estimateRepository = $estimateRepository;
        $this->estimateDetailRepository = $estimateDetailRepository;
    }

    /**
     * @Route("/estimate", name="get_estimates", methods={"GET"})
     */
    public function get_estimates(Request $request): JsonResponse
    {
        return $this->json(
            $this->serializeManager->serializeContent(
                $this->estimateRepository->findBy(["user" => $this->user])
            ), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/estimate", name="post_estimate", methods={"POST"})
     */
    public function post_estimate(Request $request) : JsonResponse 
    {
        $jsonContent = json_decode($request->getContent(), true);
        if(empty($jsonContent)) {
            return $this->json("Empty body", Response::HTTP_FORBIDDEN);
        }

        try {
            $fields = $this->estimateManager->checkFields($jsonContent);
            if(empty($fields)) {
                return $this->json("Empty body", Response::HTTP_FORBIDDEN);
            }

            $nbrEstimate = $this->estimateRepository->countEstimatesByCompanyAndUser($fields["company"], $this->user) + 1;

            $estimate = (new Estimate())
                ->setUser($this->user)
                ->setCompany($fields["company"])
                ->setLabel("Estimate n°{$nbrEstimate}")
                ->setStatus(EstimateEnum::STATUS_SEND) // Shouldn't be in Invoice ???
                ->setCreatedAt(new \DateTimeImmutable())
            ;

            $this->estimateRepository->save($estimate, true);

            foreach($fields["details"] as $detail) {
                $this->estimateDetailRepository->save(
                    $this->estimateManager->fillEstimateDetail($detail, $estimate), 
                    true
                );
            }
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $this->json(null, Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/estimate/{estimateID}", requirements={"estimateID"="\d+"}, name="get_estimate", methods={"GET"})
     */
    public function get_estimate(int $estimateID) : JsonResponse 
    {
        if(empty($estimateID)) {
            return $this->json("The estimate identifier is missing", Response::HTTP_FORBIDDEN);
        }

        $estimate = $this->estimateRepository->findOneBy(["id" => $estimateID, "user" => $this->user]);
        if(empty($estimate)) {
            return $this->json("Not found estimate", Response::HTTP_NOT_FOUND);
        }

        return $this->json(
            $this->serializeManager->serializeContent($estimate), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/estimate/{estimateID}/update", requirements={"estimateID"="\d+"}, name="update_estimate", methods={"UPDATE", "PUT"})
     */
    public function update_estimate(Request $request, int $estimateID) : JsonResponse 
    {
        // Get the body request
        $jsonContent = json_decode($request->getContent(), true);
        if(!$jsonContent) {
            return $this->json([
                "message" => "An error has been found when decoding the body"
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $estimate = $this->estimateRepository->find($estimateID);
        if(empty($estimate)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        try {
            $fields = $this->estimateManager->checkFields($jsonContent);
            if(empty($fields)) {
                return $this->json("Empty body", Response::HTTP_PRECONDITION_FAILED);
            }
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Return a response to the client
        return $this->json("Route under construction", Response::HTTP_OK);
    }

    /**
     * @Route("/estimate/{estimateID}/remove", requirements={"estimateID"="\d+"}, name="remove_estimate", methods={"DELETE"})
     */
    public function remove_estimate(Request $request, int $estimateID) : JsonResponse 
    {
        $estimate = $this->estimateRepository->find($estimateID);
        if(empty($estimate)) {
            return $this->json(["message" => "Not found estimate"], Response::HTTP_NOT_FOUND);
        }

        // Remove from the database the estimate
        try {
            foreach($estimate->getEstimateDetails() as $estimateDetail) {
                $this->estimateDetailRepository->remove($estimateDetail);
            }

            $this->estimateRepository->remove($estimate, true);
            
        } catch(\Exception $e) {
            return $this->json(["message" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}
