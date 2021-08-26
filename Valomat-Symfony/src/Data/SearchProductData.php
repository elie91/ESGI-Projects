<?php

namespace App\Data;

use App\Entity\Category;

class SearchProductData
{

    /**
     * @var int
     */
    public $page = 1;

    /**
     * @var string
     */
    public $name = '';

    /**
     * @var null|string
     */
    public $aloy;

    /**
     * @var null|Category
     */
    public $categories;

    /**
     * @var null|float
     */
    public $elaborator;

}