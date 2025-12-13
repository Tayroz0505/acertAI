import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Compromisso {
    id: string;
    user_id: string;
    titulo: string;
    descricao?: string;
    data: string; // YYYY-MM-DD
    hora: string; // HH:mm:ss
    created_at?: string;
}

export const useCompromissos = () => {
    const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchCompromissos = async () => {
        try {
            const { data: userSession } = await supabase.auth.getSession();

            if (!userSession.session) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('compromissos' as any)
                .select('*');

            if (error) throw error;

            setCompromissos((data as any) || []);
        } catch (error: any) {
            console.error("Error fetching compromissos:", error);
            toast({
                title: "Erro ao carregar compromissos",
                description: error.message || "Não foi possível carregar seus compromissos.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const createCompromisso = async (novoCompromisso: Omit<Compromisso, 'id' | 'user_id' | 'created_at'>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Usuário não autenticado");

            // Validação de data futura ou presente
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const dataCompromisso = new Date(novoCompromisso.data + 'T' + novoCompromisso.hora);
            const dataApenas = new Date(novoCompromisso.data + 'T00:00:00');

            if (dataApenas < hoje) {
                throw new Error("A data deve ser hoje ou no futuro.");
            }

            const { data, error } = await supabase
                .from('compromissos' as any)
                .insert([{
                    ...novoCompromisso,
                    user_id: user.id
                }])
                .select()
                .single();

            if (error) throw error;

            setCompromissos(prev => [...prev, data as Compromisso]);

            toast({
                title: "Compromisso criado",
                description: "Seu novo compromisso foi agendado com sucesso.",
            });

            return { data, error: null };
        } catch (error: any) {
            console.error("Error creating compromisso:", error);
            toast({
                title: "Erro ao criar compromisso",
                description: error.message || "Não foi possível criar o compromisso.",
                variant: "destructive",
            });
            return { data: null, error };
        }
    };

    const updateCompromisso = async (id: string, updates: Partial<Omit<Compromisso, 'id' | 'user_id' | 'created_at'>>) => {
        try {
            const { data, error } = await supabase
                .from('compromissos' as any)
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setCompromissos(prev => prev.map(comp => comp.id === id ? (data as Compromisso) : comp));

            toast({
                title: "Compromisso atualizado",
                description: "As alterações foram salvas com sucesso.",
            });

            return { data, error: null };
        } catch (error: any) {
            console.error("Error updating compromisso:", error);
            toast({
                title: "Erro ao atualizar",
                description: error.message || "Não foi possível atualizar o compromisso.",
                variant: "destructive",
            });
            return { data: null, error };
        }
    };

    const deleteCompromisso = async (id: string) => {
        try {
            const { error } = await supabase
                .from('compromissos' as any)
                .delete()
                .eq('id', id);

            if (error) throw error;

            setCompromissos(prev => prev.filter(comp => comp.id !== id));

            toast({
                title: "Compromisso excluído",
                description: "O compromisso foi removido com sucesso.",
            });

            return { error: null };
        } catch (error: any) {
            console.error("Error deleting compromisso:", error);
            toast({
                title: "Erro ao excluir",
                description: error.message || "Não foi possível excluir o compromisso.",
                variant: "destructive",
            });
            return { error };
        }
    };

    useEffect(() => {
        fetchCompromissos();
    }, []);

    return {
        compromissos,
        loading,
        refetch: fetchCompromissos,
        createCompromisso,
        updateCompromisso,
        deleteCompromisso
    };
};
