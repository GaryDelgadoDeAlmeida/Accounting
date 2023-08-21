<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Repository\InvoiceRepository;
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

    function __construct(Security $security, InvoiceRepository $invoiceRepository) {
        $this->user = $security->getUser() ?? (new User());
        $this->invoiceRepository = $invoiceRepository;
    }

    /**
     * @Route("/graphic-accounting", name="graphic_accounting", methods={"GET"})
     */
    public function index(Request $request): JsonResponse
    {
        $year = $request->get("year", (new \DateTime())->format("Y"));

        $invoices = $this->invoiceRepository->findBy(["user" => $this->user, "createdAt" => $year]);
        
        return $this->json(null, Response::HTTP_OK);
    }
}
