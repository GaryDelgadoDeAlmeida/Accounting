<?php

namespace App\Entity;

use App\Repository\InvoiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
class Invoice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'invoices')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'invoices')]
    private ?Company $company = null;

    #[ORM\Column(length: 255)]
    private ?string $filename = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null;

    #[ORM\Column]
    private ?bool $applyTVA = null;

    #[ORM\Column(nullable: true)]
    private ?float $tva = 0;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $invoiceDate = null;

    #[ORM\OneToMany(mappedBy: 'invoice', targetEntity: InvoiceDetail::class)]
    private Collection $invoiceDetails;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->invoiceDetails = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getCompany(): ?Company
    {
        return $this->company;
    }

    public function setCompany(?Company $company): self
    {
        $this->company = $company;

        return $this;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): self
    {
        $this->filename = $filename;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function isApplyTVA(): ?bool
    {
        return $this->applyTVA;
    }

    public function setApplyTVA(bool $applyTVA): static
    {
        $this->applyTVA = $applyTVA;

        return $this;
    }

    public function getTva(): ?float
    {
        return $this->tva;
    }

    public function setTva(?float $tva): static
    {
        $this->tva = $tva;

        return $this;
    }

    public function getInvoiceDate(): ?\DateTimeInterface
    {
        return $this->invoiceDate;
    }

    public function setInvoiceDate(\DateTimeInterface $invoiceDate): self
    {
        $this->invoiceDate = $invoiceDate;

        return $this;
    }

    /**
     * @return Collection<int, InvoiceDetail>
     */
    public function getInvoiceDetails(): Collection
    {
        return $this->invoiceDetails;
    }

    public function addInvoiceDetail(InvoiceDetail $invoiceDetail): self
    {
        if (!$this->invoiceDetails->contains($invoiceDetail)) {
            $this->invoiceDetails->add($invoiceDetail);
            $invoiceDetail->setInvoice($this);
        }

        return $this;
    }

    public function removeInvoiceDetail(InvoiceDetail $invoiceDetail): self
    {
        if ($this->invoiceDetails->removeElement($invoiceDetail)) {
            // set the owning side to null (unless already changed)
            if ($invoiceDetail->getInvoice() === $this) {
                $invoiceDetail->setInvoice(null);
            }
        }

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getAmount() : float {
        $amount = 0;

        foreach($this->invoiceDetails as $invoiceDetail) {
            $amount += $invoiceDetail->getPrice();
        }

        return $amount;
    }

    public function getTvaAmount() : float {
        $amount = 0;

        if($this->applyTVA) {
            foreach($this->invoiceDetails as $invoiceDetail) {
                $amount += $invoiceDetail->getPrice() * ($this->tva / 100);
            }
        }

        return $amount;
    }

    public function getTotalAmount() : float {
        $amount = 0;

        foreach($this->invoiceDetails as $invoiceDetail) {
            $amount += $invoiceDetail->getPrice();
            if($this->applyTVA) {
                $amount += $invoiceDetail->getPrice() * ($this->tva / 100);
            }
        }

        return $amount;
    }
}
