
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
import { ArrowLeft, Save, Briefcase } from "lucide-react";

type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
type ProjectPriority = 'baixa' | 'media' | 'alta' | 'urgente';

export default function CreateProject() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    clientName: '',
    status: 'planning' as ProjectStatus,
    priority: 'media' as ProjectPriority,
    startDate: '',
    endDate: '',
    estimatedHours: 0,
    budget: 0,
    assignedTo: '',
    category: '',
    objectives: '',
    deliverables: '',
    risks: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectData.name || !projectData.clientName) {
      toast({
        title: "Erro",
        description: "Nome do projeto e cliente são obrigatórios",
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
        description: "Projeto criado com sucesso"
      });

      setLocation("/projects");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar projeto",
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
          title="Novo Projeto" 
          subtitle="Criar novo projeto"
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
          <div className="p-6 max-w-4xl mx-auto">
            <Card className="legal-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>Dados do Projeto</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                      <TabsTrigger value="planning">Planejamento</TabsTrigger>
                      <TabsTrigger value="details">Detalhes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome do Projeto</Label>
                          <Input
                            id="name"
                            value={projectData.name}
                            onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                            placeholder="Nome do projeto"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="clientName">Cliente</Label>
                          <Input
                            id="clientName"
                            value={projectData.clientName}
                            onChange={(e) => setProjectData({...projectData, clientName: e.target.value})}
                            placeholder="Nome do cliente"
                            required
                          />
                        </div>

                        <div>
                          <Label>Status</Label>
                          <Select 
                            value={projectData.status} 
                            onValueChange={(value) => setProjectData({...projectData, status: value as ProjectStatus})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planning">Planejamento</SelectItem>
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="on_hold">Suspenso</SelectItem>
                              <SelectItem value="completed">Concluído</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Prioridade</Label>
                          <Select 
                            value={projectData.priority} 
                            onValueChange={(value) => setProjectData({...projectData, priority: value as ProjectPriority})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baixa">Baixa</SelectItem>
                              <SelectItem value="media">Média</SelectItem>
                              <SelectItem value="alta">Alta</SelectItem>
                              <SelectItem value="urgente">Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="category">Categoria</Label>
                          <Input
                            id="category"
                            value={projectData.category}
                            onChange={(e) => setProjectData({...projectData, category: e.target.value})}
                            placeholder="Categoria do projeto"
                          />
                        </div>

                        <div>
                          <Label htmlFor="assignedTo">Responsável</Label>
                          <Input
                            id="assignedTo"
                            value={projectData.assignedTo}
                            onChange={(e) => setProjectData({...projectData, assignedTo: e.target.value})}
                            placeholder="Nome do responsável"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={projectData.description}
                          onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                          placeholder="Descrição detalhada do projeto"
                          rows={4}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="planning" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Data de Início</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={projectData.startDate}
                            onChange={(e) => setProjectData({...projectData, startDate: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="endDate">Data de Término</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={projectData.endDate}
                            onChange={(e) => setProjectData({...projectData, endDate: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="estimatedHours">Horas Estimadas</Label>
                          <Input
                            id="estimatedHours"
                            type="number"
                            min="0"
                            step="0.5"
                            value={projectData.estimatedHours}
                            onChange={(e) => setProjectData({...projectData, estimatedHours: parseFloat(e.target.value) || 0})}
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="budget">Orçamento (R$)</Label>
                          <Input
                            id="budget"
                            type="number"
                            step="0.01"
                            min="0"
                            value={projectData.budget}
                            onChange={(e) => setProjectData({...projectData, budget: parseFloat(e.target.value) || 0})}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="objectives">Objetivos</Label>
                        <Textarea
                          id="objectives"
                          value={projectData.objectives}
                          onChange={(e) => setProjectData({...projectData, objectives: e.target.value})}
                          placeholder="Objetivos principais do projeto"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="deliverables">Entregáveis</Label>
                        <Textarea
                          id="deliverables"
                          value={projectData.deliverables}
                          onChange={(e) => setProjectData({...projectData, deliverables: e.target.value})}
                          placeholder="Lista de entregáveis do projeto"
                          rows={3}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <div>
                        <Label htmlFor="risks">Riscos e Desafios</Label>
                        <Textarea
                          id="risks"
                          value={projectData.risks}
                          onChange={(e) => setProjectData({...projectData, risks: e.target.value})}
                          placeholder="Identifique possíveis riscos e desafios"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                          id="notes"
                          value={projectData.notes}
                          onChange={(e) => setProjectData({...projectData, notes: e.target.value})}
                          placeholder="Informações adicionais sobre o projeto"
                          rows={4}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

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
                          Criar Projeto
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
