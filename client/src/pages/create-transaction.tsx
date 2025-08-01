import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, DollarSign } from "lucide-react";

type TransactionType = 'income' | 'expense';
type TransactionCategory = 'honorarios' | 'despesas_operacionais' | 'marketing' | 'escritorio' | 'pessoal' | 'impostos' | 'outros';

export default function CreateTransaction() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [transactionData, setTransactionData] = useState({
    description: '',
    amount: 0,
    type: 'income' as TransactionType,
    category: 'honorarios' as TransactionCategory,
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    projectName: '',
    contractId: '',
    paymentMethod: '',
    reference: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionData.description || transactionData.amount <= 0) {
      toast({
        title: "Erro",
        description: "Descrição e valor são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Sucesso",
        description: "Transação criada com sucesso"
      });

      setLocation("/financial");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar transação",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryOptions = () => {
    if (transactionData.type === 'income') {
      return [
        { value: 'honorarios', label: 'Honorários' },
        { value: 'consultoria', label: 'Consultoria' },
        { value: 'outros', label: 'Outros' }
      ];
    } else {
      return [
        { value: 'despesas_operacionais', label: 'Despesas Operacionais' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'escritorio', label: 'Escritório' },
        { value: 'pessoal', label: 'Pessoal' },
        { value: 'impostos', label: 'Impostos' },
        { value: 'outros', label: 'Outros' }
      ];
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Nova Transação" 
          subtitle="Registrar nova transação financeira"
          action={
            <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="mr-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
          }
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 max-w-2xl mx-auto">
            <Card className="legal-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Dados da Transação</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        value={transactionData.description}
                        onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
                        placeholder="Descrição da transação"
                        required
                      />
                    </div>

                    <div>
                      <Label>Tipo</Label>
                      <Select 
                        value={transactionData.type} 
                        onValueChange={(value) => setTransactionData({...transactionData, type: value as TransactionType, category: value === 'income' ? 'honorarios' : 'despesas_operacionais'})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Receita</SelectItem>
                          <SelectItem value="expense">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Categoria</Label>
                      <Select 
                        value={transactionData.category} 
                        onValueChange={(value) => setTransactionData({...transactionData, category: value as TransactionCategory})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getCategoryOptions().map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount">Valor (R$)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={transactionData.amount}
                        onChange={(e) => setTransactionData({...transactionData, amount: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={transactionData.date}
                        onChange={(e) => setTransactionData({...transactionData, date: e.target.value})}
                        required
                      />
                    </div>

                    {transactionData.type === 'income' && (
                      <>
                        <div>
                          <Label htmlFor="clientName">Cliente</Label>
                          <Input
                            id="clientName"
                            value={transactionData.clientName}
                            onChange={(e) => setTransactionData({...transactionData, clientName: e.target.value})}
                            placeholder="Nome do cliente"
                          />
                        </div>

                        <div>
                          <Label htmlFor="projectName">Projeto/Caso</Label>
                          <Input
                            id="projectName"
                            value={transactionData.projectName}
                            onChange={(e) => setTransactionData({...transactionData, projectName: e.target.value})}
                            placeholder="Nome do projeto ou caso"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                      <Select 
                        value={transactionData.paymentMethod} 
                        onValueChange={(value) => setTransactionData({...transactionData, paymentMethod: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                          <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                          <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="boleto">Boleto</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="reference">Referência/Documento</Label>
                      <Input
                        id="reference"
                        value={transactionData.reference}
                        onChange={(e) => setTransactionData({...transactionData, reference: e.target.value})}
                        placeholder="Número da nota, recibo, etc."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        value={transactionData.notes}
                        onChange={(e) => setTransactionData({...transactionData, notes: e.target.value})}
                        placeholder="Informações adicionais sobre a transação"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="legal-button-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>Salvando...</>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Criar Transação
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}