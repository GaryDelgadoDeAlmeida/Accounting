<?php

namespace App\Manager;

use App\Entity\Contact;
use App\Repository\ContactRepository;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ContactManager {
    private ContactRepository $contactRepository;
    private ParameterBagInterface $params;

    function __construct(ContactRepository $contactRepository, ParameterBagInterface $params)
    {
        $this->contactRepository = $contactRepository;
    }

    /**
     * @param bool send mail
     */
    public function add(string $subject, string $message, bool $sendMail = false)
    {
        $contact = (new Contact())
            ->setSubject($subject)
            ->setMessage($message)
            ->setCreatedAt(new \DateTimeImmutable())
        ;

        try {
            $this->contactRepository->add($contact, true);

            if($sendMail) {
                $this->sendEmail($subject, $message);
            }
        } catch(\Exception $e) {
            return $e->getMessage();
        }

        return $contact;
    }

    public function sendEmail(string $subject, string $message)
    {
        return mail($this->params->get('email.admin', $subject, $message));
    }
}