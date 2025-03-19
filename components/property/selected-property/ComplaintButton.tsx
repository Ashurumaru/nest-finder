// components/property/selected-property/ComplaintButton.tsx

'use client';

import { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

import { submitComplaint } from '@/services/propertyService';
import { toast } from '@/hooks/useToast';

type ComplaintReason =
    | 'INCORRECT_INFO'
    | 'SCAM'
    | 'ALREADY_SOLD'
    | 'INAPPROPRIATE_CONTENT'
    | 'DUPLICATE'
    | 'OTHER';

const reasonLabels: Record<ComplaintReason, string> = {
    INCORRECT_INFO: 'Неверная информация',
    SCAM: 'Мошенничество',
    ALREADY_SOLD: 'Объект уже продан/сдан',
    INAPPROPRIATE_CONTENT: 'Неприемлемое содержание',
    DUPLICATE: 'Дубликат объявления',
    OTHER: 'Другое'
};

interface ComplaintButtonProps {
    postId: string;
    isLoggedIn: boolean;
}

export default function ComplaintButton({ postId, isLoggedIn }: ComplaintButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState<ComplaintReason | null>(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason) {
            toast({
                title: 'Выберите причину',
                description: 'Пожалуйста, укажите причину жалобы',
                variant: 'destructive'
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await submitComplaint({
                postId,
                reason,
                description
            });

            toast({
                title: 'Жалоба отправлена',
                description: 'Спасибо! Ваша жалоба принята к рассмотрению.'
            });

            setIsOpen(false);
            setReason(null);
            setDescription('');
        } catch (error) {
            toast({
                title: 'Ошибка',
                description: 'Не удалось отправить жалобу. Попробуйте позже.',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpen = () => {
        if (!isLoggedIn) {
            toast({
                title: 'Требуется авторизация',
                description: 'Для отправки жалобы необходимо войти в систему',
                variant: 'destructive'
            });
            return;
        }
        setIsOpen(true);
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                onClick={handleOpen}
            >
                <Flag size={16} />
                <span>Пожаловаться</span>
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Сообщить о проблеме</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="mb-4">
                            <Label htmlFor="reason" className="text-base font-medium">Причина жалобы</Label>
                            <RadioGroup
                                id="reason"
                                value={reason || ''}
                                onValueChange={(val) => setReason(val as ComplaintReason)}
                                className="mt-2 space-y-2"
                            >
                                {Object.entries(reasonLabels).map(([value, label]) => (
                                    <div key={value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={value} id={`reason-${value}`} />
                                        <Label htmlFor={`reason-${value}`}>{label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="description" className="text-base font-medium">Дополнительная информация</Label>
                            <Textarea
                                id="description"
                                placeholder="Опишите проблему подробнее..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-2 min-h-24"
                            />
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !reason}
                        >
                            {isSubmitting ? 'Отправка...' : 'Отправить жалобу'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}