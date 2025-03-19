// app/dashboard/property/complaints/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { fetchComplaints, updateComplaintStatus } from '@/services/propertyService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
    Check,
    X,
    Eye,
    AlertTriangle,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Pagination } from '@/components/ui/pagination';
import { toast } from '@/hooks/useToast';

interface ComplaintUser {
    id: string;
    name: string;
    surname?: string;
    email: string;
}

interface ComplaintPost {
    id: string;
    title: string;
    address: string;
    city: string;
    type: string;
}

interface Complaint {
    id: string;
    reason: string;
    description?: string;
    status: 'PENDING' | 'RESOLVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
    user: ComplaintUser;
    post: ComplaintPost;
}

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

const reasonLabels: Record<string, string> = {
    INCORRECT_INFO: 'Неверная информация',
    SCAM: 'Мошенничество',
    ALREADY_SOLD: 'Объект уже продан/сдан',
    INAPPROPRIATE_CONTENT: 'Неприемлемое содержание',
    DUPLICATE: 'Дубликат объявления',
    OTHER: 'Другое'
};

const typeLabels: Record<string, string> = {
    SALE: 'Продажа',
    RENT: 'Аренда'
};

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
};

const statusLabels: Record<string, string> = {
    PENDING: 'На рассмотрении',
    RESOLVED: 'Решено',
    REJECTED: 'Отклонено'
};

export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
    });
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadComplaints();
    }, [activeTab, pagination.page]);

    const loadComplaints = async () => {
        try {
            setIsLoading(true);
            const status = activeTab !== 'all' ? activeTab.toUpperCase() : undefined;
            const result = await fetchComplaints({
                status,
                page: pagination.page,
                limit: pagination.limit
            });
            setComplaints(result.complaints);
            setPagination(result.pagination);
        } catch (error) {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить жалобы',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (complaintId: string, newStatus: string) => {
        try {
            setProcessingId(complaintId);
            await updateComplaintStatus(complaintId, newStatus);
            setComplaints(complaints.map(complaint =>
                complaint.id === complaintId ? { ...complaint, status: newStatus as 'PENDING' | 'RESOLVED' | 'REJECTED' } : complaint
            ));
            toast({
                title: 'Статус обновлен',
                description: `Жалоба успешно ${newStatus === 'RESOLVED' ? 'решена' : 'отклонена'}`
            });
        } catch (error) {
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить статус жалобы',
                variant: 'destructive'
            });
        } finally {
            setProcessingId(null);
        }
    };

    const openComplaintDetails = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setIsDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
    };

    const renderComplaintList = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        if (complaints.length === 0) {
            return (
                <div className="text-center py-10">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                    <h3 className="text-lg font-medium">Жалобы не найдены</h3>
                    <p className="text-gray-500">В данной категории нет жалоб</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {complaints.map((complaint) => (
                    <Card key={complaint.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium truncate">{complaint.post.title}</h3>
                                        <Badge className={statusColors[complaint.status]}>
                                            {statusLabels[complaint.status]}
                                        </Badge>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-500">
                                        <p className="flex items-center gap-1">
                                            <span>Объект:</span>
                                            <span className="font-medium">{typeLabels[complaint.post.type]}</span>
                                            <span>•</span>
                                            <span>{complaint.post.address}, {complaint.post.city}</span>
                                        </p>
                                        <p className="mt-1">
                                            <span className="font-medium">Причина:</span> {reasonLabels[complaint.reason]}
                                        </p>
                                        <p className="mt-1">
                                            <span className="font-medium">От пользователя:</span> {complaint.user.name} {complaint.user.surname || ''} ({complaint.user.email})
                                        </p>
                                        <p className="mt-1">
                                            <span className="font-medium">Дата:</span> {formatDate(complaint.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex md:flex-col justify-end md:justify-center items-center space-y-0 md:space-y-2 space-x-2 md:space-x-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => openComplaintDetails(complaint)}
                                    >
                                        <Eye size={16} />
                                        <span>Детали</span>
                                    </Button>

                                    {complaint.status === 'PENDING' && (
                                        <>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                                                onClick={() => handleUpdateStatus(complaint.id, 'RESOLVED')}
                                                disabled={processingId === complaint.id}
                                            >
                                                <Check size={16} />
                                                <span>Решить</span>
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="flex items-center gap-1"
                                                onClick={() => handleUpdateStatus(complaint.id, 'REJECTED')}
                                                disabled={processingId === complaint.id}
                                            >
                                                <X size={16} />
                                                <span>Отклонить</span>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {pagination.pages > 1 && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            onPageChange={(page) => setPagination({ ...pagination, page })}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Жалобы на объявления</h1>
                    <p className="text-gray-500 mt-1">Управление жалобами пользователей</p>
                </div>

                <div className="flex items-center mt-4 md:mt-0">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                            <span className="text-sm">На рассмотрении</span>
                        </div>
                        <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                            <span className="text-sm">Решено</span>
                        </div>
                        <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                            <span className="text-sm">Отклонено</span>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="all">Все жалобы</TabsTrigger>
                    <TabsTrigger value="pending">На рассмотрении</TabsTrigger>
                    <TabsTrigger value="resolved">Решенные</TabsTrigger>
                    <TabsTrigger value="rejected">Отклоненные</TabsTrigger>
                </TabsList>

                <TabsContent value="all">{renderComplaintList()}</TabsContent>
                <TabsContent value="pending">{renderComplaintList()}</TabsContent>
                <TabsContent value="resolved">{renderComplaintList()}</TabsContent>
                <TabsContent value="rejected">{renderComplaintList()}</TabsContent>
            </Tabs>

            {/* Модальное окно деталей жалобы */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedComplaint && (
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Детали жалобы</DialogTitle>
                        </DialogHeader>

                        <div className="py-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium">{selectedComplaint.post.title}</h3>
                                    <p className="text-sm text-gray-500">{selectedComplaint.post.address}, {selectedComplaint.post.city}</p>
                                </div>
                                <Badge className={statusColors[selectedComplaint.status]}>
                                    {statusLabels[selectedComplaint.status]}
                                </Badge>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium">Информация о жалобе</h4>
                                    <div className="mt-2 space-y-2 text-sm">
                                        <p><span className="font-medium">ID:</span> {selectedComplaint.id}</p>
                                        <p><span className="font-medium">Причина:</span> {reasonLabels[selectedComplaint.reason]}</p>
                                        <p><span className="font-medium">Создано:</span> {formatDate(selectedComplaint.createdAt)}</p>
                                        {selectedComplaint.status !== 'PENDING' && (
                                            <p><span className="font-medium">Обновлено:</span> {formatDate(selectedComplaint.updatedAt)}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium">Информация о заявителе</h4>
                                    <div className="mt-2 space-y-2 text-sm">
                                        <p><span className="font-medium">Имя:</span> {selectedComplaint.user.name} {selectedComplaint.user.surname || ''}</p>
                                        <p><span className="font-medium">Email:</span> {selectedComplaint.user.email}</p>
                                        <p><span className="font-medium">ID пользователя:</span> {selectedComplaint.user.id}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedComplaint.description && (
                                <>
                                    <Separator className="my-4" />
                                    <div>
                                        <h4 className="font-medium">Описание проблемы</h4>
                                        <p className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                                            {selectedComplaint.description}
                                        </p>
                                    </div>
                                </>
                            )}

                            <Separator className="my-4" />

                            <div>
                                <h4 className="font-medium">Действия</h4>
                                <div className="mt-2 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => window.open(`/properties/${selectedComplaint.post.id}`, '_blank')}
                                    >
                                        <Eye size={16} />
                                        <span>Просмотреть объявление</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            {selectedComplaint.status === 'PENDING' ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex items-center gap-1"
                                        onClick={() => {
                                            handleUpdateStatus(selectedComplaint.id, 'REJECTED');
                                            setIsDialogOpen(false);
                                        }}
                                        disabled={processingId === selectedComplaint.id}
                                    >
                                        <XCircle size={16} />
                                        <span>Отклонить</span>
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                                        onClick={() => {
                                            handleUpdateStatus(selectedComplaint.id, 'RESOLVED');
                                            setIsDialogOpen(false);
                                        }}
                                        disabled={processingId === selectedComplaint.id}
                                    >
                                        <CheckCircle size={16} />
                                        <span>Решить жалобу</span>
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Закрыть
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}