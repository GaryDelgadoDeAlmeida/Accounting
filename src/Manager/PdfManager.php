<?php

namespace App\Manager;

use Dompdf\Dompdf;
use Dompdf\Options;
use App\Entity\Invoice;
use App\Entity\Estimate;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PdfManager extends AbstractController {

    /**
     * 
     * @param string type
     * @param object entity
     * @return void
     */
    public function generatePdf(string $type, object $entity)
    {
        // Retrieve the HTML generated in our twig file
        $html = $this->renderView("models/{$type}.html.twig", [
            "{$type}" => $entity,
            "user" => $entity->getUser(),
            "company" => $entity->getCompany()
        ]);

        $pdfOptions = (new Options())
            ->set('defaultFont', 'Arial')
            ->set('isHtml5ParserEnabled', true)
            ->set('isRemoteEnabled', true)
        ;

        // Instantiate Dompdf with our options
        $dompdf = new Dompdf($pdfOptions);
        
        // Load HTML to Dompdf
        $dompdf->loadHtml($html);
        
        // (Optional) Setup the paper size and orientation 'portrait' or 'portrait'
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser (force download)
        return $dompdf;
    }
}