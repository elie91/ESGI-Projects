<?php

namespace App\Service;

use App\Entity\{FeatureValue, Product, User};
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class ImportProduct
{

    private $targetDirectory;

    private $em;

    private $translator;

    public function __construct($targetDirectory, EntityManagerInterface $em, TranslatorInterface $translator)
    {
        $this->targetDirectory = $targetDirectory;
        $this->em = $em;
        $this->translator = $translator;
    }

    public function exec($file): array
    {
        $row = 0;
        $errors = [];
        $success = [];

        $log = fopen('../var/log/import-' . date('Ymd-His') . ".csv", "w");

        $featureValues = $this->em->getRepository(FeatureValue::class)->findAll();

        if (($handle = fopen($this->targetDirectory . $file, "r")) !== false) {
            while (($data = fgetcsv($handle, 1000, ",")) !== false) {
                if ($row > 0) {
                    $product = $this->em->getRepository(Product::class)->findOneBy(['reference' => $data[0]]);
                    if ($product) {
                        if ($product->getQuantity() !== (int)$data[16]) {
                            $product->setQuantity((int)$data[16]);
                            $product->setWeight((float)str_replace(",", ".", $data[17]));

                            $success[] = $this->translator->trans("import.productUpdate", ['REFERENCE' => $data[0]]);
                            $this->em->flush();
                        }
                    } else {
                        $company = $this->em->getRepository(User::class)->findOneBy(["company" => $data[1]]);
                        if ($company) {
                            $product = (new Product())
                                ->setUserId($company)
                                ->setName($data[0])
                                ->setReference($data[0])
                                ->setAloy($data[4])
                                ->setStandardIndex($data[6])
                                ->setSlug(strtolower($data[0]))
                                ->setElaborator($data[15])
                                ->setQuantity((int)$data[16])
                                ->setWeight((float)str_replace(",", ".", $data[17]))
                                ->setState($data[5])
                                ->setActive(1);

                            $company->setState(3);

                            $findFeature = false;
                            foreach ($featureValues as $featureValue) {
                                if ($featureValue->getValue() === $data[2]) {
                                    $findFeature = true;
                                    break;
                                }
                            }

                            if ($findFeature) {
                                switch ($data[2]) {
                                    case "ROND":
                                        $product
                                            ->setDiameter((float)str_replace(",", ".", $data[7]))
                                            ->setHeight((float)str_replace(",", ".", $data[8]));
                                        break;
                                    case "PLAT":
                                        $product
                                            ->setDepth((float)str_replace(",", ".", $data[9]))
                                            ->setWidth((float)str_replace(",", ".", $data[10]))
                                            ->setHeight((float)str_replace(",", ".", $data[11]));
                                        break;
                                    case "TOLE":
                                        $product
                                            ->setDepth((float)str_replace(",", ".", $data[12]))
                                            ->setWidth((float)str_replace(",", ".", $data[13]))
                                            ->setHeight((float)str_replace(",", ".", $data[14]));
                                        break;
                                    default:
                                        $errors[] = $this->translator->trans("import.error.feature", [
                                            'REFERENCE' => $data[0],
                                            'ROW' => $row + 1
                                        ]);
                                        fputcsv($log, $errors);
                                        break;
                                }

                                $this->em->persist($product);
                                $success[] = $this->translator->trans("import.success.product", [
                                    'REFERENCE' => $data[0],
                                    'ROW' => $row
                                ]);
                                if ($row % 25 === 0) {
                                    $this->em->flush();
                                }

                            } else {
                                $errors[] = $this->translator->trans("import.error.feature", [
                                    'REFERENCE' => $data[0],
                                    'ROW' => $row + 1
                                ]);
                                fputcsv($log, $errors);
                            }
                        } else {
                            $errors[] = $this->translator->trans("import.error.company", [
                                'REFERENCE' => $data[0],
                                'ROW' => $row + 1
                            ]);
                            fputcsv($log, $errors);
                        }
                    }

                }
                $row++;
            }
            fclose($handle);
        }

        $this->em->flush();

        fclose($log);

        return [
            'errors' => $errors,
            'success' => $success
        ];

    }
}