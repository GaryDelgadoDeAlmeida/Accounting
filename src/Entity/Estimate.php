<?php

namespace App\Entity;

use App\Repository\EstimateRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EstimateRepository::class)]
class Estimate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'estimates')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'estimates')]
    private ?Company $company = null;

    #[ORM\Column(length: 255)]
    private ?string $label = null;

    #[ORM\Column(length: 30)]
    private ?string $status = null;

    #[ORM\OneToMany(mappedBy: 'estimate', targetEntity: EstimateDetail::class)]
    private Collection $estimateDetails;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->estimateDetails = new ArrayCollection();
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

    public function removeEstimateDetail(EstimateDetail $estimateDetail): self
    {
        if ($this->estimateDetails->removeElement($estimateDetail)) {
            // set the owning side to null (unless already changed)
            if ($estimateDetail->getEstimate() === $this) {
                $estimateDetail->setEstimate(null);
            }
        }

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

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

    /**
     * @return Collection<int, EstimateDetail>
     */
    public function getEstimateDetails(): Collection
    {
        return $this->estimateDetails;
    }

    public function addEstimateDetail(EstimateDetail $estimateDetail): self
    {
        if (!$this->estimateDetails->contains($estimateDetail)) {
            $this->estimateDetails->add($estimateDetail);
            $estimateDetail->setEstimate($this);
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

        foreach($this->estimateDetails as $estimateDetail) {
            $amount += ($estimateDetail->getPrice() * $estimateDetail->getNbrDays()) * $estimateDetail->getQuantity();
        }

        return $amount;
    }

    public function getTvaAmount() : float {
        $amount = 0;

        foreach($this->estimateDetails as $estimateDetail) {
            $amount += (($estimateDetail->getPrice() * $estimateDetail->getNbrDays()) * $estimateDetail->getQuantity()) * 0.2;
        }

        return $amount;
    }

    public function getTotalAmount() : float {
        $amount = 0;

        foreach($this->estimateDetails as $estimateDetail) {
            $amount += (($estimateDetail->getPrice() * $estimateDetail->getNbrDays()) * $estimateDetail->getQuantity()) * 1.2;
        }

        return $amount;
    }
}
