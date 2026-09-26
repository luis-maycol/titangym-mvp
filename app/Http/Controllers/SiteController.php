<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Models\Plan;
use App\Models\Promotion;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    /**
     * Landing page with the plan catalog preview.
     */
    public function home(): Response
    {
        return Inertia::render('site/home', [
            'plans' => PlanResource::collection(Plan::active()->get())->resolve(),
            'promotion' => fn () => ($promotion = Promotion::current()) === null ? null : [
                'id' => $promotion->id,
                'title' => $promotion->title,
                'image' => $promotion->publicPath(),
            ],
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('site/about');
    }

    public function services(): Response
    {
        return Inertia::render('site/services');
    }

    public function trainers(): Response
    {
        return Inertia::render('site/trainers');
    }

    public function facilities(): Response
    {
        return Inertia::render('site/facilities');
    }
}
