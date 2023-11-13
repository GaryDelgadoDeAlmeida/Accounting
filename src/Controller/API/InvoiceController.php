<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Manager\PdfManager;
use App\Manager\FormManager;
use App\Manager\InvoiceManager;
use App\Manager\SerializeManager;
use App\Repository\UserRepository;
use App\Repository\CompanyRepository;
use App\Repository\InvoiceRepository;
use App\Repository\InvoiceDetailRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class InvoiceController extends AbstractController
{
    private ?User $user;
    private PdfManager $pdfManager;
    private FormManager $formManager;
    // private ContactManager $contactManager;
    private InvoiceManager $invoiceManager;
    private SerializeManager $serializeManager;
    private CompanyRepository $companyRepository;
    private InvoiceRepository $invoiceRepository;
    private InvoiceDetailRepository $invoiceDetailRepository;

    function __construct(
        Security $security,
        PdfManager $pdfManager,
        FormManager $formManager, 
        // ContactManager $contactManager,
        InvoiceManager $invoiceManager, 
        SerializeManager $serializeManager,
        UserRepository $userRepository,
        CompanyRepository $companyRepository,
        InvoiceRepository $invoiceRepository,
        InvoiceDetailRepository $invoiceDetailRepository
    ) {
        $this->user = $security->getUser() ?? null; // Temporary : To delete after the login system has been implemented
        $this->pdfManager = $pdfManager;
        $this->formManager = $formManager;
        // $this->contactManager = $contactManager;
        $this->invoiceManager = $invoiceManager;
        $this->serializeManager = $serializeManager;
        $this->companyRepository = $companyRepository;
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceDetailRepository = $invoiceDetailRepository;
    }

    /**
     * @Route("/invoices", name="get_invoices", methods={"GET"})
     */
    public function get_invoices(Request $request): JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $limit = 20;
        $offset = $request->get("offset", 1);
        $offset = is_numeric($offset) && $offset >= 1 ? $offset : 1;

        return $this->json(
            $this->serializeManager->serializeContent(
                $this->invoiceRepository->findBy(["user" => $this->user], ["id" => "ASC"], $limit, ($offset - 1) * $limit)
            ),
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/invoice", name="new_invoice", methods={"POST"})
     */
    public function post_invoice(Request $request)
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $jsonContent = json_decode($request->getContent(), true);
        if(empty($jsonContent)) {
            return $this->json(null, Response::HTTP_FORBIDDEN);
        }

        $company = $this->companyRepository->find($jsonContent["company"]);
        if(empty($company)) {
            return $this->json("The company couldn't be found.", Response::HTTP_NOT_FOUND);
        }

        try {
            $invoiceDate = \DateTimeImmutable::createFromFormat("Y-m-d", $jsonContent["invoice_date"]);
            $invoice = $this->invoiceManager->addInvoice(
                $this->user,
                $company,
                "Invoice {$invoiceDate->format("m-Y")}",
                $invoiceDate
            );

            foreach($jsonContent["details"] as $index => $detail) {
                $this->invoiceManager->addInvoiceDetail(
                    $invoice, 
                    $detail["description"],
                    $detail["quantity"],
                    $detail["price"],
                    $detail["tva"] ?? false
                );
            }
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/invoice/{invoiceID}", name="get_invoice", requirements={"invoiceID"="\d+"}, methods={"GET"})
     */
    public function get_invoice(int $invoiceID = 0): JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $invoice = $this->invoiceRepository->findOneBy(["id" => $invoiceID, "user" => $this->user]);
        if(empty($invoice)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        return $this->json(
            $this->serializeManager->serializeContent($invoice), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/invoice/{invoiceID}/update", name="update_invoice", requirements={"invoiceID"="\d+"}, methods={"PUT", "UPDATE"})
     */
    public function update_invoice(Request $request, int $invoiceID = 0): JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $invoice = $this->invoiceRepository->find($invoiceID);
        if(!$invoice) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        $jsonContent = $request->getContent();
        if(!$jsonContent) {
            return $this->json(null, Response::HTTP_PRECONDITION_FAILED);
        }

        // udpate invoice

        // Return a response to the client
        return $this->json(null, Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/invoice/{invoiceID}/pdf", name="get_invoice_pdf", requirements={"invoiceID"="\d+"}, methods={"GET"})
     */
    public function get_invoice_pdf(Request $request, int $invoiceID)
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $invoice = $this->invoiceRepository->findOneBy(["id" => $invoiceID, "user" => $this->user]);
        if(empty($invoice)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        try {
            $this->pdfManager->generatePdf(
                $request->getScheme() . '://' . $request->getHttpHost() . $request->getBasePath(),
                "invoice", 
                $invoice,
                false
            );

            // After generating invoice PDF, send it to the client
            // $this->contactManager->sendEmail($invoice->getLabel(), "gary.almeida.work@gmail.com");
        } catch(\Exception $e) {
            return $this->json(
                $e->getMessage(), 
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return $this->json("", Response::HTTP_OK, [
            "Content-Type" => "application/pdf",
            "Content-Disposition" => "attachment; filename={$invoice->getFilename()}.pdf"
        ]);
        // return $this->invoiceManager->generateInvoice($invoice);
    }

    /**
     * @Route("/invoice/{invoiceID}/remove", name="remove_invoice", requirements={"invoiceID"="\d+"}, methods={"DELETE"})
     */
    public function remove_invoice(Request $request, int $invoiceID = 0) : JsonResponse 
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        if(empty($invoiceID)) {
            return $this->json(["message" => "Unknown invoice identification"], Response::HTTP_FORBIDDEN);
        }

        $invoice = $this->invoiceRepository->find($invoiceID);
        if(empty($invoice)) {
            return $this->json(["message" => "Not found invoice"], Response::HTTP_NOT_FOUND);
        }

        try {
            // Remove all details linked to the invoice
            foreach($invoice->getInvoiceDetails() as $invoiceDetail) {
                $this->invoiceDetailRepository->remove($invoiceDetail, true);
            }

            // Remove the invoice
            $this->invoiceRepository->remove($invoice, true);
        } catch(\Exception $e) {
            return $this->json(["message" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}
