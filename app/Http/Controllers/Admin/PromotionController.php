<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePromotionRequest;
use App\Models\Promotion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    /**
     * List uploaded flyers; only one can be active at a time.
     */
    public function index(): Response
    {
        return Inertia::render('admin/promotions/index', [
            'promotions' => Promotion::query()
                ->latest('id')
                ->get()
                ->map(fn (Promotion $promotion) => [
                    'id' => $promotion->id,
                    'title' => $promotion->title,
                    'image_url' => Storage::disk(Promotion::DISK)->url($promotion->image_path),
                    'is_active' => $promotion->is_active,
                    'created_at' => $promotion->created_at?->toIso8601String(),
                ]),
        ]);
    }

    /**
     * Upload a new flyer and optionally publish it right away.
     */
    public function store(StorePromotionRequest $request): RedirectResponse
    {
        $promotion = Promotion::create([
            'title' => $request->validated('title'),
            'image_path' => $request->file('image')->store('promotions', Promotion::DISK),
        ]);

        if ($request->boolean('activate')) {
            $promotion->activate();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => $promotion->is_active
            ? 'Promoción publicada en la página de inicio.'
            : 'Flyer subido. Actívalo cuando quieras mostrarlo.']);

        return to_route('admin.promotions.index');
    }

    /**
     * Turn the popup on (deactivating any other) or off.
     */
    public function update(Request $request, Promotion $promotion): RedirectResponse
    {
        $request->validate(['is_active' => ['required', 'boolean']]);

        if ($request->boolean('is_active')) {
            $promotion->activate();
        } else {
            $promotion->forceFill(['is_active' => false])->save();
        }

        return to_route('admin.promotions.index');
    }

    /**
     * Delete the flyer and its image file.
     */
    public function destroy(Promotion $promotion): RedirectResponse
    {
        Storage::disk(Promotion::DISK)->delete($promotion->image_path);
        $promotion->delete();

        Inertia::flash('toast', ['type' => 'info', 'message' => 'Promoción eliminada.']);

        return to_route('admin.promotions.index');
    }
}
