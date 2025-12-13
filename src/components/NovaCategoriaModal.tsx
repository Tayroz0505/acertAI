import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCategorias } from "@/hooks/useCategorias";

interface NovaCategoriaModalProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const cores = [
  "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B",
  "#DC2626", "#6B7280", "#EC4899", "#059669", "#FF6B35"
];

export const NovaCategoriaModal = ({ trigger, isOpen, onOpenChange }: NovaCategoriaModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange || (() => { })) : setInternalOpen;
  const [formData, setFormData] = useState({
    nome: '',
    cor: cores[0],
    tipo: 'despesa' as 'receita' | 'despesa', // Default
  });
  const { toast } = useToast();
  const { createCategoria } = useCategorias();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o nome da categoria.",
        variant: "destructive"
      });
      return;
    }

    const result = await createCategoria({
      nome: formData.nome.trim(),
      tipo: formData.tipo,
      cor: formData.cor,
      icone: 'tag' // Default icon
    });

    if (result.error) {
      toast({
        title: "Erro ao criar categoria",
        description: result.error.message,
        variant: "destructive"
      });
      return;
    }

    // Resetar formulário
    setFormData({
      nome: '',
      cor: cores[0],
      tipo: 'despesa'
    });

    setOpen(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-mordomo-500 hover:bg-mordomo-600">
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Categoria</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Alimentação, Transporte..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo *</Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="receita"
                  checked={formData.tipo === 'receita'}
                  onChange={() => handleInputChange('tipo', 'receita')}
                  className="w-4 h-4 text-mordomo-600 focus:ring-mordomo-500"
                />
                <span>Receita</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="despesa"
                  checked={formData.tipo === 'despesa'}
                  onChange={() => handleInputChange('tipo', 'despesa')}
                  className="w-4 h-4 text-mordomo-600 focus:ring-mordomo-500"
                />
                <span>Despesa</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cor">Cor</Label>
            <div className="flex items-center space-x-2">
              <input
                id="cor"
                type="color"
                value={formData.cor}
                onChange={(e) => handleInputChange('cor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-md"
              />
              <div className="flex flex-wrap gap-2">
                {cores.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => handleInputChange('cor', cor)}
                    className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400"
                    style={{ backgroundColor: cor }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-mordomo-500 hover:bg-mordomo-600">
              Adicionar Categoria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
