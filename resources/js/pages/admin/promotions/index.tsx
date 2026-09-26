import { Form, Head, router } from '@inertiajs/react';
import { Eye, EyeOff, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { formatDateTime } from '@/lib/format';
import { destroy, index, store, update } from '@/routes/admin/promotions';
import type { AdminPromotion } from '@/types';

export default function AdminPromotionsIndex({
    promotions,
}: {
    promotions: AdminPromotion[];
}) {
    return (
        <>
            <Head title="Promociones" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Promociones"
                    description="El flyer activo aparece como ventana emergente en la página de inicio. Solo puede haber uno activo a la vez."
                />

                <UploadForm />

                {promotions.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        Aún no subiste ningún flyer.
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {promotions.map((promotion) => (
                            <PromotionCard
                                key={promotion.id}
                                promotion={promotion}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function UploadForm() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Subir nuevo flyer</CardTitle>
                <CardDescription>
                    JPG, PNG o WEBP de hasta 4 MB. Recomendado: formato vertical
                    4:5 (por ejemplo 1080 × 1350).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    {...store.form()}
                    resetOnSuccess
                    onSuccess={() => setPreviewUrl(null)}
                    disableWhileProcessing
                    className="grid gap-4 md:grid-cols-[1fr_12rem]"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid content-start gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="image">Flyer</Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        required
                                        onChange={(event) => {
                                            const file =
                                                event.target.files?.[0];
                                            setPreviewUrl(
                                                file
                                                    ? URL.createObjectURL(file)
                                                    : null,
                                            );
                                        }}
                                    />
                                    <InputError message={errors.image} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="title">
                                        Título (opcional, texto alternativo)
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        maxLength={120}
                                        placeholder="Ej. 20% de descuento en el plan anual"
                                    />
                                    <InputError message={errors.title} />
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        name="activate"
                                        value="1"
                                        defaultChecked
                                        className="size-4 accent-primary"
                                    />
                                    Publicar de inmediato (desactiva la
                                    promoción actual)
                                </label>
                                <Button
                                    type="submit"
                                    className="w-fit"
                                    disabled={processing}
                                >
                                    {processing ? <Spinner /> : <Upload />}
                                    Subir flyer
                                </Button>
                            </div>
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Vista previa del flyer"
                                    className="max-h-64 w-full rounded-lg border object-contain"
                                />
                            )}
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}

function PromotionCard({ promotion }: { promotion: AdminPromotion }) {
    const [processing, setProcessing] = useState(false);

    const toggle = () => {
        router.patch(
            update.url(promotion.id),
            { is_active: !promotion.is_active },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <Card className="overflow-hidden pt-0">
            <img
                src={promotion.image_url}
                alt={promotion.title ?? 'Flyer de promoción'}
                loading="lazy"
                className="aspect-[4/5] w-full bg-muted object-contain"
            />
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="truncate text-base">
                        {promotion.title ?? 'Sin título'}
                    </CardTitle>
                    {promotion.is_active ? (
                        <Badge className="bg-emerald-600 text-white">
                            Activa
                        </Badge>
                    ) : (
                        <Badge variant="outline">Inactiva</Badge>
                    )}
                </div>
                <CardDescription>
                    Subida el {formatDateTime(promotion.created_at)}
                </CardDescription>
            </CardHeader>
            <CardFooter className="gap-2">
                <Button
                    variant={promotion.is_active ? 'outline' : 'default'}
                    size="sm"
                    className="flex-1"
                    onClick={toggle}
                    disabled={processing}
                >
                    {promotion.is_active ? <EyeOff /> : <Eye />}
                    {promotion.is_active ? 'Desactivar' : 'Activar'}
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Eliminar promoción"
                        >
                            <Trash2 />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>¿Eliminar esta promoción?</DialogTitle>
                        <DialogDescription>
                            Se borrará el flyer de forma permanente.
                        </DialogDescription>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary">Cancelar</Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    router.delete(destroy.url(promotion.id), {
                                        preserveScroll: true,
                                    })
                                }
                            >
                                Eliminar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}

AdminPromotionsIndex.layout = {
    breadcrumbs: [{ title: 'Promociones', href: index() }],
};
