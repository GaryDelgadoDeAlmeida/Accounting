<?php

namespace App\Manager;

use Dompdf\Dompdf;
use Dompdf\Options;
use App\Entity\User;
use App\Entity\Company;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Psr\Container\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InvoiceManager extends AbstractController {

    private InvoiceRepository $invoiceRepository;

    function __construct(
        InvoiceRepository $invoiceRepository,
        ContainerInterface $container
    ) {
        $this->setContainer($container);
        $this->invoiceRepository = $invoiceRepository;
    }

    public function checkFields(array $fields) {
        foreach($fields as $field) {
            // 
        }
    }

    public function fillInvoice(array $fields, Invoice $invoice = new Invoice()) {
        foreach($fields as $fieldName => $fieldValue) {
            if($fieldName === InvoiceEnum) {
                // 
            }
        }
    }

    /**
     * Add a new invoice to a company
     * 
     * @param User user
     * @param Company company
     * @param string filename
     * @param string filepath
     * @param \DateTimeImmutable invoice date
     * @return Invoice Return Invoice object
     */
    public function addInvoice(User $user, Company $company, string $filename, string $filepath, \DateTimeImmutable $invoiceDate) 
    {
        $invoice = (new Invoice())
            ->setUser($user)
            ->setCompany($company)
            ->setFilename($filename)
            ->setFilepath($filepath)
            ->setInvoiceDate($invoiceDate)
            ->setCreatedAt(new \DateTimeImmutable())
        ;

        $this->invoiceRepository->save($invoice, true);

        return $invoice;
    }

    /**
     * Generate a invoice
     * 
     * @return null
     */
    public function generateInvoice(Invoice $invoice)
    {
        $pdfOptions = new Options();
        $pdfOptions->set('defaultFont', 'Arial');

        // Instantiate Dompdf with our options
        $dompdf = new Dompdf($pdfOptions);
        $html = null;
        
        // Retrieve the HTML generated in our twig file
        $html = $this->renderView('model/invoice.html.twig', [
            'invoice' => $invoice
        ]);
        
        // Load HTML to Dompdf
        $dompdf->loadHtml($html);
        
        // (Optional) Setup the paper size and orientation 'portrait' or 'portrait'
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser (force download)
        return $dompdf->stream("{$articleName}.pdf", [
            "Attachment" => false
        ]);
    }
}