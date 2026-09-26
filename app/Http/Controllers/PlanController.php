<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Models\Plan;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    /**
     * Show the public catalog of membership plans.
     */
    public function index(): Response
    {
        return Inertia::render('plans/index', [
            'plans' => PlanResource::collection(Plan::active()->get())->resolve(),
        ]);
    }
}
