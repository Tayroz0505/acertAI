import { useState, useMemo } from "react";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear, 
  subDays,
  isWithinInterval,
  parseISO,
  eachDayOfInterval,
  isSameDay
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Download,
  Calendar as CalendarIconLucide,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTransacoes } from "@/hooks/useTransacoes";
import { useCategorias } from "@/hooks/useCategorias";

interface ChartData {
  periodo: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

interface CategoryData {
  categoria: string;
  valor: number;
  cor: string;
}

interface FilteredTransaction {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: "receita" | "despesa";
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

// Função para formatar a data para exibição (DD/MM/YYYY)
const formatarData = (dataString: string) => {
  if (!dataString) return "";
  try {
    const date = parseISO(dataString.split("T")[0]);
    return format(date, "dd/MM/yyyy");
  } catch (e) {
    return dataString;
  }
};

const Relatorios = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("mes");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [tempDateRange, setTempDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("todas");
  const [selectedCategoryId, setSelectedCategoryId] = useState("todas");
  const { toast } = useToast();
  const { transacoes, loading: loadingTransacoes } = useTransacoes();
  const { categorias, loading: loadingCategorias } = useCategorias();

  const processedData = useMemo(() => {
    if (loadingTransacoes || !transacoes.length) {
      return {
        chartData: [] as ChartData[],
        categoryData: [] as CategoryData[],
        filteredTransactions: [] as FilteredTransaction[],
        summaryData: {
          receitas: 0,
          despesas: 0,
          saldo: 0
        }
      };
    }

    // 1. Filtrar transações por Tipo e Categoria primeiro (Filtro Global)
    const globalFiltered = transacoes.filter((t) => {
      // Filtro de Tipo
      if (selectedType !== "todas" && t.tipo !== selectedType) return false;
      
      // Filtro de Categoria
      if (selectedCategoryId !== "todas" && t.categoria_id !== selectedCategoryId) return false;
      
      return true;
    });

    // 2. Filtrar transações para o resumo (baseado no período selecionado + Filtro Global)
    const filteredForSummary = globalFiltered.filter((transacao) => {
      const dataTransacao = transacao.data.split("T")[0];
      const today = new Date();

      switch (selectedPeriod) {
        case "semana":
          return dataTransacao >= format(startOfWeek(today, { weekStartsOn: 0 }), "yyyy-MM-dd");
        case "mes":
          return dataTransacao >= format(startOfMonth(today), "yyyy-MM-dd") && dataTransacao <= format(endOfMonth(today), "yyyy-MM-dd");
        case "trimestre":
          return dataTransacao >= format(startOfQuarter(today), "yyyy-MM-dd") && dataTransacao <= format(endOfQuarter(today), "yyyy-MM-dd");
        case "ano":
          return dataTransacao >= format(startOfYear(today), "yyyy-MM-dd") && dataTransacao <= format(endOfYear(today), "yyyy-MM-dd");
        case "periodo":
          if (!dateRange?.from || !dateRange?.to) return true;
          return dataTransacao >= format(dateRange.from, "yyyy-MM-dd") && dataTransacao <= format(dateRange.to, "yyyy-MM-dd");
        case "todos":
          return true;
        default:
          return true;
      }
    });

    // 3. Calcular dados do gráfico (usa globalFiltered para ter histórico correto se não for "todos")
    let chartData: ChartData[] = [];

    if (selectedPeriod === "semana") {
      // Agrupar por dia da semana
      const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
      chartData = days.map((day, index) => {
        const dayTransactions = filteredForSummary.filter((t) => {
          const data = parseISO(t.data.split("T")[0]);
          return data.getDay() === index;
        });

        const receitas = dayTransactions
          .filter((t) => t.tipo === "receita")
          .reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas = dayTransactions
          .filter((t) => t.tipo === "despesa")
          .reduce((sum, t) => sum + Number(t.valor), 0);

        return {
          periodo: day,
          receitas,
          despesas,
          saldo: receitas - despesas,
        };
      });
    } else if (selectedPeriod === "mes" || selectedPeriod === "periodo") {
      const start = selectedPeriod === "mes" ? startOfMonth(new Date()) : (dateRange?.from || startOfMonth(new Date()));
      const end = selectedPeriod === "mes" ? endOfMonth(new Date()) : (dateRange?.to || new Date());
      
      const interval = eachDayOfInterval({ start, end });
      
      chartData = interval.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const transacoesDia = filteredForSummary.filter(
          (t) => t.data.split("T")[0] === dateStr
        );

        const receitas = transacoesDia
          .filter((t) => t.tipo === "receita")
          .reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas = transacoesDia
          .filter((t) => t.tipo === "despesa")
          .reduce((sum, t) => sum + Number(t.valor), 0);

        return {
          periodo: format(day, "dd/MM"),
          receitas,
          despesas,
          saldo: receitas - despesas,
        };
      });
    } else if (selectedPeriod === "todos") {
      const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const now = new Date();
      chartData = meses.map((mesNome, index) => {
        const transacoesMes = globalFiltered.filter((t) => {
          const data = parseISO(t.data.split("T")[0]);
          return data.getMonth() === index && data.getFullYear() === now.getFullYear();
        });

        const receitas = transacoesMes
          .filter((t) => t.tipo === "receita")
          .reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas = transacoesMes
          .filter((t) => t.tipo === "despesa")
          .reduce((sum, t) => sum + Number(t.valor), 0);

        return {
          periodo: mesNome,
          receitas,
          despesas,
          saldo: receitas - despesas,
        };
      });
    } else if (selectedPeriod === "trimestre") {
      for (let i = 3; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - (i * 3));
        const quarterYear = d.getFullYear();
        const quarterIndex = Math.floor(d.getMonth() / 3);
        const quarterStart = quarterIndex * 3;

        const quarterTransactions = globalFiltered.filter((t) => {
          const transactionDate = new Date(t.data);
          return (
            transactionDate.getFullYear() === quarterYear &&
            transactionDate.getMonth() >= quarterStart &&
            transactionDate.getMonth() < quarterStart + 3
          );
        });

        const receitas = quarterTransactions
          .filter((t) => t.tipo === "receita")
          .reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas = quarterTransactions
          .filter((t) => t.tipo === "despesa")
          .reduce((sum, t) => sum + Number(t.valor), 0);

        chartData.push({
          periodo: `Q${quarterIndex + 1} ${quarterYear}`,
          receitas,
          despesas,
          saldo: receitas - despesas,
        });
      }
    } else if (selectedPeriod === "ano") {
      for (let i = 4; i >= 0; i--) {
        const targetYear = new Date().getFullYear() - i;
        const yearTransactions = globalFiltered.filter((t) => {
          const transactionDate = new Date(t.data);
          return transactionDate.getFullYear() === targetYear;
        });

        const receitas = yearTransactions
          .filter((t) => t.tipo === "receita")
          .reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas = yearTransactions
          .filter((t) => t.tipo === "despesa")
          .reduce((sum, t) => sum + Number(t.valor), 0);

        chartData.push({
          periodo: targetYear.toString(),
          receitas,
          despesas,
          saldo: receitas - despesas,
        });
      }
    }

    // Calcular dados por categoria (para o gráfico de pizza)
    const categoryMap = new Map<string, CategoryData>();

    filteredForSummary
      .filter((t) => selectedType === "todas" ? t.tipo === "despesa" : t.tipo === selectedType)
      .forEach((transaction) => {
        const categoryName = transaction.categorias?.nome || "Sem categoria";
        const categoryColor = transaction.categorias?.cor || "#6B7280";

        if (categoryMap.has(categoryName)) {
          const existingCategory = categoryMap.get(categoryName)!;
          categoryMap.set(categoryName, {
            ...existingCategory,
            valor: existingCategory.valor + Number(transaction.valor),
          });
        } else {
          categoryMap.set(categoryName, {
            categoria: categoryName,
            valor: Number(transaction.valor),
            cor: categoryColor,
          });
        }
      });

    const categoryData = Array.from(categoryMap.values());

    // Filtrar transações para a tabela
    const filteredTransactions = filteredForSummary
      .map((transaction) => ({
        id: transaction.id,
        data: transaction.data,
        descricao: transaction.descricao,
        categoria: transaction.categorias?.nome || "Sem categoria",
        valor: Number(transaction.valor),
        tipo: transaction.tipo,
      }))
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, 50);

    // Calcular totais do resumo
    const totalReceitasResumo = filteredForSummary
      .filter(t => t.tipo === "receita")
      .reduce((sum, t) => sum + Number(t.valor), 0);
    const totalDespesasResumo = filteredForSummary
      .filter(t => t.tipo === "despesa")
      .reduce((sum, t) => sum + Number(t.valor), 0);

    return {
      chartData,
      categoryData,
      filteredTransactions,
      summaryData: {
        receitas: totalReceitasResumo,
        despesas: totalDespesasResumo,
        saldo: totalReceitasResumo - totalDespesasResumo
      }
    };
  }, [transacoes, selectedPeriod, selectedType, selectedCategoryId, loadingTransacoes, dateRange]);

  const { chartData, categoryData, filteredTransactions, summaryData } = processedData;

  const totalReceitas = summaryData.receitas;
  const totalDespesas = summaryData.despesas;
  const saldoTotal = summaryData.saldo;

  const chartConfig = {
    receitas: {
      label: "Receitas",
      color: "#22c55e",
    },
    despesas: {
      label: "Despesas",
      color: "#ef4444",
    },
    saldo: {
      label: "Saldo",
      color: "#3b82f6",
    },
  };

  const handleExportReport = () => {
    try {
      // Preparar dados para exportação
      const reportData = {
        periodo: selectedPeriod,
        dataGeracao: new Date().toLocaleDateString("pt-BR"),
        resumo: {
          totalReceitas: totalReceitas,
          totalDespesas: totalDespesas,
          saldoTotal: saldoTotal,
        },
        dadosMensais: chartData,
        categorias: categoryData,
        transacoes: filteredTransactions,
      };

      // Criar CSV das transações
      const csvHeader = "Data,Descrição,Categoria,Valor,Tipo\n";
      const csvData = filteredTransactions
        .map(
          (transaction) =>
            `${transaction.data},"${transaction.descricao}","${transaction.categoria}",${transaction.valor},${transaction.tipo}`
        )
        .join("\n");

      const csvContent = csvHeader + csvData;

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `relatorio-financeiro-${selectedPeriod}-${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Relatório exportado com sucesso!",
        description: "O arquivo CSV foi baixado para seu computador.",
      });
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast({
        title: "Erro ao exportar relatório",
        description:
          "Ocorreu um erro ao tentar exportar o relatório. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Obter chave correta para o eixo X baseado no período
  const getXAxisKey = () => {
    return "periodo";
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Relatórios
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Visualize e analise seus dados financeiros - {selectedPeriod === "todos" ? "Todo o período" : 
                selectedPeriod === "semana" ? "Semana Atual" :
                selectedPeriod === "mes" ? "Mês Atual" :
                selectedPeriod === "trimestre" ? "Trimestre Atual" :
                selectedPeriod === "ano" ? "Ano Atual" :
                selectedPeriod === "periodo" ? "Período Personalizado" : "Relatório"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Tudo</SelectItem>
                <SelectItem value="semana">Semana</SelectItem>
                <SelectItem value="mes">Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Ano</SelectItem>
                <SelectItem value="periodo">Período Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {selectedPeriod === "periodo" && (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal",
                      (!dateRange?.from) && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Selecione um período</span>
                    )}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-3">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={tempDateRange?.from}
                      selected={{ from: tempDateRange?.from, to: tempDateRange?.to }}
                      onSelect={(range: any) => setTempDateRange(range)}
                      numberOfMonths={2}
                      locale={ptBR}
                    />
                    <div className="flex items-center justify-end mt-2 pt-2 border-t">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          if (tempDateRange?.from && tempDateRange?.to) {
                            setDateRange(tempDateRange);
                            setIsCalendarOpen(false);
                          } else {
                            toast({
                              title: "Selecione um intervalo",
                              description: "Selecione as datas de início e fim para filtrar.",
                              variant: "destructive"
                            });
                          }
                        }}
                      >
                        Filtrar Período
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas Categorias</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos Tipos</SelectItem>
                <SelectItem value="receita">Receitas</SelectItem>
                <SelectItem value="despesa">Despesas</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Receitas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-green-600">
                R$ {totalReceitas.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                Período: {selectedPeriod === "todos" ? "Todo o período" : 
                  selectedPeriod === "semana" ? "Semana Atual" :
                  selectedPeriod === "mes" ? "Mês Atual" :
                  selectedPeriod === "trimestre" ? "Trimestre Atual" :
                  selectedPeriod === "ano" ? "Ano Atual" :
                  selectedPeriod === "periodo" ? "Personalizado" : selectedPeriod}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Despesas
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-red-600">
                R$ {totalDespesas.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                Período: {selectedPeriod === "todos" ? "Todo o período" : 
                  selectedPeriod === "semana" ? "Semana Atual" :
                  selectedPeriod === "mes" ? "Mês Atual" :
                  selectedPeriod === "trimestre" ? "Trimestre Atual" :
                  selectedPeriod === "ano" ? "Ano Atual" :
                  selectedPeriod === "periodo" ? "Personalizado" : selectedPeriod}
              </p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-lg md:text-2xl font-bold ${
                  saldoTotal >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                R$ {saldoTotal.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                {saldoTotal >= 0 ? "Resultado positivo" : "Resultado negativo"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes tipos de relatórios */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3 sm:w-auto sm:inline-flex">
            <TabsTrigger value="overview" className="text-sm">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-sm">
              Categorias
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-sm">
              Transações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {/* Gráfico de barras - Receitas vs Despesas */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <FileText className="w-5 h-5 mr-2 text-mordomo-500" />
                    Receitas vs Despesas - {selectedPeriod}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey={getXAxisKey()}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }} 
                            width={80} 
                            tickFormatter={(value) => `R$ ${value}`}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="receitas" fill="var(--color-receitas)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="despesas" fill="var(--color-despesas)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de linha - Evolução do saldo */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-mordomo-500" />
                    Evolução do Saldo - {selectedPeriod === "todos" ? "Geral" : selectedPeriod}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey={getXAxisKey()}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }} 
                            width={80}
                            tickFormatter={(value) => `R$ ${value}`}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="saldo"
                            stroke="var(--color-saldo)"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {/* Gráfico de pizza - Despesas por categoria */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <PieChartIcon className="w-5 h-5 mr-2 text-mordomo-500" />
                    {selectedType === "receita" ? "Receitas por Categoria" : "Despesas por Categoria"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="valor"
                          label={{ fontSize: 12 }}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Tabela de categorias */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Detalhamento por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {categoryData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg border"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.cor }}
                          />
                          <span className="font-medium text-sm md:text-base">
                            {item.categoria}
                          </span>
                        </div>
                        <span className="font-bold text-sm md:text-base">
                          R$ {item.valor.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="w-full">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-base md:text-lg">
                  Transações do Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right w-[150px]">
                          Valor
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatarData(transaction.data)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.descricao}
                          </TableCell>
                          <TableCell>{transaction.categoria}</TableCell>
                          <TableCell
                            className={`text-right font-medium whitespace-nowrap ${
                              transaction.tipo === "receita"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.tipo === "receita" ? "+" : "-"}R${" "}
                            {Math.abs(transaction.valor).toLocaleString(
                              "pt-BR"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-4 text-sm md:text-base text-muted-foreground">
                      Nenhuma transação encontrada para o filtro selecionado.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Relatorios;
