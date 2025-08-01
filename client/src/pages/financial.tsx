import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  AlertCircle,
  Wallet
} from "lucide-react";

type TransactionType = 'receita' | 'despesa';
type TransactionStatus = 'pendente' | 'pago' | 'cancelado' | 'atrasado';
type TransactionCategory = 'honorarios' | 'custas' | 'despesas_operacionais' | 'salarios' | 'marketing' | 'tecnologia' | 'outros';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  status: TransactionStatus;
  date: Date;
  dueDate?: Date;
  clientId?: string;
  contractId?: string;
  notes?: string;
  attachments?: string[];
  recurring?: boolean;
  recurringPeriod?: 'mensal' | 'trimestral' | 'semestral' | 'anual';
}

interface FinancialSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldoAtual: number;
  receitasPendentes: number;
  despesasPendentes: number;
  crescimentoMensal: number;
  metaMensal: number;
  contasAtrasadas: number;
}

const mockTransactions: Transaction[] = [
  { id: '1', description: 'Honorários advocatícios - Empresa ABC Ltda', amount: 15000, type: 'receita', category: 'honorarios', status: 'pago', date: new Date(2024, 11, 15), clientId: 'client-1', notes: 'Pagamento referente ao contrato de consultoria jurídica' },
  { id: '2', description: 'Custas processuais - Processo 1234567', amount: 2500, type: 'despesa', category: 'custas', status: 'pago', date: new Date(2024, 11, 10), notes: 'Custas do processo trabalhista' },
  { id: '3', description: 'Consultoria contrato comercial - Tech Solutions', amount: 8500, type: 'receita', category: 'honorarios', status: 'pendente', date: new Date(), dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), clientId: 'client-2' },
  { id: '4', description: 'Salário - Dezembro 2024', amount: 45000, type: 'despesa', category: 'salarios', status: 'pendente', date: new Date(), dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), recurring: true, recurringPeriod: 'mensal' },
  { id: '5', description: 'Software jurídico - Licença anual', amount: 12000, type: 'despesa', category: 'tecnologia', status: 'pago', date: new Date(2024, 11, 1), recurring: true, recurringPeriod: 'anual' },
  { id: '6', description: 'Honorários - Ação trabalhista (ATRASADO)', amount: 6500, type: 'receita', category: 'honorarios', status: 'atrasado', date: new Date(2024, 10, 15), dueDate: new Date(2024, 10, 30), clientId: 'client-3' }
];

const initialNewTransactionState = {
  type: 'receita' as TransactionType,
  category: 'honorarios' as TransactionCategory,
  status: 'pendente' as TransactionStatus,
  date: new Date(),
  recurring: false,
};

export default function Financial() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>(initialNewTransactionState);
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | TransactionStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acesso Negado",
        description: "Você não está autenticado. Redirecionando...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const loadFinancialData = useCallback(() => {
    setIsLoadingData(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      const totalReceitas = mockTransactions
        .filter(t => t.type === 'receita' && t.status === 'pago')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalDespesas = mockTransactions
        .filter(t => t.type === 'despesa' && t.status === 'pago')
        .reduce((sum, t) => sum + t.amount, 0);

      const receitasPendentes = mockTransactions
        .filter(t => t.type === 'receita' && (t.status === 'pendente' || t.status === 'atrasado'))
        .reduce((sum, t) => sum + t.amount, 0);

      const despesasPendentes = mockTransactions
        .filter(t => t.type === 'despesa' && t.status === 'pendente')
        .reduce((sum, t) => sum + t.amount, 0);

      const contasAtrasadas = mockTransactions
        .filter(t => t.status === 'atrasado').length;

      setSummary({
        totalReceitas,
        totalDespesas,
        saldoAtual: totalReceitas - totalDespesas,
        receitasPendentes,
        despesasPendentes,
        crescimentoMensal: 12.5,
        metaMensal: 80000,
        contasAtrasadas
      });

      setIsLoadingData(false);
    }, 1000);
  }, []);

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  const getStatusColor = (status: TransactionStatus) => {
    const colors = {
      pendente: "bg-yellow-100 text-yellow-800",
      pago: "bg-green-100 text-green-800",
      cancelado: "bg-gray-100 text-gray-800",
      atrasado: "bg-red-100 text-red-800"
    };
    return colors[status];
  };

  const getTypeColor = (type: TransactionType) => {
    return type === 'receita' ? 'text-green-600' : 'text-red-600';
  };

  const getCategoryLabel = (category: TransactionCategory) => {
    const labels = {
      honorarios: 'Honorários',
      custas: 'Custas Processuais',
      despesas_operacionais: 'Despesas Operacionais',
      salarios: 'Salários',
      marketing: 'Marketing',
      tecnologia: 'Tecnologia',
      outros: 'Outros'
    };
    return labels[category];
  };

  const handleCreateTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      toast({
        title: "Erro",
        description: "Descrição e valor são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      description: newTransaction.description,
      amount: newTransaction.amount,
      type: newTransaction.type!,
      category: newTransaction.category!,
      status: newTransaction.status!,
      date: newTransaction.date!,
      dueDate: newTransaction.dueDate,
      notes: newTransaction.notes,
      recurring: newTransaction.recurring,
      recurringPeriod: newTransaction.recurringPeriod
    };

    setTransactions(prev => [transaction, ...prev]);
    setNewTransaction(initialNewTransactionState);
    setIsCreateDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Transação criada com sucesso"
    });

    // Em um cenário real, você faria uma chamada de API aqui.
    // Com dados mock, vamos simular a atualização do resumo.
    setTimeout(loadFinancialData, 500);
  };

  const handleEditTransaction = () => {
    if (!editingTransaction) return;

    setTransactions(transactions.map(t =>
      t.id === editingTransaction.id ? editingTransaction : t
    ));
    setEditingTransaction(null);
    setIsEditDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Transação atualizada com sucesso"
    });

    // Em um cenário real, você faria uma chamada de API aqui.
    setTimeout(loadFinancialData, 500);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: "Sucesso",
      description: "Transação excluída com sucesso"
    });
    // Em um cenário real, você faria uma chamada de API aqui.
    setTimeout(loadFinancialData, 500);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getCategoryLabel(transaction.category).toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          title="Gestão Financeira"
          subtitle="Controle completo de receitas, despesas e fluxo de caixa"
          action={
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="legal-button-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Transação
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Nova Transação</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo</Label>
                        <Select
                          value={newTransaction.type}
                          onValueChange={(value: TransactionType) => setNewTransaction({ ...newTransaction, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receita">Receita</SelectItem>
                            <SelectItem value="despesa">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={newTransaction.status}
                          onValueChange={(value: TransactionStatus) => setNewTransaction({ ...newTransaction, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="pago">Pago</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={newTransaction.description || ''}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        placeholder="Descrição da transação"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Valor (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newTransaction.amount || ''}
                          onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Select
                          value={newTransaction.category}
                          onValueChange={(value: TransactionCategory) => setNewTransaction({ ...newTransaction, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="honorarios">Honorários</SelectItem>
                            <SelectItem value="custas">Custas Processuais</SelectItem>
                            <SelectItem value="despesas_operacionais">Despesas Operacionais</SelectItem>
                            <SelectItem value="salarios">Salários</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="tecnologia">Tecnologia</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Data</Label>
                        <Input
                          type="date"
                          value={newTransaction.date ? newTransaction.date.toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewTransaction({ ...newTransaction, date: new Date(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Data de Vencimento (opcional)</Label>
                        <Input
                          type="date"
                          value={newTransaction.dueDate ? newTransaction.dueDate.toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewTransaction({ ...newTransaction, dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Observações</Label>
                      <Textarea
                        value={newTransaction.notes || ''}
                        onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                        placeholder="Observações adicionais"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateTransaction}>
                        Criar Transação
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Cards de resumo financeiro */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="legal-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                      <p className={`text-2xl font-bold ${summary && summary.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {summary?.saldoAtual.toLocaleString('pt-BR') || '0'}
                      </p>
                      <div className="flex items-center mt-1">
                        {summary && summary.crescimentoMensal >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${summary && summary.crescimentoMensal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {summary?.crescimentoMensal >= 0 ? '+' : ''}{summary?.crescimentoMensal}% este mês
                        </span>
                      </div>
                    </div>
                    <Wallet className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="legal-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receitas</p>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {summary?.totalReceitas.toLocaleString('pt-BR') || '0'}
                      </p>
                      <p className="text-sm text-gray-500">
                        +R$ {summary?.receitasPendentes.toLocaleString('pt-BR') || '0'} pendentes
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="legal-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Despesas</p>
                      <p className="text-2xl font-bold text-red-600">
                        R$ {summary?.totalDespesas.toLocaleString('pt-BR') || '0'}
                      </p>
                      <p className="text-sm text-gray-500">
                        +R$ {summary?.despesasPendentes.toLocaleString('pt-BR') || '0'} pendentes
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="legal-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Meta Mensal</p>
                      <p className="text-2xl font-bold">
                        R$ {summary?.metaMensal.toLocaleString('pt-BR') || '0'}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Progresso</span>
                          <span>{Math.round((summary?.totalReceitas / summary?.metaMensal * 100) || 0)}%</span>
                        </div>
                        <Progress value={(summary?.totalReceitas / summary?.metaMensal * 100) || 0} className="h-2 mt-1" />
                      </div>
                      {summary && summary.contasAtrasadas > 0 && (
                        <Badge className="bg-red-100 text-red-800 mt-2">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {summary.contasAtrasadas} em atraso
                        </Badge>
                      )}
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros e busca */}
            <Card className="legal-card">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar transações..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterType} onValueChange={(value: 'all' | TransactionType) => setFilterType(value)}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        <SelectItem value="receita">Receitas</SelectItem>
                        <SelectItem value="despesa">Despesas</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={(value: 'all' | TransactionStatus) => setFilterStatus(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="atrasado">Atrasado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {filteredTransactions.length} transações
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de transações */}
            <Card className="legal-card">
              <CardHeader>
                <CardTitle>Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${transaction.type === 'receita' ? 'bg-green-100' : 'bg-red-100'}`}>
                              {transaction.type === 'receita' ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{transaction.description}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>{getCategoryLabel(transaction.category)}</span>
                                <span>•</span>
                                <span>{transaction.date.toLocaleDateString('pt-BR')}</span>
                                {transaction.dueDate && (
                                  <>
                                    <span>•</span>
                                    <span>Vence: {transaction.dueDate.toLocaleDateString('pt-BR')}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className={`font-semibold ${getTypeColor(transaction.type)}`}>
                              {transaction.type === 'receita' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR')}
                            </p>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingTransaction(transaction);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      Nenhuma transação encontrada.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dialog de edição */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Editar Transação</DialogTitle>
                </DialogHeader>
                {editingTransaction && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo</Label>
                        <Select
                          value={editingTransaction.type}
                          onValueChange={(value: TransactionType) => setEditingTransaction({ ...editingTransaction, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receita">Receita</SelectItem>
                            <SelectItem value="despesa">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={editingTransaction.status}
                          onValueChange={(value: TransactionStatus) => setEditingTransaction({ ...editingTransaction, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="pago">Pago</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                            <SelectItem value="atrasado">Atrasado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={editingTransaction.description}
                        onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Valor (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editingTransaction.amount}
                          onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Select
                          value={editingTransaction.category}
                          onValueChange={(value: TransactionCategory) => setEditingTransaction({ ...editingTransaction, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="honorarios">Honorários</SelectItem>
                            <SelectItem value="custas">Custas Processuais</SelectItem>
                            <SelectItem value="despesas_operacionais">Despesas Operacionais</SelectItem>
                            <SelectItem value="salarios">Salários</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="tecnologia">Tecnologia</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Observações</Label>
                      <Textarea
                        value={editingTransaction.notes || ''}
                        onChange={(e) => setEditingTransaction({ ...editingTransaction, notes: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleEditTransaction}>
                        Salvar Alterações
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}