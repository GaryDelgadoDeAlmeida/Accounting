<?php

namespace App\Controller\API;

use App\Manager\SerializeManager;
use App\Repository\CompanyRepository;
use App\Repository\InvoiceRepository;
use App\Repository\EstimateRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class DefaultController extends AbstractController
{
    private SerializeManager $serializerManager;
    private CompanyRepository $companyRepository;
    private InvoiceRepository $invoiceRepository;
    private EstimateRepository $estimateRepository;

    function __construct(
        serializeManager $serializeManager,
        CompanyRepository $companyRepository,
        InvoiceRepository $invoiceRepository,
        EstimateRepository $estimateRepository
    ) {
        $this->serializeManager = $serializeManager;
        $this->companyRepository = $companyRepository;
        $this->invoiceRepository = $invoiceRepository;
        $this->estimateRepository = $estimateRepository;
    }

    /**
     * @Route("/", name="index", methods={"GET"})
     */
    public function index(Request $request): JsonResponse
    {
        $userID = $request->get("userID");
        $userID = is_numeric($userID) ? $userID : null;
        if(empty($userID)) {
            return $this->json("The user is missing", Response::HTTP_FORBIDDEN);
        }

        return $this->json([
            "nbrClients" => $this->companyRepository->countCompanies($userID),
            "lastMonthAmount" => 0,
            "ongoingMonthAmout" => 0,
            "currentYearBenefit" => 0,
            "clients" => $this->serializeManager->serializeContent($this->companyRepository->getCompaniesByUser($userID, 1, 3)),
            "invoices" => $this->invoiceRepository->getInvoices($userID, 1, 3),
            "estimates" => $this->estimateRepository->getEstimates($userID, 1, 3)
        ], Response::HTTP_OK);
    }
}
