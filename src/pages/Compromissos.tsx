import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCompromissos } from "@/hooks/useCompromissos";

const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const Compromissos = () => {
    const { compromissos, loading, createCompromisso, updateCompromisso, deleteCompromisso } = useCompromissos();
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());

    // Modal controls
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [novoCompromisso, setNovoCompromisso] = useState({
        titulo: "",
        descricao: "",
        data: "",
        hora: ""
    });

    const events = useMemo(() => {
        return compromissos.map(comp => {
            const start = new Date(`${comp.data}T${comp.hora}`);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration by default

            return {
                id: comp.id,
                title: comp.titulo,
                start: start,
                end: end,
                desc: comp.descricao,
                sourceData: comp // Keep original data handy
            };
        });
    }, [compromissos]);

    const handleSave = async () => {
        if (!novoCompromisso.titulo || !novoCompromisso.data || !novoCompromisso.hora) {
            return;
        }

        if (isEditing && selectedEvent) {
            const { error } = await updateCompromisso(selectedEvent.id, novoCompromisso);
            if (!error) {
                setIsFormModalOpen(false);
                setNovoCompromisso({ titulo: "", descricao: "", data: "", hora: "" });
                setIsEditing(false);
                setSelectedEvent(null);
            }
        } else {
            const { error } = await createCompromisso(novoCompromisso);
            if (!error) {
                setIsFormModalOpen(false);
                setNovoCompromisso({ titulo: "", descricao: "", data: "", hora: "" });
            }
        }
    };

    const handleDelete = async () => {
        if (selectedEvent) {
            await deleteCompromisso(selectedEvent.id);
            setIsDetailsModalOpen(false);
            setSelectedEvent(null);
        }
    };

    const handleEditClick = () => {
        if (selectedEvent) {
            setNovoCompromisso({
                titulo: selectedEvent.title,
                descricao: selectedEvent.desc || "",
                data: selectedEvent.sourceData.data,
                hora: selectedEvent.sourceData.hora
            });
            setIsEditing(true);
            setIsDetailsModalOpen(false);
            setIsFormModalOpen(true);
        }
    };

    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event);
        setIsDetailsModalOpen(true);
    };

    const handleOpenNew = () => {
        setIsEditing(false);
        setNovoCompromisso({ titulo: "", descricao: "", data: "", hora: "" });
        setSelectedEvent(null);
        setIsFormModalOpen(true);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNovoCompromisso({ ...novoCompromisso, data: e.target.value });
    };

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const onNavigate = (newDate: Date) => {
        setDate(newDate);
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Compromissos
                    </h1>

                    {/* Botão Novo Compromisso */}
                    <Button onClick={handleOpenNew} className="bg-mordomo-500 hover:bg-mordomo-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Compromisso
                    </Button>

                    {/* Modal de Detalhes */}
                    <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{selectedEvent?.title}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Data e Hora</p>
                                    <p>{selectedEvent && format(selectedEvent.start, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                                </div>
                                {selectedEvent?.desc && (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">Descrição</p>
                                        <p>{selectedEvent.desc}</p>
                                    </div>
                                )}
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
                                <Button variant="outline" onClick={handleEditClick}>Editar</Button>
                                <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>Fechar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Modal de Criação/Edição */}
                    <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEditing ? "Editar Compromisso" : "Novo Compromisso"}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Título</Label>
                                    <Input
                                        id="titulo"
                                        value={novoCompromisso.titulo}
                                        onChange={(e) => setNovoCompromisso({ ...novoCompromisso, titulo: e.target.value })}
                                        placeholder="Ex: Reunião de equipe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="descricao">Descrição</Label>
                                    <Input
                                        id="descricao"
                                        value={novoCompromisso.descricao}
                                        onChange={(e) => setNovoCompromisso({ ...novoCompromisso, descricao: e.target.value })}
                                        placeholder="Detalhes adicionais..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="data">Data</Label>
                                        <Input
                                            id="data"
                                            type="date"
                                            value={novoCompromisso.data}
                                            // Only limit date if creating new, or if editing allow keeping old date? 
                                            // Ideally we always prevent past dates but for editing existign ones usually fine.
                                            // Let's keep min date for now.
                                            min={getTodayDate()}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hora">Hora</Label>
                                        <Input
                                            id="hora"
                                            type="time"
                                            value={novoCompromisso.hora}
                                            onChange={(e) => setNovoCompromisso({ ...novoCompromisso, hora: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsFormModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleSave} className="bg-mordomo-500 hover:bg-mordomo-600">Salvar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="flex-1 p-4 shadow-sm overflow-hidden bg-white">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-gray-500">Carregando compromissos...</p>
                        </div>
                    ) : (
                        <BigCalendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            views={['month', 'week', 'day', 'agenda']}
                            view={view}
                            onView={setView}
                            date={date}
                            onNavigate={onNavigate}
                            onSelectEvent={handleSelectEvent}
                            culture='pt-BR'
                            messages={{
                                next: "Próximo",
                                previous: "Anterior",
                                today: "Hoje",
                                month: "Mês",
                                week: "Semana",
                                day: "Dia",
                                agenda: "Agenda",
                                date: "Data",
                                time: "Hora",
                                event: "Evento",
                            }}
                        />
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Compromissos;
