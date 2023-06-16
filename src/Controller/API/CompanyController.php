<?php

namespace App\Controller\API;

use App\Manager\FormManager;
use App\Manager\CompanyManager;
use App\Repository\CompanyRepository;
use App\Repository\EstimateRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class CompanyController extends AbstractController {

    private EntityManagerInterface $em;
    private SerializerInterface $serializer;
    private FormManager $formManager;
    private CompanyManager $companyManager;
    private CompanyRepository $companyRepository;
    private EstimateRepository $estimateRepository;

    function __construct(
        EntityManagerInterface $em,
        SerializerInterface $serializer,
        FormManager $formManager,
        CompanyManager $companyManager,
        CompanyRepository $companyRepository,
        EstimateRepository $estimateRepository
    ) {
        $this->em = $em;
        $this->serializer = $serializer;
        $this->formManager = $formManager;
        $this->companyManager = $companyManager;
        $this->companyRepository = $companyRepository;
        $this->estimateRepository = $estimateRepository;
    }

    /**
     * @Route("/company", name="get_companies", methods={"GET"})
     */
    public function get_companies(Request $request): JsonResponse
    {
        $offset = $request->get("offset", 1);
        $offset = $offset > 1 ? $offset : 1;
        $limit = 20;

        $normalize = $this->serializer->normalize($this->companyRepository->getCompanies($offset, $limit), null);

        return $this->json($normalize, Response::HTTP_OK);
    }

    /**
     * @Route("/company", name="post_company", methods={"POST"})
     */
    public function post_company(Request $request): JsonResponse
    {
        // Get the body request
        $bodyContent = $request->getContent();

        // Decode the JSON content into array
        $jsonContent = json_decode($bodyContent);
        if(!$jsonContent) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Separate only the needed value
        $content = [];
        foreach($jsonContent as $key => $row) {
            if(!in_array($key, ["name", "address", "zip_code", "city", "country", "siren", "siret", "dns_number", "phone", "email"])) {
                continue;
            }

            // $this->formManager
            $content[$key] = $row;
        }

        try {
            $company = $this->companyManager->newCompany($content);
        } catch(\Exeception $e) {
            return $this->json($e->getMessage());
        }

        return $this->json(null, Response::HTTP_CREATED);
    }

    /**
     * @Route("/company/{id}", requirements={"id"="\d+"}, name="get_company", methods={"GET"})
     */
    public function get_company(Request $request, $id): JsonResponse
    {
        $company = $this->companyRepository->find($id);
        if(empty($company)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        return $this->json($company, Response::HTTP_OK);
    }

    /**
     * @Route("/company/{id}/estimates", requirements={"id"="\d+"}, name="get_estimates_form_company", methods={"GET"})
     */
    public function get_estimates_form_company(Request $id) : JsonResponse {
        $company = $this->companyRepository->find($id);
        if(empty($company)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        // Get all estimates linked to the company
        $estimates = $this->estimateRepository->findBy(["company" => $company]);

        // Convert the object arrays into jsonable array
        $normalize = $this->serializer->normalize($estimates, null);

        // Return the response to the client
        return $this->json($$normalize, Response::HTTP_OK);
    }

    /**
     * @Route("/company/{id}/update", requirements={"id"="\d+"}, name="update_company", methods={"PUT"})
     */
    public function put_company(Request $request, $id): JsonResponse
    {
        // Get the body request
        $bodyContent = $request->getContent();

        // Decode the JSON content into array
        $jsonContent = json_decode($bodyContent);
        foreach($jsonContent as $key => $row) {
            // 
        }

        return $this->json(["All rights"], Response::HTTP_OK);
    }

    /**
     * @Route("/company/{id}/remove", requirements={"id"="\d+"}, name="remove_company", methods={"DELETE"})
     */
    public function remove_company(Request $request, int $id): JsonResponse
    {
        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}