<?php

namespace App\Controller\API;

use App\Manager\FormManager;
use App\Manager\CompanyManager;
use App\Repository\CompanyRepository;
use App\Repository\InvoiceRepository;
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
    private InvoiceRepository $invoiceRepository;

    function __construct(
        EntityManagerInterface $em,
        SerializerInterface $serializer,
        FormManager $formManager,
        CompanyManager $companyManager,
        CompanyRepository $companyRepository,
        InvoiceRepository $invoiceRepository,
        EstimateRepository $estimateRepository
    ) {
        $this->em = $em;
        $this->serializer = $serializer;
        $this->formManager = $formManager;
        $this->companyManager = $companyManager;
        $this->companyRepository = $companyRepository;
        $this->invoiceRepository = $invoiceRepository;
        $this->estimateRepository = $estimateRepository;
    }

    /**
     * @Route("/company", name="get_companies", methods={"GET"})
     */
    public function get_companies(Request $request): JsonResponse
    {
        $limit = 20;
        $offset = $request->get("offset", 1);
        $offset = $offset > 1 ? $offset : 1;

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
     * @Route("/company/{companyID}", requirements={"companyID"="\d+"}, name="get_company", methods={"GET"})
     */
    public function get_company(Request $request, int $companyID): JsonResponse
    {
        $company = $this->companyRepository->find($companyID);
        if(empty($company)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        $userID = $request->get("userID");
        $userID = is_numeric($userID) ? $userID : null;
        if(empty($userID)) {
            return $this->json([
                "message" => "The user is empty"
            ], Response::HTTP_FORBIDDEN);
        }

        return $this->json([
            "company" => $company,
            "estimates" => $this->estimateRepository->getEstimatesByCompanyAndUser($companyID, $userID),
            "invoices" => $this->invoiceRepository->getInvoicesByClientAndUser($companyID, $userID)
        ], Response::HTTP_OK);
    }

    /**
     * @Route("/company/{companyID}/estimates", requirements={"companyID"="\d+"}, name="get_estimates_form_company", methods={"GET"})
     */
    public function get_estimates_form_company(Request $companyID) : JsonResponse {
        $company = $this->companyRepository->find($companyID);
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
     * @Route("/company/{companyID}/update", requirements={"companyID"="\d+"}, name="update_company", methods={"PUT"})
     */
    public function put_company(Request $request, int $companyID): JsonResponse
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
     * @Route("/company/{companyID}/remove", requirements={"companyID"="\d+"}, name="remove_company", methods={"DELETE"})
     */
    public function remove_company(Request $request, int $companyID): JsonResponse
    {
        $userID = $request->get("userID");
        $userID = is_numeric($userID) ? $userID : null;
        if(empty($userID)) {
            return $this->json(["message" => "Missing user id"], Response::HTTP_FORBIDDEN);
        }

        $user = $this->userRepository->find($userID);
        if(empty($user)) {
            return $this->json(["message" => "Not found user"], Response::HTTP_NOT_FOUND);
        }

        $company = $this->companyRepository->find($companyID);
        if(empty($company)) {
            return $this->json(["message" => "Not found company"], Response::HTTP_NOT_FOUND);
        }

        // Unlink the user and the company
        $company->removeUser($user);

        // Remove all invoices of the user and the company
        $invoices = $this->invoiceRepository->getInvoicesByClientAndUser($companyID, $userID);
        foreach($invoices as $invoice) {
            $company->removeInvoice($invoice, true);
        }

        // Remove all estimates of the user and the company
        $estimates = $this->estimateRepository->getEstimatesByClientAndUser($companyID, $userID);
        foreach($estimates as $estimate) {
            $this->estimateRepository->remove($estimate, true);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}