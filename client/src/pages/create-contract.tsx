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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, FileText } from "lucide-react";

type ContractType = 'assessoria' | 'consultoria' | 'representacao' | 'outros';
type ContractStatus = 'rascunho' | 'revisao' | 'aprovado' | 'ativo' | 'concluido' | 'cancelado';

export default function CreateContract() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [contractData, setContractData] = useState({
    title: '',
    description: '',
    clientName: '',
    type: 'assessoria' as ContractType,
    status: 'rascunho' as ContractStatus,
    value: 0,
    startDate: '',
    endDate: '',
    renewalDate: '',
    notificationDays: 30,
    content: '',
    tags: [] as string[],
    paymentTerms: '',
    deliverables: '',
    scope: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contractData.title || !contractData.clientName) {
      toast({
        title: "Erro",
        description: "Título e cliente são obrigatórios",
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
        description: "Contrato criado com sucesso"
      });

      setLocation("/contracts");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar contrato",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Novo Contrato" 
          subtitle="Criar nova minuta de contrato"
          action={
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/contracts'}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          }
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto">
            <Card className="legal-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Dados do Contrato</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                      <TabsTrigger value="financial">Financeiro</TabsTrigger>
                      <TabsTrigger value="content">Conteúdo</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Título do Contrato</Label>
                          <Input
                            id="title"
                            value={contractData.title}
                            onChange={(e) => setContractData({...contractData, title: e.target.value})}
                            placeholder="Digite o título do contrato"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="clientName">Cliente</Label>
                          <Input
                            id="clientName"
                            value={contractData.clientName}
                            onChange={(e) => setContractData({...contractData, clientName: e.target.value})}
                            placeholder="Nome do cliente"
                            required
                          />
                        </div>

                        <div>
                          <Label>Tipo de Contrato</Label>
                          <Select 
                            value={contractData.type} 
                            onValueChange={(value) => setContractData({...contractData, type: value as ContractType})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="assessoria">Assessoria Jurídica</SelectItem>
                              <SelectItem value="consultoria">Consultoria</SelectItem>
                              <SelectItem value="representacao">Representação</SelectItem>
                              <SelectItem value="outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Status</Label>
                          <Select 
                            value={contractData.status} 
                            onValueChange={(value) => setContractData({...contractData, status: value as ContractStatus})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rascunho">Rascunho</SelectItem>
                              <SelectItem value="revisao">Em Revisão</SelectItem>
                              <SelectItem value="aprovado">Aprovado</SelectItem>
                              <SelectItem value="ativo">Ativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="startDate">Data de Início</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={contractData.startDate}
                            onChange={(e) => setContractData({...contractData, startDate: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="endDate">Data de Término</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={contractData.endDate}
                            onChange={(e) => setContractData({...contractData, endDate: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={contractData.description}
                          onChange={(e) => setContractData({...contractData, description: e.target.value})}
                          placeholder="Descrição detalhada do contrato"
                          rows={3}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="financial" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="value">Valor do Contrato (R$)</Label>
                          <Input
                            id="value"
                            type="number"
                            step="0.01"
                            value={contractData.value}
                            onChange={(e) => setContractData({...contractData, value: parseFloat(e.target.value) || 0})}
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="notificationDays">Dias para Notificação de Renovação</Label>
                          <Input
                            id="notificationDays"
                            type="number"
                            value={contractData.notificationDays}
                            onChange={(e) => setContractData({...contractData, notificationDays: parseInt(e.target.value) || 30})}
                            placeholder="30"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="paymentTerms">Condições de Pagamento</Label>
                        <Textarea
                          id="paymentTerms"
                          value={contractData.paymentTerms}
                          onChange={(e) => setContractData({...contractData, paymentTerms: e.target.value})}
                          placeholder="Descreva as condições de pagamento"
                          rows={3}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4">
                      <div>
                        <Label htmlFor="scope">Escopo dos Serviços</Label>
                        <Textarea
                          id="scope"
                          value={contractData.scope}
                          onChange={(e) => setContractData({...contractData, scope: e.target.value})}
                          placeholder="Descreva o escopo detalhado dos serviços"
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="deliverables">Entregáveis</Label>
                        <Textarea
                          id="deliverables"
                          value={contractData.deliverables}
                          onChange={(e) => setContractData({...contractData, deliverables: e.target.value})}
                          placeholder="Liste os entregáveis previstos"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="content">Conteúdo do Contrato</Label>
                        <Textarea
                          id="content"
                          value={contractData.content}
                          onChange={(e) => setContractData({...contractData, content: e.target.value})}
                          placeholder="Conteúdo completo do contrato"
                          rows={8}
                          className="font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.location.href = '/contracts'}
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
                          Criar Contrato
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