<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\InvoiceRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class GraphicAccountingController extends AbstractController
{
    private User $user;
    private InvoiceRepository $invoiceRepository;

    function __construct(Security $security, UserRepository $userRepository, InvoiceRepository $invoiceRepository) {
        $this->user = $security->getUser() ?? $userRepository->find(1);
        $this->invoiceRepository = $invoiceRepository;
    }

    /**
     * @Route("/graphic-accounting", name="graphic_accounting", methods={"GET"})
     */
    public function index(Request $request): JsonResponse
    {
        $yearAmount = [];
        $year = $request->get("year", (new \DateTime())->format("Y"));
        $invoices = $this->invoiceRepository->getDetailYearBenefit($this->user, $year);
        foreach($invoices as $invoice) {
            $month = intval($invoice->getInvoiceDate()->format("m"));
            if(!isset($yearAmount[$month])) {
                $yearAmount[$month] = 0;
            }

            $yearAmount[$month] += $invoice->getAmount();
        }
        
        return $this->json($yearAmount, Response::HTTP_OK);
    }
}
